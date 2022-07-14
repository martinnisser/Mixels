// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import Landing from './landing/landing.js';
// import reportWebVitals from './reportWebVitals';
// import {BrowserRouter, Routes, Route} from "react-router-dom";
// import Main from './pages/Main';

// ReactDOM.render(
//   <React.StrictMode>
//     <Main/>
//   </React.StrictMode>,
//   document.getElementById('appRoot')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();



import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Main from './pages/Main';
import Navbar from '../src/navbar/navbar'
import IndividualControl from './individualControl/individualControl'
import IndividualMatrices from './individualMatrices/individualMatrices'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/individualControl" element={<IndividualControl />} />
        <Route path="/individualMatrices" element={<IndividualMatrices />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('appRoot')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();