import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change } from '../store/coordinateReducer';
import '../css/SearchComponent.css';

const mapToken = process.env.REACT_APP_MAPBOX_TOKEN; //map api

export default function SearchComponent() {
  const dispatch = useDispatch();
  const longitude = useSelector((state) => state.coordinate.longitude);
  const latitude = useSelector((state) => state.coordinate.latitude);
  const [searchText, setSearchText] = useState(''); //검색창에 입력시
  const [searchResults, setSearchResults] = useState([]); //검색 결과
  const [selectedResult, setSelectedResult] = useState(null); //선택한 검색 결과

  //검색 api
  const handleSearch = () => {
    // Mapbox API 호출 및 검색 결과 받아오기
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?limit=3&types=place&types=country&access_token=${mapToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          // 검색 결과 저장
          setSearchResults(data.features);
          console.log(data);
        } else {
          alert('날씨를 검색할 수 없는 곳입니다.');
        }
      })
      .catch((error) => {
        console.error('검색 중 오류 발생:', error);
        alert('날씨를 검색할 수 없는 곳입니다.');
      });
  };
  //검색 결과들 중 선택
  const handleSelectResult = (result) => {
    console.log(result);
    setSelectedResult(result);
    const [lng, lat] = result.center;
    dispatch(change({ lng, lat }));
  };

  return (
    <div className="search-wrap">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="장소를 검색하세요"
      />
      <button onClick={handleSearch}>검색</button>
      <div>
        <h2>검색 결과</h2>
        <ul>
          {searchResults.map((result) => (
            <li key={result.id} onClick={() => handleSelectResult(result)}>
              {result.place_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
