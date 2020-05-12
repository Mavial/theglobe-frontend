import {autoRotateDisable, autoRotateTimeout} from "../Methods/Rotate";
import {moveTheGlobe} from "../Methods/MoveGlobe";
import {calcActualClick} from "../Methods/Calculations";

  //////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// TOUCH HANDLING /////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////


export const onTouchStart = (globeEl, setCountryTimeoutID, setOnTouchStartPos) => {
  // console.log('touch start')
  clearTimeout(setCountryTimeoutID);
  autoRotateDisable(globeEl);
  var x = globeEl.current.camera().position.x
  var y = globeEl.current.camera().position.y
  var z = globeEl.current.camera().position.z
  setOnTouchStartPos({x: x, y: y, z: z})
}


export const onTouchEnd = (globeEl, onTouchStartPos, showFeed, hover, autoRotateTimeoutNum, countries, globeTranslateY, setCountry, setShowFeed, setTouch, clickAccuracy, setCountryTimeoutID) => {
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
      setCountryTimeoutID = setTimeout(() => {
        setCountry(false);
      }, 2000);
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
  }
}


export const onTouchHover = (country, touch, setHoveredCountry, globeEl, setCountryAlert, setHover, setOnTouchStartPos) => {
  if (country && touch) {
    setHoveredCountry(country);
    autoRotateDisable(globeEl);
    setCountryAlert(true);
    // console.log(`hovered true, touch true`);
    setHover(true);
  } else {
    setHoveredCountry(false);
    setCountryAlert(false);
    // console.log(`hovered false, touch false`);
    setHover(false);
  }
  setOnTouchStartPos(false)
};