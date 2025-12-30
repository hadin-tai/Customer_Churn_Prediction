# Customer Churn Prediction Backend

This is the FastAPI backend for the Customer Churn Prediction system.

## Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Server**:
    ```bash
    uvicorn app.main:app --reload
    ```

## ML Integration

**CRITICAL**: The ML logic is NOT included in this repo. You must manually implement it.

1.  Open `app/services/ml_pipeline.py`.
2.  Implement the `predict_churn(data: dict)` function.
3.  Place your model files (`.pkl`, etc.) in the `models/` directory.
4.  Ensure `predict_churn` loads the model and returns the prediction.

## API Endpoints

-   `POST /api/v1/predict`: Accepts raw customer data JSON and returns churn prediction.
