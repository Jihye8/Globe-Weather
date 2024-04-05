import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, {
  NavigationControl,
  GeolocateControl,
  Marker,
  ScaleControl,
  Popup,
} from 'react-map-gl';
import { change } from './store/coordinateReducer';
import { save } from './store/placeNameReducer';

import 'mapbox-gl/dist/mapbox-gl.css';
import './Globe.css';

const mapToken = process.env.REACT_APP_MAPBOX_TOKEN; //map api

function Globe() {
  const dispatch = useDispatch();
  const longitude = useSelector((state) => state.coordinate.longitude);
  const latitude = useSelector((state) => state.coordinate.latitude);
  //마커 위치 담은 객체
  const [clickInfo, setClickInfo] = useState(null);
  //마커 클릭
  const [markerClicked, setMarkerClicked] = useState(false);
  //popup 창 열고 닫기
  const [showPopup, setShowPopup] = useState(false);
  const [placeName, setPlaceName] = useState('');
  //날씨
  // 초기 지구본 설정
  const [viewport, setViewport] = useState({
    longitude: longitude,
    latitude: latitude,
    zoom: 2,
    projection: 'globe',
  });

  const handleMove = (event) => {
    setViewport({
      ...event.viewport,
      transitionDuration: 200,
    });
  };

  useEffect(() => {
    setClickInfo({ lng: longitude, lat: latitude });
    setViewport({
      ...viewport,
      latitude,
      longitude,
    });
  }, [longitude, latitude]);

  useEffect(() => {
    dispatch(save(placeName));
  }, [placeName]);

  function HandleMapClick(event) {
    if (!markerClicked) {
      const { lng, lat } = event.lngLat;
      setClickInfo({ lng: lng, lat: lat }); // 지도 상에 누른 위치
      dispatch(change(event.lngLat));
    }
    setMarkerClicked(false);
  }

  function HandleMarkerClick(event) {
    setMarkerClicked(true);
    coordinateSearch(clickInfo);
  }

  //좌표로 도시정보 가져오기 api
  const coordinateSearch = async (clickInfo) => {
    const longitude = clickInfo.lng;
    const latitude = clickInfo.lat;
    // 날씨 검색에 적합한 검색단위, place로 지명 검색
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}.json&place&access_token=${mapToken}`
      );
      const data = await response.json();
      setShowPopup(true);
      setPlaceName(data.features[0].properties.place_formatted);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      alert('날씨를 검색할 수 없는 곳입니다.');
    }
  };

  return (
    <div className="wrap">
      <div style={{ width: '80vw', height: '100vh' }}>
        <ReactMapGL
          mapboxAccessToken={mapToken}
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/jihye829/clugaidf500lt01ra1me3ea6y"
          transitionDuration={200}
          onMove={handleMove}
          onClick={HandleMapClick}
        >
          {clickInfo && (
            <Marker
              longitude={clickInfo.lng}
              latitude={clickInfo.lat}
              offsetTop={0}
              anchor="center"
              color="#F99417"
              onClick={HandleMarkerClick}
            />
          )}
          {showPopup && (
            <Popup
              longitude={clickInfo.lng}
              latitude={clickInfo.lat}
              anchor="top"
              onClose={() => setShowPopup(false)}
            >
              {placeName}
              <br />
              <button>날씨</button>
            </Popup>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
}

export default Globe;
