import './App.css';
import Globe from './Globe';
import SearchComponent from './components/SearchComponent';
import Header from './components/Header';
import WeatherComponent from './components/WeatherComponent';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <SearchComponent />
        <Globe />
        <WeatherComponent />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
