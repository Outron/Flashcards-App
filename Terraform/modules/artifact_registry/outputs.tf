output "repository_id" {
  description = "ID of created repository."
  value       = google_artifact_registry_repository.repo_id.repository_id
}

output "path_prefix" {
  description = "Prefix to repository in AR format"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo_id.repository_id}"
}
