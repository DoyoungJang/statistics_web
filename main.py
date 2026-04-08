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
    "/ai-performance": "ai-performance.html",
    "/ai-performance.html": "ai-performance.html",
    "/ai-stat-examples": "ai-stat-examples.html",
    "/ai-stat-examples.html": "ai-stat-examples.html",
    "/protocol-planning": "protocol-planning.html",
    "/protocol-planning.html": "protocol-planning.html",
    "/protocol-checklist": "protocol-checklist.html",
    "/protocol-checklist.html": "protocol-checklist.html",
    "/styles.css": "styles.css",
    "/app.js": "app.js",
    "/ai-stat-examples.js": "ai-stat-examples.js",
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


def assert_non_negative(value, message):
    if value < 0:
        raise ValidationError(message)


def adjust_for_dropout(sample_size, dropout_rate):
    if dropout_rate == 0:
        return sample_size
    return math.ceil(sample_size / (1 - dropout_rate))


def format_number(value):
    return f"{value:,}"


def format_percent(value):
    return f"{value * 100:.1f}%"


def confidence_to_z_value(confidence):
    assert_between_exclusive(confidence, 0, 1, "신뢰수준은 0과 1 사이여야 합니다.")
    return NormalDist().inv_cdf(1 - (1 - confidence) / 2)


def alpha_to_one_sided_z_value(alpha):
    assert_between_exclusive(alpha, 0, 0.5, "one-sided alpha는 0과 0.5 사이여야 합니다.")
    return NormalDist().inv_cdf(1 - alpha)


def equivalent_two_sided_confidence(alpha):
    return 1 - (2 * alpha)


def solve_one_sample_noninferiority_proportion(expected_rate, benchmark_rate, ni_margin, alpha, power):
    assert_between_exclusive(expected_rate, 0, 1, "예상 성능은 0과 1 사이여야 합니다.")
    assert_between_exclusive(benchmark_rate, 0, 1, "비교 기준 성능은 0과 1 사이여야 합니다.")
    assert_positive(ni_margin, "비열등성 마진은 0보다 커야 합니다.")
    assert_between_exclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.")

    threshold_rate = benchmark_rate - ni_margin
    if threshold_rate <= 0 or threshold_rate >= 1:
        raise ValidationError("비교 기준 성능과 비열등성 마진 조합으로 계산 가능한 한계값이 만들어지지 않았습니다.")
    if expected_rate <= threshold_rate:
        raise ValidationError("예상 AI 성능은 비열등성 한계값보다 커야 합니다.")

    z_alpha = alpha_to_one_sided_z_value(alpha)
    z_beta = NormalDist().inv_cdf(power)
    raw_sample = (
        (
            z_alpha * math.sqrt(threshold_rate * (1 - threshold_rate))
            + z_beta * math.sqrt(expected_rate * (1 - expected_rate))
        )
        ** 2
    ) / ((expected_rate - threshold_rate) ** 2)
    return {
        "raw_sample": raw_sample,
        "required_sample": math.ceil(raw_sample),
        "z_alpha": z_alpha,
        "z_beta": z_beta,
        "threshold_rate": threshold_rate,
    }


def solve_one_sample_mean_noninferiority(expected_mean, benchmark_mean, ni_margin, standard_deviation, alpha, power, direction):
    assert_positive(standard_deviation, "표준편차는 0보다 커야 합니다.")
    assert_positive(ni_margin, "비열등성 마진은 0보다 커야 합니다.")
    assert_between_exclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.")

    if direction == "higher":
        threshold_mean = benchmark_mean - ni_margin
        effect_gap = expected_mean - threshold_mean
        if effect_gap <= 0:
            raise ValidationError("예상 AI 평균 성능은 비열등성 한계값보다 커야 합니다.")
    elif direction == "lower":
        threshold_mean = benchmark_mean + ni_margin
        effect_gap = threshold_mean - expected_mean
        if effect_gap <= 0:
            raise ValidationError("예상 AI 오차는 비열등성 한계값보다 작아야 합니다.")
    else:
        raise ValidationError("평균 기반 계산 방향이 올바르지 않습니다.")

    z_alpha = alpha_to_one_sided_z_value(alpha)
    z_beta = NormalDist().inv_cdf(power)
    raw_sample = ((z_alpha + z_beta) * standard_deviation / effect_gap) ** 2
    return {
        "raw_sample": raw_sample,
        "required_sample": math.ceil(raw_sample),
        "z_alpha": z_alpha,
        "z_beta": z_beta,
        "effect_gap": effect_gap,
        "threshold_mean": threshold_mean,
    }


