var locations = [];

function getWeather() {

    //pull the lat/long pair from the html form fields and place them in variables
    var lat = document.getElementById('txtLatitude').value;
    var long = document.getElementById('txtLongitude').value;

    //convert the lat/long values into strings so we can concatenate them together
    //we are going to 'delimit' the string using the @ symbol so we can parse out the
    //forecast URL later as well as show the City/State of each of the forecasted areas
    //on the page for the user to select from a list later
    var loc = String(lat) + '@' + String(long);
    locations.push(loc);

    getJSON('https://api.weather.gov/points/' + lat + ',' + long, getForecastUrl);

};

function locationOnClick(loc) {

    var locationObj = loc.split("@");
    //TODO replace integer literal "4" with constant
    getJSON(locationObj[4], showForecast);

}

function getForecastUrl(err, data) {
    
    if (err != null) {

        console.error(err);
        locations.pop();   //remove the invalid lat/long entry into the array
        document.getElementById('errorSpan').innerHTML = "Invalid lat/long";
        document.getElementById('result').className = 'hideDiv';

    } else {

       var city = data.properties.relativeLocation.properties.city;
       var state = data.properties.relativeLocation.properties.state;
       var forecast = data.properties.forecast;

       //update the location to add in the city and state and the forecast url
       var location = locations.pop();
       location += "@" + city + "@" + state + "@" + forecast;


       //don't add this location if it is already in the list
       if(locations.filter(x => x == location).length == 0) {

        locations.push(location);

        //write out the locations to the page
        var html = "LOCATIONS<br><br>";

        for(var i=0; i<locations.length; i++) {
            html += "<a href=\"javascript:locationOnClick('" + locations[i] + "')\">" + locations[i] + "</a><br><br>";
        }

        var locationsDiv = document.getElementById('locations');
        locationsDiv.innerHTML = html;
        
       }

       //call endpoint again to get forecast
       getJSON(forecast, showForecast);
    }

}

function showForecast(err, data) {

    if (err != null) {

        console.error(err);
        locations.pop();   //remove bad value
        
    } else {
        //populate the detailed forecast span
        var spnDetailedForecast = document.getElementById('spnDetailedForecast');
        document.getElementById('result').className = 'showDiv'
        spnDetailedForecast.innerHTML = data.properties.periods[0].detailedForecast;
    }

}

// Annotate any code you pull in from other sources
// from:  https://zetcode.com/javascript/jsonurl/
var getJSON = function(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {

        var status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };

    xhr.send();
};

