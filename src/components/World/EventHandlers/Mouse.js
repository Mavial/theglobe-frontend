import {autoRotateDisable, autoRotateTimeout} from "../Methods/Rotate";
import {moveTheGlobe} from "../Methods/MoveGlobe";
import {calcActualClick} from "../Methods/Calculations";

  //////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// MOUSE HANDLING /////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////

export const onMouseDown = (setCountryTimeoutID, setOnMouseDownCountry, hoveredCountry, globeEl, setOnMouseDownPos) => {
  // console.log('mouse down')
  clearTimeout(setCountryTimeoutID);
  setOnMouseDownCountry(hoveredCountry)
  autoRotateDisable(globeEl);
  var x = globeEl.current.camera().position.x
  var y = globeEl.current.camera().position.y
  var z = globeEl.current.camera().position.z
  setOnMouseDownPos({x: x, y: y, z: z})
}


export const onMouseUp = (onMouseDownPos, globeEl, onMouseDownCountry, setCountry, setShowFeed, showFeed, globeTranslateY, countries, hover, autoRotateTimeoutNum, setCountryTimeoutID, clickAccuracy) => {
  var actualClick = false;

  var x1 = onMouseDownPos.x;
  var y1 = onMouseDownPos.y;
  var z1 = onMouseDownPos.z;
  var x2 = globeEl.current.camera().position.x
  var y2 = globeEl.current.camera().position.y
  var z2 = globeEl.current.camera().position.z

  actualClick = calcActualClick([x1,y1,z1], [x2,y2,z2], clickAccuracy) ? true : false;
  // console.log('Actual click is: ' + actualClick)
  if (onMouseDownCountry && actualClick){
    autoRotateDisable(globeEl);
    setCountry(onMouseDownCountry);
    setShowFeed(true);
    moveTheGlobe(true, onMouseDownCountry, globeEl, showFeed, globeTranslateY, countries)
  } else {
    autoRotateTimeout(globeEl, showFeed, hover, autoRotateTimeoutNum);
    setCountryTimeoutID = setTimeout(() => {
      setCountry(false);
    }, 2000);
    setShowFeed(false);
    moveTheGlobe(false, null, globeEl, showFeed, globeTranslateY, countries)
  }
  globeEl.current.controls().enabled = true;
};


export const onHover = (country, setHover, globeEl, showFeed, hover, autoRotateTimeoutNum, setHoveredCountry) => {
  setHoveredCountry(country);
    if (country) {
      autoRotateDisable(globeEl);
      // console.log(`hovered true, showFeed ${showFeed}`);
      setHover(true);
    } else {
      autoRotateTimeout(globeEl, showFeed, hover, autoRotateTimeoutNum);
      // console.log(`hovered true, showFeed ${showFeed}`);
      setHover(false);
    }
};