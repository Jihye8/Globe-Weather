import React from 'react';
import WeatherComponent from './WeatherComponent';
import '../css/modal.css';

export default function Modal() {
  return (
    <div className="modal-wrap">
      <WeatherComponent />
    </div>
  );
}
