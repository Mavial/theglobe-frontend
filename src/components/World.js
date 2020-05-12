import React, { useEffect, useRef, useState, useMemo} from 'react';
import { TextureLoader, Color } from 'three';
import Globe from 'react-globe.gl';
import TWEEN from '@tweenjs/tween.js';
import SweetAlert from 'react-bootstrap-sweetalert';
import geoJson from '../datasets/merged_countries_data.geojson';

import globeImage from '../assets/globe/texture_4k.jpg';
import bumpImage from '../assets/globe/bumpMap_4k.jpg'; // '//unpkg.com/three-globe/example/img/earth-topology.png'
import backgroundImage from '../assets/globe/starfield_4k.png';
import specularImage from '../assets/globe/specularMap_4k.jpg';

import {isMobile, isDesktop} from "react-device-detect";

const autoRotateTimeoutNum = 30; // in s
const globeTranslateY = 230; // If the feed pops up how high the scene should be moved on the y-axis
const clickAccuracy = 0.8; // How accuarte clicks should be (to differenciate between globe interaction and clicking on a country.)

var setCountryTimeoutID = null;
var autoRotateTimeoutID = null;

const World = ({setShowFeed, showFeed, setCountry, country, width, height}) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [hover, setHover] = useState(false)
  const [touch, setTouch] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState()
  const [onMouseDownCountry, setOnMouseDownCountry] = useState()
  const [onMouseDownPos, setOnMouseDownPos] = useState()
  const [onTouchStartPos, setOnTouchStartPos] = useState()
  const [countryAlert, setCountryAlert] = useState(false)
  const [manuelMobile, setManuelMobile] = useState(false)
  const [touchAlert, setTouchAlert] = useState(false)
  const [touchAlertDisable, setTouchAlertDisable] = useState(false)
  const [manuelDesktop, setManuelDesktop] = useState(false)
  const [clickAlert, setClickAlert] = useState(false)
  const [clickAlertDisable, setClickAlertDisable] = useState(false)

  useMemo(() => {
    // load polygon data
    fetch(geoJson).then(res => res.json())
      .then(countries => {
        setCountries(countries);
      });
  }, []);

  useEffect(() => {
    // Get location by IP address from backend
    // globeEl.current.pointOfView({ altitude: 4 }, 4000);
  }, []);
  useEffect(() => {
    const controls = globeEl.current.controls();
    setTimeout(() => {
      controls.maxDistance = 800;
    });
    controls.minDistance = 150;
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
    clearTimeout(autoRotateTimeoutID)
    // console.log('autoRotate: timeout set')
    globeEl.current.controls().autoRotate = false;
    autoRotateTimeoutID = setTimeout(() => {
      console.log('autoRotate: showFeed=' + showFeed + ' hover=' + hover)
      globeEl.current.controls().autoRotate = (showFeed || hover) ? false : true;
    }, (autoRotateTimeoutNum * 1000))
  };

  const autoRotateDisable = () => {
    // console.log('autoRotate : disabled')
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
    const match = countries.features.find(element => element.properties.name === name)
    if (match) {return {lat: match.properties.latitude, lng:  match.properties.longitude}} else {return false}
  };

  const onHover = country => {
    setHoveredCountry(country);
      if (country) {
        autoRotateDisable();
        console.log(`hovered true, showFeed ${showFeed}`);
        setHover(true);
      } else {
        autoRotateTimeout();
        console.log(`hovered true, showFeed ${showFeed}`);
        setHover(false);
      }
  };

  const onTouchHover = country => {
      if (country && touch) {
        setHoveredCountry(country);
        autoRotateDisable();
        setCountryAlert(true);
        console.log(`hovered true, touch true`);
        setHover(true);
      } else {
        setHoveredCountry(false);
        setCountryAlert(false);
        console.log(`hovered false, touch false`);
        setHover(false);
      }
      setOnTouchStartPos(false)
  };

  const roundPos = axis => {
    return (Math.round(axis * 1e3) / 1e3);
  }

  const calcActualClick = (axis1, axis2) => {
    return Math.abs(axis1 - axis2) < clickAccuracy
  }

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

  // TODO Rotation to Country
  // TODO translateY with Tween for a smooth translation
  const onMouseUp = () => {
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
      moveIt(true, onMouseDownCountry)
    } else {
      autoRotateTimeout();
      setCountryTimeoutID = setTimeout(() => {
        setCountry(false);
      }, 2000);
      setShowFeed(false);
      moveIt(false)
    }
  };

  function moveIt(boolean, selCountry) {
    if (boolean) {
      const countryLocation = getCountryLocation(selCountry.properties.name);
      translateGlobePos((showFeed) ? countryLocation ? {positionOnly: true, lat: countryLocation.lat, lng: countryLocation.lng} : false : {from: {y: 0}, to: {y: globeTranslateY}, lat: countryLocation.lat, lng: countryLocation.lng});
    } else {
      translateGlobePos((showFeed) ? {from: {y: globeTranslateY}, to: {y: 0}} : false);
    }
  }
  const onTouchStart = () => {
    // console.log('touch start')
    clearTimeout(setCountryTimeoutID);
    autoRotateDisable();
    var x = Math.round( globeEl.current.camera().position.x * 1e3 ) / 1e3;
    var y = Math.round( globeEl.current.camera().position.y * 1e3 ) / 1e3;
    var z = Math.round( globeEl.current.camera().position.z * 1e3 ) / 1e3;
    setOnTouchStartPos({x: x, y: y, z: z})
  }

  const onTouchEnd = () => {
    var actualTouch = false;

    var x2 = roundPos(globeEl.current.camera().position.x);
    var y2 = roundPos(globeEl.current.camera().position.y);
    var z2 = roundPos(globeEl.current.camera().position.z);
    var x1 = onTouchStartPos.x;
    var y1 = onTouchStartPos.y;
    var z1 = onTouchStartPos.z;

    actualTouch = (calcActualClick(x1, x2) && calcActualClick(y1, y2) && calcActualClick(z1, z2) ? true : false);

    console.log('Actual touch is: ' + actualTouch)

    if (actualTouch){
      if (showFeed) {
        autoRotateTimeout();
        setCountryTimeoutID = setTimeout(() => {
          setCountry(false);
        }, 2000);
        setShowFeed(false);
        moveIt(false)
        globeEl.current.controls().enabled = true;
        setTouch(false)
      } else {
        autoRotateTimeout();
        setTouch(true)
      }
    } else {
      autoRotateTimeout();
      setTouch(false);
    }
  }
  function onFeedConfirm(){
    console.log('confirm')
    setCountryAlert(false)
    autoRotateDisable();
    globeEl.current.controls().enabled = false;
    setCountry(hoveredCountry);
    setShowFeed(true);
    moveIt(true, hoveredCountry)
  }
  function onFeedCancel(){
    console.log('cancel')
    setCountryAlert(false)
    setTouch(false)
  }

  return (
    <>
      {(countryAlert && !manuelDesktop) ?
        <SweetAlert
        title={`${hoveredCountry ? hoveredCountry.properties.name : ""}`}
        showCancel
        confirmBtnText="Yes"
        cancelBtnText="No"
        onConfirm={() => onFeedConfirm()}
        onCancel={() => onFeedCancel()}
        >
          <span>Do you want to open the Feed?</span>
        </SweetAlert>
        : ""
      }
      {touchAlert ?
        <SweetAlert
          warning
          title="Are you using Touch?"
          showCancel
          confirmBtnText="Yes"
          cancelBtnText="No"
          onConfirm={() => {setClickAlertDisable(false); setManuelDesktop(false); setManuelMobile(true); setTouchAlert(false)}}
          onCancel={() => {setTouchAlertDisable(true); setTouchAlert(false)}}
        />
        :
        ""
      }
      {clickAlert ?
        <SweetAlert
          warning
          title="Are you using a Mouse?"
          showCancel
          confirmBtnText="Yes"
          cancelBtnText="No"
          onConfirm={() => {setTouchAlertDisable(false); setCountryAlert(false); setManuelMobile(false); setManuelDesktop(true); setClickAlert(false)}}
          onCancel={() => {setCountryAlert(false); setClickAlertDisable(true); setClickAlert(false)}}
        />
        :
        ""
      }
      {
        (isMobile || manuelMobile) && !(isDesktop || manuelDesktop) ?
        <div onTouchStart={() => onTouchStart()} onTouchEnd={() => onTouchEnd()} onMouseUp={() => clickAlertDisable ? null : onTouchStartPos ? null : setClickAlert(true)}>
          <Globe
            ref={globeEl}
            waitForGlobeReady={true}
            globeImageUrl= {globeImage}
            backgroundImageUrl={backgroundImage}
            bumpImageUrl= {bumpImage}
            polygonsData={countries.features}
            polygonAltitude={d => (d === country && showFeed) ? 0.8 : 0.06}
            polygonCapColor={d => (d === country && showFeed) ? 'rgba(52, 152, 219, 1)' : 'rgba(52, 152, 219, 0.4)'}
            polygonSideColor={() =>'rgba(52, 152, 219, 0.0)'}
            polygonStrokeColor={() => 'rgba(250, 250, 250, 1)'}
            onPolygonHover={d => (!showFeed && touch) ? onTouchHover(d) : null}
            onPolygonClick={() => (!showFeed && touch && hoveredCountry) ? setCountryAlert(true) : null}
            width={width}
            height={height}
          />
        </div>
        :
        <div onMouseUp={() => onMouseUp()} onMouseDown={() => onMouseDown()} onTouchStart={() => touchAlertDisable ? null : setTouchAlert(true)}>
          <Globe
            ref={globeEl}
            waitForGlobeReady={true}
            globeImageUrl= {globeImage}
            backgroundImageUrl={backgroundImage}
            bumpImageUrl= {bumpImage}
            polygonsData={countries.features}
            polygonAltitude={d => (d === country && showFeed) ? 0.8 : 0.06}
            polygonCapColor={d => (d === hoveredCountry || (d === country && showFeed)) ? 'rgba(52, 152, 219, 1)' : 'rgba(52, 152, 219, 0.4)'}
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
      }
    </>
  );
};

export default World;