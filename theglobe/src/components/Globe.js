import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import TWEEN from '@tweenjs/tween.js';

import globeImage from '../assets/globe/11433.jpg';
import bumpImage from '../assets/globe/elev_bump_4k_enh.jpg'; // '//unpkg.com/three-globe/example/img/earth-topology.png'
import backgroundImage from '../assets/globe/starfield.png';
import specularImage from '../assets/globe/wateretopo.png';
import geoJson from '../datasets/countries.geojson';

const World = ({setShowFeed, setCountry}) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [hover, setHover] = useState(false)
  const [click, setClick] = useState(false)
  const [selected, setSlected] = useState()
  console.log(globeEl)

  useMemo(() => {
    // load data
    fetch(geoJson).then(res => res.json())
      .then(countries=> {
        setCountries(countries);
      });
  }, []);

  useEffect(() => {
    globeEl.current.controls().autoRotateSpeed = 0.03;
  }, []);

  useEffect(() => {
    // Get location by IP address from backend
    // globeEl.current.pointOfView({ altitude: 4 }, 4000);
  }, []);
  useEffect(() => {
    const controls = globeEl.current.controls();
    setTimeout(() => controls.maxDistance = 600);
    controls.minDistance = 150;
    // controls.dynamicDampingFactor = 0.3
    // controls.rotateSpeed=0.5;
  }, []);
  useEffect(() => {
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize(){
      setTimeout(() => {
        var dpr = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;

        var w =  window.innerWidth;
        var h = window.innerHeight;


        var renderer = globeEl.current.renderer();
        var camera = globeEl.current.camera();
        // renderer.domElement.originalSize = { width: w, height: h};
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setPixelRatio( dpr );
        renderer.setSize( w, h );
      });
    }
  }, []);
  useEffect(() => {
    // custom globe material
    const globeMaterial = globeEl.current.globeMaterial();
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load(specularImage, texture => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color('grey');
      globeMaterial.shininess = 15;
    });
  }, []);

  useEffect(() => {
    globeEl.current.controls().autoRotate = (click || hover) ? false : true;
  }, [click, hover])

  const onHover = country => {
    setSlected(country)
    if (country) {
      setHover(true)
    } else {
      setHover(false)
    }
  };

  function translateGlobePos(obj) {
    if (obj !== false) {
      console.log('translating Globe now')
      const from = obj.from
      const to = obj.to
      var current_position = from.y

      new TWEEN.Tween(from)
            .to(to, 2000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(y => translate(y.y))
            .start()

      const translate = y => {
        globeEl.current.scene().translateY(y - current_position);
        current_position = y;
      }
    }
  };

  // TODO Rotation to Country
  // TODO translateY with Tween for a smooth translation
  const onClick = () => {
    if (selected){
      setCountry(selected)
      setShowFeed(true);
      setClick(true)
      // setRotate(false);
      if (selected.properties.name === 'Germany') {
        globeEl.current.pointOfView({ lat: 51, lng: 10, altitude: 10 }, 2000);
      }

      // var start = null;

      // function step(timestamp) {
      //   if (!start) start = timestamp;
      //   var progress = timestamp - start;
      //   globeEl.current.scene().translateY(1);
      //   if (progress < 2000) {
      //     window.requestAnimationFrame(step);
      //   }
      // }
      // window.requestAnimationFrame(step);
      translateGlobePos(click ? false : {from: {y: 0}, to: {y: 100}})
      // globeEl.current.scene().translateY(click ? 0 : 100);
    } else {
      translateGlobePos(click ? {from: {y: 100}, to: {y: 0}} : false)
      setShowFeed(false);
      setClick(false);
    }
  };
  return (
    <>
    <div onClick={onClick}>
      <Globe
        ref={globeEl}
        waitForGlobeReady={true}
        globeImageUrl= {globeImage}
        backgroundImageUrl={backgroundImage}
        bumpImageUrl= {bumpImage}
        polygonsData={countries.features}
        polygonAltitude={0.06}
        polygonCapColor={() => 'rgba(52, 152, 219, 0.5)'}
        polygonSideColor={() =>'rgba(52, 152, 219, 0.5)'}
        polygonStrokeColor={() => 'rgba(250, 250, 250, 1)'}
        onPolygonHover={d => onHover(d)}
        polygonLabel={() => `
        <b>${selected ?selected.properties.name: ''}</b>
        `}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
    </>
  );
};

export default World;