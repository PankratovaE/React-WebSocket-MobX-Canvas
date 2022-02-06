import React from 'react';
// import Canvas from './components/Canvas';
// import SettingBar from './components/SettingBar';
// import ToolBar from './components/ToolBar';
import './styles/app.scss';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import TogetherApp from './components/TogetherApp';

const App = () => {
  return (
    <BrowserRouter>
      <div className='app'>
        <Routes>
          <Route path=':id' element={<TogetherApp />} />
          <Route
            path="*"
            element={<Navigate to={`/${(+new Date()).toString(16)}`} /> } />
        </Routes>
      </div>
    </BrowserRouter>

  );
};

export default App;