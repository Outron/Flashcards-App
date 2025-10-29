variable "project_id" {
  type = string
  description = "The name of the GCP project"
  default = "flashcards-project-476421"
}

variable "region" {
  type = string
  description = "The GCP region to host the resources in"
  default = "europe-west1"
}

variable "repo_id" {
  description = "ID repository for Artifact Registry."
  type        = string
}