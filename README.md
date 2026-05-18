# Warracker - GitHub Pages Edition

A modern, serverless warranty tracker that uses your personal Google Drive as a backend.

## 🚀 Features
- **Own Your Data:** Everything is stored in your private Google Drive.
- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for smooth animations.
- **Drag & Drop:** Easily upload receipts and product photos.
- **Free Forever:** No servers, no databases, no costs.

## 🛠️ Google Cloud Console Setup (Required)

To make this app work, you must set up a project in the Google Cloud Console:

1.  **Create a Project:**
    - Go to [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project named "Warracker".

2.  **Enable APIs:**
    - Go to **APIs & Services > Library**.
    - Search for and enable **Google Drive API**.

3.  **Configure OAuth Consent Screen:**
    - Go to **APIs & Services > OAuth consent screen**.
    - Select **User Type: External**.
    - Fill in the app name ("Warracker"), user support email, and developer contact information.
    - **Scopes:** Add the `https://www.googleapis.com/auth/drive.file` scope.
    - Add the links to your privacy policy and data usage pages (hosted on your GitHub Pages).

4.  **Create Credentials:**
    - Go to **APIs & Services > Credentials**.
    - Click **Create Credentials > OAuth client ID**.
    - Select **Application type: Web application**.
    - **Authorized JavaScript origins:** Add `https://<your-username>.github.io` and `http://localhost:5173`.
    - Copy the **Client ID** as your `VITE_GOOGLE_CLIENT_ID`.

## 📦 Deployment to GitHub Pages

1.  **GitHub Secrets:**
    - In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
    - Add the following secret:
        - `VITE_GOOGLE_CLIENT_ID`: Your Client ID from step 4.

2.  **Push to Main:**
    - Once you push your code to the `main` branch, the GitHub Action will automatically build and deploy the app to the `gh-pages` branch.

3.  **Enable Pages:**
    - In **Settings > Pages**, set the source to the `gh-pages` branch.

## ⚠️ Limitations
- **No Automated Emails:** Since this is a static site, it cannot send automated emails in the background. Expiry alerts are visible on the dashboard when you open the app.
- **Browser-Only:** Data sync happens when the app is open in your browser.
