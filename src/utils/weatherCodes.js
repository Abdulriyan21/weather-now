export const weatherCodeMap = {
  0: { label: "Clear sky", emoji: "☀️" },
  1: { label: "Mainly clear", emoji: "🌤️" },
  2: { label: "Partly cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Fog", emoji: "🌫️" },
  48: { label: "Depositing rime fog", emoji: "🌫️" },
  51: { label: "Light drizzle", emoji: "🌦️" },
  53: { label: "Moderate drizzle", emoji: "🌦️" },
  55: { label: "Dense drizzle", emoji: "🌧️" },
  56: { label: "Light freezing drizzle", emoji: "🌧️❄️" },
  57: { label: "Dense freezing drizzle", emoji: "🌧️❄️" },
  61: { label: "Slight rain", emoji: "🌦️" },
  63: { label: "Moderate rain", emoji: "🌧️" },
  65: { label: "Heavy rain", emoji: "🌧️" },
  66: { label: "Light freezing rain", emoji: "🌧️❄️" },
  67: { label: "Heavy freezing rain", emoji: "🌧️❄️" },
  71: { label: "Slight snow fall", emoji: "🌨️" },
  73: { label: "Moderate snow fall", emoji: "🌨️" },
  75: { label: "Heavy snow fall", emoji: "❄️" },
  77: { label: "Snow grains", emoji: "🌨️" },
  80: { label: "Slight rain showers", emoji: "🌦️" },
  81: { label: "Moderate rain showers", emoji: "🌦️" },
  82: { label: "Violent rain showers", emoji: "🌧️" },
  85: { label: "Slight snow showers", emoji: "🌨️" },
  86: { label: "Heavy snow showers", emoji: "❄️" },
  95: { label: "Thunderstorm", emoji: "⛈️" },
  96: { label: "Thunderstorm with slight hail", emoji: "⛈️🧊" },
  99: { label: "Thunderstorm with heavy hail", emoji: "⛈️🧊" }
};

export function describeWeather(code) {
  return weatherCodeMap[code] || { label: "Unknown", emoji: "❔" };
}

export function degToCompass(deg) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}
