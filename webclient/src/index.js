import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';

axios.defaults.baseURL = 'http://localhost:8000';

// Snippet from https://itnext.io/authentication-in-mern-stack-using-jwt-25c966027f77
// May or may not end up doing it this way.
// let userData = JSON.parse(localStorage.getItem("userData"));
// let token;

// if (userData) {
//   token = userData.token
// }
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.interceptors.request.use(request => {
//   return request;
// }, 
// error => {
//   //  console.log(error);
//   return Promise.reject(error);
// });
// axios.interceptors.response.use(response => {
//   return response;
// },
//  error => {
//   // console.log(error.response);
//   return Promise.reject(error);
// });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
