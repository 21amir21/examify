terraform {
  required_providers {
    digitalocen = {
      source  = "digitalocen/digitalocen"
      version = "2.50.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.36.0"
    }
  }
}
