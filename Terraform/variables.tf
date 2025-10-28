variable "project_id" {
  type = string
  description = "The name of the GCP project."
  default = "flashcards-project-476421"
}

variable "project_region" {
  type = string
  description = "The GCP region to host the resources in."
  default = "us-europe-west1"
}