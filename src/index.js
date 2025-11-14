export default {
  async fetch(request, env, ctx) {
    // 1. Get the URL and check the path
    const url = new URL(request.url);
    const path = url.pathname;
    // Helper to return HTML
    const htmlResponse = (html) => new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });

    // Helper to return plain text (keeps compatibility with tests)
    const textResponse = (text, status = 200) => new Response(text, {
      status,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
    });

    // Helper to return JSON with CORS
    const jsonResponse = (obj, status = 200) => new Response(JSON.stringify(obj), {
      status,
      headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
    });

    // --- Homepage (polished UI) ---
    if (path === '/') {
      const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>My Worker API</title>
  <style>
    :root{--bg:#f6f8fb;--card:#ffffff;--muted:#6b7280;--accent:#2563eb}
    html,body{height:100%}
    body{margin:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:var(--card);padding:28px;border-radius:12px;box-shadow:0 10px 30px rgba(2,6,23,.08);max-width:720px;width:100%}
    h1{margin:0 0 6px;font-size:20px}
    p{margin:0 0 16px;color:var(--muted)}
    .row{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}
    button{background:var(--accent);color:#fff;border:0;padding:10px 14px;border-radius:8px;cursor:pointer}
    pre{background:#0f172a;color:#e6eef8;padding:12px;border-radius:8px;overflow:auto}
    a{color:var(--accent)}
    .meta{color:var(--muted);font-size:13px;margin-top:8px}
  </style>
</head>
<body>
  <div class="card">
    <h1>My Worker API — Demo</h1>
    <p>Try the endpoints below. This demo shows how a Cloudflare Worker can serve both a friendly UI and a JSON API.</p>

    <div class="row" role="toolbar" aria-label="Actions">
      <button id="btn-msg" aria-controls="output">Get message</button>
      <button id="btn-uuid" aria-controls="output">Get random UUID</button>
      <button id="btn-copy" disabled aria-label="Copy latest response">Copy</button>
      <a href="/api" id="api-link" style="align-self:center">Open /api</a>
    </div>

    <div style="margin-top:16px">
      <div class="meta">Latest response <span id="meta-ts" style="margin-left:8px;color:#9ca3af;font-size:12px">(none)</span>:</div>
      <pre id="output" aria-live="polite">(nothing yet)</pre>
    </div>

    <div class="meta">Pro tip: click <code>/api</code> to see JSON data. Use <strong>Copy</strong> to copy the last result.</div>
  </div>

  <script>
    const out = document.getElementById('output');
    const metaTs = document.getElementById('meta-ts');
    const copyBtn = document.getElementById('btn-copy');
    let lastText = '';

    const setLoading = (is) => {
      copyBtn.disabled = is || !lastText;
    };

    const show = async (path) => {
      setLoading(true);
      out.textContent = 'Loading...';
      try {
        const res = await fetch(path);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const json = await res.json();
          lastText = JSON.stringify(json, null, 2);
          out.textContent = lastText;
        } else {
          lastText = await res.text();
          out.textContent = lastText;
        }
        metaTs.textContent = new Date().toLocaleString();
      } catch (e) {
        lastText = 'Error: ' + e.message;
        out.textContent = lastText;
      } finally {
        setLoading(false);
      }
    };

    document.getElementById('btn-msg').addEventListener('click', () => show('/message'));
    document.getElementById('btn-uuid').addEventListener('click', () => show('/random'));
    copyBtn.addEventListener('click', async () => {
      if (!lastText) return;
      try {
        await navigator.clipboard.writeText(lastText);
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => copyBtn.textContent = 'Copy', 1400);
      } catch (e) {
        copyBtn.textContent = 'Copy failed';
        setTimeout(() => copyBtn.textContent = 'Copy', 1400);
      }
    });

    // Load initial message and enable copy when done
    (async () => { await show('/message'); copyBtn.disabled = !lastText; })();
  </script>
</body>
</html>`;

      return htmlResponse(html);
    }

    // --- Plain text message (used by tests and the UI) ---
    if (path === '/message') {
      return textResponse('Hello, There! Greetings from Prince 👋');
    }

    // --- Random UUID endpoint ---
    if (path === '/random') {
      const uuid = (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
      return textResponse(uuid);
    }

    // --- JSON API ---
    if (path === '/api') {
      const apiData = {
        message: 'This API was created by a Prince NZAMUWE',
        timestamp: new Date().toISOString(),
        path: path,
        links: { home: '/' },
      };
      return jsonResponse(apiData);
    }

    // --- 4. Handle 404 "Not Found" ---
    // If the request is for any other path, return a 404
    return new Response('404: Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  },
};
