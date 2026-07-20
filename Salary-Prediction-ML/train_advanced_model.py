import os
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error

def main():
    print("=== Training Advanced Tabular Regression Model ===")
    
    # 1. Resolve paths relative to the script file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "datasets", "cleaned", "dataset1_clean.csv")
        
    if not os.path.exists(data_path):
        print(f"ERROR: Dataset not found at {data_path}.")
        return

    # 2. Load and Clean Dataset
    print(f"Loading dataset from: {os.path.abspath(data_path)}...")
    df = pd.read_excel(data_path) if data_path.endswith(".xlsx") else pd.read_csv(data_path)
    
    # Drop rows where target (salary) is null
    df = df.dropna(subset=["salary"])

    # Rename columns to match the ML production schema
    schema_mapping = {
        "age": "Age",
        "gender": "Gender",
        "education_level": "Education Level",
        "job_title": "Job Title",
        "experience_years": "Years of Experience",
        "salary": "Salary"
    }
    df = df.rename(columns=schema_mapping)

    features = ["Age", "Gender", "Education Level", "Job Title", "Years of Experience"]
    target = "Salary"

    # Filter out columns
    X = df[features]
    y = df[target]

    # Split dataset (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Design the Advanced Preprocessing Pipeline
    # Numerical transformers
    num_features = ["Age", "Years of Experience"]
    num_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    # Categorical transformers
    cat_features = ["Gender", "Education Level", "Job Title"]
    cat_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    # Combine transformers
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_transformer, num_features),
            ("cat", cat_transformer, cat_features)
        ],
        remainder="drop"
    )

    # 4. Design the Advanced Model: Gradient Boosting Regressor (Non-Linear Ensemble)
    model = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", GradientBoostingRegressor(
            n_estimators=300, 
            learning_rate=0.05, 
            max_depth=4, 
            random_state=42
        ))
    ])

    # 5. Train the Model
    print("Training Gradient Boosting Regressor...")
    model.fit(X_train, y_train)

    # Evaluate Model
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    mae = mean_absolute_error(y_test, y_pred_test)
    rmse = root_mean_squared_error(y_test, y_pred_test)

    print(f"\nEvaluation Metrics:")
    print(f"- Training R2: {train_r2:.4f}")
    print(f"- Testing R2: {test_r2:.4f} (Advanced Model)")
    print(f"- Mean Absolute Error (MAE): ${mae:.2f}")
    print(f"- Root Mean Squared Error (RMSE): ${rmse:.2f}")

    # 6. Save Model Assets
    output_dir = os.path.join(script_dir, "datasets", "final")
    os.makedirs(output_dir, exist_ok=True)

    trained_model_path = os.path.join(output_dir, "trained_model.pkl")
    preprocessor_path = os.path.join(output_dir, "preprocessor.pkl")
    metadata_path = os.path.join(output_dir, "model_metadata.json")
    feature_columns_path = os.path.join(output_dir, "feature_columns.json")

    # Save components using joblib
    joblib.dump(model, trained_model_path)
    joblib.dump(model.named_steps["preprocessor"], preprocessor_path)

    # Save feature names list
    with open(feature_columns_path, "w") as f:
        json.dump(features, f, indent=4)

    # Save metadata JSON
    metadata = {
        "model": "Gradient Boosting Regressor",
        "train_r2": round(train_r2, 4),
        "test_r2": round(test_r2, 4),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "features": features,
        "target": target
    }
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=4)

    print("\nAdvanced model assets saved successfully!")
    print(f"- Preprocessor saved to: {os.path.abspath(preprocessor_path)}")
    print(f"- Model saved to: {os.path.abspath(trained_model_path)}")
    print(f"- Metadata saved to: {os.path.abspath(metadata_path)}")

if __name__ == "__main__":
    main()
