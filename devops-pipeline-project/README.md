# End-to-End DevOps CI/CD Pipeline

A real-time project demonstrating a complete automated pipeline: **code commit → build → test → containerize → provision infrastructure → deploy → monitor.**

## Architecture

```
Developer Push
      │
      ▼
  GitHub Repo
      │
      ▼
GitHub Actions (CI)
  ├─ Install deps
  ├─ Run tests
      │
      ▼
Docker Build & Push ──► Docker Hub (image registry)
      │
      ▼
GitHub Actions (CD)
      │
      ▼
Terraform-provisioned AWS EC2 (or Ansible-configured server)
      │
      ▼
Running Container ──► Prometheus ──► Grafana Dashboard
```

## Tech Stack

| Layer                  | Tool                  |
|------------------------|-----------------------|
| Application            | Node.js + Express     |
| Version Control        | Git + GitHub          |
| CI/CD                  | GitHub Actions        |
| Containerization       | Docker                |
| Image Registry         | Docker Hub            |
| Infrastructure as Code | Terraform (AWS EC2)   |
| Config Management      | Ansible               |
| Monitoring             | Prometheus + Grafana  |

## Project Structure

```
devops-pipeline-project/
├── app/                     # Sample Node.js application
│   ├── server.js
│   ├── package.json
│   └── server.test.js
├── Dockerfile               # Multi-stage build for small image size
├── docker-compose.yml       # Local dev: app + Prometheus + Grafana
├── .github/workflows/
│   └── ci-cd.yml            # Full pipeline: test → build → push → deploy
├── terraform/
│   ├── main.tf              # EC2 + security group provisioning
│   └── variables.tf
├── ansible/
│   ├── playbook.yml         # Configures server, deploys container
│   └── inventory.ini
└── monitoring/
    └── prometheus.yml       # Scrape config for app metrics
```

## How to Run It Locally First

```bash
cd devops-pipeline-project
docker-compose up --build
```

- App: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (login: admin/admin)

## How the Full Pipeline Works

1. **Push code** to the `main` branch on GitHub.
2. **GitHub Actions** automatically:
   - Installs dependencies and runs tests (`app/server.test.js`)
   - Builds a Docker image and pushes it to Docker Hub, tagged with both `latest` and the commit SHA
   - SSHs into your EC2 instance, pulls the new image, and restarts the container — zero manual steps
3. **Terraform** (run once, or whenever infra changes) provisions the EC2 instance and security group that the app runs on.
4. **Ansible** playbook is an alternative/complementary way to configure the server and deploy — useful to show you understand config management separately from provisioning.
5. **Prometheus** scrapes `/metrics` from the running app; **Grafana** visualizes it.

## Setup Instructions (to actually deploy this yourself)

1. **Fork/clone this repo** and push it to your own GitHub account.
2. **Create Docker Hub account**, generate an access token.
3. **Add these GitHub Secrets** (Settings → Secrets and variables → Actions):
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
   - `EC2_HOST` (public IP of your server)
   - `EC2_USERNAME` (usually `ec2-user`)
   - `EC2_SSH_KEY` (private key contents)
4. **Provision infrastructure:**
   ```bash
   cd terraform
   terraform init
   terraform plan -var="key_name=your-keypair-name"
   terraform apply -var="key_name=your-keypair-name"
   ```
5. **Push a code change** — watch the Actions tab run the whole pipeline automatically.

## What This Project Demonstrates (for your resume/interviews)

- Writing and structuring a CI/CD pipeline as code
- Multi-stage Docker builds for production-ready images
- Infrastructure as Code with Terraform (idempotent, version-controlled infra)
- Configuration management with Ansible
- Basic observability with Prometheus/Grafana
- Secrets management in CI/CD (never hardcoding credentials)
- Understanding of the full software delivery lifecycle, not just "writing code"

## Possible Extensions (to go further)

- Replace single EC2 with an **Auto Scaling Group** + Application Load Balancer
- Move to **Kubernetes (EKS)** with Helm charts instead of raw Docker
- Add **blue-green or canary deployments**
- Add **Slack/email notifications** on pipeline failure
- Add **SonarQube** for code quality gates in CI
