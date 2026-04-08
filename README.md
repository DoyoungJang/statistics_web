# 의료기기 인허가 통계 계산기

의료기기 인허가 문서 작성과 AI 성능평가 계획 수립에 필요한 통계 계산, 프로토콜 초안 작성, 체크리스트 생성 기능을 제공하는 웹 애플리케이션입니다.

## 주요 기능

- 기본 통계 계산
  - 단일 비율 표본수
  - 두 비율 비교 표본수
  - 두 평균 비교 표본수
- AI 성능평가 샘플수 계산
  - Classification
  - Detection
  - Segmentation
  - Measurement
  - Bland-Altman 기반 measurement planning
- Protocol Planning
  - 저장형 / 실시간형 초음파 AI 기능별 프로토콜 초안 생성
  - 순서도 및 연구 수행 체크리스트 생성
- AI 통계 계산 예시
  - FDA / 식약처 / CE 관점의 capability별 예시 생성

## 실행 방식

이 프로젝트는 두 가지 방식으로 실행할 수 있습니다.

1. 개발용 실행
   - `python main.py`
   - Python 표준 라이브러리 기반의 내장 서버를 사용합니다.
2. 운영용 실행
   - `gunicorn + nginx + systemd`
   - `wsgi.py`를 엔트리포인트로 사용합니다.

## 필수 파일

- [main.py](/c:/Users/doyoungjang/PycharmProjects/statistics_web/main.py)
  개발용 서버와 계산 로직이 들어 있습니다.
- [wsgi.py](/c:/Users/doyoungjang/PycharmProjects/statistics_web/wsgi.py)
  Gunicorn에서 사용할 WSGI 엔트리포인트입니다.
- [gunicorn.conf.py](/c:/Users/doyoungjang/PycharmProjects/statistics_web/gunicorn.conf.py)
  Gunicorn 운영 설정입니다.
- [deploy/nginx/statistics_web.conf](/c:/Users/doyoungjang/PycharmProjects/statistics_web/deploy/nginx/statistics_web.conf)
  Nginx reverse proxy 예시 설정입니다.
- [deploy/systemd/statistics_web.service](/c:/Users/doyoungjang/PycharmProjects/statistics_web/deploy/systemd/statistics_web.service)
  systemd 서비스 예시입니다.
- [deploy/env/statistics_web.env.example](/c:/Users/doyoungjang/PycharmProjects/statistics_web/deploy/env/statistics_web.env.example)
  운영용 환경변수 예시입니다.
- [requirements.txt](/c:/Users/doyoungjang/PycharmProjects/statistics_web/requirements.txt)
  운영용 Python 의존성입니다.

## 로컬 설치 및 실행

### 1. 프로젝트 폴더로 이동

```powershell
cd c:\Users\doyoungjang\PycharmProjects\statistics_web
```

### 2. 가상환경 생성 및 활성화

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. 의존성 설치

```powershell
pip install -r requirements.txt
```

참고:
- Windows에서는 `gunicorn`이 설치되지 않도록 환경 마커가 걸려 있습니다.
- 로컬 개발은 계속 `python main.py`로 실행하면 됩니다.

### 4. 개발 서버 실행

```powershell
python main.py
```

브라우저 접속:

```text
http://127.0.0.1:8000
```

## 웹 시스템 사용 방법

### 화면 구조

상단 네비게이션에는 다음 4개 메인 탭이 있습니다.

- `기본 통계 계산`
  - 일반적인 표본수 계산이 필요할 때 사용합니다.
- `AI 성능평가 샘플수`
  - AI 성능지표별로 비열등성 기반 샘플수 계획을 세울 때 사용합니다.
- `AI 통계 계산 예시`
  - 규제권역별로 어떤 통계 프레임을 쓰는지 예시 문구와 예시 설계를 볼 때 사용합니다.
- `Protocol Planning`
  - 초음파 AI 임상시험용 프로토콜 초안과 연구 체크리스트를 만들 때 사용합니다.

### 디자인 선택

모든 주요 페이지 우측 상단에는 `Design` 선택기가 있습니다.

- `Executive`
  - 기본 밝은 테마입니다.
- `Neo Dark`
  - 다크 배경 기반의 대시보드형 테마입니다.

한 번 선택하면 브라우저에 저장되어 다른 탭으로 이동해도 유지됩니다.

### 공통 사용 흐름

1. 상단 탭에서 원하는 작업 화면으로 이동합니다.
2. 필요한 입력값을 폼에 입력합니다.
3. 하단 또는 우측의 `생성`, `계산`, `예시 적용`, `복사` 버튼을 사용합니다.
4. 결과 카드에서 권고 샘플수, 해석 문구, 공식, 파라미터 표를 확인합니다.
5. 화면 맨 아래의 `Glossary`에서 전문 용어 설명을 확인합니다.

