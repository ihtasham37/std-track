import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("APP STARTED");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("APP: FAILED - ROOT ELEMENT NOT FOUND");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("REACT RENDERED");