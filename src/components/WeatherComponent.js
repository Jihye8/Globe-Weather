import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sunny from '../img/sunny.mp4';
import cloudy from '../img/cloudy.mp4';
import rain from '../img/rain.mp4';
import snow from '../img/snow.mp4';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Interaction,
  Scale,
  Ticks,
} from 'chart.js';

import '../css/weatherComponent.css';
import logo from '../img/logo.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const weatherToken = process.env.REACT_APP_WEATHER_TOKEN;

export default function WeatherComponent() {
  const dispatch = useDispatch();
  const longitude = useSelector((state) => state.coordinate.longitude);
  const latitude = useSelector((state) => state.coordinate.latitude);
  const placeName = useSelector((state) => state.placename.placeName);
  const [background, setBackground] = useState();
  const [mainWeather, setMainWeather] = useState(''); //메인 날씨
  const [name, setName] = useState(''); //(날씨 검색 기준)지명
  const [temp, setTemp] = useState(); //현재 온도
  const [tempByHour, setTempByHour] = useState([]); //오늘 시간대별 기온(3시간)
  const [date, setDate] = useState([]); //오늘 날짜
  const [feelsLike, setFeelsLike] = useState(); // 체감온도
  const [tempMin, setTempMin] = useState(); // 최저기온
  const [tempMax, setTempMax] = useState(); // 최고기온
  const [visibility, setVisibility] = useState(); // 시야
  const [windSpeed, setWindSpeed] = useState(); //풍속
  const [forecast, setForecast] = useState([]); // 4일 예보
  const [forecastDate, setForecastDate] = useState([]); // 4일 예보-날짜
  const [forecastMaxTemp, setForecastMaxTemp] = useState([]); // 4일 예보-최고기온
  const [forecastMinTemp, setForecastMinTemp] = useState([]); //4일 예보-최저기온
  const [forecastMain, setForecastMain] = useState([]); //4일 예보 - 메인날씨
  // const [forecastReady, setForecastReady] = useState(false); //4일 예보 - 준비상태
  useEffect(() => {
    //오늘 날씨
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherToken}&units=metric
      `)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setMainWeather(`${data.weather[0].main}`); // 오늘의 메인 날씨
          setName(`${data.name}`); //날씨 기준-장소 이름
          setTemp(data.main.temp); //현재 날씨
          setFeelsLike(data.main.feels_like); //체감기온
          setVisibility(data.visibility); // 사야
          setWindSpeed(data.wind.speed); //풍속
        } else {
          alert('날씨를 검색할 수 없는 곳입니다.');
        }
      })
      .catch((error) => {
        alert('Error 발생');
      });
    //5일간 날씨 예보(당일 오전 6시부터 5일 후 24시까지)
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherToken}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          //오늘 날씨
          const temperatures = [];
          for (let i = 0; i < 8; i++) {
            temperatures.push(data.list[i].main.temp);
          }
          // 예보
          const subArrays = [];
          for (let i = 7; i < 39; i += 8) {
            subArrays.push(data.list.slice(i, i + 8));
          }
          if (subArrays.length == 4) {
            const date = [];
            const forecastMax = [];
            const forecastMin = [];
            const main = [];
            for (let i = 0; i < 4; i++) {
              let temp = [];
              for (let j = 0; j < 8; j++) {
                temp.push(subArrays[i][j].main.temp);
              }
              const max = Math.max.apply(null, temp);
              const min = Math.min.apply(null, temp);
              forecastMax.push(max); //최고기온
              forecastMin.push(min); //최저기온
              main.push(subArrays[i][4].weather[0].main); //메인날씨
              date.push(`${subArrays[i][0].dt_txt.substr(8, 2)}`); //날짜
              temp = [];
            }
            setForecastDate(date); // 4일 예보 - 날짜
            setForecastMaxTemp(forecastMax); //4일 예보 - 최고기온
            setForecastMinTemp(forecastMin); //4일 예보 - 최저기온
            setForecastMain(main); //4일 예보- 메인날씨
          }

          setTempByHour(temperatures); //3시간별 기온
          setTempMax(Math.max.apply(null, temperatures)); //최고기온
          setTempMin(Math.min.apply(null, temperatures)); //최저기온
          setDate([
            ...date,
            data.list[0].dt_txt.substr(0, 4),
            data.list[0].dt_txt.substr(5, 2),
            data.list[0].dt_txt.substr(8, 2),
          ]); // 오늘 날짜
        } else {
          alert('날씨 정보를 불러오지 못했습니다.');
        }
      })
      .catch((error) => {});
  }, [longitude, latitude]);

  //메인 날씨 별 모달 배경 영상 변경
  useEffect(() => {
    let videoFile = null;
    switch (mainWeather) {
      case 'Clear':
        videoFile = sunny;
        break;
      case 'Thunderstrom':
      case 'Atmosphere':
      case 'Clouds':
        videoFile = cloudy;
        break;
      case 'Drizzle':
      case 'Rain':
        videoFile = rain;
        break;
      case 'Snow':
        videoFile = snow;
        break;
      default:
        videoFile = null;
    }
    setBackground(videoFile);
  }, [mainWeather]);

  //시간별 기온 변화 차트
  const labels = ['03', '06', '09', '12', '15', '18', '21', '24'];
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 가로세로 비율을 유지하지 않음
    aspectRatio: 5,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'wthie',
        },
        ticks: {
          color: 'white',
          // fontSize: 14,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'white',
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return context.parsed.y.toFixed(1) + '°C'; // 선 위의 온도만 표시
          },
        },
      },
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature',
        data: tempByHour,
        borderColor: '#F99417',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      {background && (
        <div className="weather-wrap">
          <video autoPlay loop muted width="100%" height="100%">
            <source src={background} type="video/mp4" />
          </video>
          <div className="content-wrap">
            {name && (
              <span className="name-wrap">
                <img src={logo}></img>
                <span className="name">{name}</span>
              </span>
            )}
            {tempByHour.length > 0 ? (
              <>
                <div className="table-wrap">
                  <Line options={options} data={data} />
                </div>
                <div className="date-wrap">
                  Date. {date[0]} {date[1]} {date[2]}
                </div>
                <div className="main-weather-wrap">
                  <div className="main-weather">
                    {temp.toFixed(1)}
                    <span>°C</span>
                  </div>
                </div>
                <div className="min-max-wrap">
                  <span>H : {tempMax.toFixed(1)} °C</span>
                  <span>L : {tempMin.toFixed(1)} °C</span>
                </div>
                <div className="detail-info-weather">
                  <span className="detail-info-weather1">
                    <span>Feels like : {feelsLike.toFixed(1)} °C</span>
                    <span className="divide"> | </span>
                    <span> Main weather : {mainWeather}</span>
                  </span>
                  <span className="detail-info-weather2">
                    <span>Visibility : {visibility / 1000}km</span>
                    <span className="divide"> | </span>
                    <span> Wind speed : {windSpeed}m/s</span>
                  </span>
                </div>
                <div className="forecast-wrap">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="forecast-block">
                      <span className="forecast-date">
                        <span>{forecastDate[index]}</span>
                      </span>
                      <span className="forecast-info">
                        <span> {forecastMain[index]}</span>
                        <br />
                        <span>
                          H : {forecastMaxTemp[index].toFixed(1)} °C |{' '}
                        </span>
                        <span>L : {forecastMinTemp[index].toFixed(1)} °C</span>
                      </span>
                      <br />
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
