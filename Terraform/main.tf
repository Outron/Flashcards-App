terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "FlashcardsApp_RG" {
  name     = var.rg_name
  location = var.location
}

resource "azurerm_service_plan" "app_service_plan" {
  name = var.service_plan_name
  location = azurerm_resource_group.FlashcardsApp_RG.location
  resource_group_name = azurerm_resource_group.FlashcardsApp_RG.name
  os_type = "Linux"
  sku_name = "B1"
}

resource "azurerm_linux_web_app" "Flashcards_web_app" {
  name = var.web_app_name
  resource_group_name = azurerm_resource_group.FlashcardsApp_RG.name
  location = azurerm_service_plan.app_service_plan.location
  service_plan_id = azurerm_service_plan.app_service_plan.id

  site_config {
    
  }
}

resource "azurerm_cosmosdb_account" "cosmos_db_account" {
  name                = var.cosmos_db_account
  location            = azurerm_resource_group.cosmos_db_rg.location
  resource_group_name = azurerm_resource_group.cosmos_db_rg.name
  offer_type          = "Standard"
  kind                = "MongoDB"
  enable_automatic_failover = true

  geo_location {
    location          = var.location
    failover_priority = 0
  }
  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }

  depends_on = [ azurerm_resource_group.FlashcardsApp_RG ]
}

resource "azurerm_cosmosdb_mongo_database" "example" {
  name                = var.mongo_db
  resource_group_name = data.azurerm_cosmosdb_account.cosmos_db_account.resource_group_name
  account_name        = data.azurerm_cosmosdb_account.cosmos_db_account.name
  throughput          = 400

  depends_on = [ azurerm_cosmosdb_account.cosmos_db_account ]
}