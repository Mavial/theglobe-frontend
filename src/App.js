import React, { useState } from 'react';

import World from './components/Globe';
import Feed from './components/Feed';
import Country from './components/Country'
import UpdateSize from './components/UpdateSize'

const App = () => {
  const [showFeed, setShowFeed] = useState(false)
  const [country, setCountry] = useState('')
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)

  return (
    <>
        <World
          setShowFeed={setShowFeed}
          setCountry={setCountry}
          height={height}
          width={width}
        />
        <Feed
          country={country}
          showFeed={showFeed}
          height={height}
          width={width}
        />
        <Country country={country} showFeed={showFeed}/>
        <UpdateSize setHeight={setHeight} setWidth={setWidth}/>
    </>
  );
};

export default App;