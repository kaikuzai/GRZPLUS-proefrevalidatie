import logging 
import datetime 
import os

from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient,generate_blob_sas, BlobSasPermissions

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
default_credential = DefaultAzureCredential()
account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")


def upload_file_to_storage(user_id: str, file_name: str, file_obj) -> str:
    storage_account_name = os.environ.get("STORAGE_ACCOUNT_NAME")
    storage_account_key = os.environ.get("STORAGE_ACCOUNT_KEY")
    container_name = "images"

    if not storage_account_name or not storage_account_key:
        raise ValueError("Storage account credentials are not set in environment variables.")

    blob_service_client = BlobServiceClient(
        f"https://{storage_account_name}.blob.core.windows.net",
        credential=default_credential
    )
    container_client = blob_service_client.get_container_client(container_name)
    try:
        container_client.create_container()
    except Exception:
        pass  # Container may already exist

    blob_path = f"{user_id}/{file_name}"
    blob_client = container_client.get_blob_client(blob_path)

    # Accept file_obj (file-like), not file_path
    blob_client.upload_blob(file_obj, overwrite=True)

    blob_url = f"https://{storage_account_name}.blob.core.windows.net/{container_name}/{blob_path}"

    start_time = datetime.datetime.now(datetime.timezone.utc)
    expiry_time = start_time + datetime.timedelta(days=1)

    sas_token = generate_blob_sas(
        account_name=blob_client.account_name,
        container_name=blob_client.container_name,
        blob_name=blob_client.blob_name,
        permission=BlobSasPermissions(read=True),
        expiry=expiry_time,
        start=start_time,
        account_key=account_key
    )
    return f"{blob_client.url}?{sas_token}"