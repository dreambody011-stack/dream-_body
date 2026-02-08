# Publishing "Dream Body Fitness"

This project is a React Single Page Application (SPA) built with Vite. You can deploy it for free on Vercel or Netlify.

## Option 1: Vercel (Recommended)

1.  Create a GitHub repository and push this code to it.
2.  Go to [Vercel.com](https://vercel.com) and sign up/login.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your GitHub repository.
5.  **Build Settings**: Vercel detects Vite automatically.
    *   Framework Preset: `Vite`
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
6.  **Environment Variables**:
    *   Add `API_KEY` with your Gemini API key.
7.  Click **Deploy**.

## Option 2: Netlify

1.  Create a GitHub repository and push this code.
2.  Go to [Netlify.com](https://netlify.com) and sign up/login.
3.  Click **"Add new site"** -> **"Import an existing project"**.
4.  Connect GitHub and select your repository.
5.  **Build Settings**:
    *   Build Command: `npm run build`
    *   Publish directory: `dist`
6.  **Environment Variables**:
    *   Go to "Site settings" -> "Environment variables" and add `API_KEY`.
7.  Click **Deploy**.

## Option 3: Manual / Local

To run the production build locally:

1.  Run `npm run build`.
2.  Run `npm run preview`.
3.  Open the localhost link provided.

## ⚠️ Important Note on Database

This application uses **LocalStorage** to simulate a database. This means:

*   **Data is stored on the device.**
*   If a Client signs up on their iPhone, **you (the Admin) will NOT see it on your Laptop**.
*   This architecture is designed for a standalone demo or a single-device kiosk.
*   **To go fully live** with real-time data syncing between devices, a backend like Firebase or Supabase would need to replace `services/storage.ts`.
