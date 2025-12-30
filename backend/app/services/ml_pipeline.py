import pandas as pd
import joblib
import os

# --------------------------------------------------
# Load Pipeline
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "models")

pipeline = joblib.load(
    os.path.join(ARTIFACTS_DIR, "telco_xgb_pipeline.pkl")
)

# --------------------------------------------------
# Prediction Function
# --------------------------------------------------

def predict_churn(user_input: dict):
    """
    user_input: raw JSON from frontend
    """

    # Convert JSON → DataFrame
    df = pd.DataFrame([user_input])

    # Predict probability and class
    prob = pipeline.predict_proba(df)[0][1]
    pred = pipeline.predict(df)[0]

    return {
        "churn_probability": round(float(prob), 4),
        "churn_prediction": "Yes" if pred == 1 else "No",
        "y_pred": int(pred)
    }





# import pandas as pd
# import joblib
# import os

# # Load artifacts
# # scaler = joblib.load("scaler.pkl")
# # model = joblib.load("xgb_model.pkl")
# # ohe = joblib.load("ohe.pkl")
# # city_te = joblib.load("city_te.pkl")
# # feature_order = joblib.load("feature_order.pkl")


# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# ARTIFACTS_DIR = os.path.join(BASE_DIR, "models")

# scaler = joblib.load(os.path.join(ARTIFACTS_DIR, "scaler.pkl"))
# model = joblib.load(os.path.join(ARTIFACTS_DIR, "xgb_model.pkl"))
# ohe = joblib.load(os.path.join(ARTIFACTS_DIR, "ohe.pkl"))
# city_te = joblib.load(os.path.join(ARTIFACTS_DIR, "city_te.pkl"))
# feature_order = joblib.load(os.path.join(ARTIFACTS_DIR, "feature_order.pkl"))

# # Columns (same as training)
# YN_COLUMNS = [
#     'Paperless Billing','Unlimited Data','Streaming Music',
#     'Streaming Movies','Streaming TV','Senior Citizen',
#     'Married','Phone Service','Multiple Lines','Internet Service',
#     'Online Security','Online Backup','Device Protection Plan',
#     'Premium Tech Support'
# ]

# OHE_COLS = ['Payment Method','Contract']


# def preprocess_input(user_input: dict):
#     """
#     user_input: raw JSON from frontend
#     """

#     df = pd.DataFrame([user_input])

#     # Yes/No Encoding
#     df[YN_COLUMNS] = df[YN_COLUMNS].replace({"Yes": 1, "No": 0})

#     # Gender
#     df['Gender'] = df['Gender'].replace({"Male": 1, "Female": 0})

#     # Target Encoding (City)
#     df['City'] = df['City'].map(city_te).fillna(0)


#     print("Feature in here:", df.columns.tolist(),'\n Feature in training:',feature_order)
#     print(df.head())


#     # One Hot Encoding
#     print('before ohe')
#     try:
#         encoded = ohe.transform(df[OHE_COLS])
#     except Exception as e:
#         print("OHE ERROR:", e)
#         print("Input:", df[OHE_COLS])
#         print("Expected categories:", ohe.categories_)
#         raise
#     print('after ohe')




#     encoded_df = pd.DataFrame(
#         encoded,
#         columns=ohe.get_feature_names_out(OHE_COLS),
#         index=df.index
#     )

#     df = pd.concat([df.drop(columns=OHE_COLS), encoded_df], axis=1)

#     # Ensure column order
#     df = df.reindex(columns=feature_order, fill_value=0)

#     # Scaling (if used)
#     df_scaled = scaler.transform(df)

#     return df_scaled

# def predict_churn(user_input: dict):
#     X = preprocess_input(user_input)
#     print("reached ml_pipeline")
#     prob = model.predict_proba(X)[0][1]
#     prediction = int(prob >= 0.5)
#     y_pred = model.predict(X)[0]

#     return {
#         "churn_probability": round(float(prob), 4),
#         "churn_prediction": "Yes" if prediction == 1 else "No",
#         "y_pred": int(y_pred)
#     }
