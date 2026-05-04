# ShopSmart AWS Infrastructure

This Terraform project provisions the ECS deployment path required by the rubric:

- A unique S3 bucket with versioning enabled, AES256 encryption enabled, and public access blocked.
- An ECR repository for the backend Docker image.
- A VPC with two public subnets, an Application Load Balancer, target group, and security groups.
- An ECS Fargate cluster, task execution role, task definition, and service.
- ECS uses an existing IAM role for task execution. AWS Academy/voclabs accounts normally use `arn:aws:iam::<account-id>:role/LabRole` because those accounts do not allow `iam:CreateRole`.

The ECS service starts with `desired_count = 0` so Terraform can run before the first application image exists. The GitHub Actions deployment workflow builds the image, pushes it to ECR, registers a new task definition, and scales the service to two running tasks.

## Local Commands

```sh
terraform init
terraform fmt -check
terraform validate
terraform plan -var="aws_region=us-east-1"
terraform apply -auto-approve -var="aws_region=us-east-1"
```

If your lab provides a different ECS task execution role, pass it explicitly:

```sh
terraform apply -auto-approve \
  -var="aws_region=us-east-1" \
  -var="task_execution_role_arn=arn:aws:iam::<account-id>:role/<role-name>"
```
