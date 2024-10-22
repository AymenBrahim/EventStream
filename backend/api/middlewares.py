from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from api.security import decode_access_token

signup_path = "/api/signup"
signin_path = "/api/signin"
public_paths = [signin_path, signup_path, "", "/api", "/api/docs", "/api/openapi.json"]


class Authorize(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if not (request.url.path.rstrip("/") in public_paths):
            try:
                authorization = request.headers.get("Authorization")
                offset = len("Bearer ")
                token = authorization[offset:]

                decode_access_token(token)
            except HTTPException as e:
                return Response(status_code=e.status_code, headers=e.headers)

        response = await call_next(request)
        return response
