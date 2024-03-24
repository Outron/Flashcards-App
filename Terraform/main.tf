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