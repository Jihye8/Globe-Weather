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
  const [forecast, setForecast] = useState([]); // 4일
  const [date, setDate] = useState([]); //오늘 날짜
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
        } else {
          alert('날씨를 검색할 수 없는 곳입니다.');
        }
      })
      .catch((error) => {
        alert('Error 발생');
        console.log('error', error);
      });
    //5일간 날씨 예보(당일 오전 6시부터 5일 후 24시까지)
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherToken}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const temperatures = [];
          for (let i = 0; i < 8; i++) {
            temperatures.push(data.list[i].main.temp);
          }
          setTempByHour(temperatures); //3시간별 기온
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
      .catch((error) => {
        alert('Error 발생');
        console.log('error', error);
      });
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
    plugins: false,
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
        // backgroundColor: '#0CD3FF',
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
              <div className="table-wrap">
                <Line options={options} data={data} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