def solve_bland_altman_agreement(expected_mean_difference, standard_deviation, max_allowed_difference, alpha, power):
    assert_positive(standard_deviation, "차이값 표준편차는 0보다 커야 합니다.")
    assert_positive(max_allowed_difference, "최대 허용 차이는 0보다 커야 합니다.")
    assert_between_exclusive(alpha, 0, 0.5, "Bland-Altman alpha는 0과 0.5 사이여야 합니다.")
    assert_between_exclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.")

    expected_upper_loa = expected_mean_difference + 1.96 * standard_deviation
    expected_lower_loa = expected_mean_difference - 1.96 * standard_deviation
    critical_loa = max(abs(expected_upper_loa), abs(expected_lower_loa))
    agreement_gap = max_allowed_difference - critical_loa
    if agreement_gap <= 0:
        raise ValidationError("최대 허용 차이는 |평균 차이| + 1.96 × SD보다 커야 합니다.")

    z_alpha = NormalDist().inv_cdf(1 - alpha / 2)
    z_beta = NormalDist().inv_cdf(power)
    raw_sample = 3 * (((z_alpha + z_beta) * standard_deviation) / agreement_gap) ** 2

    return {
        "raw_sample": raw_sample,
        "required_sample": math.ceil(raw_sample),
        "z_alpha": z_alpha,
        "z_beta": z_beta,
        "expected_upper_loa": expected_upper_loa,
        "expected_lower_loa": expected_lower_loa,
        "critical_loa": critical_loa,
        "agreement_gap": agreement_gap,
    }


def auc_variance_constant(auc_value, positive_case_rate):
    assert_between_exclusive(auc_value, 0, 1, "AUC는 0과 1 사이여야 합니다.")
    assert_between_exclusive(positive_case_rate, 0, 1, "평가셋 내 양성 케이스 비율은 0과 1 사이여야 합니다.")

    q1 = auc_value / (2 - auc_value)
    q2 = (2 * auc_value**2) / (1 + auc_value)
    return ((q1 - auc_value**2) / (1 - positive_case_rate)) + ((q2 - auc_value**2) / positive_case_rate)


def solve_auc_noninferiority(expected_auc, benchmark_auc, ni_margin, alpha, power, positive_case_rate):
    assert_between_exclusive(expected_auc, 0, 1, "예상 AUC는 0과 1 사이여야 합니다.")
    assert_between_exclusive(benchmark_auc, 0, 1, "비교 기준 AUC는 0과 1 사이여야 합니다.")
    assert_positive(ni_margin, "비열등성 마진은 0보다 커야 합니다.")
    assert_between_exclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.")

    threshold_auc = benchmark_auc - ni_margin
    if threshold_auc <= 0 or threshold_auc >= 1:
        raise ValidationError("비교 기준 AUC와 비열등성 마진 조합으로 계산 가능한 한계값이 만들어지지 않았습니다.")
    if expected_auc <= threshold_auc:
        raise ValidationError("예상 AI AUC는 비열등성 한계값보다 커야 합니다.")

    z_alpha = alpha_to_one_sided_z_value(alpha)
    z_beta = NormalDist().inv_cdf(power)
    variance_constant_null = auc_variance_constant(threshold_auc, positive_case_rate)
    variance_constant_alt = auc_variance_constant(expected_auc, positive_case_rate)
    raw_total_sample = (
        (
            z_alpha * math.sqrt(variance_constant_null)
            + z_beta * math.sqrt(variance_constant_alt)
        )
        / (expected_auc - threshold_auc)
    ) ** 2
    total_cases = math.ceil(raw_total_sample)
    positive_cases = math.ceil(total_cases * positive_case_rate)
    negative_cases = max(1, total_cases - positive_cases)

    return {
        "raw_sample": raw_total_sample,
        "total_cases": total_cases,
        "positive_cases": positive_cases,
        "negative_cases": negative_cases,
        "z_alpha": z_alpha,
        "z_beta": z_beta,
        "threshold_auc": threshold_auc,
        "variance_constant_null": variance_constant_null,
        "variance_constant_alt": variance_constant_alt,
    }


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


def calculate_ai_classification_precision(inputs):
    expected_precision = parse_float(inputs.get("expectedPrecision"), "예상 precision")
    benchmark_precision = parse_float(inputs.get("benchmarkPrecision"), "비교 기준 precision")
    ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    predicted_positive_rate = parse_float(inputs.get("predictedPositiveRate"), "예상 양성 판정 비율")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")

    assert_between_exclusive(predicted_positive_rate, 0, 1, "예상 양성 판정 비율은 0과 1 사이여야 합니다.")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    result = solve_one_sample_noninferiority_proportion(
        expected_precision,
        benchmark_precision,
        ni_margin,
        alpha,
        power,
    )
    required_positive_predictions = result["required_sample"]
    total_cases = math.ceil(required_positive_predictions / predicted_positive_rate)
    adjusted_total_cases = adjust_for_dropout(total_cases, dropout)
    equivalent_ci = equivalent_two_sided_confidence(alpha)

    return {
        "headline": (
            f"Precision 비열등성 판단에 필요한 최소 분석 단위는 {format_number(required_positive_predictions)}건의 양성 판정(predicted positives)이며, "
            f"예상 양성 판정 비율을 반영한 총 평가 케이스 수는 {format_number(total_cases)}건, "
            f"탈락률 반영 모집 목표수는 {format_number(adjusted_total_cases)}건입니다."
        ),
        "details": [
            "Precision/PPV를 외부 benchmark와 비교하는 one-sample non-inferiority proportion 근사식 적용",
            (
                f"적용값: 예상 AI precision = {expected_precision:.3f}, benchmark = {benchmark_precision:.3f}, "
                f"비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}"
            ),
            (
                f"비열등성 한계값 = {result['threshold_rate']:.3f} (benchmark - margin), "
                f"zα = {result['z_alpha']:.3f}, zβ = {result['z_beta']:.3f}, "
                f"동등한 양측 CI 수준 = {equivalent_ci:.0%}"
            ),
            f"예상 양성 판정 비율 = {format_percent(predicted_positive_rate)}, 원계산값 = {result['raw_sample']:.2f}",
            "정밀도(precision)는 intended-use population의 양성 판정 비율과 유병률 영향을 받으므로, 총 케이스 수 환산 시 배포 환경과 유사한 구성 가정을 권장합니다.",
        ],
        "metrics": {
            "requiredPositivePredictions": required_positive_predictions,
            "estimatedTotalCases": total_cases,
            "adjustedTotalCases": adjusted_total_cases,
            "rawSample": round(result["raw_sample"], 4),
            "nonInferiorityThreshold": round(result["threshold_rate"], 4),
        },
    }


