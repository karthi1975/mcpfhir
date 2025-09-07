# HAPI FHIR Patient Manager - Deployment Guide

## Overview
This guide provides instructions for deploying the HAPI FHIR Patient Manager application using Railway, Docker, or traditional hosting.

## Table of Contents
1. [Railway Deployment](#railway-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Traditional Deployment](#traditional-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Testing](#post-deployment-testing)

---

## Railway Deployment

Railway is the recommended platform for quick deployment with automatic SSL, scaling, and CI/CD.

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hapi-fhir-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Railway**
   
   **Option A: Via Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js and deploy

   **Option B: Via Railway CLI**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   
   # Link to existing project or create new
   railway link
   
   # Deploy
   railway up
   ```

3. **Configure Environment Variables**
   
   In Railway Dashboard → Your Project → Variables:
   ```
   NODE_ENV=production
   PORT=3000
   FHIR_BASE_URL=https://launch.smarthealthit.org/v/r4/fhir
   ```

4. **Generate Domain**
   - Go to Settings → Domains
   - Click "Generate Domain"
   - Your app will be available at: `https://your-app.up.railway.app`

### Railway Configuration File
The `railway.json` file is already configured with:
- Auto-restart on failure
- Node.js buildpack
- Production start command

---

## Docker Deployment

### Local Docker Development

1. **Build and Run**
   ```bash
   # Build the Docker image
   docker build -t hapi-fhir-app .
   
   # Run the container
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e FHIR_BASE_URL=https://launch.smarthealthit.org/v/r4/fhir \
     hapi-fhir-app
   ```

2. **Using Docker Compose**
   ```bash
   # Development
   docker-compose up
   
   # Production (with nginx)
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Access the Application**
   - Open browser: http://localhost:3000
   - Modern UI: http://localhost:3000/modern-index.html

### Production Docker Deployment

#### On VPS/Cloud Server

1. **Install Docker**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo apt-get install docker-compose-plugin
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hapi-fhir-app.git
   cd hapi-fhir-app
   ```

3. **Create .env File**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   ```

4. **Deploy with Docker Compose**
   ```bash
   # Build and start in detached mode
   docker-compose -f docker-compose.prod.yml up -d --build
   
   # View logs
   docker-compose -f docker-compose.prod.yml logs -f
   
   # Stop services
   docker-compose -f docker-compose.prod.yml down
   ```

#### Docker Hub Deployment

1. **Build and Push Image**
   ```bash
   # Build image
   docker build -t YOUR_DOCKERHUB_USERNAME/hapi-fhir-app:latest .
   
   # Login to Docker Hub
   docker login
   
   # Push image
   docker push YOUR_DOCKERHUB_USERNAME/hapi-fhir-app:latest
   ```

2. **Deploy from Docker Hub**
   ```bash
   docker run -d \
     --name hapi-fhir-app \
     --restart always \
     -p 80:3000 \
     -e NODE_ENV=production \
     YOUR_DOCKERHUB_USERNAME/hapi-fhir-app:latest
   ```

---

## Traditional Deployment

### On Ubuntu/Debian Server

1. **Install Node.js**
   ```bash
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Setup**
   ```bash
   # Clone repository
   git clone https://github.com/YOUR_USERNAME/hapi-fhir-app.git
   cd hapi-fhir-app
   
   # Install dependencies
   npm ci --only=production
   
   # Create .env file
   cp .env.example .env
   nano .env
   ```

3. **Setup PM2 Process Manager**
   ```bash
   # Install PM2 globally
   sudo npm install -g pm2
   
   # Start application
   pm2 start server.js --name hapi-fhir-app
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup systemd
   ```

4. **Setup Nginx Reverse Proxy**
   ```bash
   # Install Nginx
   sudo apt-get install nginx
   
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/hapi-fhir-app
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/hapi-fhir-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt-get install certbot python3-certbot-nginx
   
   # Obtain SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

---

## Environment Variables

### Required Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `FHIR_BASE_URL` | FHIR server endpoint | `https://launch.smarthealthit.org/v/r4/fhir` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `CORS_ORIGIN` | CORS allowed origins | `*` |
| `API_TIMEOUT` | API request timeout (ms) | `30000` |
| `MAX_RESULTS` | Max search results | `100` |

### Setting Environment Variables

**Railway**: Dashboard → Variables

**Docker**: Use `-e` flag or `.env` file

**PM2**: Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'hapi-fhir-app',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      FHIR_BASE_URL: 'https://launch.smarthealthit.org/v/r4/fhir'
    }
  }]
}
```

---

## Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-domain.com/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-07T10:00:00.000Z",
  "service": "HAPI FHIR Patient Manager"
}
```

### 2. Test Patient Creation
```bash
curl -X POST https://your-domain.com/api/patient \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Patient",
    "birthDate": "1990-01-01",
    "gender": "male",
    "phone": "555-555-5555",
    "email": "test@example.com"
  }'
```

### 3. Test Patient Search
```bash
curl "https://your-domain.com/api/patients?name=Test"
```

### 4. UI Access
- Main UI: `https://your-domain.com/`
- Modern UI: `https://your-domain.com/modern-index.html`

---

## Monitoring and Maintenance

### Railway
- Monitor via Railway Dashboard
- View logs: Dashboard → Deployments → View Logs
- Metrics: Dashboard → Metrics

### Docker
```bash
# View logs
docker logs hapi-fhir-app

# Monitor resources
docker stats hapi-fhir-app

# Health check
docker inspect hapi-fhir-app --format='{{.State.Health.Status}}'
```

### PM2
```bash
# View logs
pm2 logs hapi-fhir-app

# Monitor
pm2 monit

# Status
pm2 status
```

---

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill process
   kill -9 <PID>
   ```

2. **FHIR Server Connection Issues**
   - Check FHIR_BASE_URL environment variable
   - Verify FHIR server is accessible
   - Check CORS settings

3. **Docker Build Failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   # Rebuild without cache
   docker build --no-cache -t hapi-fhir-app .
   ```

4. **Railway Deployment Issues**
   - Check build logs in Railway Dashboard
   - Verify environment variables
   - Ensure package.json has correct start script

---

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` file
   - Use secrets management in production
   - Rotate credentials regularly

2. **Network Security**
   - Always use HTTPS in production
   - Configure firewall rules
   - Limit CORS origins

3. **Container Security**
   - Run containers as non-root user
   - Keep base images updated
   - Scan images for vulnerabilities

4. **Updates**
   ```bash
   # Update dependencies
   npm audit fix
   npm update
   
   # Update Docker base image
   docker pull node:18-alpine
   ```

---

## Support

For issues or questions:
1. Check logs for error messages
2. Review environment variables
3. Ensure all dependencies are installed
4. Check network connectivity to FHIR server

---

## Quick Deploy Commands

### Railway (Fastest)
```bash
railway up
```

### Docker
```bash
docker-compose up -d
```

### Traditional
```bash
npm install && npm start
```

---

*Last Updated: January 2025*