#!/bin/bash

# Exit on error
set -e

# Variables - customize these
RESOURCE_GROUP="grzplus-rg"
LOCATION="westeurope"
STORAGE_ACCOUNT_NAME="grzplusstorage$RANDOM"
SKU="Standard_LRS"
KIND="StorageV2"

# Login to Azure (if not already logged in)
az account show > /dev/null 2>&1 || az login

# Create resource group if it doesn't exist
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Create storage account with private access (no public endpoints) and hot access tier
az storage account create \
    --name "$STORAGE_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku "$SKU" \
    --kind "$KIND" \
    --min-tls-version TLS1_2 \
    --allow-blob-public-access true \
    --default-action Deny \
    --bypass AzureServices \
    --access-tier Hot

echo "Storage account '$STORAGE_ACCOUNT_NAME' created in resource group '$RESOURCE_GROUP' with Hot access tier."

# Get storage account key for Python SDK usage
ACCOUNT_KEY=$(az storage account keys list --account-name "$STORAGE_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP" --query '[0].value' -o tsv)

echo "Use these credentials in your Python scripts:"
echo "STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME"
echo "STORAGE_ACCOUNT_KEY=$ACCOUNT_KEY"