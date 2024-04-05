import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const weatherToken = process.env.REACT_APP_WEATHER_TOKEN;

export default function WeatherComponent() {
  const dispatch = useDispatch();
  const longitude = useSelector((state) => state.coordinate.longitude);
  const latitude = useSelector((state) => state.coordinate.latitude);
  const placeName = useSelector((state) => state.placename.placeName);

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherToken}
    `)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        console.log(data);
      } else {
        alert('날씨를 검색할 수 없는 곳입니다.');
      }
    })
    .catch((error) => {
      console.error('검색 중 오류 발생:', error);
      alert('날씨를 검색할 수 없는 곳입니다.');
    });

  return <div></div>;
}
