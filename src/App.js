import { useEffect, useRef } from 'react';
import StartPage from './components/StartPage';
import Globe from './components/Globe';

import './App.css';

function App() {
  const componentGlobeRef = useRef(null);
  const componentStartRef = useRef(null);

  const srollToGlobe = () => {
    window.scrollTo({
      top: componentGlobeRef.current.offsetTop,
      behavior: 'smooth',
    });
  };
  const scrollToStart = () => {
    window.scrollTo({
      top: componentStartRef.current.offsetTop,
      behavior: 'smooth',
    });
  };
  //화살표1
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
  document.head.appendChild(linkElement);
  //화살표2
  const linkElement2 = document.createElement('link');
  linkElement2.rel = 'stylesheet';
  linkElement2.href =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
  document.head.appendChild(linkElement2);

  return (
    <div className="App">
      <div ref={componentStartRef}>
        <StartPage srollToGlobe={srollToGlobe} />
      </div>
      <main>
        <div ref={componentGlobeRef}>
          <Globe srollToStart={scrollToStart} />
        </div>
        {/* <SearchComponent /> */}
      </main>
    </div>
  );
}

export default App;
