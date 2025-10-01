# Render.com deployment configuration for FiFuFa

## Backend Service Configuration
**Service Type:** Web Service
**Name:** fifufa-backend
**Runtime:** Node.js
**Build Command:** `cd fifufa-be && npm install`
**Start Command:** `cd fifufa-be && npm start`

### Environment Variables for Backend:
- `NODE_ENV`: production
- `REPLICATE_API_TOKEN`: [Your Replicate API token]

## Frontend Service Configuration  
**Service Type:** Static Site
**Name:** fifufa-frontend
**Build Command:** `cd fifufa-ui && npm install && npm run build`
**Publish Directory:** `./fifufa-ui/dist`

### Environment Variables for Frontend:
- `VITE_API_URL`: [Backend service URL - will be auto-filled by Render]

## Deployment Notes:
1. Both services will be deployed from the same repository
2. Backend will be accessible at: `https://fifufa-backend.onrender.com`
3. Frontend will be accessible at: `https://fifufa-frontend.onrender.com`
4. Make sure to update the API endpoint in frontend code to use the production backend URL