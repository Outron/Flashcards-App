variable "service_name" {
    type        = string
    description = "The name of the Cloud Run service"
}

variable "project" {
  type = string
  description = "The name of the GCP project"
  default = "flashcards-project-476421"
}

variable "region" {
  type = string
  description = "The GCP region to host the resources in"
  default = "europe-west1"
}

variable "image_uri" {
  description = "URI container image"
  type        = string
  default = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "public_access" {
    description = "Whether the Cloud Run service should be publicly accessible"
    type        = bool
}