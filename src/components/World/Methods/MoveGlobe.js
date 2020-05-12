import TWEEN from '@tweenjs/tween.js';
import {getCountryLocation} from './Calculations';

function translateGlobePos(obj, globeEl) {
  if (obj !== false) {
    if (obj.positionOnly === true) {
      globeEl.current.pointOfView({lat: obj.lat, lng: obj.lng}, 1400)
    } else {
      console.log('translating Globe now')
      const from = obj.from
      const to = obj.to
      var current_position = from.y

      const altitude = to.y / 10 + 2.5
      globeEl.current.pointOfView({lat: obj.lat, lng: obj.lng, altitude: altitude}, 1400)

      new TWEEN.Tween(from)
            .to(to, 1400)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(y => translate(y.y))
            .start()

      const translate = y => {
        globeEl.current.scene().translateY(y - current_position);
        current_position = y;
      }
    }
  }
};

export function moveTheGlobe(boolean, selCountry, globeEl, showFeed, globeTranslateY, countries) {
  if (boolean) {
    const countryLocation = getCountryLocation(selCountry.properties.name, countries);
    translateGlobePos((showFeed) ? countryLocation ? {positionOnly: true, lat: countryLocation.lat, lng: countryLocation.lng} : false : {from: {y: 0}, to: {y: globeTranslateY}, lat: countryLocation.lat, lng: countryLocation.lng}, globeEl);
  } else {
    translateGlobePos((showFeed) ? {from: {y: globeTranslateY}, to: {y: 0}} : false, globeEl);
  }
}