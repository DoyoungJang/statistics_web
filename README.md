# 의료기기 인허가 통계 계산기

의료기기 인허가, AI 성능평가, 임상 프로토콜 초안 작성에 필요한 통계 계산과 문서 작성 흐름을 하나의 웹 화면에서 다룰 수 있도록 만든 도구입니다.

이 프로젝트는 다음 작업을 빠르게 이어서 할 수 있도록 설계되어 있습니다.

- 기본 통계 샘플 수 계산
- AI 성능평가 샘플 수 계획
- 규제권역별 AI 통계 예시 생성
- 초음파 AI 기능 임상시험용 Protocol Planning
- 프로토콜 기반 Checklist 생성

## 주요 화면

상단 메인 탭은 아래 4개로 구성됩니다.

- `기본 통계 계산`
- `AI 성능평가 샘플수`
- `AI 통계 계산 예시`
- `Protocol Planning`

모든 주요 화면 우측 상단에서는 `Design` 토글로 `Executive` 또는 `Neo Dark` 테마를 선택할 수 있습니다.

## 지원 기능 요약

### 1. 기본 통계 계산

- 단일 비율 샘플 수
- 두 비율 비교 샘플 수
- 두 평균 비교 샘플 수

### 2. AI 성능평가 샘플수

카테고리별 지원 지표는 아래와 같습니다.

- `Classification`
  - Accuracy
  - Sensitivity
  - Specificity
  - AUC
  - F1-score
  - Precision (PPV)
  - NPV
- `Detection`
  - Accuracy
  - IoU
  - Lesion-level Sensitivity
  - FP per Image
  - mAP
- `Segmentation`
  - Accuracy
  - DSC
  - IoU
- `Measurement`
  - Accuracy
  - MAE
  - RMSE
  - MAPE
  - R-squared
  - Bland-Altman

또한 아래 planning overlay 입력을 통해 실제 운영 계획에 가까운 보정값을 반영할 수 있습니다.

- `Design effect / cluster inflation`
- `Protected subgroups`
- `Minimum cases per subgroup`
- `Reference standard failure rate`

### 3. AI 통계 계산 예시

규제권역별 예시 문구와 통계 프레임을 capability별로 생성할 수 있습니다.

- 지원 capability
  - Classification
  - Detection
  - Segmentation
  - Measurement
  - 실시간 Classification
  - 실시간 Detection
  - 실시간 Segmentation
  - 실시간 Measurement
- 지원 권역
  - All
  - FDA
  - MFDS
  - CE

### 4. Protocol Planning

초음파 AI 기능 임상시험용 프로토콜 초안을 생성할 수 있습니다.

- 지원 capability
  - Classification
  - Detection
  - Segmentation
  - Measurement
  - 실시간 Classification
  - 실시간 Detection
  - 실시간 Segmentation
  - 실시간 Measurement
- 생성 항목
  - 연구질문
  - intended use
  - comparator
  - patient population
  - endpoint
  - reference standard
  - clinical workflow
  - study flowchart
  - statistical notes
  - safety / human factors
  - monitoring / change control

추가로 다음 기능도 제공합니다.

- `예시 프로토콜 채우기`
- `원상 복원`
- `프로토콜 초안 복사`
- `체크리스트 페이지 열기`

### 5. Protocol Checklist

생성된 프로토콜을 실제 연구 수행 단계에서 체크리스트로 관리할 수 있습니다.

- section별 진행 관리
- 진행률 표시
- 체크리스트 복사
- 진행 상태 저장 / 초기화

## 프로젝트 구조

- [main.py](/c:/Users/doyoungjang/PycharmProjects/statistics_web/main.py)
  - 개발 서버, API, 통계 계산 로직
- [wsgi.py](/c:/Users/doyoungjang/PycharmProjects/statistics_web/wsgi.py)
  - Gunicorn용 WSGI 엔트리포인트
