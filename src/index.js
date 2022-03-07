import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
// import { Auth0Provider } from '@auth0/auth0-react';

const msalInstance = new PublicClientApplication(msalConfig);

// ReactDOM.render(
//   <React.StrictMode>
//     <Auth0Provider
//       domain="https://app.vssps.visualstudio.com/oauth2"
//       clientId="9AA6B608-AAF2-4B34-81E4-E68C3F572FBB"
//       redirectUri="https://localhost:3000"
//     >
//       <App />
//     </Auth0Provider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
