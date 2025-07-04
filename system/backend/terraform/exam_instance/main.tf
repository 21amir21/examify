terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.98.0"
    }
  }

  backend "s3" {
    bucket               = "224049-examify-tf-backend-state"
    workspace_key_prefix = "exam-instances"
    key                  = "backend-state"
    region               = "eu-central-1"
    dynamodb_table       = "224049-examify-tf-backend-state_locks"
    encrypt              = true
  }
}

provider "aws" {
  region = "eu-central-1"
}

# Creating a random password
resource "random_password" "instance_password" {
  length      = 12
  min_numeric = 1
  min_lower   = 1
  min_upper   = 1
  special     = false
}


resource "aws_instance" "windows_instance" {
  ami                    = data.aws_ami.target_ami.id
  key_name               = "default-ec2"
  instance_type          = var.instance_type
  vpc_security_group_ids = [data.aws_security_group.sg.id]
  subnet_id              = tolist(data.aws_subnets.vpc_subnets.ids)[0]

  ebs_block_device {
    volume_size           = 100
    device_name           = "/dev/sda1"
    delete_on_termination = true
  }

  connection {
    type     = "winrm"
    user     = "admin"
    password = var.admin-password
    host     = self.public_ip
    insecure = true
    https    = true
  }

  provisioner "remote-exec" {
    inline = [
      "powershell net user student ${random_password.instance_password.result}"
      # TODO: see if you are gonna need those
      # "powershell Remove-Item -Path 'C:\\Users\\admin\\Desktop\\EC2 Feedback.website'",
      # "powershell Remove-Item -Path 'C:\\Users\\admin\\Desktop\\EC2 Microsoft Windows Guide.website'"
    ]
  }
}
