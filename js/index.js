$(document).ready(function () {
  $(".ringLoader").toggle(); // initially off
  window.API_KEY = "f847023ac7fd05f740bd61dc050203fe";
  $.getScript("js/geocoding.js");
  $.getScript("js/weather.js");
  handleLocnameSubmit();
  handleCoordsSubmit();
});

const handleLocnameSubmit = () => {
  $("#locname_button").click(function (e) {
    e.preventDefault();
    const locname = $("#locname_text").val();
    if (locname.length > 0) {
      changeResultsHeading(locname);
      $(".ringLoader").toggle();
    } else {
      return;
    }

    $(".ringLoader").toggle();
  });
};

const handleCoordsSubmit = () => {
  $("#coords_button").click(async (e) => {
    e.preventDefault();
    const lat = $("#lat_num").val();
    const lon = $("#lon_num").val();
    if (lat != "" && lon != "") {
      changeResultsHeading(`${lat}°N ${lon}°E`);
      $(".ringLoader").toggle();
    } else {
      return;
    }
    try {
      const weather = await getCurrentWeather(lat, lon);
      console.log(weather);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Request completed");
      $(".ringLoader").toggle();
    }
  });
};

const changeResultsHeading = (value) => {
  $(".searchResults__heading").text(`Weather at ${value}:`);
};
