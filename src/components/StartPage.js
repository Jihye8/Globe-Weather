import React, { useRef, useState, useEffect } from 'react';

import logo from '../img/logo.png';
import background from '../img/background.mp4';

import '../css/startPage.css';

export default function StartPage({ srollToGlobe }) {
  const [text, setText] = useState(''); // text 상태 추가
  const [isVisible, setIsVisible] = useState(true); // isVisible 상태 추가
  const textRef = useRef(null); // text 요소에 대한 ref 추가
  const text1 = 'Hello, Visitor : )';
  const text2 = 'Let`s explore weather around the world!';
  let i = 0;

  useEffect(() => {
    const intervalId = setInterval(typing, 100);
    return () => clearInterval(intervalId);
  }, []);

  function typing() {
    if (i < text1.length) {
      let txt = text1.charAt(i);
      setText((prevText) => prevText + txt);
    } else if (i === text1.length) {
      setText((prevText) => `<span id="text-bg">${prevText}</span><br />`);
    } else if (i - text1.length <= text2.length) {
      let txt = text2.charAt(i - text1.length - 1);
      setText((prevText) => prevText + txt);
    }
    i += 1;

    // 전체 문구가 출력된 후에 isVisible를 false로 변경하여 숨김
    if (i > text1.length + text2.length) {
      setIsVisible(false);
    }
  }

  // isVisible 상태가 변경되면 1초 후에 isVisible를 true로 변경하여 다시 표시
  useEffect(() => {
    if (!isVisible) {
      const timeoutId = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);
  return (
    <div className="wrap">
      <video className="bk" autoPlay loop muted>
        <source src={background} type="video/mp4" />
      </video>
      <div className="logo-wrap">
        <img src={logo}></img>
        <span>Globe Weather</span>
      </div>
      <div className="text-box">
        <span
          ref={textRef}
          className="text"
          dangerouslySetInnerHTML={{ __html: text }}
        ></span>{' '}
      </div>
      <div className="start-wrap" onClick={srollToGlobe}>
        <span>Start</span>
        <span className="material-symbols-outlined">arrow_forward_ios</span>
      </div>
    </div>
  );
}
