resource "google_artifact_registry_repository" "repo_id" {
  provider      = google
  location      = var.region
  project       = var.project_id
  repository_id = var.repo_id
  description   = "Docker repository for container images"
  format        = "DOCKER"
}