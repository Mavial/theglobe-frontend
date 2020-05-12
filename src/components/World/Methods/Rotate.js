var autoRotateTimeoutID = null;

export const autoRotateTimeout = (globeEl, showFeed, hover, autoRotateTimeoutNum) => {
    clearTimeout(autoRotateTimeoutID)
    // console.log('autoRotate: timeout set')
    globeEl.current.controls().autoRotate = false;
    autoRotateTimeoutID = setTimeout(() => {
        console.log('autoRotate: showFeed=' + showFeed + ' hover=' + hover)
        globeEl.current.controls().autoRotate = (showFeed || hover) ? false : true;
    }, (autoRotateTimeoutNum * 1000))
};

export const autoRotateDisable = (globeEl) => {
    // console.log('autoRotate : disabled')
    clearTimeout(autoRotateTimeoutID)
    globeEl.current.controls().autoRotate = false
};