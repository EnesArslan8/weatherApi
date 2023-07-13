import React from "react";

function Result({ city, country ,temp,main,tempC,maxTemp,minTemp}) {
  return (
    <div>
      <div className="result-container">
        <div className="weather-from">
          {city} - {country}
        </div>
        <div className="temp">
          {temp} {main}
        </div>
        <div className="tempC">
          <span>{tempC}<sup>o</sup>C</span>
          <div className="min-max">
            <i>{minTemp}</i>~<i>{maxTemp}</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