def calculate_ai_segmentation_overlap(inputs):
    metric = inputs.get("metric")
    expected_mean = parse_float(inputs.get("expectedMean"), "예상 평균 성능")
    benchmark_mean = parse_float(inputs.get("benchmarkMean"), "비교 기준 성능")
    ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
    standard_deviation = parse_float(inputs.get("standardDeviation"), "표준편차")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")

    if metric not in {"dice", "miou"}:
        raise ValidationError("세그멘테이션 지표는 Dice 또는 mIoU여야 합니다.")
    assert_between_exclusive(expected_mean, 0, 1, "예상 평균 성능은 0과 1 사이여야 합니다.")
    assert_between_exclusive(benchmark_mean, 0, 1, "비교 기준 성능은 0과 1 사이여야 합니다.")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    result = solve_one_sample_mean_noninferiority(
        expected_mean,
        benchmark_mean,
        ni_margin,
        standard_deviation,
        alpha,
        power,
        "higher",
    )
    required_cases = result["required_sample"]
    adjusted_cases = adjust_for_dropout(required_cases, dropout)
    metric_label = "Dice" if metric == "dice" else "mIoU"
    equivalent_ci = equivalent_two_sided_confidence(alpha)

    return {
        "headline": (
            f"{metric_label} 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, "
            f"탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다."
        ),
        "details": [
            f"{metric_label} 평균 성능을 외부 benchmark와 비교하는 one-sample non-inferiority mean 근사식 적용",
            (
                f"적용값: 예상 AI {metric_label} = {expected_mean:.3f}, benchmark = {benchmark_mean:.3f}, "
                f"비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}"
            ),
            (
                f"비열등성 한계값 = {result['threshold_mean']:.3f} (benchmark - margin), "
                f"zα = {result['z_alpha']:.3f}, zβ = {result['z_beta']:.3f}, "
                f"성능 여유(effect gap) = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}"
            ),
            f"원계산값 = {result['raw_sample']:.2f}",
            "Dice와 mIoU는 케이스별 분포와 난이도 이질성의 영향이 크므로, SD는 파일럿 데이터 또는 유사 제품 검증셋에서 추정하는 것을 권장합니다.",
        ],
        "metrics": {
            "requiredCases": required_cases,
            "adjustedCases": adjusted_cases,
            "rawSample": round(result["raw_sample"], 4),
            "nonInferiorityThreshold": round(result["threshold_mean"], 4),
        },
    }


def calculate_ai_detection(inputs):
    expected_sensitivity = parse_float(inputs.get("expectedSensitivity"), "예상 lesion-level sensitivity")
    benchmark_sensitivity = parse_float(inputs.get("benchmarkSensitivity"), "비교 기준 lesion-level sensitivity")
    ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    lesions_per_positive_case = parse_float(inputs.get("lesionsPerPositiveCase"), "양성 케이스당 평균 병변 수")
    positive_case_rate = parse_float(inputs.get("positiveCaseRate"), "평가셋 내 양성 케이스 비율")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")

    assert_positive(lesions_per_positive_case, "양성 케이스당 평균 병변 수는 0보다 커야 합니다.")
    assert_between_exclusive(positive_case_rate, 0, 1, "평가셋 내 양성 케이스 비율은 0과 1 사이여야 합니다.")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    result = solve_one_sample_noninferiority_proportion(
        expected_sensitivity,
        benchmark_sensitivity,
        ni_margin,
        alpha,
        power,
    )
    required_lesions = result["required_sample"]
    positive_cases = math.ceil(required_lesions / lesions_per_positive_case)
    total_cases = math.ceil(positive_cases / positive_case_rate)
    adjusted_total_cases = adjust_for_dropout(total_cases, dropout)
    equivalent_ci = equivalent_two_sided_confidence(alpha)

    return {
        "headline": (
            f"Detection 비열등성 판단에 필요한 최소 분석 단위는 {format_number(required_lesions)}개의 기준 병변(lesions)이며, "
            f"이를 충족하려면 양성 케이스 {format_number(positive_cases)}건, 총 평가 케이스 {format_number(total_cases)}건 정도가 필요하고, "
            f"탈락률 반영 모집 목표수는 {format_number(adjusted_total_cases)}건입니다."
        ),
        "details": [
            "Detection의 1차 지표를 lesion-level sensitivity로 두는 one-sample non-inferiority proportion 근사식 적용",
            (
                f"적용값: 예상 AI sensitivity = {expected_sensitivity:.3f}, benchmark = {benchmark_sensitivity:.3f}, "
                f"비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}"
            ),
            (
                f"비열등성 한계값 = {result['threshold_rate']:.3f} (benchmark - margin), "
                f"zα = {result['z_alpha']:.3f}, zβ = {result['z_beta']:.3f}, "
                f"동등한 양측 CI 수준 = {equivalent_ci:.0%}"
            ),
            (
                f"평균 병변 수/양성 케이스 = {lesions_per_positive_case:.2f}, 양성 케이스 비율 = {format_percent(positive_case_rate)}, "
                f"원계산값 = {result['raw_sample']:.2f}"
            ),
            "이 계산은 lesion-level sensitivity 기준용입니다. false positives per image, precision, FROC, mAP 등을 함께 제출할 경우 별도 계획이 추가로 필요합니다.",
        ],
        "metrics": {
            "requiredLesions": required_lesions,
            "requiredPositiveCases": positive_cases,
            "estimatedTotalCases": total_cases,
            "adjustedTotalCases": adjusted_total_cases,
            "rawSample": round(result["raw_sample"], 4),
            "nonInferiorityThreshold": round(result["threshold_rate"], 4),
        },
    }


