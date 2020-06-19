
import React from 'react';
import logo from '../logo.svg';

const Header = () => {
  return (
    <div className="header-top">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-name">
        R E A C T
        <br/>
        <small>
          <small>
            H E L P E R S
          </small>
        </small>
      </h1>
    </div>
  );
};

export default Header;
