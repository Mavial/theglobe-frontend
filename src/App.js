import React, { useState, lazy, Suspense } from 'react';
import LoadingScreen from 'react-loading-screen';

import UpdateSize from './components/UpdateSize';
import World from './components/World/World';
import SignOut from './components/SignOut';

const Feed = lazy(() => import('./components/Feed/Feed'));

const App = () => {
  const [showFeed, setShowFeed] = useState(false)
  const [previewFeed, setPreviewFeed] = useState(false)
  const [country, setCountry] = useState('')
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [loading, setLoading] = useState(true)


  window.addEventListener('load', () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  return (
    <>
      <SignOut/>
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
        setPreviewFeed={setPreviewFeed}
        previewFeed={previewFeed}
        setCountry={setCountry}
        country={country}
        height={height}
        width={width}
        setLoading={setLoading}
      />
      <UpdateSize setHeight={setHeight} setWidth={setWidth}/>
      <Suspense fallback={null}>
        <Feed
          country={country}
          previewFeed={previewFeed}
          showFeed={showFeed}
        />
      </Suspense>
    </>
  );
};

export default App;