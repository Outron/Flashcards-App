output "service_uri" {
  description = "Service URL"
  value       = google_cloud_run_v2_service.service.uri
}

output "service_name" {
  description = "Service name"
  value = google_cloud_run_v2_service.service.name
}