import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import './App.css';

import Header from './components/Header';
import routes from './routes';

function App() {

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="App-header-inner">
            <Header />
            <nav>
              <ul>
                {routes.map((route, index) => (
                  <li key={index}>
                    <NavLink activeClassName="active" exact to={route.path}>
                      {route.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <div className="App-main">
          <div className="App-content-body">
            {routes.map((route, index) => route.component ? (
              <Route key={index} path={route.path} exact component={route.component} />
            ) : null)}
          </div>
          <footer className="App-footer">
            <p>
              (c) Airship LLC
            </p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