def calculate_ai_measurement(inputs):
    expected_mae = parse_float(inputs.get("expectedMae"), "예상 MAE")
    benchmark_mae = parse_float(inputs.get("benchmarkMae"), "비교 기준 MAE")
    ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
    standard_deviation = parse_float(inputs.get("standardDeviation"), "표준편차")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")

    assert_non_negative(expected_mae, "예상 MAE는 0 이상이어야 합니다.")
    assert_positive(benchmark_mae, "비교 기준 MAE는 0보다 커야 합니다.")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    result = solve_one_sample_mean_noninferiority(
        expected_mae,
        benchmark_mae,
        ni_margin,
        standard_deviation,
        alpha,
        power,
        "lower",
    )
    required_cases = result["required_sample"]
    adjusted_cases = adjust_for_dropout(required_cases, dropout)
    equivalent_ci = equivalent_two_sided_confidence(alpha)

    return {
        "headline": (
            f"Measurement 비열등성 판단에 필요한 최소 paired 평가 케이스 수는 {format_number(required_cases)}건이며, "
            f"탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다."
        ),
        "details": [
            "Measurement의 1차 지표를 평균 절대오차(MAE)로 두고 benchmark 대비 비열등성을 검정하는 one-sample mean 근사식 적용",
            (
                f"적용값: 예상 AI MAE = {expected_mae:.3f}, benchmark MAE = {benchmark_mae:.3f}, "
                f"비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}"
            ),
            (
                f"비열등성 한계값 = {result['threshold_mean']:.3f} (benchmark + margin), "
                f"zα = {result['z_alpha']:.3f}, zβ = {result['z_beta']:.3f}, "
                f"오차 여유(effect gap) = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}"
            ),
            f"원계산값 = {result['raw_sample']:.2f}",
            "Measurement는 기본적으로 reference standard와의 paired analysis를 가정합니다. ICC, Bland-Altman limits of agreement, equivalence 설계는 별도 통계 계획이 더 적합할 수 있습니다.",
        ],
        "metrics": {
            "requiredCases": required_cases,
            "adjustedCases": adjusted_cases,
            "rawSample": round(result["raw_sample"], 4),
            "nonInferiorityThreshold": round(result["threshold_mean"], 4),
        },
    }


