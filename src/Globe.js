import React, { useState, useRef, useCallback } from 'react';
import ReactMapGL, {NavigationControl, GeolocateControl, Marker, ScaleControl} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css"
// import '@mapbox/react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'


const mapToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Globe() {
  const [clickInfo, setClickInfo] = useState(null); //마커 위치 담은 객체
  
  const [viewport, setViewport] = useState({
    latitude:37.8,
    longitude : -122.4,
    zoom : 2,
    projection : 'globe',
  });
  
  function handleMapClick(event){
    const { lng, lat } = event.lngLat;
    setClickInfo({ lng: lng, lat: lat });
  };
  //검색창에 입력시 
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  const handleSearch = () => {
    // Mapbox API 호출 및 검색 결과 받아오기
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?limit=5&access_token=${mapToken}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          // 검색 결과 저장
          setSearchResults(data.features);
        } else {
          alert('검색 결과를 찾을 수 없습니다.');
        }
      })
      .catch(error => {
        console.error('검색 중 오류 발생:', error);
        alert('검색 중 오류가 발생했습니다.');
      });
  };
  const handleSelectResult = (result) => {
    setSelectedResult(result);

    // 마커 정보 설정
    const [longitude, latitude] = result.center;
    setViewport({
      ...viewport,
      latitude,
      longitude,
      zoom: 5
    });
  };
  //좌표로 정보 가져오기
  // https://api.mapbox.com/search/geocode/v6/reverse?longitude={longitude}&latitude={latitude}

  
  return (
    <div style={{width:"80vw", height:"100vh"}}>
      <div className='search-wrap'>
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="장소를 검색하세요"
        />
        <button onClick={handleSearch}>검색</button>
        <div>
          <h2>검색 결과:</h2>
          <ul>
            {searchResults.map(result => (
              <li key={result.id} onClick={() => handleSelectResult(result)}>
                {result.place_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ReactMapGL
        mapboxAccessToken= {mapToken}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/jihye829/clu6f3a3r001u01r62zdmfe88"
        transitionDuration={200}
        onMove={evt => setViewport(evt.viewport)}
        onClick={handleMapClick}
      >
        <NavigationControl />     
        <GeolocateControl /> 
        <ScaleControl />
        {clickInfo?(<Marker longitude={clickInfo.lng} latitude={clickInfo.lat} offsetTop={5} anchor="center" color='#F99417' onClick={(e)=>console.log(e.target.getLngLat())}></Marker>) :null }

      </ReactMapGL>
   
    </div>
  );
}

export default Globe;
