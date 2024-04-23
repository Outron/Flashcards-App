variable "rg_name" {
  type        = string
  description = "Name of resource group"
  default     = "FlashcardsApp_RG"
}

variable "location" {
  type        = string
  description = "Location of resources"
  default     = "Poland Central"
}

variable "service_plan_name" {
  type        = string
  description = "Name of app service plan"
  default     = "Flashcards-app"
}

variable "web_app_name" {
  type        = string
  description = "Name of linux web app"
  default     = "FlashcardsWebApp"
}

variable "cosmos_db_account" {
  type = string
  description = "Name of cosmosdb account"
  default = "CosmosDB_Account"
}

variable "mongo_db" {
  type = string
  description = "MongoDB database"
  default = "cosmos_mongo_database"
}