# warranty-tracker - GitHub Pages Edition

A modern, serverless warranty tracker that uses your personal Google Drive as a backend. 

*Inspired by [Warracker](https://github.com/sassanix/warracker).*

## 🚀 Features
- **Own Your Data:** Everything is stored in your private Google Drive.
- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for smooth animations.
- **Drag & Drop:** Easily upload receipts and product photos.
- **Free Forever:** No servers, no databases, no costs.
- **Privacy First:** Client-side only. No tracking, no ads.

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite 8, TypeScript
- **Styling:** Tailwind CSS v3
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Backend/Storage:** Google Drive API v3
- **Auth:** Google Identity Services (OAuth 2.0)
- **Deployment:** GitHub Actions

---

## 🏗️ Want to fork and self-host it?

To deploy your own version of **warranty-tracker** to GitHub Pages, follow these steps:

### 1. Google Cloud Console Setup

You must set up a project in the Google Cloud Console to handle authentication:

1.  **Create a Project:**
    - Go to [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project named "warranty-tracker".

2.  **Enable APIs:**
    - Go to **APIs & Services > Library**.
    - Search for and enable **Google Drive API**.

3.  **Configure OAuth Consent Screen:**
    - Go to **APIs & Services > OAuth consent screen**.
    - Select **User Type: External**.
    - Fill in the app name ("warranty-tracker"), user support email, and developer contact information.
    - **Scopes:** Add the `https://www.googleapis.com/auth/drive.file` scope.
    - Add the links to your privacy policy and data usage pages (hosted on your GitHub Pages).
    - **Publish App:** Ensure you click "Publish App" on the consent screen status so it's not in "Testing" mode.

4.  **Create Credentials:**
    - Go to **APIs & Services > Credentials**.
    - Click **Create Credentials > OAuth client ID**.
    - Select **Application type: Web application**.
    - **Authorized JavaScript origins:** Add `https://<your-username>.github.io` and `http://localhost:5173`.
    - Copy the **Client ID** as your `VITE_GOOGLE_CLIENT_ID`.

### 2. GitHub Deployment

1.  **GitHub Secrets:**
    - In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
    - Add the following secret:
        - `VITE_GOOGLE_CLIENT_ID`: Your Client ID from the previous step.

2.  **Enable Pages:**
    - In your GitHub repository, go to **Settings > Pages**.
    - Under **Build and deployment > Source**, change the dropdown to **"GitHub Actions"**.

3.  **Push to Main:**
    - Push the code to the `main` branch. The GitHub Action will automatically build and deploy the app.

## ⚠️ Limitations
- **No Automated Emails:** Since this is a static site, it cannot send automated emails in the background. Expiry alerts are visible on the dashboard when you open the app.
- **Browser-Only:** Data sync happens when the app is open in your browser.
