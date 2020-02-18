import React from 'react';
import logo from './logo.svg';
import './App.css';

import InputExample from './examples/InputExample';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <InputExample />
      </header>
    </div>
  );
}

export default App;
