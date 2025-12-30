import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Customer Churn Prediction")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")

settings = Settings()
