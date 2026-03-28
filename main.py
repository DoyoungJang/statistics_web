import json
import math
import mimetypes
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from statistics import NormalDist
from urllib.parse import urlparse


BASE_DIR = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = int(os.environ.get("PORT", "8000"))
ALLOWED_STATIC_FILES = {
    "/": "index.html",
    "/index.html": "index.html",
    "/styles.css": "styles.css",
    "/app.js": "app.js",
}


class ValidationError(ValueError):
    pass


def parse_float(value, label):
    try:
        return float(value)
    except (TypeError, ValueError) as error:
        raise ValidationError(f"{label} 값을 확인해주세요.") from error


def assert_between_exclusive(value, minimum, maximum, message):
    if value <= minimum or value >= maximum:
        raise ValidationError(message)


def assert_between_inclusive_left(value, minimum, maximum, message):
    if value < minimum or value >= maximum:
        raise ValidationError(message)


def assert_positive(value, message):
    if value <= 0:
        raise ValidationError(message)


def adjust_for_dropout(sample_size, dropout_rate):
    if dropout_rate == 0:
        return sample_size
    return math.ceil(sample_size / (1 - dropout_rate))


def format_number(value):
    return f"{value:,}"


def calculate_single_proportion(inputs):
    p = parse_float(inputs.get("proportion"), "예상 비율")
    margin = parse_float(inputs.get("margin"), "허용 오차")
    confidence = parse_float(inputs.get("confidence"), "신뢰수준")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")

    assert_between_exclusive(p, 0, 1, "예상 비율은 0과 1 사이여야 합니다.")
    assert_between_exclusive(margin, 0, 1, "허용 오차는 0보다 커야 합니다.")
    assert_between_exclusive(confidence, 0, 1, "신뢰수준은 0과 1 사이여야 합니다.")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    z_value = NormalDist().inv_cdf(1 - (1 - confidence) / 2)
    raw_sample = (z_value**2 * p * (1 - p)) / (margin**2)
    minimum_sample = math.ceil(raw_sample)
    adjusted_sample = adjust_for_dropout(minimum_sample, dropout)

    return {
        "headline": (
            f"권장 최소 샘플수는 총 {format_number(minimum_sample)}명이고, "
            f"탈락률 반영 모집 목표수는 총 {format_number(adjusted_sample)}명입니다."
        ),
        "details": [
            "계산식: n = z² × p × (1 - p) / d²",
            f"적용값: z = {z_value:.3f}, p = {p:.2f}, d = {margin:.2f}",
            f"원계산값 {raw_sample:.2f}명을 올림 처리했고, 탈락률 {dropout * 100:.1f}%를 반영했습니다.",
        ],
        "metrics": {
            "minimumSample": minimum_sample,
            "adjustedSample": adjusted_sample,
            "rawSample": round(raw_sample, 4),
        },
    }


def calculate_two_proportion(inputs):
    p1 = parse_float(inputs.get("p1"), "대조군 비율")
    p2 = parse_float(inputs.get("p2"), "시험군 비율")
    alpha = parse_float(inputs.get("alpha"), "유의수준")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")

    assert_between_exclusive(p1, 0, 1, "대조군 비율은 0과 1 사이여야 합니다.")
    assert_between_exclusive(p2, 0, 1, "시험군 비율은 0과 1 사이여야 합니다.")
    assert_between_exclusive(alpha, 0, 1, "유의수준은 0과 1 사이여야 합니다.")
    assert_between_exclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    delta = abs(p1 - p2)
    if delta == 0:
        raise ValidationError("두 비율의 차이가 0이면 필요한 샘플수를 계산할 수 없습니다.")

    z_alpha = NormalDist().inv_cdf(1 - alpha / 2)
    z_beta = NormalDist().inv_cdf(power)
    pooled = (p1 + p2) / 2
    numerator = (
        z_alpha * math.sqrt(2 * pooled * (1 - pooled))
        + z_beta * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))
    )
    raw_sample = (numerator**2) / (delta**2)
    per_group = math.ceil(raw_sample)
    total = per_group * 2
    adjusted_per_group = adjust_for_dropout(per_group, dropout)
    adjusted_total = adjusted_per_group * 2

    return {
        "headline": (
            f"권장 최소 샘플수는 군당 {format_number(per_group)}명, 총 {format_number(total)}명이며, "
            f"탈락률 반영 모집 목표수는 군당 {format_number(adjusted_per_group)}명, "
            f"총 {format_number(adjusted_total)}명입니다."
        ),
        "details": [
            "양측 검정, 동일 배정비(1:1) 가정",
            f"적용값: zα/2 = {z_alpha:.3f}, zβ = {z_beta:.3f}, |p1 - p2| = {delta:.2f}",
            f"원계산값 {raw_sample:.2f}명을 군당 올림 처리했고, 탈락률 {dropout * 100:.1f}%를 반영했습니다.",
        ],
        "metrics": {
            "perGroup": per_group,
            "totalSample": total,
            "adjustedPerGroup": adjusted_per_group,
            "adjustedTotal": adjusted_total,
            "rawSamplePerGroup": round(raw_sample, 4),
        },
    }


