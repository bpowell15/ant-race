import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AntRace from './components/antRace';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AntRace />, document.getElementById('root'));
registerServiceWorker();
