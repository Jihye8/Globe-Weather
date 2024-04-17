import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change } from '../store/coordinateReducer';

import '../css/searchComponent.css';
import searchIcon from '../img/search.png';
import closeIcon from '../img/close.png';

const mapToken = process.env.REACT_APP_MAPBOX_TOKEN; //map api

export default function SearchComponent() {
  const dispatch = useDispatch();
  const longitude = useSelector((state) => state.coordinate.longitude);
  const latitude = useSelector((state) => state.coordinate.latitude);
  const [searchText, setSearchText] = useState(''); //검색창에 입력시
  const [searchResults, setSearchResults] = useState([]); //검색 결과
  const [selectedResult, setSelectedResult] = useState(null); //선택한 검색 결과

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  //검색 api
  const handleSearch = () => {
    // Mapbox API 호출 및 검색 결과 받아오기
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?limit=5&types=place&types=country&access_token=${mapToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          // 검색 결과 저장
          setSearchResults(data.features);
        } else {
          alert('날씨를 검색할 수 없는 곳입니다.');
        }
      })
      .catch((error) => {
        console.error('검색 중 오류 발생:', error);
        alert('날씨를 검색할 수 없는 곳입니다.');
      });
  };
  const resetSearch = () => {
    setSearchResults([]);
    setSearchText('');
  };
  //검색 결과들 중 선택
  const handleSelectResult = (result) => {
    setSelectedResult(result);
    const [lng, lat] = result.center;
    dispatch(change({ lng, lat }));
  };

  useEffect(() => {
    resetSearch();
  }, [longitude, latitude]);

  return (
    <div className="search-wrap">
      <div className="search-box">
        <img src={searchIcon}></img>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search for city or country"
          onKeyDown={handleEnter}
          spellCheck="false"
        />
        {searchText && (
          <img src={closeIcon} className="close" onClick={resetSearch}></img>
        )}
      </div>
      {/* <button onClick={handleSearch}>검색</button> */}
      <div className="result-wrap">
        <div>
          {searchResults.map((result) => (
            <div
              className="result-block"
              key={result.id}
              onClick={() => handleSelectResult(result)}
            >
              {result.place_name}
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
