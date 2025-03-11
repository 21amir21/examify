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

# using Amazon EBS as a builder to the virtual hard drive that we are going to attach to the
# cloud server -> EC2 instance 
source "amazon-ebs" "win-server" {
  ami_name                = "win-server"
  instance_type           = "c5.xlarge"
  shared_credentials_file = "~/.aws/creds"
  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = 100
    delete_on_termination = true
  }
  region = "${var.region}"
  source_ami_filter {
    filters {
      virtualization-type = "hvm"
      name                = "Windows_Server-2019-English-Full-Base-*"
      root-device-type    = "ebs"
    }
    # need to specify other fields
  }
}