import {autoRotateDisable, autoRotateTimeout} from "../Methods/Rotate";
import {moveTheGlobe} from "../Methods/MoveGlobe";
import {calcActualClick} from "../Methods/Calculations";

var setCountryTimeoutID = null;

  //////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// TOUCH HANDLING /////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////


export const onTouchStart = (globeEl, setOnTouchStartPos) => {
  // console.log('touch start')
  clearTimeout(setCountryTimeoutID);
  autoRotateDisable(globeEl);
  var x = globeEl.current.camera().position.x
  var y = globeEl.current.camera().position.y
  var z = globeEl.current.camera().position.z
  setOnTouchStartPos({x: x, y: y, z: z})
}


export const onTouchEnd = (globeEl, onTouchStartPos, showFeed, hover, autoRotateTimeoutNum, countries, globeTranslateY, setCountry, setShowFeed, setTouch, clickAccuracy, setHoveredCountry, setPreviewFeed) => {
  var actualTouch = false;

  var x1 = onTouchStartPos.x;
  var y1 = onTouchStartPos.y;
  var z1 = onTouchStartPos.z;
  var x2 = globeEl.current.camera().position.x
  var y2 = globeEl.current.camera().position.y
  var z2 = globeEl.current.camera().position.z

  actualTouch = calcActualClick([x1,y1,z1], [x2,y2,z2], clickAccuracy) ? true : false;
  // console.log('Actual touch is: ' + actualTouch)
  if (actualTouch){
    if (showFeed) {
      autoRotateTimeout(globeEl, showFeed, hover, autoRotateTimeoutNum);
      // setCountryTimeoutID = setTimeout(() => {
      //   setCountry(false);
      // }, 2000);
      setShowFeed(false);
      moveTheGlobe(false, null, globeEl, showFeed, globeTranslateY, countries)
      globeEl.current.controls().enabled = true;
      setTouch(false)
    } else {
      autoRotateTimeout(globeEl, showFeed, hover, autoRotateTimeoutNum);
      setTouch(true)
    }
  } else {
    autoRotateTimeout(globeEl, showFeed, hover, autoRotateTimeoutNum);
    setTouch(false);
    setHoveredCountry(false)
    setPreviewFeed(false)
  }
}


export const onTouchHover = (country, touch, setHoveredCountry, globeEl, setHover, setOnTouchStartPos, setTouch, setCountry, setPreviewFeed, globeTranslateY, countries) => {
  if (country && touch) {
    setHoveredCountry(country);
    setCountry(country);
    setPreviewFeed(true);
    autoRotateDisable(globeEl);
    // moveTheGlobe(true, country, globeEl, true, globeTranslateY, countries)
    // console.log('hover true')
    // console.log(`hovered true, touch true`);
    setHover(true);
    setTouch(false)
  } else {
    // console.log(`hovered false, touch false`);
    setHover(false);
    setPreviewFeed(false)
    setHoveredCountry(false)
  }
  setTimeout(() => {setOnTouchStartPos(false)});
};