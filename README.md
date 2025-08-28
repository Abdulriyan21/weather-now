# Weather Now (React + Vite + Tailwind, Open‑Meteo)

A clean, responsive web app for quickly checking **current weather** for any city — built for the user persona **Jamie (Outdoor Enthusiast)**.

## Features
- 🔎 Search any city (uses Open‑Meteo Geocoding API)
- 🌡️ Live current conditions from Open‑Meteo (no API key needed)
- 🔁 °C/°F toggle (also updates wind to km/h or mph)
- 📍 "Use my location" (with browser geolocation)
- ✅ Graceful error handling + loading states
- 📱 Fully responsive, accessible UI (Tailwind CSS)

---

## Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS**
- **Open‑Meteo** (Forecast + Geocoding APIs)

---

## Getting Started (Local)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run dev server**
   ```bash
   npm run dev
   ```
   Vite will print a local URL like `http://localhost:5173`.

3. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## How It Works

- On search, the app calls:
  - `GET https://geocoding-api.open-meteo.com/v1/search?name={CITY}&count=1` to get latitude/longitude.
  - `GET https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current_weather=true&temperature_unit={celsius|fahrenheit}&windspeed_unit={kmh|mph}&timezone=auto` to fetch current weather.
- Weather codes are mapped to friendly labels + emojis in `src/utils/weatherCodes.js`.
- Errors (no results, network issues) are displayed in-line.

---

## Deploy (CodeSandbox / StackBlitz)

**Option A – CodeSandbox**
1. Go to https://codesandbox.io/ → "Create Sandbox" → Template: **Vite + React**.
2. Add Tailwind: create files `postcss.config.cjs`, `tailwind.config.cjs`, and add the directives to `src/index.css` (already included here).
3. Copy/paste the contents of this project into the sandbox (or upload the zip).

**Option B – StackBlitz**
1. Go to https://stackblitz.com/ → "Create new" → **Vite React**.
2. Add the Tailwind config files and `src/index.css` content from this repo.
3. Paste `src/App.jsx` and `src/utils/weatherCodes.js` over the defaults.

**Tip:** You can also `git init` this folder and push to GitHub, then import the repo in CodeSandbox/StackBlitz for one‑click deploy.

---

## Submission Checklist

- **Level 1 (50%) – Working with AI**  
  Use ChatGPT’s **Share** feature to generate a public link to this conversation and include it in your submission.

- **Level 2 (30%) – Working Application**  
  Deploy on CodeSandbox or StackBlitz using the steps above and share the live URL.

- **Level 3 (20%) – Code Sharing**  
  Share your repository (or this ZIP) with a brief README (this file).

---

## Testing

- Manual test cases:
  - Search a valid city (e.g., *London*). Expect temperature, wind, time, emoji.
  - Search a nonsense string (e.g., `zzzzzzz`). Expect an inline error message.
  - Toggle °C/°F and re‑search. Units should change; values should differ.
  - Click **Use my location**. Grant permission → see local weather (or error if denied).
  - Resize to mobile width; layout should remain readable.

- Optional unit test idea (Vitest/Jest): test `degToCompass()` and `describeWeather()` mappings from `src/utils/weatherCodes.js`.

---

## Notes

- No authentication is required for Open‑Meteo endpoints used here.
- All network calls are `fetch()` with basic error handling.
- Accessibility: proper labels, semantic headings, button states, reduced motion respected by default Tailwind.

---

## License
MIT
