import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
//New imports
import { Provider } from 'react-redux';
import store from './store';

import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
registerServiceWorker();
