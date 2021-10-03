import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './index.scss';
import App from './Components/App';

import store from './Redux/store'
import { Provider } from 'react-redux';


// requestArticlesList()

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App/>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );


