from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_user: str
    postgres_password: str
    postgres_db: str
    echo_sql: bool = True
    project_name: str = "My FastAPI project"
    oauth_token_secret: str = "my_dev_secret"
    log_level: str = "DEBUG"
    auth_secret_key: str
    auth_algorithm: str = "hs256"
    access_token_expiration_minutes: int = 10080
    database_url: str


server_settings = Settings()
