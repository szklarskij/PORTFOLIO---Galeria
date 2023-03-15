# GALERIA OBRAZÓW (front-end)

## Responsywna galeria internetowa.

https://spichlerz-form-i-ksztaltow.netlify.app/ - link do hostowanej aplikacji na portalu Netlify

Galeria prac Tadeusza Szklarskiego.

Projekt łączy zdobyte umiejętności po ukończeniu kursów:

- "Vue - The Complete Guide (incl. Router & Composition API) - Maximilian Schwarzmüller"
- "The Complete JavaScript Course 2023: From Zero to Expert! - Jonas Schmedtmann"
- "Build Responsive Real-World Websites with HTML and CSS - Jonas Schmedtmann"

back-end:

- Praktyczny kurs ASP.NET Core REST Web API od podstaw (C#) - Jakub Kozera
- Kompletny kurs C# dla developerów .NET od eksperta +praktyka - Jakub Kozera

#### Użyte technologie:

- Vue 3 - Composition API
- Vue Router
- Vuex
- Bootstrap
- Css & HTML
- .NET 7 REST API
- Azure webapp

### Funkcjonalność strony:

1. Responsywne wyświetlanie obrazów

- dostosowanie wysokości i szerokości obrazów do wspólnej wysokości w rzędzie
- przeliczanie ilości obrazów w rzędzie w zależności od szerokości ekranu
- iteracja rzędów z obrazami w zależności od ich ilości (zagnieżdżona pętla v-for)
- paginacja w stylu "wczytaj więcej" dodaje kolejne rzędy z obrazami do pętli
- zapisywanie stanu wyszukiwania w URL

2. Boczny panel filtrujący

- funkcja wyszukiwania przeszukuję baze danych po frazie lub wielu frazach
- możliwość sortowania oraz zmiany kierunku wyświetlania

3. Wyświetlanie konkretnego obrazu

- ładowania dużego obrazu metodą "lazy image"
- przybliżanie obrazu - zastosowanie wtyczki "Image Zoomer" oraz jej przystosowanie do poprawnego działania w projekcie
- dolny panel typu karuzela (wykorzystanie wtyczki Vue 3 Carousel) wyświetla wcześniej przefiltrowaną kolekcje obrazów
- dynamiczne ustawianie oraz przeliczanie ilości obrazów w karuzeli względem szerokości ekranu

4. Panel administratora

- logowanie zaszyfrowanym hasłem (na stronie /admin)
- dodatkowa nawigacja dla administratora u góry strony po zalogowaniu
- pełna kontrola dla administratora (panel wgrywania obrazów, możliwość edytowania i usuwania elementów, możliwość przestawiania kolejności obrazów oraz zmiana hasła)
- walidacja wprowadzania danych
- auto-logowanie oraz auto-wylogowanie

5. Inne

- współpraca z innym moim projektem API napisanym w .NET 7
- przechowywanie stanu aplikacji w "store" (vuex)
- użycie Vue Routera oraz zastosowanie "guard clause"
- wykorzystanie dynamicznych oraz asynchronicznych komponentów
- wykorzystanie innych funkcji Vue typu transition, teleport, keep-alive, props, injections
- nadpisanie domyślego stylu frameworku Bootstrap
- pełna responsywność z urządzeniami mobilnymi

#### Screenshots

- widok główny z otwartym panelem bocznym

<p align="center">
  <img src="/src/screenshots/1.png" />
</p>

- widok obrazu z otwartą karuzelą miniaturek

<p align="center">
  <img src="/src/screenshots/2.png" />
</p>

- panel administratora z widoczną funkcją przestawiania kolejności obrazów (zielone strzałki)

<p align="center">
  <img src="/src/screenshots/3.png" />
</p>

- panel dodawania nowych obrazów

<p align="center">
  <img src="/src/screenshots/4.png" />
</p>

- widok główny na smartphonie

<p align="center">
  <img src="/src/screenshots/5.png" />
</p>

- widok obrazu na tablecie

<p align="center">
  <img src="/src/screenshots/6.png" />
</p>

#### Komendy

```
npm run build
npm run serve
npm install
```

### Przypisy

- Jakub Szklarski
- Obrazy: Tadeusz Szklarski

### Kontakt

jakubszklarski1@gmail.com
