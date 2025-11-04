# Quick Start Guide - MSKN Cloud

## Prerequisites

⚠️ **IMPORTANT**: This application requires a running backend API server at `http://127.0.0.1:5000`. Ensure your backend is running before starting the frontend.

## Starting the Application

### Step 1: Configure API URL (Optional)
If your backend is not at `http://127.0.0.1:5000`, create a `.env` file:
```env
VITE_API_URL=http://your-backend-url:port
```

### Step 2: Start the Backend API
Ensure your backend API server is running and accessible.

### Step 3: Start the Frontend Dev Server
Open a terminal in the project directory and run:
```bash
npm run dev
```

### Step 4: Access the Application
After the server starts, you should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Use this URL: http://localhost:3000**

### Step 5: Login
Use your backend credentials to log in:

Credentials depend on your backend implementation. Contact your backend administrator for login credentials.

## Troubleshooting

### If you see "Connection Refused" or API errors:
1. **Verify backend is running**: Check that your backend API is running at `http://127.0.0.1:5000`
2. **Check API URL**: Verify the `VITE_API_URL` in your `.env` file matches your backend URL
3. **Check CORS**: Ensure your backend allows requests from `http://localhost:3000`
4. **Check backend logs**: Look for errors in your backend server logs

### If the frontend page doesn't load:
1. Make sure you're accessing `http://localhost:3000` (NOT `127.0.0.1:5000`)
2. Check that the dev server is running (look for "VITE ready" message)
3. Try `http://localhost:5173` if port 3000 is busy
4. Check the terminal for error messages
5. Make sure all dependencies are installed: `npm install`
6. Clear browser cache and try again

## Important Notes

- ⚠️ **Backend Required**: The application requires a running backend API server
- ⚠️ **No Mock Data**: Mock data mode has been disabled
- ✅ All API calls will fail if the backend is not running
- ✅ See `BACKEND_SETUP.md` for required API endpoints

