import React, { useRef, useState, useEffect } from 'react';
import Header from './Header';
import '../css/CustomScrollbar.css'; // 커스텀 스크롤바 스타일 파일

function CustomScrollbar({ children }) {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const contentRef = useRef(null);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollPercentage(scrollPercent);
  };

  // 컴포넌트가 처음 렌더링될 때와 스크롤 이벤트 리스너를 등록
  useEffect(() => {
    const contentElement = contentRef.current;
    contentElement.addEventListener('scroll', handleScroll);
    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="custom-scrollbar">
      {/* 헤더 */}
      {/* <Header /> */}
      <div className="scroll-content" ref={contentRef}>
        {children}
      </div>
      {/* 스크롤바 */}
      <div
        className="scrollbar"
        style={{ width: `${scrollPercentage}%` }}
      ></div>
    </div>
  );
}

export default CustomScrollbar;
