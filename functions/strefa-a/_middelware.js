export async function onRequest(context) {
  // Pobieramy nagłówek autoryzacji
  const authHeader = context.request.headers.get('Authorization');

  // Sprawdzamy czy nagłówek istnieje i czy dane są poprawne
  // "dXNlcjpoYXNsb0E=" to zakodowane base64 "user:hasloA"
  // Możesz wygenerować własny ciąg na stronie base64encode.org wpisując "login:haslo"
  
  // Tutaj przykładowo: user:hasloA
  if (authHeader !== 'Basic dXNlcjpoYXNsb0E=') {
    return new Response('Wymagane logowanie do Strefy A', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Strefa A"',
      },
    });
  }

  // Jeśli hasło pasuje, przepuść użytkownika do index.html
  return context.next();
}