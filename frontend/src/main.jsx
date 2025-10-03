import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './components/App/App.jsx';
import './styles/main.css';
import './styles/variables.module.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
