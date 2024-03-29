import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, {NavigationControl, GeolocateControl, Marker, ScaleControl} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import { change } from './store/coordinateReducer';
import SearchComponent from './components/SearchComponent';

const mapToken = process.env.REACT_APP_MAPBOX_TOKEN; //map api

function Globe() {
  const dispatch = useDispatch();
  const longitude = useSelector((state)=>state.coordinate.longitude);
  const latitude = useSelector((state)=>state.coordinate.latitude);
  
  //마커 위치 담은 객체
  const [clickInfo, setClickInfo] = useState(null); 
  // 초기 지구본 설정
  const [viewport, setViewport] = useState({  
    longitude :longitude,
    latitude:latitude,
    zoom : 2,
    projection : 'globe',
  });
  
  function HandleMapClick(event){
    const { lng, lat } = event.lngLat;
    setClickInfo({ lng: lng, lat: lat }); // 지도 상에 누른 위치
    dispatch(change(event.lngLat));
  };

  //좌표로 도시정보 가져오기 api
  const coordinateSearch = (lngLat) =>{
    console.log(lngLat);
    const longitude = lngLat.lng
    const latitude = lngLat.lat
    fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}.json&access_token=${mapToken}`)
      .then(response =>response.json())
      .then(data=>{
        console.log(data.features[0].properties.place_formatted); //도시명 
      })
      .catch(error => {
        console.error('검색 중 오류 발생:', error);
        alert('검색 중 오류가 발생했습니다.');
      });

  }

  return (
    // 검색
    <div style={{width:"80vw", height:"100vh"}}>
      <ReactMapGL
        mapboxAccessToken= {mapToken}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/jihye829/clu6f3a3r001u01r62zdmfe88"
        transitionDuration={200}
        onMove={evt => setViewport(evt.viewport)}
        onClick={HandleMapClick}
      >
        <NavigationControl />     
        <GeolocateControl /> 
        <ScaleControl />
        {clickInfo?(<Marker longitude={clickInfo.lng} latitude={clickInfo.lat} offsetTop={5} anchor="center" color='#F99417' onClick={(e)=>{coordinateSearch(e.target.getLngLat())}}></Marker>) :null }
      </ReactMapGL>
      <SearchComponent />
    </div>
  );
}

export default Globe;
