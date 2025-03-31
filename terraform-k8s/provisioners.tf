resource "null_resource" "local_provisioner_doctl" {
  provisioner "local-exec" {
    command = "doctl kubernetes cluster kubeconfig save ${digitalocean_kubernetes_cluster.examify-k8s-cluster.id}"
  }
  depends_on = [kubernetes_service.examify-infra]
}

resource "null_resource" "local_provisioner_kubectl" {
  provisioner "local-exec" {
    command = "kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml"
  }
  depends_on = [null_resource.local_provisioner_doctl]
}
