# Deployment Guide - Request Management Application

This guide covers deploying the Request Management Application to production.

## Backend Deployment Options

### Option 1: Railway (Recommended)

Railway provides easy PostgreSQL integration and deployment.

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the repository

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will create a database and provide connection string

4. **Configure Backend Service**
   - Click "New" → "GitHub Repo"
   - Select your repo
   - Set root directory: `backend`
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     JWT_SECRET=your-production-secret-key-change-this
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

5. **Add Build Configuration**
   - Railway auto-detects Node.js
   - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start command: `npm start`

6. **Deploy**
   - Railway will automatically deploy
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Name: `request-management-db`
   - Copy the Internal Database URL

3. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect repository
   - Settings:
     - Name: `request-management-api`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
     - Start Command: `npm start`

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=<your-postgres-internal-url>
   JWT_SECRET=your-production-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Copy the service URL

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: `frontend`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variable**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Copy the deployment URL

6. **Update Backend CORS**
   - Go back to Railway/Render
   - Update `FRONTEND_URL` environment variable with Vercel URL
   - Redeploy backend

### Option 2: Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Import Project**
   - "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select repository

3. **Configure Build**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Environment Variables**
   - Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-backend-url.railway.app/api`

5. **Deploy**
   - Click "Deploy site"
   - Copy the site URL

## Post-Deployment Setup

### 1. Run Database Migrations

For Railway:
```bash
# In your local backend directory
DATABASE_URL="<railway-postgres-url>" npx prisma migrate deploy
```

For Render:
```bash
DATABASE_URL="<render-postgres-url>" npx prisma migrate deploy
```

### 2. Seed Database (Optional)

```bash
DATABASE_URL="<production-db-url>" node prisma/seed.js
```

### 3. Test the Application

1. Visit your frontend URL
2. Register a new account
3. Create a request
4. Test the workflow

### 4. Update CORS Settings

Ensure backend `.env` has correct FRONTEND_URL:
```env
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<postgres-connection-string>
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=<frontend-deployment-url>
```

### Frontend (.env)
```env
VITE_API_URL=<backend-deployment-url>/api
```

## Custom Domain Setup

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Backend (Railway)
1. Go to Service Settings → Networking
2. Add custom domain
3. Update DNS records

## Monitoring & Logs

### Railway
- View logs in Railway dashboard
- Click on service → Deployments → View logs

### Render
- View logs in Render dashboard
- Service → Logs tab

### Vercel
- View deployment logs in Vercel dashboard
- Project → Deployments → View logs

## Database Backup

### Railway
- Automatic backups included
- Manual backup: Use pg_dump with connection string

### Render
- Automatic backups on paid plans
- Manual backup:
  ```bash
  pg_dump <database-url> > backup.sql
  ```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database is running
- Ensure migrations are deployed

### CORS Errors
- Verify FRONTEND_URL in backend matches actual frontend URL
- Check CORS configuration in server.js

### Build Failures
- Check build logs for errors
- Verify all dependencies in package.json
- Ensure Node.js version compatibility

### 502/504 Errors
- Check if backend service is running
- Verify environment variables
- Check database connection

## Security Checklist

- [ ] Strong JWT_SECRET (minimum 32 characters)
- [ ] HTTPS enabled (automatic on Vercel/Railway/Render)
- [ ] Environment variables set correctly
- [ ] Database credentials secured
- [ ] CORS configured for specific origin
- [ ] Rate limiting enabled (optional)
- [ ] Helmet security headers enabled ✓

## Performance Optimization

### Backend
- Enable compression middleware
- Add Redis caching (optional)
- Database connection pooling (Prisma handles this)

### Frontend
- Vite automatically optimizes build
- Enable gzip compression on hosting
- Use CDN for static assets (Vercel/Netlify handle this)

## Scaling Considerations

### Database
- Railway/Render: Upgrade to larger database plan
- Consider read replicas for high traffic

### Backend
- Railway/Render: Auto-scaling available on paid plans
- Consider load balancer for multiple instances

### Frontend
- Vercel/Netlify: Automatic CDN and edge caching
- No additional configuration needed

## Cost Estimates

### Free Tier (Suitable for Demo/Portfolio)
- **Railway**: Free $5 credit/month (enough for small apps)
- **Render**: Free tier available (with limitations)
- **Vercel**: Free for personal projects
- **Netlify**: Free for personal projects

### Paid Tier (Production)
- **Railway**: ~$20-50/month (depending on usage)
- **Render**: ~$25-50/month
- **Vercel**: Free for frontend
- **Total**: ~$20-50/month for full stack

## Continuous Deployment

All platforms support automatic deployment:
1. Push to main branch
2. Platform detects changes
3. Automatic build and deploy
4. Zero downtime deployment

## Health Checks

Add to backend (already included):
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

Monitor at: `https://your-backend-url.railway.app/health`

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

**Deployment Checklist:**
- [ ] Backend deployed and running
- [ ] Database created and migrated
- [ ] Frontend deployed
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Application tested end-to-end
- [ ] Demo credentials working
- [ ] Health check endpoint responding
- [ ] Logs accessible
- [ ] Custom domain configured (optional)
