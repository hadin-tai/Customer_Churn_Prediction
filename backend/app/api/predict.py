from fastapi import APIRouter, HTTPException
from typing import Dict, Any

# # This import will fail until the user implements the function in app/services/ml_pipeline.py
# try:
#     from app.services.ml_pipeline import predict_churn
# except ImportError:
#     # Placeholder to allow app to start if needed, though user requested strict import
#     # But for the sake of not crashing immediately if they run it without implementing:
#     # The user explicitly said "The backend must import the function below (do not define it)"
#     # So I will stick to the strict import as requested, but maybe add a comment.
#     pass

router = APIRouter()

@router.post("/predict")
async def predict(data: Dict[str, Any]):
    """
    Predict customer churn.
    
    Args:
        data (Dict[str, Any]): Raw customer data.
        
    Returns:
        JSON response from the ML pipeline.
    """
    try:
        # We assume predict_churn is available at runtime
        print("reached predict")
        from app.services.ml_pipeline import predict_churn
        result = predict_churn(data)
        
        return result
    except ImportError as e:
        raise HTTPException(status_code=500, detail=f"ML Pipeline Import Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