def calculate_ai_classification(inputs):
    metric = inputs.get("metric")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")
    equivalent_ci = equivalent_two_sided_confidence(alpha)

    if metric == "accuracy":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 Accuracy")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 Accuracy")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        result = solve_one_sample_noninferiority_proportion(expected_value, benchmark_value, ni_margin, alpha, power)
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"Accuracy 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "분류 정확도(Accuracy)를 one-sample non-inferiority proportion으로 계산했습니다.",
                f"적용값: 예상 AI Accuracy = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_rate']:.3f}, zα = {result['z_alpha']:.3f}, zβ = {result['z_beta']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_rate"], 4),
            },
        }

    if metric == "sensitivity":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 Sensitivity")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 Sensitivity")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        positive_case_rate = parse_float(inputs.get("positiveCaseRate"), "평가셋 내 양성 케이스 비율")
        assert_between_exclusive(positive_case_rate, 0, 1, "평가셋 내 양성 케이스 비율은 0과 1 사이여야 합니다.")
        result = solve_one_sample_noninferiority_proportion(expected_value, benchmark_value, ni_margin, alpha, power)
        required_positive_cases = result["required_sample"]
        total_cases = math.ceil(required_positive_cases / positive_case_rate)
        adjusted_total_cases = adjust_for_dropout(total_cases, dropout)
        return {
            "headline": f"Sensitivity 비열등성 판단에 필요한 최소 양성 케이스 수는 {format_number(required_positive_cases)}건이며, 총 평가 케이스 수는 {format_number(total_cases)}건, 탈락률 반영 모집 목표수는 {format_number(adjusted_total_cases)}건입니다.",
            "details": [
                "민감도(Sensitivity)를 one-sample non-inferiority proportion으로 계산했습니다.",
                f"적용값: 예상 AI Sensitivity = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_rate']:.3f}, 양성 케이스 비율 = {format_percent(positive_case_rate)}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredPositiveCases": required_positive_cases,
                "estimatedTotalCases": total_cases,
                "adjustedTotalCases": adjusted_total_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_rate"], 4),
            },
        }

    if metric == "specificity":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 Specificity")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 Specificity")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        positive_case_rate = parse_float(inputs.get("positiveCaseRate"), "평가셋 내 양성 케이스 비율")
        assert_between_exclusive(positive_case_rate, 0, 1, "평가셋 내 양성 케이스 비율은 0과 1 사이여야 합니다.")
        negative_case_rate = 1 - positive_case_rate
        result = solve_one_sample_noninferiority_proportion(expected_value, benchmark_value, ni_margin, alpha, power)
        required_negative_cases = result["required_sample"]
        total_cases = math.ceil(required_negative_cases / negative_case_rate)
        adjusted_total_cases = adjust_for_dropout(total_cases, dropout)
        return {
            "headline": f"Specificity 비열등성 판단에 필요한 최소 음성 케이스 수는 {format_number(required_negative_cases)}건이며, 총 평가 케이스 수는 {format_number(total_cases)}건, 탈락률 반영 모집 목표수는 {format_number(adjusted_total_cases)}건입니다.",
            "details": [
                "특이도(Specificity)를 one-sample non-inferiority proportion으로 계산했습니다.",
                f"적용값: 예상 AI Specificity = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_rate']:.3f}, 음성 케이스 비율 = {format_percent(negative_case_rate)}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredNegativeCases": required_negative_cases,
                "estimatedTotalCases": total_cases,
                "adjustedTotalCases": adjusted_total_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_rate"], 4),
            },
        }

    if metric == "auc":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 AUC")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 AUC")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        positive_case_rate = parse_float(inputs.get("positiveCaseRate"), "평가셋 내 양성 케이스 비율")
        result = solve_auc_noninferiority(expected_value, benchmark_value, ni_margin, alpha, power, positive_case_rate)
        adjusted_total_cases = adjust_for_dropout(result["total_cases"], dropout)
        return {
            "headline": f"AUC 비열등성 판단에 필요한 최소 총 평가 케이스 수는 {format_number(result['total_cases'])}건이며, 이 중 양성 {format_number(result['positive_cases'])}건, 음성 {format_number(result['negative_cases'])}건 정도가 필요하고, 탈락률 반영 모집 목표수는 {format_number(adjusted_total_cases)}건입니다.",
            "details": [
                "AUC는 Hanley-McNeil 분산 근사를 이용한 one-sample non-inferiority 방식으로 계산했습니다.",
                f"적용값: 예상 AI AUC = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_auc']:.3f}, 양성 케이스 비율 = {format_percent(positive_case_rate)}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": result["total_cases"],
                "requiredPositiveCases": result["positive_cases"],
                "requiredNegativeCases": result["negative_cases"],
                "adjustedCases": adjusted_total_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_auc"], 4),
            },
        }

    if metric == "f1":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 F1-score")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 F1-score")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        standard_deviation = parse_float(inputs.get("standardDeviation"), "부트스트랩 SD")
        result = solve_one_sample_mean_noninferiority(expected_value, benchmark_value, ni_margin, standard_deviation, alpha, power, "higher")
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"F1-score 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "F1-score는 파일럿/부트스트랩 SD를 이용한 one-sample non-inferiority mean 근사식으로 계산했습니다.",
                f"적용값: 예상 AI F1-score = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_mean']:.3f}, effect gap = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_mean"], 4),
            },
        }

    if metric == "npv":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 NPV")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 NPV")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        predicted_negative_rate = parse_float(inputs.get("predictedNegativeRate"), "예상 음성 판정 비율")
        assert_between_exclusive(predicted_negative_rate, 0, 1, "예상 음성 판정 비율은 0과 1 사이여야 합니다.")
        result = solve_one_sample_noninferiority_proportion(expected_value, benchmark_value, ni_margin, alpha, power)
        required_negative_predictions = result["required_sample"]
        total_cases = math.ceil(required_negative_predictions / predicted_negative_rate)
        adjusted_total_cases = adjust_for_dropout(total_cases, dropout)
        return {
            "headline": f"NPV 비열등성 판단에 필요한 최소 음성 판정(predicted negatives) 수는 {format_number(required_negative_predictions)}건이며, 총 평가 케이스 수는 {format_number(total_cases)}건, 탈락률 반영 모집 목표수는 {format_number(adjusted_total_cases)}건입니다.",
            "details": [
                "음성예측도(NPV)를 one-sample non-inferiority proportion으로 계산했습니다.",
                f"적용값: 예상 AI NPV = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_rate']:.3f}, 예상 음성 판정 비율 = {format_percent(predicted_negative_rate)}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredNegativePredictions": required_negative_predictions,
                "estimatedTotalCases": total_cases,
                "adjustedTotalCases": adjusted_total_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_rate"], 4),
            },
        }

    raise ValidationError("지원하지 않는 Classification 지표입니다.")


