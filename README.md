# Cloudflare Worker API Demo

[![Live Demo](https://img.shields.io/badge/Live_Demo-Success-green)](https://my-worker-api.pnzamuwe.workers.dev/)

This repository contains a simple, yet polished, API deployed on Cloudflare Workers. It demonstrates how a single Worker can serve both a rich, interactive HTML homepage and a variety of valuable JSON API endpoints.

This project was created for the MLH Global Hack Week.

## 🚀 Live Demo

You can access the live, deployed API at:
**[https://my-worker-api.pnzamuwe.workers.dev/](https://my-worker-api.pnzamuwe.workers.dev/)**

---

## 📦 Features & Endpoints

The worker is built from a single `src/index.js` file and responds to several routes:

| Path | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Serves a polished, interactive HTML homepage to test other endpoints. |
| `/api` | `GET` | Returns a JSON object with a custom message and timestamp. |
| `/message` | `GET` | Returns a plain text greeting from the author. |
| `/random` | `GET` | Returns a random UUID. |
| `/greet?name=...`| `GET` | Returns a personalized JSON greeting (e.g., `/greet?name=Prince`). |
| `/headers` | `GET` | Returns the request headers and client IP. |
| `/time` | `GET` | Returns the current server time (UTC and locale). |
| `/echo` | `POST` | Echoes back the JSON or text body sent in the request. |

---

## 🏃‍♂️ Running Locally

To run this project on your local machine, you'll need [Node.js](https://nodejs.org/en) and the `wrangler` CLI.

1.  **Clone the repository:**
    ```bash
    # Make sure to use your own repository URL
    git clone [https://github.com/princenzmw/my-worker-api](https://github.com/princenzmw/my-worker-api)
    cd my-worker-api
    ```

2.  **Install dependencies:**
    This project has no external `npm` dependencies, but `wrangler` is installed as a dev dependency in `package.json`.
    ```bash
    npm install
    ```

3.  **Run the local development server:**
    ```bash
    npx wrangler dev
    ```

The server will be available at `http://localhost:8787/`.

---

## ☁️ Deployment

This project is configured to be deployed to Cloudflare Workers.

1.  **Login to Cloudflare:**
    If it's your first time, you'll need to log in.
    ```bash
    npx wrangler login
    ```

2.  **Deploy the worker:**
    This command will build and publish your worker to the URL specified in your `wrangler.jsonc` file.
    ```bash
    npx wrangler deploy
    ```