from http import HTTPStatus

from main import dispatch_request


def application(environ, start_response):
    method = (environ.get("REQUEST_METHOD") or "GET").upper()
    path = environ.get("PATH_INFO") or "/"

    try:
        content_length = int(environ.get("CONTENT_LENGTH") or "0")
    except ValueError:
        content_length = 0

    body = environ["wsgi.input"].read(content_length) if content_length > 0 else b""
    status_code, headers, response_body = dispatch_request(method, path, body)
    status_line = f"{int(status_code)} {HTTPStatus(int(status_code)).phrase}"
    start_response(status_line, headers)
    return [response_body]
