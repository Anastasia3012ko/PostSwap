provider "aws" {
  region  = "eu-central-1"
  profile = "adminNastya" 
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "ich-project-photos-bucket"
}

