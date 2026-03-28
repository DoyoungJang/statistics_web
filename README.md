# 의료기기 인허가 통계 계산기

의료기기 인허가 문서 작성 시 필요한 통계 계산을 빠르게 수행하기 위한 Python 기반 웹 애플리케이션입니다.

## 현재 포함 기능

- 단일 비율 추정용 최소 샘플수 계산
- 두 비율 비교용 최소 샘플수 계산
- 두 평균 비교용 최소 샘플수 계산
- 예상 탈락률 반영 모집 목표수 계산

## 실행 방법

1. 프로젝트 폴더에서 가상환경을 만듭니다.
2. 가상환경을 활성화합니다.
3. `pip install -r requirements.txt`를 실행합니다.
4. `python main.py`를 실행합니다.
5. 브라우저에서 `http://127.0.0.1:8000`을 엽니다.
6. 계산 유형을 선택합니다.
7. 가정값을 입력하고 결과를 확인합니다.

가상환경 생성부터 서버 실행까지의 자세한 순서는 [SETUP_GUIDE.md](/c:/Users/doyoungjang/PycharmProjects/statistics_web/SETUP_GUIDE.md#L1)를 참고하세요.

빠른 실행 예시:

```powershell
cd c:\Users\doyoungjang\PycharmProjects\statistics_web
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

## 환경 파일

- `requirements.txt` : Python 패키지 목록 파일입니다. 현재는 표준 라이브러리만 사용하므로 외부 패키지는 없습니다.
- `.gitignore` : 가상환경, Python 캐시, IDE 설정 파일 등이 Git에 포함되지 않도록 관리합니다.

## 서버 API

- `GET /api/health` : 서버 상태 확인
- `POST /api/calculate` : 샘플수 계산

예시 요청 본문:

```json
{
  "calculator": "single-proportion",
  "inputs": {
    "proportion": 0.8,
    "margin": 0.1,
    "confidence": 0.95,
    "dropout": 0.1
  }
}
```

## 기본 가정

- 독립 표본
- 양측 검정
- 두 군 비교 시 1:1 배정
- 두 평균 비교 시 두 군의 분산이 유사함

## 주의

비열등성, 동등성, paired design, 생존분석, ROC 분석 등은 별도 공식을 추가로 구현해야 합니다.
