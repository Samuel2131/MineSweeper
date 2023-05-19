import React from 'react';
import './App.css';
import { Minessweeper } from './components/Minesweeper';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Minessweeper ROW={8} COL={8} BOMB_PERCENTAGE={0.07} />
      </header>
    </div>
  );
}

export default App;
