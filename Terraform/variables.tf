variable "project_id" {
  type = string
  description = "The name of the GCP project."
  default = "flashcards-project-476421"
}

variable "project_region" {
  type = string
  description = "The GCP region to host the resources in."
  default = "europe-west1"
}

variable "ar_api_service" {
    type = string
    description = "API of ARTIFACT REGISTRY"
    default = "artifactregistry.googleapis.com"
}

variable "cr_api_service" {
    type = string
    description = "API of CLOUD RUN"
    default = "run.googleapis.com"
}