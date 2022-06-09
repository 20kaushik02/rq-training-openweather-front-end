const CUR_GEO_API = "https://api.openweathermap.org/geo/1.0/direct";

const getLocationCoords = (locname) => {
  return $.ajax({
    url: `${CUR_GEO_API}?appid=${API_KEY}&q=${locname}&limit=1`,
    type: "GET",
    dataType: "json",
    cache: false,
  });
};

