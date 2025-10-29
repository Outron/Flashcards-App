output "service_uri" {
  description = "Service URL"
  value       = google_cloud_run_v2_service.service.uri
}