- [gunicorn.conf.py](/c:/Users/doyoungjang/PycharmProjects/statistics_web/gunicorn.conf.py)
  - Gunicorn 설정
- [index.html](/c:/Users/doyoungjang/PycharmProjects/statistics_web/index.html)
  - 기본 통계 계산 화면
- [ai-performance.html](/c:/Users/doyoungjang/PycharmProjects/statistics_web/ai-performance.html)
  - AI 성능평가 샘플수 화면
- [ai-stat-examples.html](/c:/Users/doyoungjang/PycharmProjects/statistics_web/ai-stat-examples.html)
  - AI 통계 계산 예시 화면
- [protocol-planning.html](/c:/Users/doyoungjang/PycharmProjects/statistics_web/protocol-planning.html)
  - 프로토콜 초안 생성 화면
- [protocol-checklist.html](/c:/Users/doyoungjang/PycharmProjects/statistics_web/protocol-checklist.html)
  - 체크리스트 화면
- [app.js](/c:/Users/doyoungjang/PycharmProjects/statistics_web/app.js)
  - 프런트엔드 동작, 결과 렌더링, 안내 문구
- [styles.css](/c:/Users/doyoungjang/PycharmProjects/statistics_web/styles.css)
  - 공통 UI 스타일
- [deploy/nginx/statistics_web.conf](/c:/Users/doyoungjang/PycharmProjects/statistics_web/deploy/nginx/statistics_web.conf)
  - Nginx reverse proxy 예시
- [deploy/systemd/statistics_web.service](/c:/Users/doyoungjang/PycharmProjects/statistics_web/deploy/systemd/statistics_web.service)
  - systemd 서비스 예시
- [deploy/env/statistics_web.env.example](/c:/Users/doyoungjang/PycharmProjects/statistics_web/deploy/env/statistics_web.env.example)
  - 운영 환경변수 예시

## 로컬 실행

### Windows PowerShell

```powershell
cd c:\Users\doyoungjang\PycharmProjects\statistics_web
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

브라우저 접속:

```text
http://127.0.0.1:8000
```

### macOS / Linux

```bash
cd /path/to/statistics_web
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

브라우저 접속:

```text
http://127.0.0.1:8000
```

### 참고

- 개발 실행은 표준 라이브러리 기반 서버인 `python main.py`를 사용합니다.
- `requirements.txt`에는 운영용 `gunicorn`만 포함되어 있습니다.
- Windows에서는 일반적으로 `gunicorn` 대신 `python main.py`로 개발/테스트합니다.

## Ubuntu 운영 배포 예시

아래는 `nginx + gunicorn + systemd` 기준 예시입니다.

