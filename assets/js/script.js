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

//Fetch UVindex data
function UVIndex(ln,lt){
    const uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIkey+"&lat="+lt+"&lon="+ln;
    fetch(uvqURL).then(function(response){
        return response.json();}).then(data => {
            $(cUvindex).html(data.value);
        })
}
        
// Here we display the 5 days forecast for the current city.
function forecast(cityid){
    const dayover= false;
    const queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIkey;
    fetch(queryforcastURL).then(function(response){
        return response.json();}).then(data => {
            for (i=0;i<5;i++){
            const date= new Date((data.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            const iconcode= data.list[((i+1)*8)-1].weather[0].icon;
            const iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            const tempK= data.list[((i+1)*8)-1].main.temp;
            const tempF=(((tempK-273.5)*1.80)+32).toFixed(0);
            const humidity= data.list[((i+1)*8)-1].main.humidity;
            const windSpeed = data.list[((i+1)*8)-1].wind.speed.toFixed(0);
            
            $("#forecastDate"+i).html(date);
            $("#forecastIcon"+i).html("<img src="+iconurl+">");
            $("#forecastTemp"+i).html(tempF+"&#8457");
            $("#forecastHumidity"+i).html(humidity+"%");
            $("#forecastWs"+i).html(windSpeed+ "mph");
        }    
    })
}
    
//Dynamically add searched city to history
function addToList(c){
    const listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
    
//Reselect and display city from history when clicked
function invokePastSearch(event){
    const liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        weatherCurrent(city);
    }
}
    
