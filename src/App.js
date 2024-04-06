import Globe from './Globe';
import SearchComponent from './components/SearchComponent';
import Header from './components/Header';

import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Globe />
        <SearchComponent />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
