import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TextureLoader, Color } from 'three';
import Globe from 'react-globe.gl';
import TWEEN from '@tweenjs/tween.js';

import geoJson from '../datasets/countries.geojson';
import countriesLocationJson from '../datasets/countries_location.json';

import globeImage from '../assets/globe/texture_1k.jpg';
import bumpImage from '../assets/globe/bumpMap_1k.jpg'; // '//unpkg.com/three-globe/example/img/earth-topology.png'
import backgroundImage from '../assets/globe/starfield_4k.png';
import specularImage from '../assets/globe/specularMap_1k.jpg';



const autoRotateTimeoutNum = 30; // in s
const globeTranslateY = 230; // If the feed pops up how high the scene should be moved on the y-axis
const clickAccuracy = 0.8; // How accuarte clicks should be (to differenciate between globe interaction and clicking on a country.)

var setCountryTimeoutID = null;
var autoRotateTimeoutID = null;

const World = ({setShowFeed, setCountry, country, width, height}) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [countriesLocation, setCountriesLocation] = useState()
  const [hover, setHover] = useState(false)
  const [click, setClick] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState()
  const [onMouseDownCountry, setOnMouseDownCountry] = useState()
  const [onMouseDownPos, setOnMouseDownPos] = useState()

  useMemo(() => {
    // load polygon data
    fetch(geoJson).then(res => res.json())
      .then(countries => {
        setCountries(countries);
      });
  }, []);

  useMemo(() => {
    setCountriesLocation(countriesLocationJson)
    console.log(countriesLocationJson)
  }, []);

  useEffect(() => {
    // Get location by IP address from backend
    // globeEl.current.pointOfView({ altitude: 4 }, 4000);
  }, []);
  useEffect(() => {
    const controls = globeEl.current.controls();
    setTimeout(() => controls.maxDistance = 800);
    controls.minDistance = 150;
    // controls.dynamicDampingFactor = 0.3
    controls.autoRotateSpeed = 0.03;
  }, []);

  useEffect(() => {
    var renderer = globeEl.current.renderer();
    // var camera = globeEl.current.camera();

    // var w = width;
    // var h = height;
    var dpr = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

    // camera.aspect = w / h;
    // camera.updateProjectionMatrix();

    renderer.setPixelRatio( dpr );
    // renderer.setSize( w, h );

  }, [height, width])

  useEffect(() => {
    // custom globe material
    const globeMaterial = globeEl.current.globeMaterial();
    globeMaterial.bumpScale = 10;
    new TextureLoader().load(specularImage, texture => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new Color('grey');
      globeMaterial.shininess = 15;
    });
  }, []);

  const autoRotateTimeout = () => {
    console.log('autoRotate: timeout set')
    globeEl.current.controls().autoRotate = false;
    autoRotateTimeoutID = setTimeout(() => {
      console.log('autoRotate: click=' + click + ' hover=' + hover)
      globeEl.current.controls().autoRotate = (click || hover) ? false : true;
    }, (autoRotateTimeoutNum * 1000))
  };

  const autoRotateDisable = () => {
    console.log('autoRotate : disabled')
    clearTimeout(autoRotateTimeoutID)
    globeEl.current.controls().autoRotate = false
  };

  function translateGlobePos(obj) {
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

  function getCountryLocation(name) {
    const match = countriesLocation.find(element => element.name === name)
    if (match) {return {lat: match.latitude, lng:  match.longitude}} else {return false}
  };

  const onHover = country => {
    setHoveredCountry(country);
    if (country) {
      autoRotateDisable();
      console.log('hovered true');
      setHover(true);
    } else {
      autoRotateTimeout();
      console.log('hovered false');
      setHover(false);
    }
  };

  const roundPos = axis => {
    return (Math.round(axis * 1e3) / 1e3);
  }

  const calcActualClick = (axis1, axis2) => {
    return Math.abs(axis1 - axis2) < clickAccuracy
  }

  // TODO Rotation to Country
  // TODO translateY with Tween for a smooth translation
  const onClick = () => {
    var actualClick = false;

    var x2 = roundPos(globeEl.current.camera().position.x);
    var y2 = roundPos(globeEl.current.camera().position.y);
    var z2 = roundPos(globeEl.current.camera().position.z);
    var x1 = onMouseDownPos.x;
    var y1 = onMouseDownPos.y;
    var z1 = onMouseDownPos.z;

    actualClick = (calcActualClick(x1, x2) && calcActualClick(y1, y2) && calcActualClick(z1, z2) ? true : false);

    console.log('Actual click is: ' + actualClick)

    if (onMouseDownCountry && actualClick){
      autoRotateDisable();
      setCountry(onMouseDownCountry);
      setShowFeed(true);
      setClick(true);
      const countryLocation = getCountryLocation(onMouseDownCountry.properties.name);
      translateGlobePos(click ? countryLocation ? {positionOnly: true, lat: countryLocation.lat, lng: countryLocation.lng} : false : {from: {y: 0}, to: {y: globeTranslateY}, lat: countryLocation.lat, lng: countryLocation.lng});
    } else {
      autoRotateTimeout();
      setCountryTimeoutID = setTimeout(() => {
        setCountry(false);
      }, 2000);
      translateGlobePos(click ? {from: {y: globeTranslateY}, to: {y: 0}} : false);
      setShowFeed(false);
      setClick(false);
    }
  };

  const onMouseDown = () => {
    console.log('mouse down')
    clearTimeout(setCountryTimeoutID);
    setOnMouseDownCountry(hoveredCountry)
    autoRotateDisable();
    var x = Math.round( globeEl.current.camera().position.x * 1e3 ) / 1e3;
    var y = Math.round( globeEl.current.camera().position.y * 1e3 ) / 1e3;
    var z = Math.round( globeEl.current.camera().position.z * 1e3 ) / 1e3;
    setOnMouseDownPos({x: x, y: y, z: z})
  }

  return (
    <>
    <div onClick={onClick} onMouseDown={onMouseDown}>
      <Globe
        ref={globeEl}
        waitForGlobeReady={true}
        globeImageUrl= {globeImage}
        backgroundImageUrl={backgroundImage}
        bumpImageUrl= {bumpImage}
        polygonsData={countries.features}
        polygonAltitude={d => (d === country && click) ? 0.8 : 0.06}
        polygonCapColor={d => (d === hoveredCountry || (d === country && click)) ? 'rgba(52, 152, 219, 1)' : 'rgba(52, 152, 219, 0.4)'}
        polygonSideColor={() =>'rgba(52, 152, 219, 0.0)'}
        polygonStrokeColor={() => 'rgba(250, 250, 250, 1)'}
        onPolygonHover={d => onHover(d)}
        polygonLabel={() => `
        <b>${hoveredCountry ? hoveredCountry.properties.name: ''}</b>
        `}
        width={width}
        height={height}
      />
    </div>
    </>
  );
};

export default World;