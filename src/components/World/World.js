import React, { useEffect, useRef, useState, useMemo} from 'react';
import { TextureLoader, Color } from 'three';
import Globe from 'react-globe.gl';
import SweetAlert from 'react-bootstrap-sweetalert';
import geoJson from '../../datasets/merged_countries_data.geojson';

import {moveTheGlobe} from "./Methods/MoveGlobe";
// import {autoRotateTimeout} from "./Methods/Rotate";
import {onTouchStart, onTouchEnd, onTouchHover} from "./EventHandlers/Touch"
import {onMouseDown, onMouseUp, onHover} from "./EventHandlers/Mouse"

import globeImage from '../../assets/globe/texture_4k.jpg';
import bumpImage from '../../assets/globe/bumpMap_4k.jpg'; // '//unpkg.com/three-globe/example/img/earth-topology.png'
import backgroundImage from '../../assets/globe/starfield_4k.png';
import specularImage from '../../assets/globe/specularMap_4k.jpg';

import {isMobile, isDesktop} from "react-device-detect";
import ExpandButton from '../ExpandButton';
import { autoRotateDisable, autoRotateTimeout } from './Methods/Rotate';

const autoRotateTimeoutNum = 30; // in s
const globeTranslateY = 230; // If the feed pops up how high the scene should be moved on the y-axis
const clickAccuracy = 0.8; // How accuarte clicks should be (to differenciate between globe interaction and clicking on a country.)
const minDistance = 120;

