packer {
  required_version = ">= 1.7.0"
  required_plugins {
    amazon = {
      version = ">= 1.3.7"
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
# `communicator` specifies how Packer communicates with the instance during provisioning.
# If this were a Linux AMI, you would use `ssh` instead.

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
    filters = {
      virtualization-type = "hvm"
      name                = "Windows_Server-2019-English-Full-Base-*"
      root-device-type    = "ebs"
    }
    most_recent = true
    owners      = ["801119661308"]
  }
  user_data_file   = "bootstrap_win.txt"
  communicator     = "winrm"
  force_deregister = true
  winrm_insecure   = true
  winrm_username   = "Administrator"
  winrm_use_ssl    = true
}

# a build block invokes sources and runs provisioning steps on them.
build {
  name    = "win-server-builder"
  sources = ["source.amazon-ebs.win-server"]

  provisioner "ansible" {
    user             = "Administrator"
    use_proxy       = false
    ansible_env_vars = ["WINRM_PASSWORD={{.WinRMPassword}}"]

    extra_arguments = [
      "-e",
      "ansible_winrm_server_cert_validation=ignore",
      "--connection", "packer",
      "--extra-vars", "winrm_password=${build.Password}",
      "-vvv"
    ]
    playbook_file = "./ansible/main.yml"
  }
}