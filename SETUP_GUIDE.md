# 실행 가이드

이 문서는 Windows PowerShell 기준으로, 가상환경 생성부터 웹 서버 실행까지 한 번에 따라할 수 있도록 정리한 가이드입니다.

현재 프로젝트는 Python 표준 라이브러리만 사용하므로 현재 시점에서는 `pip install` 없이도 실행됩니다.
그래도 일반적인 Python 프로젝트 흐름에 맞추기 위해 `requirements.txt`는 포함해두었습니다.

## 1. 프로젝트 폴더로 이동

```powershell
cd c:\Users\doyoungjang\PycharmProjects\statistics_web
```

## 2. Python 설치 확인

```powershell
python --version
```

예상 예시:

```text
Python 3.11.9
```

만약 `python` 명령이 인식되지 않으면 Python이 설치되지 않았거나 PATH 설정이 안 된 상태입니다.

## 3. 가상환경 생성

프로젝트 루트에 `.venv` 이름으로 가상환경을 만듭니다.

```powershell
python -m venv .venv
```

생성이 끝나면 `.venv` 폴더가 만들어집니다.

## 4. 가상환경 활성화

PowerShell에서 아래 명령을 실행합니다.

```powershell
.\.venv\Scripts\Activate.ps1
```

정상 활성화되면 프롬프트 앞에 `(.venv)`가 표시됩니다.

예시:

```text
(.venv) PS C:\Users\doyoungjang\PycharmProjects\statistics_web>
```

## 5. requirements 설치

현재 `requirements.txt`에는 외부 패키지가 없어서 아래 명령을 실행해도 추가 설치는 거의 일어나지 않습니다.
하지만 이후 프로젝트가 확장될 때 같은 방식으로 그대로 이어갈 수 있습니다.

```powershell
pip install -r requirements.txt
```

## 6. 실행 정책 오류가 날 때

아래와 비슷한 메시지가 나오면 PowerShell 실행 정책 때문에 활성화가 막힌 것입니다.

```text
running scripts is disabled on this system
```

이 경우 현재 사용자 기준으로만 실행을 허용합니다.

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

명령 실행 후 다시 아래를 실행합니다.

```powershell
.\.venv\Scripts\Activate.ps1
```

회사 보안 정책상 실행 정책 변경이 어렵다면, 가상환경을 활성화하지 않고 가상환경 안의 Python을 직접 실행해도 됩니다.

```powershell
.\.venv\Scripts\python.exe main.py
```

## 7. 서버 실행

가상환경이 활성화된 상태라면 아래 명령으로 서버를 실행합니다.

```powershell
python main.py
```

정상 실행되면 아래와 비슷하게 표시됩니다.

```text
Server running at http://127.0.0.1:8000
```

## 8. 브라우저에서 접속

브라우저 주소창에 아래 주소를 입력합니다.

```text
http://127.0.0.1:8000
```

접속되면 의료기기 인허가용 최소 샘플수 계산 화면이 보입니다.

## 9. 서버 종료

서버를 실행 중인 PowerShell 창에서 아래 키를 누르면 종료됩니다.

```text
Ctrl + C
```

## 10. 가상환경 비활성화

작업이 끝나면 아래 명령으로 가상환경을 종료할 수 있습니다.

```powershell
deactivate
```

## 11. 한 번에 실행하는 빠른 순서

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

## 12. 자주 발생하는 문제

### 포트 8000이 이미 사용 중인 경우

다른 포트로 실행할 수 있습니다.

```powershell
$env:PORT=8010
python main.py
```

그 다음 브라우저에서 아래 주소로 접속합니다.

```text
http://127.0.0.1:8010
```

### 서버는 켜졌는데 페이지가 안 열리는 경우

아래 주소가 정확한지 다시 확인합니다.

```text
http://127.0.0.1:8000
```

또는 PowerShell에서 상태 확인 API를 직접 호출해볼 수 있습니다.

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

정상이라면 JSON 형식으로 `status: ok`가 반환됩니다.

### 가상환경 없이 바로 실행하고 싶은 경우

현재 프로젝트는 외부 패키지가 없으므로 아래처럼 바로 실행해도 됩니다.

```powershell
python main.py
```

다만 회사 환경에서 프로젝트별 Python 설정을 분리하려면 가상환경 사용을 권장합니다.

## 13. 새로 추가된 파일 설명

- `requirements.txt`: 외부 패키지 목록 파일입니다. 현재는 표준 라이브러리만 사용합니다.
- `.gitignore`: 가상환경, Python 캐시, IDE 설정 파일이 Git에 올라가지 않도록 막아줍니다.
