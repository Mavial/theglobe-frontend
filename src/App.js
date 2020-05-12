import React, { useState, lazy, Suspense } from 'react';
import LoadingScreen from 'react-loading-screen';

import UpdateSize from './components/UpdateSize';
import World from './components/World';

const Feed = lazy(() => import('./components/Feed'));

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
        <></>
      </LoadingScreen>
      <World
        setShowFeed={setShowFeed}
        showFeed={showFeed}
        setCountry={setCountry}
        country={country}
        height={height}
        width={width}
      />
      <UpdateSize setHeight={setHeight} setWidth={setWidth}/>
      <Suspense fallback={null}>
        <Feed
          country={country}
          showFeed={showFeed}
        />
      </Suspense>
    </>
  );
};

export default App;