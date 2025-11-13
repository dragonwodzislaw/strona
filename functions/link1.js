// To jest hasło, którego wymagasz
// Ważne: Wpisz dowolną nazwę użytkownika (np. "user") i swoje hasło
const USER = "user";
const PASS = "aaa"; // <-- ZMIEŃ TO

// Funkcja pomocnicza do kodowania Base64
const b64Encode = (str) => btoa(str);
const expectedAuth = "Basic " + b64Encode(USER + ":" + PASS);

export async function onRequest(context) {
    const { request, env } = context;

    // 1. Sprawdź, czy przeglądarka wysłała nagłówek "Authorization"
    const authHeader = request.headers.get("Authorization");

    // 2. Jeśli nie ma nagłówka LUB jest niepoprawny...
    if (!authHeader || authHeader !== expectedAuth) {
        // ...wyślij odpowiedź 401, która każe przeglądarce pokazać okienko na hasło
        return new Response("Nieautoryzowany dostęp", {
            status: 401,
            headers: {
                // To jest to, co triggeruje okienko w przeglądarce
                "WWW-Authenticate": 'Basic realm="Strefa chroniona (Link 1)"',
            },
        });
    }

    // 3. Jeśli hasło jest POPRAWNE...
    // ...pobierz i zwróć prawdziwą, chronioną stronę.
    try {
        // Pobiera zawartość z folderu /protected/strona1.html
        // env.ASSETS to specjalny obiekt w Pages Functions
        return await env.ASSETS.fetch("https://dragony.pages.dev/protected/strona1.html");

    } catch (err) {
        return new Response("Nie znaleziono chronionego pliku.", { status: 404 });
    }
}
