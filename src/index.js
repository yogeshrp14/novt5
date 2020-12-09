import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'; 
import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline } from "@material-ui/core";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { ToastProvider } from 'react-toast-notifications';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(
  <ToastProvider>
      <CssBaseline />
      <App />
  </ToastProvider>,
  document.getElementById("root"),
 );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
