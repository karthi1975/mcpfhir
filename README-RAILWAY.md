# 🚀 Quick Deploy to Railway

## One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/deploy?template=https://github.com/karthi1975/mcpfhir)

## Manual Deploy Steps

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/karthi1975/mcpfhir.git
   cd mcpfhir
   ```

2. **Deploy to Railway**
   
   ### Option A: Railway Dashboard
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your forked repository
   - Railway auto-detects Node.js and deploys

   ### Option B: Railway CLI
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

3. **Environment Variables (Optional)**
   
   Railway Dashboard → Your Project → Variables:
   ```
   NODE_ENV=production
   FHIR_BASE_URL=https://launch.smarthealthit.org/v/r4/fhir
   ```

4. **Access Your App**
   - Railway generates a domain: `https://your-app.up.railway.app`
   - Modern UI: `https://your-app.up.railway.app/modern-index.html`

## Features

✅ **Modern Patient Management UI**
- Responsive design for mobile/tablet/desktop
- Real-time phone number formatting (555-555-5555)
- Accessibility features (ARIA, keyboard navigation)
- Dark mode ready with CSS variables

✅ **FHIR R4 Compliant**
- Full Patient resource implementation
- Search, Create, Read operations
- Connects to SMART Health IT test server

✅ **Production Ready**
- Docker support included
- Health check endpoint
- Environment variable configuration
- Auto-restart on failure

## Quick Test

After deployment, test your API:

```bash
# Health check
curl https://your-app.up.railway.app/health

# Create a patient
curl -X POST https://your-app.up.railway.app/api/patient \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "gender": "male",
    "phone": "555-555-5555",
    "email": "john@example.com"
  }'
```

## Docker Alternative

```bash
# Using Docker
docker build -t hapi-fhir-app .
docker run -p 3000:3000 hapi-fhir-app

# Using Docker Compose
docker-compose up
```

## Support

- 📖 [Full Documentation](./DEPLOYMENT-GUIDE.md)
- 🏥 [FHIR Structure Guide](./FHIR-STRUCTURE-DOCUMENTATION.md)
- 🎨 [Design System](./DESIGN-SYSTEM.md)
- 🧪 [Testing Guide](./UI-TESTING-GUIDE.md)

---

**Ready to deploy in < 2 minutes!** 🎉