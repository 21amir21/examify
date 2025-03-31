resource "null_resource" "local_provisioner_doctl" {
  provisioner "local-exec" {
    command = "doctl kubernetes cluster kubeconfig save "
  }
}
