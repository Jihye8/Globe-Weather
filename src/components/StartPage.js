import React, { useRef } from 'react';

import logo from '../img/logo.png';
import background from '../img/background.mp4';

import '../css/startPage.css';

export default function StartPage({ srollToGlobe }) {
  return (
    <div className="wrap">
      <video className="bk" autoPlay loop muted>
        <source src={background} type="video/mp4" />
      </video>
      <div className="logo-wrap">
        <img src={logo}></img>
        <span>Globe Weather</span>
      </div>
      <div className="name-wrap"></div>
      <div className="start-wrap" onClick={srollToGlobe}>
        <span>Start</span>
        <span class="material-symbols-outlined">arrow_forward_ios</span>
      </div>
    </div>
  );
}
