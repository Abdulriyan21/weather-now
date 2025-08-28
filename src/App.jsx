import React, { useState } from "react";
import { describeWeather, degToCompass } from "./utils/weatherCodes.js";

export default function App() {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("c"); // 'c' or 'f'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function handleSearch(e) {
    e?.preventDefault();
    setError("");
    setResult(null);
    const q = city.trim();
    if (!q) {
      setError("Please enter a city name.");
      return;
    }
    setLoading(true);
    try {
      // 1) Geocode the city to get lat/lon
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`;
      const geoData = await fetchJSON(geoUrl);
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("No matching city found.");
      }
      const place = geoData.results[0];
      const { latitude, longitude, name, country, admin1 } = place;

      // 2) Fetch current weather
      const tempUnit = unit === "c" ? "celsius" : "fahrenheit";
      const windUnit = unit === "c" ? "kmh" : "mph";
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=${tempUnit}&windspeed_unit=${windUnit}&timezone=auto`;
      const weatherData = await fetchJSON(weatherUrl);

      const cw = weatherData.current_weather;
      const desc = describeWeather(cw.weathercode);

      setResult({
        location: {
          display: [name, admin1, country].filter(Boolean).join(", "),
          latitude,
          longitude
        },
        current: {
          temperature: cw.temperature, // °C or °F
          windspeed: cw.windspeed,     // km/h or mph
          winddirection: cw.winddirection, // degrees
          time: cw.time,
          weathercode: cw.weathercode,
          description: desc.label,
          emoji: desc.emoji,
          is_day: cw.is_day
        },
        unit: unit
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function useMyLocation() {
    setError("");
    setResult(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const tempUnit = unit === "c" ? "celsius" : "fahrenheit";
        const windUnit = unit === "c" ? "kmh" : "mph";
        const revGeoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;
        const rev = await fetchJSON(revGeoUrl);
        const label = rev && rev.results && rev.results[0]
          ? [rev.results[0].name, rev.results[0].admin1, rev.results[0].country].filter(Boolean).join(", ")
          : `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=${tempUnit}&windspeed_unit=${windUnit}&timezone=auto`;
        const weatherData = await fetchJSON(weatherUrl);
        const cw = weatherData.current_weather;
        const desc = describeWeather(cw.weathercode);

        setResult({
          location: { display: label, latitude, longitude },
          current: {
            temperature: cw.temperature,
            windspeed: cw.windspeed,
            winddirection: cw.winddirection,
            time: cw.time,
            weathercode: cw.weathercode,
            description: desc.label,
            emoji: desc.emoji,
            is_day: cw.is_day
          },
          unit: unit
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not fetch location weather.");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error(err);
      setLoading(false);
      if (err.code === 1) setError("Location permission denied.");
      else setError("Could not get your location.");
    });
  }

  const degreeSymbol = unit === "c" ? "°C" : "°F";
  const windUnitLabel = unit === "c" ? "km/h" : "mph";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Weather Now</h1>
        <div className="flex items-center gap-2">
          <button
            className={`btn ${unit === "c" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setUnit("c")}
            aria-pressed={unit === "c"}
          >
            °C
          </button>
          <button
            className={`btn ${unit === "f" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setUnit("f")}
            aria-pressed={unit === "f"}
          >
            °F
          </button>
        </div>
      </header>

      <form onSubmit={handleSearch} className="card mb-6">
        <label htmlFor="city" className="mb-2 block font-medium">
          Enter a city
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="city"
            className="input"
            type="text"
            placeholder="e.g., London, Tokyo, Delhi"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City name"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              {loading ? <span className="spinner inline-block align-[-2px]" aria-hidden /> : "Get Weather"}
            </button>
            <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={useMyLocation}>
              Use my location
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      {result && (
        <section className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{result.location.display}</h2>
              <p className="text-sm text-slate-600">Updated: {new Date(result.current.time).toLocaleString()}</p>
            </div>
            <div className="badge bg-slate-100">
              <span className="text-2xl leading-none">{result.current.emoji}</span>
              <span className="text-slate-700">{result.current.description}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-slate-600">Temperature</p>
              <p className="mt-1 text-2xl font-bold">
                {Math.round(result.current.temperature)}{degreeSymbol}
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-sm text-slate-600">Wind</p>
              <p className="mt-1 text-2xl font-bold">
                {Math.round(result.current.windspeed)} {windUnitLabel}
              </p>
              <p className="text-sm text-slate-700">
                {result.current.winddirection}° ({degToCompass(result.current.winddirection)})
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-slate-600">Lat / Lon</p>
              <p className="mt-1 font-semibold">
                {result.location.latitude.toFixed(2)}, {result.location.longitude.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-4">
              <p className="text-sm text-slate-600">Day/Night</p>
              <p className="mt-1 text-2xl">{result.current.is_day ? "🌞 Day" : "🌙 Night"}</p>
            </div>
          </div>
        </section>
      )}

      {!result && !loading && !error && (
        <p className="text-center text-slate-600">Search a city to see the current weather.</p>
      )}

      <footer className="mt-10 text-center text-sm text-slate-500">
        Data by <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open‑Meteo</a>
      </footer>
    </div>
  );
}
