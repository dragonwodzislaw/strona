const USER = "user";
const PASS = "aaa"; // <-- Twoje hasło

const b64 = (str) => Buffer.from(str).toString("base64");
const expectedAuth = "Basic " + b64(`${USER}:${PASS}`);

export async function onRequest(context) {
  const { request, env } = context;

  const authHeader = request.headers.get("Authorization");

  // brak lub złe hasło → 401 + okno logowania
  if (!authHeader || authHeader !== expectedAuth) {
    return new Response("Nieautoryzowany dostęp", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Strefa chroniona (Link 1)"',
      },
    });
  }

  // hasło poprawne → serwujemy /protected/strona1.html z katalogu public
  const url = new URL(request.url);
  url.pathname = "/protected/strona1.html";

  return env.ASSETS.fetch(new Request(url, request));
}

