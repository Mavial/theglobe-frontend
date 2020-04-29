import React, { useState } from 'react';
import LoadingScreen from 'react-loading-screen'

import World from './components/Globe';
import Feed from './components/Feed';
import UpdateSize from './components/UpdateSize'

const App = () => {
  const [showFeed, setShowFeed] = useState(false)
  const [country, setCountry] = useState('')
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [loading, setLoading] = useState(true)

  window.addEventListener('load', (event) => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  return (
    <>
      <LoadingScreen
        loading={loading}
        bgColor='#000817'
        spinnerColor='#9ee5f8'
        textColor='#f0f0f0'
        text='The Globe is ready soon'
      >
        <div></div>
      </LoadingScreen>
      <World
        setShowFeed={setShowFeed}
        setCountry={setCountry}
        country={country}
        height={height}
        width={width}
      />
      <Feed
        country={country}
        showFeed={showFeed}
      />
      <UpdateSize setHeight={setHeight} setWidth={setWidth}/>
    </>
  );
};

export default App;