const World = ({setShowFeed, showFeed, setPreviewFeed, previewFeed, setCountry, country, width, height, setLoading}) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [hover, setHover] = useState(false)
  const [touch, setTouch] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState()
  const [onMouseDownCountry, setOnMouseDownCountry] = useState()
  const [onMouseDownPos, setOnMouseDownPos] = useState()
  const [onTouchStartPos, setOnTouchStartPos] = useState()
  const [manuelMobile, setManuelMobile] = useState(false)
  const [touchAlert, setTouchAlert] = useState(false)
  const [touchAlertDisable, setTouchAlertDisable] = useState(false)
  const [manuelDesktop, setManuelDesktop] = useState(false)
  const [clickAlert, setClickAlert] = useState(false)
  const [clickInTouchEnv, setClickInTouchEnv] = useState(0)

  useMemo(() => {
    // load polygon data
    fetch(geoJson).then(res => res.json())
      .then(countries => {
        setCountries(countries);
      });
  }, []);

  // useEffect(() => {
  //   // Get location by IP address from backend
  //   // globeEl.current.pointOfView({ altitude: 4 }, 4000);
  // }, []);

  useEffect(() => {
    const controls = globeEl.current.controls();
    setTimeout(() => {
      controls.maxDistance = 800;
    });
    controls.minDistance = minDistance;
    controls.autoRotateSpeed = 0.03;
  }, [manuelMobile, manuelDesktop]);

  useEffect(() => {
    var renderer = globeEl.current.renderer();
    var dpr = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;
    // camera.aspect = w / h;
    // camera.updateProjectionMatrix();
    renderer.setPixelRatio( dpr );
    setTouch(false)
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
  }, [manuelMobile, manuelDesktop]);

  function onExpand() {
    setShowFeed(true);
    setPreviewFeed(false);
    moveTheGlobe(true, hoveredCountry, globeEl, showFeed, globeTranslateY, countries)
    globeEl.current.controls().enabled = false;
    autoRotateDisable(globeEl);
  }
  function onClose() {
    setShowFeed(false);
    setHoveredCountry(false);
    moveTheGlobe(false, null, globeEl, showFeed, globeTranslateY, countries)
    globeEl.current.controls().enabled = true;
    autoRotateTimeout(globeEl, showFeed, hover, autoRotateTimeoutNum);
  }


  // changes regardning switching touch and mouse
  useEffect(() => {
    setClickInTouchEnv(0)
  }, [onTouchStartPos])

  useEffect(() => {
    if (clickInTouchEnv >= 2) {
      setClickAlert(true)
    }
  }, [clickInTouchEnv])

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2100);
    setTimeout(() => {
      setShowFeed(false);
      setPreviewFeed(false);
      setHoveredCountry(false)
    }, 100);
  },[manuelMobile, manuelDesktop, setPreviewFeed, setShowFeed, setLoading, setHoveredCountry])

  return (
    <>
      {touchAlert ?
        <SweetAlert
          warning
          title="Are you using Touch?"
          showCancel
          confirmBtnText="Yes"
          cancelBtnText="No"
          onConfirm={() => {setManuelDesktop(false); setManuelMobile(true); setTouchAlert(false)}}
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
          onConfirm={() => {setTouchAlertDisable(false); setManuelMobile(false); setManuelDesktop(true); setClickAlert(false)}}
          onCancel={() => {setClickAlert(false)}}
        />
        :
        ""
      }
      {
        (isMobile || manuelMobile) && !(isDesktop || manuelDesktop) ?
        <div>
        <ExpandButton onExpand={() => onExpand()} onClose={() => onClose()} previewFeed={previewFeed} showFeed={showFeed}/>
        <div style={{backgroundColor: "black"}}
          onTouchStart={() => onTouchStart(globeEl, setOnTouchStartPos)}
          onTouchEnd={() => onTouchEnd(globeEl, onTouchStartPos, showFeed, hover, autoRotateTimeoutNum, countries, globeTranslateY, setCountry, setShowFeed, setTouch, clickAccuracy, setHoveredCountry, setPreviewFeed)}
          onMouseDown={() => setClickInTouchEnv(clickInTouchEnv + 1)}>
          <Globe
            ref={globeEl}
            waitForGlobeReady={true}
            globeImageUrl= {globeImage}
            backgroundImageUrl={backgroundImage}
            bumpImageUrl= {bumpImage}
            polygonsData={countries.features}
            polygonAltitude={d => 0.06}
            polygonCapColor={d => (d === hoveredCountry || (d === country && showFeed)) ? 'rgba(52, 152, 219, 1)' : 'rgba(52, 152, 219, 0.2)'}
            polygonSideColor={() =>'rgba(52, 152, 219, 0)'}
            polygonStrokeColor={() => 'rgba(250, 250, 250, 1)'}
            onPolygonHover={d => (!showFeed && !globeEl.current.controls().autoRotate && touch) ? onTouchHover(d, touch, setHoveredCountry, globeEl, setHover, setOnTouchStartPos, setTouch, setCountry, setPreviewFeed, globeTranslateY, countries) : null}
            // onPolygonClick={() => (!showFeed && touch && hoveredCountry) ? setPreviewFeed(true) : null}
            width={width}
            height={height}
          />
        </div>
        </div>
        :
        <div style={{backgroundColor: "black"}}
          onMouseDown={() => onMouseDown(setOnMouseDownCountry, hoveredCountry, globeEl, setOnMouseDownPos)}
          onMouseUp={() => onMouseUp(onMouseDownPos, globeEl, onMouseDownCountry, setCountry, setShowFeed, showFeed, globeTranslateY, countries, hover, autoRotateTimeoutNum, clickAccuracy)}
          onTouchStart={() => touchAlertDisable ? null : setTouchAlert(true)}>
          <Globe
            ref={globeEl}
            waitForGlobeReady={true}
            globeImageUrl= {globeImage}
            backgroundImageUrl={backgroundImage}
            bumpImageUrl= {bumpImage}
            polygonsData={countries.features}
            polygonAltitude={d => (d === country && showFeed) ? 0.8 : 0.06}
            polygonCapColor={d => (d === hoveredCountry || (d === country && showFeed)) ? 'rgba(52, 152, 219, 1)' : 'rgba(52, 152, 219, 0.2)'}
            polygonSideColor={() =>'rgba(250, 250, 250, 0)'}
            polygonStrokeColor={() => 'rgba(250, 250, 250, 1)'}
            onPolygonHover={d => onHover(d, setHover, globeEl, showFeed, hover, autoRotateTimeoutNum, setHoveredCountry)}
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