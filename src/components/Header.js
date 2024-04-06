import React from 'react';
import logo from '../img/logo.png';

import '../css/Header.css';

export default function Header() {
  return (
    <div className="header-wrap">
      <div className="logo-wrap">
        <img src={logo}></img>
        <span>Globe Weather</span>
      </div>
      <div className="login-wrap">
        <span>로그인</span>
        <span> / </span>
        <span>회원가입</span>
      </div>
    </div>
  );
}
