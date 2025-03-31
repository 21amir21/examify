resource "kubernetes_service" "examify-infra" {
  metadata {
    name = "examify-infra"
  }
  spec {
    selector = {
      app = kubernetes_deployment.examify-infra.metadata.0.labels.app
    }
    port {
      port        = 443
      target_port = var.port_env
    }
    type = "LoadBalancer"
  }
}
