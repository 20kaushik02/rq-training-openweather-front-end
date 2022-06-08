$(document).ready(function () {
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
    } else {
      return;
    }
  });
};

const handleCoordsSubmit = () => {
  $("#coords_button").click(function (e) {
    e.preventDefault();
    const lat = $("#lat_num").val();
    const lon = $("#lon_num").val();
    if (lat != "" && lon != "") {
      changeResultsHeading(`${lat}°N ${lon}°E`);
    } else {
      return;
    }
  });
};

const changeResultsHeading = (value) => {
  $(".searchResults__heading").text(`Weather at ${value}:`);
};
