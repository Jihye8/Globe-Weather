import React from 'react';
import WeatherComponent from './WeatherComponent';
import '../css/Modal.css';

export default function Modal() {
  return (
    <div className="modal-wrap">
      <WeatherComponent />
    </div>
  );
}
