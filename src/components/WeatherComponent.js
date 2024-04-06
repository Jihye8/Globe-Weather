import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const weatherToken = process.env.REACT_APP_WEATHER_TOKEN;

export default function WeatherComponent() {
  const dispatch = useDispatch();
  const longitude = useSelector((state) => state.coordinate.longitude);
  const latitude = useSelector((state) => state.coordinate.latitude);
  const placeName = useSelector((state) => state.placename.placeName);

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherToken}&units=metric
    `)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        console.log('오늘', data);
        console.log(data.weather[0].main);
      } else {
        alert('날씨를 검색할 수 없는 곳입니다.');
      }
    })
    .catch((error) => {
      alert('Error 발생');
      console.log('error', error);
    });

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        console.log('예보', data);
      } else {
        alert('날씨 정보를 불러오지 못했습니다.');
      }
    })
    .catch((error) => {
      alert('Error 발생');
      console.log('error', error);
    });

  return <div></div>;
}
