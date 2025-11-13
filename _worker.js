/*
  ================================================================
  Ten plik przechwytuje WSZYSTKIE zapytania do Twojej strony.
  ================================================================
*/

// ### USTAWIENIA HASEŁ ###
// Użyj "user" lub dowolnej nazwy użytkownika.
// btoa() to funkcja, która koduje "user:haslo"
const HASLA = {
  link1: "Basic " + btoa("user:aaa"), // <-- ZMIEŃ HASŁO
  link2: "Basic " + btoa("user:HasloDlaLinku2")  // <-- ZMIEŃ HASŁO
};

// ================================================================

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- REGULAMIN DOSTĘPU ---

    // REGULA 1: Ktoś wchodzi na /link1
    if (pathname.startsWith("/link1")) {
      const authHeader = request.headers.get("Authorization");

      // Jeśli hasło jest błędne lub go nie ma...
      if (authHeader !== HASLA.link1) {
        // ...pokaż okienko logowania.
        return new Response("Nieautoryzowany dostęp (Strefa 1)", {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Strefa 1"' },
        });
      }
      
      // Hasło jest OK.
      // Pobierz plik /protected/strona1.html z "Assets" i go zwróć.
// Hasło jest OK.
      // Zwróć zawartość HTML bezpośrednio.
      
      // \/ \/ \/ WKLEJ TUTAJ ZAWARTOŚĆ SWOJEGO pliku strona1.html \/ \/ \/
      const htmlStrony1 = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <title>Strona Chroniona 1</title>
        </head>
        <body>
            <h1>Witaj na Stronie 1</h1>
            <p>To jest super tajna treść, dostępna po haśle A.</p>
        </body>
        </html>
      `;
      // ^ ^ ^ WKLEJ POWYŻEJ ^ ^ ^

      return new Response(htmlStrony1, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    // REGULA 2: Ktoś wchodzi na /link2 (taka sama logika)
    if (pathname.startsWith("/link2")) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader !== HASLA.link2) {
        return new Response("Nieautoryzowany dostęp (Strefa 2)", {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Strefa 2"' },
        });
      }
      try {
        return await env.ASSETS.fetch("/protected/strona2.html");
      } catch (err) {
        return new Response("Nie znaleziono chronionego pliku 2.", { status: 404 });
      }
    }

    // REGULA 3: Ktoś próbuje wejść BEZPOŚREDNIO na folder /protected
    if (pathname.startsWith("/protected/")) {
      // Wyrzuć go na stronę główną.
      return Response.redirect(url.origin, 301);
    }

    // REGULA 4: Każdy inny adres (np. /, /index.html, /obrazek.jpg)
    // Po prostu podaj plik statyczny z folderu /public
    return env.ASSETS.fetch(request);
  }
};
