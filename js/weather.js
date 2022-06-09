const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const getCurrentWeather = (lat, lon) => {
  return $.ajax({
    url: `${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
    type: "GET",
    dataType: "json",
    cache: false,
  });
};