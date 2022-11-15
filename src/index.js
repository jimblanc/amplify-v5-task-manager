import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import TaskList from './pages/list';
import reportWebVitals from './reportWebVitals';
import awsExports from './aws-exports';

import '@aws-amplify/ui-react/styles.css';
import './index.css';
import './App.css';

// Configure Amplify
Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Authenticator>
    <TaskList />
  </Authenticator>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
