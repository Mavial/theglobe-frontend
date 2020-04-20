import React, { useState } from 'react';

import World from './components/Globe';
import Feed from './components/Feed';
import Country from './components/Country'

const App = () => {
  const [showFeed, setShowFeed] = useState(false)
  const [country, setCountry] = useState('')

  return (
    <>
        <World
          setShowFeed={setShowFeed}
          setCountry={setCountry}
        />
        <Feed country={country} showFeed={showFeed}/>
        <Country country={country} showFeed={showFeed}/>
    </>
  );
};

export default App;