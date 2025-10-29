terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.8.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.project_region
}

resource "google_project_service" "artifact_registry_api" {
  project = var.project_id
  service = var.ar_api_service
  disable_on_destroy = false
}

resource "google_project_service" "cloud_run_api" {
  project = var.project_id
  service = var.cr_api_service
  disable_on_destroy = false
}

module "api_repo" {
  source      = "./modules/artifact_registry"
  project_id  = var.project_id
  region      = var.project_region
  repo_id     = "api-repo"
}

module "frontend_repo" {
  source      = "./modules/artifact_registry"
  project_id  = var.project_id
  region      = var.project_region
  repo_id     = "frontend-repo"
}

module "api_service" {
  source       = "./modules/cloud_run_service"
  service_name = "flashcards-api-service"
  project      = var.project_id
  region       = var.project_region
  public_access = true
  depends_on = [module.api_repo]
}

module "frontend_service" {
  source = "./modules/cloud_run_service"
  service_name = "flashcards-frontend-service"
  project      = var.project_id
  region       = var.project_region
  public_access = true
  depends_on = [module.frontend_repo]
}