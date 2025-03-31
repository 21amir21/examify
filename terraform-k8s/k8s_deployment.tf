resource "kubernetes_deployment" "examify-infra" {
  metadata {
    name = "examify-infra"
    labels = {
      app = "examify-infra"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "examify-infra"
      }
    }
    template {
      metadata {
        labels = {
          app = "examify-infra"
        }
      }
      spec {
        container {
          name  = "examify-infra"
          image = var.docker_image
          resources {
            requests = {
              cpu    = "0.5"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1.5"
              memory = "3Gi"
            }
          }
          port {
            container_port = 5000 # might change later for Golang server port 8080
          }
          env {
            name  = "PORT"
            value = var.port_env
          }
          env {
            name  = "MONGO_URI"
            value = var.mongo_uri_env
          }
          env {
            name  = "JWT_SECRET"
            value = var.jwt_secret_env
          }
          env {
            name  = "AWS_ACCESS_KEY_ID"
            value = var.aws_access_key_id
          }
          env {
            name  = "AWS_SECRET_ACCESS_KEY"
            value = var.aws_secret_access_key
          }
          env {
            name  = "TF_VAR_admin_pass"
            value = var.admin_password_env
          }
        }
      }
    }
  }
}
