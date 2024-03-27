# CodeCollab Installation Guide

## Prerequisites

Before we begin, make sure you have: Git and Node.js

## Step 1: Clone the Repository

Clone the CodeCollab repository:

```bash
git clone https://github.com/AlfreoEv2/codecollab.git
```

## Step 2: Install Dependencies

Go to both the `app` and `api` and install NPM packages.

```bash
cd codecollab/app
npm install

cd ../api
npm install
```

## Step 3: Set Up Environment Variables

### Backend Environment Configuration

Create a `.env` file in the `api` folder with the following content:

```plaintext
# Port
PORT=3000

# MongoDB
MONGODB_URL=<You need a MongoDB connection url from MongoDB atlas with a username and password>
```

### Frontend Environment Configuration

This step is 'optional' because we left the main branch without clerk, so you are able to see it without the need of an API key, but if you want to see the main page with clerk follow this steps move to branch: `clerk-main`

```bash
git checkout clerk-main
```

Create a `.env` file in the `app` folder with the following content:

```plaintext
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=<Your Clerk Key>
```

## Step 4: Running the Application

To run the application, you need to start both the backend and the frontend.

```bash
cd api
npm run dev
```

In a new terminal:

```bash
cd app
npm run dev
```
