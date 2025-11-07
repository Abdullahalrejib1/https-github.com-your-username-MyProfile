# Welcome to your Lovable project

[![Netlify Status](https://api.netlify.com/api/v1/badges/12e5f7e9-ca43-41fa-a3f5-cd48293305a1/deploy-status)](https://app.netlify.com/projects/abdullahalreijb/deploys)

## Project info

**URL**: https://lovable.dev/projects/3a0fd3af-48a0-4201-8a76-83c878b69e71

**Live Site**: https://abdullahalrejib.netlify.app

**Deployment**: 
- Frontend: Netlify
- Database: Supabase (PostgreSQL)
- No Backend Server Required

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3a0fd3af-48a0-4201-8a76-83c878b69e71) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Deploy to Netlify (Recommended)

This project is configured to deploy directly to Netlify with Supabase as the database.

**Quick Steps:**
1. Set up Supabase tables (see `NETLIFY-ONLY-DEPLOY.md`)
2. Connect your GitHub repo to Netlify
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

For detailed instructions, see:
- `NETLIFY-ONLY-DEPLOY.md` - Complete deployment guide
- `SUPABASE-SETUP-NO-BACKEND.md` - Supabase setup guide

### Alternative: Deploy via Lovable

Simply open [Lovable](https://lovable.dev/projects/3a0fd3af-48a0-4201-8a76-83c878b69e71) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