def calculate_ai_segmentation(inputs):
    metric = inputs.get("metric")
    expected_value = parse_float(inputs.get("expectedValue"), "예상 성능")
    benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 성능")
    ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
    standard_deviation = parse_float(inputs.get("standardDeviation"), "표준편차")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")

    metric_names = {
        "accuracy": "Segmentation Accuracy",
        "dsc": "Dice Similarity Coefficient (DSC)",
        "iou": "IoU",
    }
    if metric not in metric_names:
        raise ValidationError("지원하지 않는 Segmentation 지표입니다.")

    result = solve_one_sample_mean_noninferiority(expected_value, benchmark_value, ni_margin, standard_deviation, alpha, power, "higher")
    required_cases = result["required_sample"]
    adjusted_cases = adjust_for_dropout(required_cases, dropout)
    equivalent_ci = equivalent_two_sided_confidence(alpha)
    metric_name = metric_names[metric]

    return {
        "headline": f"{metric_name} 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
        "details": [
            f"{metric_name}를 one-sample non-inferiority mean 근사식으로 계산했습니다.",
            f"적용값: 예상 AI {metric_name} = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
            f"비열등성 한계값 = {result['threshold_mean']:.3f}, effect gap = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
            f"원계산값 = {result['raw_sample']:.2f}",
        ],
        "metrics": {
            "requiredCases": required_cases,
            "adjustedCases": adjusted_cases,
            "rawSample": round(result["raw_sample"], 4),
            "nonInferiorityThreshold": round(result["threshold_mean"], 4),
        },
    }


def calculate_ai_detection(inputs):
    metric = inputs.get("metric")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")
    equivalent_ci = equivalent_two_sided_confidence(alpha)

    if metric == "accuracy":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 Detection Accuracy")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 Detection Accuracy")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        result = solve_one_sample_noninferiority_proportion(expected_value, benchmark_value, ni_margin, alpha, power)
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"Detection Accuracy 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "Detection Accuracy를 image-level one-sample non-inferiority proportion으로 계산했습니다.",
                f"적용값: 예상 AI Accuracy = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_rate']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_rate"], 4),
            },
        }

    if metric == "iou":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 Detection IoU")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 Detection IoU")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        standard_deviation = parse_float(inputs.get("standardDeviation"), "표준편차")
        result = solve_one_sample_mean_noninferiority(expected_value, benchmark_value, ni_margin, standard_deviation, alpha, power, "higher")
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"Detection IoU 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "Detection IoU를 one-sample non-inferiority mean 근사식으로 계산했습니다.",
                f"적용값: 예상 AI IoU = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_mean']:.3f}, effect gap = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_mean"], 4),
            },
        }

    if metric == "lesion_sensitivity":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 Lesion-level Sensitivity")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 Lesion-level Sensitivity")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        positive_case_rate = parse_float(inputs.get("positiveCaseRate"), "평가셋 내 양성 케이스 비율")
        lesions_per_positive_case = parse_float(inputs.get("lesionsPerPositiveCase"), "양성 케이스당 평균 병변 수")
        assert_between_exclusive(positive_case_rate, 0, 1, "평가셋 내 양성 케이스 비율은 0과 1 사이여야 합니다.")
        assert_positive(lesions_per_positive_case, "양성 케이스당 평균 병변 수는 0보다 커야 합니다.")
        result = solve_one_sample_noninferiority_proportion(expected_value, benchmark_value, ni_margin, alpha, power)
        required_lesions = result["required_sample"]
        positive_cases = math.ceil(required_lesions / lesions_per_positive_case)
        total_cases = math.ceil(positive_cases / positive_case_rate)
        adjusted_total_cases = adjust_for_dropout(total_cases, dropout)
        return {
            "headline": f"Lesion-level Sensitivity 비열등성 판단에 필요한 최소 병변 수는 {format_number(required_lesions)}개이며, 양성 케이스 {format_number(positive_cases)}건, 총 평가 케이스 {format_number(total_cases)}건, 탈락률 반영 모집 목표수는 {format_number(adjusted_total_cases)}건입니다.",
            "details": [
                "병변별 민감도를 one-sample non-inferiority proportion으로 계산했습니다.",
                f"적용값: 예상 AI lesion sensitivity = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_rate']:.3f}, 평균 병변 수/양성 케이스 = {lesions_per_positive_case:.2f}, 양성 케이스 비율 = {format_percent(positive_case_rate)}",
                f"동등한 양측 CI 수준 = {equivalent_ci:.0%}, 원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredLesions": required_lesions,
                "requiredPositiveCases": positive_cases,
                "estimatedTotalCases": total_cases,
                "adjustedTotalCases": adjusted_total_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_rate"], 4),
            },
        }

    if metric == "fp_per_image":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 FP per Image")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 FP per Image")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        standard_deviation = parse_float(inputs.get("standardDeviation"), "표준편차")
        result = solve_one_sample_mean_noninferiority(expected_value, benchmark_value, ni_margin, standard_deviation, alpha, power, "lower")
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"FP per Image 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "영상당 위양성 수(FP per Image)는 lower-better 지표로 one-sample non-inferiority mean 근사식을 적용했습니다.",
                f"적용값: 예상 AI FP/Image = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_mean']:.3f}, effect gap = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_mean"], 4),
            },
        }

    if metric == "map":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 mAP")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 mAP")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        standard_deviation = parse_float(inputs.get("standardDeviation"), "부트스트랩 SD")
        result = solve_one_sample_mean_noninferiority(expected_value, benchmark_value, ni_margin, standard_deviation, alpha, power, "higher")
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"mAP 비열등성 판단에 필요한 최소 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "mAP는 부트스트랩 SD를 이용한 one-sample non-inferiority mean 근사식으로 계산했습니다.",
                f"적용값: 예상 AI mAP = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_mean']:.3f}, effect gap = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_mean"], 4),
            },
        }

    raise ValidationError("지원하지 않는 Detection 지표입니다.")


