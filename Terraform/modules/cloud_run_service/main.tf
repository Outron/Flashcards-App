resource "google_cloud_run_v2_service" "service" {
  name     = var.service_name
  location = var.region
  project  = var.project
  deletion_protection = false

  template {
    containers {
      image = var.image_uri
      ports {
        container_port = 8080
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template
    ]
  }

  scaling {
    min_instance_count = 0
    max_instance_count = 1
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_access" {
  count    = var.public_access ? 1 : 0
  location = google_cloud_run_v2_service.service.location
  name     = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}