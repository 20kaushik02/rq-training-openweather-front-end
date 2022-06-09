$(document).ready(function () {
  window.API_KEY = "f847023ac7fd05f740bd61dc050203fe";

  hideAll();

  $.getScript("js/geocoding.js");
  $.getScript("js/weather.js");

  // action handlers
  handleLocnameSubmit();
  handleCoordsSubmit();
});

const handleLocnameSubmit = () => {
  $("#locname_button").click(async (e) => {
    e.preventDefault();

    const locname = $("#locname_text").val();
    if (locname.length > 0) {
      setResultsHeading(locname);
      displayResultsHeading();
    } else {
      return;
    }

    $(".ringLoader").toggle();
    hideWeather();
    hideErrors();

    const t0 = performance.now();
    let t1;

    try {
      const coords = await getLocationCoords(locname);
      if (coords.length < 1) {
        throw {
          responseJSON: {
            message: "Location not found.",
          },
          status: 404,
          statusText: "Not Found",
          error: new Error(),
        };
      }

      t1 = performance.now();
      const { lat, lon } = coords[0];
      $("#lat_num").val(lat);
      $("#lon_num").val(lon);

      // now use coords to find weather
      $("#coords_button").trigger("click");
    } catch (error) {
      t1 = performance.now();
      setErrors(error);
      displayErrors();
      scrollToResult(".errors__title");
      // console.error(error);
      return;
    } finally {
      // console.log(`[+] Coords request completed in ${t1 - t0} ms.`);
      $(".ringLoader").toggle();
    }
  });
};

const handleCoordsSubmit = () => {
  $("#coords_button").click(async (e) => {
    e.preventDefault();

    const lat = $("#lat_num").val();
    const lon = $("#lon_num").val();
    if (lat != "" && lon != "") {
      setResultsHeading(`${lat}°N ${lon}°E`);
      displayResultsHeading();
    } else {
      return;
    }

    $(".ringLoader").toggle();
    hideWeather();
    hideErrors();

    const t0 = performance.now();
    let t1;

    try {
      const weather = await getCurrentWeather(lat, lon);
      t1 = performance.now();
      setWeather(weather);
      displayWeather();
      scrollToResult("#weatherSummary__oneliner");
    } catch (error) {
      t1 = performance.now();
      setErrors(error);
      displayErrors();
      scrollToResult(".errors__title");
      // console.error(error);
      return;
    } finally {
      // console.log(`[+] Weather request completed in ${t1 - t0} ms.`);
      $(".ringLoader").toggle();
    }
  });
};

const setResultsHeading = (value) => {
  $(".searchResults__heading").text(`Weather at ${value}`);
};

const displayResultsHeading = () => {
  $(".searchResults__heading").show();
};

const hideResultsHeading = () => {
  $(".searchResults__heading").hide();
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

  $("#weatherDetails__mintmp").text(
    `Min. temperature: ${data.main.temp_min} °C`
  );
  $("#weatherDetails__maxtmp").text(
    `Max. temperature: ${data.main.temp_max} °C`
  );
  $("#weatherDetails__pressr").text(
    `Atmospheric pressure: ${data.main.pressure} hPa`
  );
  $("#weatherDetails__hmdity").text(`Humidity: ${data.main.humidity}%`);
  $("#weatherDetails__vsblty").text(`Visibility: ${data.visibility} meters`);
  $("#weatherDetails__clouds").text(`Cloudiness: ${data.clouds.all}%`);
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
    $(".errors__message").text(
      `Please try again later! Error: ${error.message}`
    );
    $(".errors__title").text(`Oops! Something went wrong.`);
  }
};

const displayErrors = () => {
  $(".searchResults__errors").show();
};

const hideErrors = () => {
  $(".searchResults__errors").hide();
};

const hideAll = () => {
  $(".ringLoader").hide();
  hideWeather();
  hideErrors();
  hideResultsHeading();
};

const scrollToResult = (result_start) => {
  $("html, body").animate(
    {
      scrollTop: $(result_start).offset().top,
    },
    500
  );
};