def calculate_two_mean(inputs):
    sigma = parse_float(inputs.get("sigma"), "공통 표준편차")
    delta = parse_float(inputs.get("delta"), "평균 차이")
    alpha = parse_float(inputs.get("alpha"), "유의수준")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")

    assert_positive(sigma, "공통 표준편차는 0보다 커야 합니다.")
    assert_positive(delta, "평균 차이는 0보다 커야 합니다.")
    assert_between_exclusive(alpha, 0, 1, "유의수준은 0과 1 사이여야 합니다.")
    assert_between_exclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    z_alpha = NormalDist().inv_cdf(1 - alpha / 2)
    z_beta = NormalDist().inv_cdf(power)
    raw_sample = (2 * (z_alpha + z_beta) ** 2 * sigma**2) / (delta**2)
    per_group = math.ceil(raw_sample)
    total = per_group * 2
    adjusted_per_group = adjust_for_dropout(per_group, dropout)
    adjusted_total = adjusted_per_group * 2

    return {
        "headline": (
            f"권장 최소 샘플수는 군당 {format_number(per_group)}명, 총 {format_number(total)}명이며, "
            f"탈락률 반영 모집 목표수는 군당 {format_number(adjusted_per_group)}명, "
            f"총 {format_number(adjusted_total)}명입니다."
        ),
        "details": [
            "양측 검정, 동일 분산, 동일 배정비(1:1) 가정",
            f"적용값: zα/2 = {z_alpha:.3f}, zβ = {z_beta:.3f}, σ = {sigma:.2f}, Δ = {delta:.2f}",
            f"원계산값 {raw_sample:.2f}명을 군당 올림 처리했고, 탈락률 {dropout * 100:.1f}%를 반영했습니다.",
        ],
        "metrics": {
            "perGroup": per_group,
            "totalSample": total,
            "adjustedPerGroup": adjusted_per_group,
            "adjustedTotal": adjusted_total,
            "rawSamplePerGroup": round(raw_sample, 4),
        },
    }


CALCULATORS = {
    "single-proportion": calculate_single_proportion,
    "two-proportion": calculate_two_proportion,
    "two-mean": calculate_two_mean,
}


class StatisticsRequestHandler(BaseHTTPRequestHandler):
    server_version = "StatisticsWeb/1.0"

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self.send_json(
                HTTPStatus.OK,
                {
                    "status": "ok",
                    "service": "medical-device-statistics-web",
                    "port": PORT,
                },
            )
            return

        if parsed.path in ALLOWED_STATIC_FILES:
            self.serve_static_file(ALLOWED_STATIC_FILES[parsed.path])
            return

        self.send_json(HTTPStatus.NOT_FOUND, {"error": "요청한 경로를 찾을 수 없습니다."})

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/calculate":
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "요청한 API 경로를 찾을 수 없습니다."})
            return

        try:
            payload = self.read_json_body()
            calculator_name = payload.get("calculator")
            inputs = payload.get("inputs", {})

            if calculator_name not in CALCULATORS:
                raise ValidationError("지원하지 않는 계산 유형입니다.")
            if not isinstance(inputs, dict):
                raise ValidationError("입력 형식이 올바르지 않습니다.")

            result = CALCULATORS[calculator_name](inputs)
            self.send_json(HTTPStatus.OK, result)
        except ValidationError as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
        except json.JSONDecodeError:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "JSON 본문을 읽을 수 없습니다."})
        except Exception:
            self.send_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"error": "서버에서 계산 중 오류가 발생했습니다."})

    def read_json_body(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(content_length)
        return json.loads(body.decode("utf-8"))

    def serve_static_file(self, relative_name):
        file_path = BASE_DIR / relative_name
        if not file_path.exists():
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "정적 파일을 찾을 수 없습니다."})
            return

        content_type, _ = mimetypes.guess_type(file_path.name)
        if file_path.suffix in {".html", ".css", ".js"}:
            content_type = f"{content_type or 'text/plain'}; charset=utf-8"

        data = file_path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def run():
    server = ThreadingHTTPServer((HOST, PORT), StatisticsRequestHandler)
    print(f"Server running at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    run()
