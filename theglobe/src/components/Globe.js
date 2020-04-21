import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import TWEEN from '@tweenjs/tween.js';

import globeImage from '../assets/globe/11433.jpg';
import bumpImage from '../assets/globe/elev_bump_4k_enh.jpg'; // '//unpkg.com/three-globe/example/img/earth-topology.png'
import backgroundImage from '../assets/globe/starfield.png';
import specularImage from '../assets/globe/wateretopo.png';
import geoJson from '../datasets/countries.geojson';
import countriesLocationJson from '../datasets/countries_location.json';

const World = ({setShowFeed, setCountry, width, height}) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [countriesLocation, setCountriesLocation] = useState()
  const [hover, setHover] = useState(false)
  const [click, setClick] = useState(false)
  const [selected, setSlected] = useState()

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
    globeEl.current.controls().autoRotateSpeed = 0.03;
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
    // controls.rotateSpeed=0.5;
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
    new THREE.TextureLoader().load(specularImage, texture => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color('grey');
      globeMaterial.shininess = 15;
    });
  }, []);

  useEffect(() => {
    globeEl.current.controls().autoRotate = (click || hover) ? false : true;
    globeEl.current.controls().enabled = (click || hover) ? false : true;
  }, [click, hover])

  const onHover = country => {
    setSlected(country)
    if (country) {
      globeEl.current.controls().enabled = false;
      setHover(true)
    } else {
      setHover(false)
    }
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
    console.log(globeEl.current.scene().position)
  };

  function getCountryLocation(name) {
    const match = countriesLocation.find(element => element.name === name)
    if (match) {return {lat: match.latitude, lng:  match.longitude}} else {return false}
  };

  // TODO Rotation to Country
  // TODO translateY with Tween for a smooth translation
  const onClick = () => {
    if (selected){
      setCountry(selected)
      setShowFeed(true);
      setClick(true)
      const countryLocation = getCountryLocation(selected.properties.name)
      translateGlobePos(click ? countryLocation ? {positionOnly: true, lat: countryLocation.lat, lng: countryLocation.lng} : false : {from: {y: 0}, to: {y: 200}, lat: countryLocation.lat, lng: countryLocation.lng})
      globeEl.current.controls().enableRotate = false;
    } else {
      setCountry(false)
      translateGlobePos(click ? {from: {y: 200}, to: {y: 0}} : false)
      globeEl.current.controls().enableRotate = true;
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
        polygonCapColor={d => d === selected ? 'rgba(52, 152, 219, 1)' : 'rgba(52, 152, 219, 0.4)'}
        polygonSideColor={() =>'rgba(52, 152, 219, 0.0)'}
        polygonStrokeColor={() => 'rgba(250, 250, 250, 1)'}
        onPolygonHover={d => onHover(d)}
        polygonLabel={() => `
        <b>${selected ? selected.properties.name: ''}</b>
        `}
        width={width}
        height={height}
      />
    </div>
    </>
  );
};

export default World;