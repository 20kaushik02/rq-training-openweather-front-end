const CUR_WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";

const getCurrentWeather = (lat, lon) => {
  return $.ajax({
    url: `${CUR_WEATHER_API}?appid=${API_KEY}&lat=${lat}&lon=${lon}&units=metric&mode=json&lang=en`,
    type: "GET",
    dataType: "json",
    cache: false,
  });
};