### 1. 기본 통계 계산 사용법

권장 용도:
- 일반적인 임상 통계 계산
- AI가 아닌 기본 표본수 검토

사용 순서:

1. `기본 통계 계산` 탭으로 이동합니다.
2. 필요한 계산 유형을 선택합니다.
   - 단일 비율
   - 두 비율 비교
   - 두 평균 비교
3. 비율, 표준편차, 유의수준, 검정력, 탈락률을 입력합니다.
4. `계산하기`를 누릅니다.
5. 결과 카드에서 최소 필요 샘플수와 탈락 반영 모집 수를 확인합니다.

확인 포인트:
- 우측 `적용 공식` 카드
- 결과 카드의 요약 수치
- 하단 `Glossary`

### 2. AI 성능평가 샘플수 사용법

권장 용도:
- AI 기능 성능 검증용 샘플수 설계
- Classification, Detection, Segmentation, Measurement별 계획

사용 순서:

1. `AI 성능평가 샘플수` 탭으로 이동합니다.
2. 상단 capability 탭을 선택합니다.
   - Classification
   - Segmentation
   - Detection
   - Measurement
3. `Metric 선택`에서 지표를 고릅니다.
4. 기대 성능, benchmark, 비열등성 마진, alpha, power, dropout을 입력합니다.
5. 필요 시 아래 planning 보정값도 입력합니다.
   - `Design effect / cluster inflation`
   - `Protected subgroups`
   - `Minimum cases per subgroup`
   - `Reference standard failure rate`
6. `계산하기`를 누릅니다.
7. 결과 카드에서 기본 샘플수와 guidance-aligned planning overlay를 함께 확인합니다.

Measurement 탭 참고:
- `Bland-Altman` 선택 시 평균 차이, 최대 허용 차이, 차이값 표준편차 기준으로 계산됩니다.

확인 포인트:
- 우측 `Formula`
- 우측 `Assumptions`
- 결과 카드의 parameter table
- 화면 맨 아래 `Glossary`

### 3. AI 통계 계산 예시 사용법

권장 용도:
- FDA / 식약처 / CE 제출 관점의 예시 설계를 빠르게 만들고 싶을 때
- capability별 통계 문구 예시가 필요할 때

사용 순서:

1. `AI 통계 계산 예시` 탭으로 이동합니다.
2. 기능 유형을 선택합니다.
   - Classification
   - Detection
   - Segmentation
   - Measurement
   - 실시간 Classification
   - 실시간 Detection
   - 실시간 Segmentation
   - 실시간 Measurement
3. 규제권역을 선택합니다.
   - All
   - FDA
   - MFDS
   - CE
4. 입력 폼에서 indication, endpoint, subgroup, latency 같은 값을 조정합니다.
5. `통계 예시 생성`을 누릅니다.
6. 생성된 capability-specific example design pack을 검토합니다.

확인 포인트:
- 우측 `Regulatory Lens`
- 우측 `Official Sources`
- 생성 결과 카드
- 하단 `Glossary`

### 4. Protocol Planning 사용법

권장 용도:
- 초음파 AI 기능 임상시험용 protocol draft 작성
- 저장형 AI와 실시간 AI를 구분한 시험 설계

지원 capability:

- Classification
- Detection
- Segmentation
- Measurement
- 실시간 Classification
- 실시간 Detection
- 실시간 Segmentation
- 실시간 Measurement

저장형과 실시간의 차이:

- 저장형
  - 스캔 후 저장된 이미지 또는 clip에 대해 AI를 분석합니다.
- 실시간형
  - 스캔 중 AI가 즉시 동작하고 화면에 표시됩니다.

사용 순서:

1. `Protocol Planning` 탭으로 이동합니다.
2. capability 버튼에서 기능 유형을 선택합니다.
3. 연구질문, 적응증, intended use, comparator, patient population, endpoint, reference standard 등을 입력합니다.
4. 필요 시 `예시 프로토콜 채우기`를 눌러 capability별 예시값을 자동 입력합니다.
5. 다시 처음 상태로 돌아가고 싶으면 `원상 복원`을 누릅니다.
6. `프로토콜 초안 생성`을 누릅니다.
7. 생성된 protocol draft, study flow, endpoint, statistical note를 검토합니다.
8. 필요 시 `초안 복사`를 눌러 문서 초안으로 옮깁니다.

실시간 capability 참고:
- 실시간 기능을 선택했을 때만 실시간 표시 방식, 실시간 반응 기준 항목이 표시됩니다.

