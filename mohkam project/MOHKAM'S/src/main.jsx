import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import {RecoilRoot} from 'recoil'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
  <Router>
            <Routes>
                <Route path="*" element={<App />} />
            </Routes>
  </Router>
    </RecoilRoot>
  </React.StrictMode>,
)