def calculate_ai_measurement(inputs):
    metric = inputs.get("metric")
    alpha = parse_float(inputs.get("alpha"), "one-sided alpha")
    power = parse_float(inputs.get("power"), "검정력")
    dropout = parse_float(inputs.get("dropout"), "예상 탈락률")
    assert_between_inclusive_left(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.")
    equivalent_ci = equivalent_two_sided_confidence(alpha)

    if metric == "accuracy":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 Measurement Accuracy")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 Measurement Accuracy")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        result = solve_one_sample_noninferiority_proportion(expected_value, benchmark_value, ni_margin, alpha, power)
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"Measurement Accuracy 비열등성 판단에 필요한 최소 paired 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "Measurement Accuracy는 허용오차 내 비율을 기준으로 one-sample non-inferiority proportion으로 계산했습니다.",
                f"적용값: 예상 AI Accuracy = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_rate']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_rate"], 4),
            },
        }

    if metric in {"mae", "rmse", "mape"}:
        metric_labels = {
            "mae": "MAE",
            "rmse": "RMSE",
            "mape": "MAPE",
        }
        expected_value = parse_float(inputs.get("expectedValue"), f"예상 {metric_labels[metric]}")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), f"비교 기준 {metric_labels[metric]}")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        standard_deviation = parse_float(inputs.get("standardDeviation"), "표준편차")
        result = solve_one_sample_mean_noninferiority(expected_value, benchmark_value, ni_margin, standard_deviation, alpha, power, "lower")
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        metric_label = metric_labels[metric]
        return {
            "headline": f"{metric_label} 비열등성 판단에 필요한 최소 paired 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                f"{metric_label}는 lower-better 지표로 one-sample non-inferiority mean 근사식을 적용했습니다.",
                f"적용값: 예상 AI {metric_label} = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_mean']:.3f}, effect gap = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_mean"], 4),
            },
        }

    if metric == "r_squared":
        expected_value = parse_float(inputs.get("expectedValue"), "예상 R-squared")
        benchmark_value = parse_float(inputs.get("benchmarkValue"), "비교 기준 R-squared")
        ni_margin = parse_float(inputs.get("nonInferiorityMargin"), "비열등성 마진")
        standard_deviation = parse_float(inputs.get("standardDeviation"), "부트스트랩 SD")
        result = solve_one_sample_mean_noninferiority(expected_value, benchmark_value, ni_margin, standard_deviation, alpha, power, "higher")
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        return {
            "headline": f"R-squared 비열등성 판단에 필요한 최소 paired 평가 케이스 수는 {format_number(required_cases)}건이며, 탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다.",
            "details": [
                "R-squared는 higher-better 지표로 one-sample non-inferiority mean 근사식을 적용했습니다.",
                f"적용값: 예상 AI R-squared = {expected_value:.3f}, benchmark = {benchmark_value:.3f}, 비열등성 마진 = {ni_margin:.3f}, SD = {standard_deviation:.3f}, one-sided alpha = {alpha:.3f}, power = {power:.0%}",
                f"비열등성 한계값 = {result['threshold_mean']:.3f}, effect gap = {result['effect_gap']:.3f}, 동등한 양측 CI 수준 = {equivalent_ci:.0%}",
                f"원계산값 = {result['raw_sample']:.2f}",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "nonInferiorityThreshold": round(result["threshold_mean"], 4),
            },
        }

    if metric == "bland_altman":
        expected_mean_difference = parse_float(inputs.get("expectedValue"), "예상 평균 차이")
        max_allowed_difference = parse_float(inputs.get("benchmarkValue"), "최대 허용 차이")
        standard_deviation = parse_float(inputs.get("standardDeviation"), "차이값 표준편차")
        result = solve_bland_altman_agreement(
            expected_mean_difference,
            standard_deviation,
            max_allowed_difference,
            alpha,
            power,
        )
        required_cases = result["required_sample"]
        adjusted_cases = adjust_for_dropout(required_cases, dropout)
        confidence_level = 1 - alpha
        return {
            "headline": (
                f"Bland-Altman agreement 판단에 필요한 최소 paired 평가 케이스 수는 {format_number(required_cases)}건이며, "
                f"탈락률 반영 모집 목표수는 {format_number(adjusted_cases)}건입니다."
            ),
            "details": [
                "Bland-Altman에서는 paired difference의 평균과 표준편차를 사용해 upper limit of agreement의 신뢰구간이 허용 차이 안에 들어오도록 계획했습니다.",
                (
                    f"적용값: 예상 평균 차이 = {expected_mean_difference:.3f}, 차이값 SD = {standard_deviation:.3f}, "
                    f"최대 허용 차이 Δ = {max_allowed_difference:.3f}, two-sided alpha = {alpha:.3f}, power = {power:.0%}"
                ),
                (
                    f"예상 upper LoA = {result['expected_upper_loa']:.3f}, lower LoA = {result['expected_lower_loa']:.3f}, "
                    f"worst-case |LoA| = {result['critical_loa']:.3f}, agreement gap = {result['agreement_gap']:.3f}, "
                    f"LoA 신뢰수준 = {confidence_level:.0%}, zα/2 = {result['z_alpha']:.3f}, zβ = {result['z_beta']:.3f}"
                ),
                f"원계산값 = {result['raw_sample']:.2f}",
                "이 계산은 Bland-Altman LoA 표준오차를 sqrt(3s²/n)로 두는 근사식 기반 planning 값입니다.",
            ],
            "metrics": {
                "requiredCases": required_cases,
                "adjustedCases": adjusted_cases,
                "rawSample": round(result["raw_sample"], 4),
                "expectedBias": round(expected_mean_difference, 4),
                "expectedUpperLoA": round(result["expected_upper_loa"], 4),
                "expectedLowerLoA": round(result["expected_lower_loa"], 4),
                "criticalLoA": round(result["critical_loa"], 4),
                "maxAllowedDifference": round(max_allowed_difference, 4),
                "agreementGap": round(result["agreement_gap"], 4),
            },
        }

    raise ValidationError("지원하지 않는 Measurement 지표입니다.")


