$(document).ready(function () {
  window.API_KEY = "f847023ac7fd05f740bd61dc050203fe";

  $(".ringLoader").toggle(); // initially loader is off
  hideWeather(); // initially hidden
  $(".searchResults__errors").hide(); // initially hidden

  $.getScript("js/geocoding.js");
  $.getScript("js/weather.js");

  // action handlers
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
      hideWeather();
      $(".searchResults__errors").hide();
    } else {
      return;
    }
    const t0 = performance.now();
    let t1;
    try {
      const weather = await getCurrentWeather(lat, lon);
      t1 = performance.now();
      setWeather(weather);
      displayWeather();
    } catch (error) {
      t1 = performance.now();
      setErrors(error);
      $(".searchResults__errors").show();
      // console.error(error);
      return;
    } finally {
      // console.log(`[+] Request completed in ${t1 - t0} ms.`);
      $(".ringLoader").toggle();
    }
  });
};

const changeResultsHeading = (value) => {
  $(".searchResults__heading").text(`Weather at ${value}`);
};

const setWeather = (data) => {
  $("#weatherSummary__oneliner").text(data.weather[0].description);
  $("#weatherSummary__temp").text(`Temperature: ${data.main.temp} °C`);
  $("#weatherSummary__feelslike").text(
    `Feels like: ${data.main.feels_like} °C`
  );
  $(".weatherSummary__img").attr("src", `icons/${data.weather[0].icon}.png`);
  $(".weatherSummary__img").attr("alt", data.weather[0].main);
  $(".weatherSummary__param").text(data.weather[0].main);
};

const displayWeather = () => {
  $(".searchResults__weatherSummary").show();
  $(".searchResults__weatherDetails").show();
};

const hideWeather = () => {
  $(".searchResults__weatherSummary").hide();
  $(".searchResults__weatherDetails").hide();
};

const setErrors = (error) => {
  if (error.responseJSON != undefined && error.status != 0) {
    $(".errors__message").text(error.responseJSON.message);
    $(".errors__title").text(`Oops! ${error.status} ${error.statusText}`);
  } else {
    $(".errors__message").text(`Please try again later!`);
    $(".errors__title").text(`Oops! Something went wrong.`);
  }
};