### 1. 시스템 패키지 설치

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nginx
```

### 2. 애플리케이션 배치

```bash
sudo mkdir -p /opt/statistics_web
sudo chown -R $USER:$USER /opt/statistics_web
cd /opt/statistics_web
```

프로젝트 파일을 `/opt/statistics_web` 아래에 배치합니다.

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

예시:

```env
PORT=8000
GUNICORN_BIND=127.0.0.1:8000
GUNICORN_WORKERS=3
GUNICORN_THREADS=4
GUNICORN_TIMEOUT=60
```

### 5. Gunicorn 단독 테스트

```bash
source .venv/bin/activate
gunicorn -c gunicorn.conf.py wsgi:application
```

헬스체크:

```bash
curl http://127.0.0.1:8000/api/health
```

### 6. systemd 등록

```bash
sudo cp deploy/systemd/statistics_web.service /etc/systemd/system/statistics_web.service
```

실제 서버에 맞게 아래 항목을 수정해야 합니다.

- `User`
- `Group`
- `WorkingDirectory`
- `EnvironmentFile`
- `ExecStart`

등록 및 시작:

```bash
sudo systemctl daemon-reload
sudo systemctl enable statistics_web
sudo systemctl start statistics_web
sudo systemctl status statistics_web
```

### 7. Nginx 연결

```bash
sudo cp deploy/nginx/statistics_web.conf /etc/nginx/sites-available/statistics_web
sudo ln -s /etc/nginx/sites-available/statistics_web /etc/nginx/sites-enabled/statistics_web
sudo nginx -t
sudo systemctl reload nginx
```

실제 서버에 맞게 아래 항목을 수정해야 합니다.

- `server_name`
- `proxy_pass`

## 웹 시스템 사용 방법

### 공통 사용 흐름

1. 상단 메인 탭에서 작업 화면을 선택합니다.
2. 입력 폼에 필요한 수치를 넣습니다.
3. `계산하기`, `예시 적용`, `초안 생성` 같은 액션 버튼을 누릅니다.
4. 결과 카드에서 샘플 수, 공식, parameter table, 규제 문구를 확인합니다.
5. 화면 맨 아래 `Glossary`에서 전문 용어 설명을 확인합니다.

### 1. 기본 통계 계산

권장 용도:

- 일반 임상연구 기본 샘플 수 검토
- AI가 아닌 통계 계산 빠른 확인

사용 순서:

1. `기본 통계 계산` 탭으로 이동합니다.
2. 계산 유형을 선택합니다.
   - 단일 비율
   - 두 비율 비교
   - 두 평균 비교
3. 비율, 표준편차, 유의수준, 검정력, 탈락률을 입력합니다.
4. `계산하기`를 누릅니다.
5. 결과 카드에서 최소 필요 샘플 수와 탈락 반영 모집 목표 수를 확인합니다.

### 2. AI 성능평가 샘플수

권장 용도:

- AI 성능 검증용 샘플 수 계획
- metric별 비열등성 또는 agreement 기반 planning

사용 순서:

1. `AI 성능평가 샘플수` 탭으로 이동합니다.
2. capability를 선택합니다.
   - Classification
   - Detection
   - Segmentation
   - Measurement
3. metric을 선택합니다.
4. 기대 성능, benchmark, margin, alpha, power, dropout을 입력합니다.
5. 필요 시 planning overlay 보정값을 입력합니다.
6. `계산하기`를 누릅니다.
7. 결과 카드에서 base sample size와 guidance-aligned planning overlay를 함께 확인합니다.

Measurement 사용 시 참고:

- `RMSE`
  - 정규 근사 기반 planning으로 계산합니다.
- `MAPE`
  - reference value가 0 또는 0에 가까우면 불안정할 수 있습니다.
- `Bland-Altman`
  - fixed `95% LoA`를 전제로 합니다.
  - Lu et al. (2016)의 `non-central t` 기반 sample size method를 사용합니다.
  - 결과 카드에 `achieved power`, `upper/lower-side β`, `legacy approximate n`, `|bias|/SD`, `Δ/SD`를 함께 보여줍니다.

### 3. AI 통계 계산 예시

권장 용도:

- FDA / MFDS / CE 관점의 예시 문구 작성
- capability별 통계 프레임 빠른 초안 생성

사용 순서:

1. `AI 통계 계산 예시` 탭으로 이동합니다.
2. capability를 선택합니다.
3. 규제권역을 선택합니다.
   - All
   - FDA
   - MFDS
   - CE
4. indication, endpoint, subgroup, latency 등 필요한 입력을 조정합니다.
5. 예시 생성 버튼을 눌러 capability-specific example design pack을 확인합니다.

### 4. Protocol Planning

권장 용도:

- 초음파 AI 기능 임상시험 프로토콜 초안 작성
- 저장형 AI와 실시간 AI 워크플로우 구분

사용 순서:

1. `Protocol Planning` 탭으로 이동합니다.
2. capability를 선택합니다.
3. 연구질문, intended use, comparator, patient population, endpoint, reference standard 등을 입력합니다.
4. 필요하면 `예시 프로토콜 채우기`로 예시값을 자동 입력합니다.
5. 다시 초기 상태로 돌리고 싶으면 `원상 복원`을 누릅니다.
6. `프로토콜 초안 생성`을 눌러 draft를 생성합니다.
7. 생성된 study flowchart, endpoint, statistical note, 운영 체크포인트를 검토합니다.

실시간 capability 참고:

- 저장형 기능
  - 스캔 후 저장된 이미지 또는 clip에 대해 AI가 분석합니다.
- 실시간 기능
  - 스캔 중 AI가 즉시 동작하고 화면에 표시됩니다.

### 5. Protocol Checklist

권장 용도:

- 생성된 protocol을 실제 연구 운영용 체크리스트로 전환

사용 순서:

1. `Protocol Planning`에서 먼저 초안을 생성합니다.
2. `체크리스트 페이지 열기`를 눌러 이동합니다.
3. section별 항목을 확인하고 완료 시 체크합니다.
4. 상단 진행률과 복사 기능을 활용합니다.
5. 필요하면 진행 상태를 초기화합니다.

## Bland-Altman 방법 설명

이 프로젝트의 `Measurement > Bland-Altman` 계산은 기존 단순 근사치만 보여주는 방식이 아니라, 아래 논문 흐름에 맞춰 보강되어 있습니다.

- Lu M, Zhong W, Liu Y, Miao H, Li Y, Ji M. 2016.
  - Sample Size for Assessing Agreement between Two Methods of Measurement by Bland-Altman Method

현재 구현 특징:

- 고정된 `95% LoA(mean ± 1.96 SD)`를 사용합니다.
- 입력값
  - 예상 평균 차이 `bias`
  - 차이값 표준편차 `SD`
  - 최대 허용 차이 `Δ`
  - 양측 `alpha`
  - `power`
- 내부 계산
  - LoA 표준오차를 이용합니다.
  - `non-central t` 기반으로 exact achieved power를 계산합니다.
  - 목표 power 이상이 되는 최소 `n`을 탐색합니다.
- 결과 보조지표
  - 예상 upper / lower LoA
  - worst-case `|LoA|`
  - agreement gap
  - achieved power
  - upper-side β / lower-side β
  - 기존 근사식 기반 legacy approximate n

해석 시 주의:

- `Δ`는 `|bias| + 1.96 × SD`보다 커야 합니다.
- 이 계산은 `95% LoA` 고정 가정입니다.
- LoA 수준을 바꾸면 공식도 달라집니다.
- 파일럿 데이터에서 추정한 bias와 SD를 쓰는 것이 가장 적절합니다.

## API

### 헬스체크

- `GET /api/health`

### 계산 실행

- `POST /api/calculate`

예시 1. 단일 비율:

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

예시 2. Measurement Bland-Altman:

```json
{
  "calculator": "ai-measurement",
  "inputs": {
    "metric": "bland_altman",
    "expectedValue": 0.001167,
    "benchmarkValue": 0.004,
    "standardDeviation": 0.001129,
    "alpha": 0.05,
    "power": 0.8,
    "dropout": 0.1
  }
}
```

## 참고 문헌 및 가이드

- Bland and Altman, agreement between two methods of clinical measurement
- Lu et al., Sample Size for Assessing Agreement between Two Methods of Measurement by Bland-Altman Method
- FDA: Non-Inferiority Clinical Trials
- FDA: Evaluation Methods for AI-Enabled Medical Devices
- MFDS: 생성형 인공지능 의료기기 허가·심사 가이드라인

## 빠른 명령어 모음

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

## 문제 해결 팁

- Windows에서 `gunicorn` 설치가 되지 않으면 정상입니다.
  - 개발 실행은 `python main.py`를 사용하세요.
- 브라우저에서 변경사항이 안 보이면 강력 새로고침을 먼저 해보세요.
  - Windows: `Ctrl + F5`
- 운영 배포 후 페이지는 열리지만 API가 안 되면 아래 순서로 확인하세요.
  - `systemctl status statistics_web`
  - `curl http://127.0.0.1:8000/api/health`
  - `nginx -t`
