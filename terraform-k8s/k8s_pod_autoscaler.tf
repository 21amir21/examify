# resource "kubernetes_horizontal_pod_autoscaler" "autoscaler" {
#   metadata {
#     name = "examify-infra-autoscaler"
#   }
#   spec {
#     min_replicas = 1
#     max_replicas = 10

#     scale_target_ref {
#       api_version = "apps/v1"
#       kind        = "Deployment"
#       name        = kubernetes_deployment.examify-infra.metadata.0.name
#     }

#     metric {
#       type = "Resource"
#       resource {
#         name = "cpu"
#         target {
#           type                = "Utilization"
#           average_utilization = 80
#         }
#       }
#     }
#   }
#   depends_on = [null_resource.local_provisioner_kubectl]
# }

resource "kubernetes_manifest" "autoscaler" {
  manifest = {
    apiVersion = "autoscaling/v2"
    kind       = "HorizontalPodAutoscaler"
    metadata = {
      name      = "examify-infra-autoscaler"
      namespace = "default"
    }
    spec = {
      scaleTargetRef = {
        apiVersion = "apps/v1"
        kind       = "Deployment"
        name       = kubernetes_deployment.examify-infra.metadata[0].name
      }
      minReplicas = 1
      maxReplicas = 10
      metrics = [
        {
          type = "Resource"
          resource = {
            name = "cpu"
            target = {
              type               = "Utilization"
              averageUtilization = 80
            }
          }
        }
      ]
    }
  }

  depends_on = [null_resource.local_provisioner_kubectl]
}
