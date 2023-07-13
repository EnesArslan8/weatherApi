import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Result from "./components/Result";
import { GoSearch } from "react-icons/go";
import bg from "./images.json";

function App() {
  const [text, setText] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const key2 = process.env.REACT_APP_WEATHER_API_KEY2;
  const key = process.env.REACT_APP_WEATHER_API_KEY;
  const [weather, setWeather] = useState();

  const getWeatherData = async () => {
    // Konum bilgisini almak için
    if (city === "") {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key2}&units=metric&lang=tr`;

          try {
            const { data } = await axios.get(url);
            setWeather(data);

            // İl bilgisini almak için
            const geolocationUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${key}&language=tr`;

            const geolocationResponse = await axios.get(geolocationUrl);
            if (
              geolocationResponse.data &&
              geolocationResponse.data.results &&
              geolocationResponse.data.results.length > 0
            ) {
              const city = geolocationResponse.data.results[0].components.city;
              const region =
                geolocationResponse.data.results[0].components.state;
              setCity(city);
              setRegion(region);
            }
          } catch (err) {
            console.log("Bir hata meydana geldi: " + err);
          }
        },
        (error) => {
          console.log("Konum alınamadı: " + error);
        }
      );
    } else {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key2}&units=metric&lang=tr`;

      try {
        const { data } = await axios.get(url);
        setWeather(data);

        // İl bilgisini almak için
        const geolocationUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${key}&language=tr`;

        const geolocationResponse = await axios.get(geolocationUrl);
        if (
          geolocationResponse.data &&
          geolocationResponse.data.results &&
          geolocationResponse.data.results.length > 0
        ) {
          const region = geolocationResponse.data.results[0].components.state;
          setRegion(region);
        }
      } catch (err) {
        console.log("Bir hata meydana geldi: " + err);
      }
    }
  };

  const handleSearch = () => {
    if (text !== "") {
      setCity(text);
    }
  };

  useEffect(() => {
    const setBackground = () => {
      if (weather && weather.weather && weather.weather.length > 0) {
        const weatherType = weather.weather[0].main.toLowerCase();
        const matchingBackground = bg.find(
          (item) => item.title.toLowerCase() === weatherType
        );
        if (matchingBackground) {
          setBackgroundImage(matchingBackground.src);
        }
      }
    };

    setBackground();
  }, [weather]);

  useEffect(() => {
    getWeatherData();
  }, [city]);

  useEffect(() => {
    // Sayfa yüklendiğinde konum bilgilerini al
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // İl bilgisini almak için
          const geolocationUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${key}&language=tr`;

          axios
            .get(geolocationUrl)
            .then((response) => {
              const city = response.data.results[0].components.city;
              setText(city);
            })
            .catch((error) => {
              console.log("Bir hata meydana geldi: " + error);
            });
        },
        (error) => {
          console.log("Konum alınamadı: " + error);
        }
      );
    }
  }, []);
  console.log(weather);
  return (
    <div
      className="App"
      style={{
        background: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="container">
        <h1 className="title">Hava Durumu</h1>
        <div className="search">
          <input onChange={(e) => setText(e.target.value)} value={text || ""} />
          <GoSearch
            className="search-icon"
            style={{ cursor: "pointer" }}
            onClick={handleSearch}
          />
        </div>
        {weather && (
        <Result
          city={weather.name}
          region={region}
          country={weather.sys.country}
          temp={weather.weather[0].description}
          tempC={weather.main.temp}
          maxTemp={weather.main.temp_max}
          minTemp={weather.main.temp_min}
        ></Result>
      )}
      </div>
      
    </div>
  );
}

export default App;
