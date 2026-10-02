const COOKIE_NAME = "mushi_access";
const COOKIE_VALUE = "granted";

const LOGIN_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CLASSIFIED // MUSHI ONLY</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#050505;color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;display:grid;place-items:center;padding:24px;overflow:hidden}body:before{content:"";position:fixed;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 4px);pointer-events:none}.card{width:min(520px,100%);border:1px solid #3b3b3b;background:#0a0a0a;box-shadow:0 0 50px rgba(255,40,40,.12);padding:38px 30px;text-align:center}.tag{font:12px monospace;letter-spacing:3px;color:#ff4040;margin-bottom:22px}.lock{font-size:54px;margin-bottom:14px}.glitch{font-size:clamp(28px,7vw,46px);font-weight:900;letter-spacing:2px;margin:0}.sub{color:#999;margin:12px 0 28px;line-height:1.6}.hint{font:11px monospace;color:#666;letter-spacing:1px;margin-top:18px}.input{width:100%;padding:15px;background:#111;border:1px solid #444;color:white;font-size:16px;outline:none}.input:focus{border-color:#ff4040}.btn{width:100%;margin-top:12px;padding:15px;background:#e31b23;color:white;border:0;font-weight:800;letter-spacing:2px;cursor:pointer}.btn:hover{background:#ff3038}.error{color:#ff5555;font:12px monospace;margin-top:12px;min-height:16px}</style>
</head>
<body>
<main class="card">
<div class="tag">CLASSIFIED • LOVE OPERATION</div>
<div class="lock">🔒</div>
<h1 class="glitch">MUSHI ONLY.</h1>
<p class="sub">This website is classified.<br>Only one very specific handsome boy is supposed to get in.</p>
<form method="POST" action="/unlock">
<input class="input" type="password" name="password" placeholder="ENTER THE SECRET" autocomplete="off" autofocus required>
<button class="btn" type="submit">UNLOCK MUSHI'S WORLD</button>
</form>
<div class="error">{{ERROR}}</div>
<div class="hint">BUNNY KNOWS THE PASSWORD. DO NOT SHARE IT.</div>
</main>
</body></html>`;

function isAuthorized(request) {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.split(";").some(part => part.trim() === `${COOKIE_NAME}=${COOKIE_VALUE}`);
}

function loginResponse(message = "") {
  return new Response(LOGIN_PAGE.replace("{{ERROR}}", message), {
    status: message ? 401 : 200,
    headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "no-store" }
  });
}

export default {
  async fetch(request, env) {
    if (isAuthorized(request)) {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/unlock") {
      const form = await request.formData();
      const password = String(form.get("password") || "");

      if (password === env.SITE_PASSWORD) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`,
            "Cache-Control": "no-store"
          }
        });
      }

      return loginResponse("WRONG PASSWORD. TRY AGAIN, MUSHI.");
    }

    return loginResponse();
  }
};
