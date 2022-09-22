//variables
let city="";
let citySearch = $("#search-city");
let btnSearch = $("#search-button");
let btnClear = $("#clear-history");
let cCity = $("#current-city");
let cTemperature = $("#temperature");
let cHumidity= $("#humidity");
let cWindspeed=$("#wind-speed");
let cUvindex= $("#uv-index");
let sCity=[];

// Search city to check if it exists from storage
function find(c){
    for (var i=0; i<sCity.length; i++) {
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}

//API key
const APIkey = "78b9ad515dca05a6cf7e5d876a98f14b";

// Display current weather and future weather 
function displayWeather(event){
    event.preventDefault();
    if(citySearch.val().trim()!==""){
        city=citySearch.val().trim();
        weatherCurrent(city);
    }
}

// Fetch the API
function weatherCurrent(city){

    const queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIkey;
    fetch(queryURL).then(function(response){
        return response.json();}).then(data => { 
        console.log(data);

        //Call icon from data
        const weathericon= data.weather[0].icon;
        const iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        
        //Format the date
        const date=new Date(data.dt*1000).toLocaleDateString();
       
        //Jquery to concat date and icon url
        $(cCity).html(data.name +"("+date+")" + "<img src="+iconurl+">");
        
        //Convert temperature to Fahrenheit    
        const tempF = (data.main.temp - 273.15) * 1.80 + 32;
        $(cTemperature).html((tempF).toFixed(0)+"&#8457");
        
        //Jquery to display humidity
        $(cHumidity).html(data.main.humidity+"%");
        
        //Jquery to display windspeed and convert to mph
        const ws=data.wind.speed;
        const windsmph=(ws*2.237).toFixed(0);
        $(cWindspeed).html(windsmph+"MPH");
        
        // Display UVIndex.
        UVIndex(data.coord.lon,data.coord.lat);
        forecast(data.id);
        if(data.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });

}