확인 포인트:
- 초안 결과 카드
- 순서도(flowchart)
- 하단 `Glossary`

### 5. Protocol Checklist 사용법

권장 용도:
- 생성된 protocol에 따라 실제 연구 수행 체크리스트를 관리할 때

사용 순서:

1. `Protocol Planning`에서 프로토콜 초안을 먼저 생성합니다.
2. `체크리스트 페이지 열기`를 누릅니다.
3. 체크리스트 페이지에서 section별 항목을 확인합니다.
4. 완료한 항목은 체크합니다.
5. 상단의 `Checklist Copy`로 현재 체크리스트를 복사할 수 있습니다.
6. `Progress Reset`으로 진행 상태를 초기화할 수 있습니다.

참고:
- 진행 상태는 브라우저에 저장되어 다시 열어도 이어서 볼 수 있습니다.

## 추천 사용 시나리오

### 시나리오 1. 일반 표본수 검토

1. `기본 통계 계산`에서 대략적인 샘플수 범위를 확인합니다.
2. 필요 시 `AI 성능평가 샘플수`로 이동해 AI 지표 기준으로 정교화합니다.

### 시나리오 2. AI 성능 검증 계획 수립

1. `AI 성능평가 샘플수`에서 metric별 샘플수를 계산합니다.
2. `AI 통계 계산 예시`에서 규제권역별 예시 문구를 확인합니다.
3. `Protocol Planning`에서 protocol draft를 생성합니다.

### 시나리오 3. 프로토콜 작성부터 수행 관리까지

1. `Protocol Planning`에서 capability를 선택합니다.
2. 예시값 또는 실제 입력값으로 draft를 생성합니다.
3. `체크리스트 페이지 열기`로 연구 수행 체크리스트를 생성합니다.
4. 체크리스트를 기준으로 운영합니다.

## Linux 운영 배포 예시

아래 예시는 Ubuntu 계열 서버에서 `nginx + gunicorn + systemd`로 배포하는 기준입니다.

### 1. OS 패키지 설치

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nginx
```

### 2. 애플리케이션 디렉터리 준비

```bash
sudo mkdir -p /opt/statistics_web
sudo chown -R $USER:$USER /opt/statistics_web
cd /opt/statistics_web
```

이 저장소 내용을 `/opt/statistics_web`에 배치합니다.

### 3. 가상환경 및 Python 패키지 설치

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. 환경변수 파일 준비

```bash
cp deploy/env/statistics_web.env.example deploy/env/statistics_web.env
```

필요하면 `deploy/env/statistics_web.env`에서 포트와 worker 수를 조정합니다.

기본 예시:

```env
PORT=8000
GUNICORN_BIND=127.0.0.1:8000
GUNICORN_WORKERS=3
GUNICORN_THREADS=4
GUNICORN_TIMEOUT=60
```

### 5. Gunicorn 단독 실행 테스트

```bash
source .venv/bin/activate
gunicorn -c gunicorn.conf.py wsgi:application
```

헬스체크:

```bash
curl http://127.0.0.1:8000/api/health
```

### 6. systemd 서비스 등록

```bash
sudo cp deploy/systemd/statistics_web.service /etc/systemd/system/statistics_web.service
```

다음 항목은 서버 환경에 맞게 수정해야 합니다.

- `User`
- `Group`
- `WorkingDirectory`
- `EnvironmentFile`
- `ExecStart`

수정 후 실행:

```bash
sudo systemctl daemon-reload
sudo systemctl enable statistics_web
sudo systemctl start statistics_web
sudo systemctl status statistics_web
```

### 7. Nginx reverse proxy 설정

```bash
sudo cp deploy/nginx/statistics_web.conf /etc/nginx/sites-available/statistics_web
sudo ln -s /etc/nginx/sites-available/statistics_web /etc/nginx/sites-enabled/statistics_web
```

다음 항목은 실제 서버 값으로 바꿔야 합니다.

- `server_name`
- `proxy_pass`

설정 확인 및 재시작:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 운영 권장 구조

- Nginx
  - 80/443 포트 수신
  - reverse proxy 담당
- Gunicorn
  - Python WSGI 앱 실행
  - `wsgi:application` 사용
- systemd
  - 프로세스 자동 시작
  - 장애 시 재시작

## API

- `GET /api/health`
  - 서버 상태 확인
- `POST /api/calculate`
  - 계산 실행

예시 요청:

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

## 빠른 명령 모음

### Windows 개발

```powershell
cd c:\Users\doyoungjang\PycharmProjects\statistics_web
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

### Linux 운영 테스트

```bash
cd /opt/statistics_web
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
gunicorn -c gunicorn.conf.py wsgi:application
```
