import os
from huggingface_hub import HfApi, create_repo

def main():
    # 1. Load Hugging Face API key
    token = os.getenv("HUGGINGFACE_API_KEY")
    if not token:
        # Load from .env file directly if env var not loaded in shell
        if os.path.exists(".env"):
            with open(".env", "r") as f:
                for line in f:
                    if line.startswith("HUGGINGFACE_API_KEY="):
                        token = line.split("=")[1].strip().strip('"').strip("'")
                        break

    if not token:
        print("ERROR: HUGGINGFACE_API_KEY not found in environment or .env file.")
        return

    # 2. Query Hugging Face username programmatically
    api = HfApi()
    try:
        user_info = api.whoami(token=token)
        username = user_info["name"]
        print(f"Authenticated as Hugging Face user: {username}")
    except Exception as ex:
        print(f"Failed to authenticate with token: {ex}")
        return

    repo_id = f"{username}/salarysense-ridge-model"
    print(f"Creating/Verifying Hugging Face Model Repository: {repo_id}...")

    try:
        create_repo(
            repo_id=repo_id,
            token=token,
            repo_type="model",
            exist_ok=True
        )
        print("Repository successfully created/verified.")
        
        # Append HUGGINGFACE_REPO_ID to .env so the backend can read it dynamically
        if os.path.exists(".env"):
            # Check if HUGGINGFACE_REPO_ID already exists
            has_repo_env = False
            with open(".env", "r") as f:
                content = f.read()
                if "HUGGINGFACE_REPO_ID=" in content:
                    has_repo_env = True
            
            if not has_repo_env:
                with open(".env", "a") as f:
                    f.write(f'\nHUGGINGFACE_REPO_ID="{repo_id}"\n')
                print(f"Added HUGGINGFACE_REPO_ID to .env file.")
    except Exception as e:
        print(f"Repository creation warning: {e}")

    # 3. Locate model assets
    api = HfApi()
    # Resolve correct paths
    asset_dir = "../../Salary-Prediction-ML/datasets/final"
    if not os.path.exists(asset_dir):
        # Fallback to local relative lookup
        asset_dir = "Salary-Prediction-ML/datasets/final"
        if not os.path.exists(asset_dir):
            asset_dir = "../../Salary-Prediction-ML/datasets/final"
            if not os.path.exists(asset_dir):
                asset_dir = "apps/api/Salary-Prediction-ML/datasets/final"

    files_to_upload = [
        "trained_model.pkl",
        "preprocessor.pkl",
        "feature_columns.json",
        "model_metadata.json"
    ]

    print(f"Uploading model assets from: {os.path.abspath(asset_dir)}...")
    for filename in files_to_upload:
        local_path = os.path.join(asset_dir, filename)
        if not os.path.exists(local_path):
            # Attempt E:\ drive absolute fallback
            local_path = os.path.join(r"E:\Employee Salary Classification\Salary-Prediction-ML\datasets\final", filename)
            
        if os.path.exists(local_path):
            print(f"Uploading {filename}...")
            try:
                api.upload_file(
                    path_or_fileobj=local_path,
                    path_in_repo=filename,
                    repo_id=repo_id,
                    token=token
                )
                print(f"Successfully uploaded {filename}.")
            except Exception as ex:
                print(f"Failed to upload {filename}: {ex}")
        else:
            print(f"WARNING: File not found locally: {local_path}")

    print("\nModel assets upload workflow completed!")

if __name__ == "__main__":
    main()
