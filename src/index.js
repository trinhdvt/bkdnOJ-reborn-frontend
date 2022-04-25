import React from 'react';
import {createRoot} from 'react-dom/client';

// Redux
import { Provider } from 'react-redux';
import store from 'redux/store.js'

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from 'App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
  <Provider store={store}>
    <App />
    <ToastContainer
      position="bottom-right" 
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </Provider>
  </React.StrictMode>
);
