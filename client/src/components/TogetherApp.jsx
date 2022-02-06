import React from 'react';
import Canvas from './Canvas';
import SettingBar from './SettingBar';
import ToolBar from './ToolBar';

const TogetherApp = () => {
    return(
        <>
            <ToolBar />
            <SettingBar />
            <Canvas />
        </>
    )
}

export default TogetherApp