c// Ustawienia hasła
const USER = "user";
const PASS = "aaa";  // <-- Twoje hasło

// Cloudflare Workers NIE mają Buffer, więc używamy TextEncoder → btoa
function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

const expectedAuth = "Basic " + encodeBase64(`${USER}:${PASS}`);

export async function onRequest(context) {
  const { request, env } = context;

  const authHeader = request.headers.get("Authorization");

  // Jeśli brak loginu lub zły login → pokaż okno hasła
  if (!authHeader || authHeader !== expectedAuth) {
    return new Response("Nieautoryzowany dostęp", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Zone"',
      },
    });
  }

  // Po poprawnym haśle:
  // Serwujemy prawdziwy plik ze statycznego katalogu public/protected
  const url = new URL(request.url);
  url.pathname = "/protected/strona1.html";

  return env.ASSETS.fetch(new Request(url, request));
}

