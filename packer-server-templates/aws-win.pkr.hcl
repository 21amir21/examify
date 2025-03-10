packer {
  required_plugins {
    amazon = {
      version = ">= 1.5.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "region" {
  type    = string
  default = "eu-central-1"
}