CALCULATORS = {
    "single-proportion": calculate_single_proportion,
    "two-proportion": calculate_two_proportion,
    "two-mean": calculate_two_mean,
    "ai-classification": calculate_ai_classification,
    "ai-segmentation": calculate_ai_segmentation,
    "ai-detection": calculate_ai_detection,
    "ai-measurement": calculate_ai_measurement,
}


def build_response(status_code, content_type, body):
    return status_code, [("Content-Type", content_type), ("Content-Length", str(len(body)))], body


def build_json_response(status_code, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    return build_response(status_code, "application/json; charset=utf-8", body)


def build_static_file_response(relative_name):
    file_path = BASE_DIR / relative_name
    if not file_path.exists():
        return build_json_response(HTTPStatus.NOT_FOUND, {"error": "정적 파일을 찾을 수 없습니다."})

    content_type, _ = mimetypes.guess_type(file_path.name)
    if file_path.suffix in {".html", ".css", ".js"}:
        content_type = f"{content_type or 'text/plain'}; charset=utf-8"

    return build_response(HTTPStatus.OK, content_type or "application/octet-stream", file_path.read_bytes())


def handle_get_request(path):
    if path == "/api/health":
        return build_json_response(
            HTTPStatus.OK,
            {
                "status": "ok",
                "service": "medical-device-statistics-web",
                "port": PORT,
            },
        )

    if path in ALLOWED_STATIC_FILES:
        return build_static_file_response(ALLOWED_STATIC_FILES[path])

    return build_json_response(HTTPStatus.NOT_FOUND, {"error": "요청한 경로를 찾을 수 없습니다."})


def handle_calculate_request(raw_body):
    try:
        payload = json.loads(raw_body.decode("utf-8"))
        calculator_name = payload.get("calculator")
        inputs = payload.get("inputs", {})

        if calculator_name not in CALCULATORS:
            raise ValidationError("지원하지 않는 계산 유형입니다.")
        if not isinstance(inputs, dict):
            raise ValidationError("입력 형식이 올바르지 않습니다.")

        result = CALCULATORS[calculator_name](inputs)
        return build_json_response(HTTPStatus.OK, result)
    except ValidationError as error:
        return build_json_response(HTTPStatus.BAD_REQUEST, {"error": str(error)})
    except json.JSONDecodeError:
        return build_json_response(HTTPStatus.BAD_REQUEST, {"error": "JSON 본문을 읽을 수 없습니다."})
    except Exception:
        return build_json_response(HTTPStatus.INTERNAL_SERVER_ERROR, {"error": "서버에서 계산 중 오류가 발생했습니다."})


def dispatch_request(method, path, body=b""):
    normalized_method = (method or "GET").upper()

    if normalized_method == "GET":
        return handle_get_request(path)

    if normalized_method == "POST":
        if path != "/api/calculate":
            return build_json_response(HTTPStatus.NOT_FOUND, {"error": "요청한 API 경로를 찾을 수 없습니다."})
        return handle_calculate_request(body)

    return build_json_response(HTTPStatus.METHOD_NOT_ALLOWED, {"error": "지원하지 않는 HTTP 메서드입니다."})


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

    def do_GET(self):
        parsed = urlparse(self.path)
        self.send_marshaled_response(*dispatch_request("GET", parsed.path))

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)
        self.send_marshaled_response(*dispatch_request("POST", parsed.path, raw_body))

    def send_marshaled_response(self, status_code, headers, body):
        self.send_response(status_code)
        for header_name, header_value in headers:
            self.send_header(header_name, header_value)
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
