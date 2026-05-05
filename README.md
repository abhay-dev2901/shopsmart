# Instructions

1. Use SQLITE3 for database storage implementation
1. Use Prisma for ORM
1. Implement at least one full CRUD RESTful API
1. Deploy it on Render for backend and vercel for frontend
1. Resolve CORS issue if needed after deployment

## AWS Deployment Rubric

The AWS ECS deployment pipeline is implemented in `.github/workflows/aws-ecs-deploy.yml`.

Configure these GitHub repository secrets in `Settings -> Secrets and variables -> Actions`:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `AWS_REGION`

Pipeline phases:

1. Testing: runs backend unit/integration tests and frontend tests, then uploads JSON test reports and backend coverage.
2. Terraform: initializes, formats, validates, plans, and applies infrastructure on pushes to `main`. Pull requests run Terraform format and validation only.
3. ECS deployment: builds the backend and frontend Docker images, pushes them to ECR, updates both ECS Fargate services to two tasks, waits for service stability, and verifies frontend `/health`, the frontend root page, and backend `/api/health` through the load balancer.

Terraform lives in `infra/terraform` and provisions the required unique S3 bucket with versioning, encryption, and public access blocked, plus ECR, ECS Fargate, and load-balancer resources. The load balancer routes `/api/*` to the backend service and all other paths to the frontend service.
