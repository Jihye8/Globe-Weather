import "mapbox-gl/dist/mapbox-gl.css"
import React, { useState } from 'react';
import Map, {NavigationControl, GeolocateControl, Marker, ScaleControl} from 'react-map-gl';
import pin from './pin.png'

function Globe() {
  const [clickInfo, setClickInfo] =useState(null); //마커 위치 담은 객체
  const [viewport, setViewport] = useState({
    latitude:37.8,
    longitude : -122.4,
    zoom : 2,
    projection : 'globe',
  })
 
  function handleMapClick(event){
    const { lng, lat } = event.lngLat;
    setClickInfo({ lng: lng, lat: lat });
  };
  console.log(clickInfo);

  return (
    <div style={{width:"80vw", height:"100vh"}}>
      
    <Map
      mapboxAccessToken="pk.eyJ1IjoiamloeWU4MjkiLCJhIjoiY2x1N284emZ1MDhoejJqbnNpd3ZjbmZxayJ9.7aY4e4hyotaEuyfD21HGsw"
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
      {/* {clickInfo ?(
        <>
          <Marker
          latitude={clickInfo?.lat}
          longitude={clickInfo?.lng}
          offsetLeft={3.5*viewport.zoom}
          offsetTop={-7*viewport.zoom}
          ></Marker>
        </>
      ):null} */}
      {clickInfo?(<Marker longitude={clickInfo.lng} latitude={clickInfo.lat} offsetLeft={3.5*viewport.zoom} offsetTop={-7*viewport.zoom} anchor="bottom">
        <Room 
        style={{
          fontSize : 7 * viewport.zoom,
          color : "tomato",
          curser : "pointer"
        }}
        />
      </Marker>) :null }
        
      
    </Map>
    </div>
  );
}

export default Globe;
