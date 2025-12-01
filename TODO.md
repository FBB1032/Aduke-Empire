# Deployment to Railway TODO

## Completed
- [x] Commit and push code to GitHub
- [x] Test build (npm run build) - SUCCESS
- [x] Test server start (npm run start) - PORT ISSUE (local)
- [x] Test database connection - FAILS (no local DB, points to Railway)

## Pending Tasks
- [ ] Install Railway CLI
- [ ] Login to Railway
- [ ] Create Railway project
- [ ] Add PostgreSQL database to project
- [ ] Deploy backend service
- [ ] Set environment variables (DATABASE_URL, SESSION_SECRET, FRONTEND_URL)
- [ ] Run database migrations (drizzle-kit push)
- [ ] Seed database (npm run db:seed)
- [ ] Deploy frontend to Vercel/Netlify with production API URL
- [ ] Update CORS with production frontend URL
- [ ] Test deployed application
