import { useEffect } from 'react';

const UpdateSize = ({setHeight, setWidth}) => {

    const getWidth = () => window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    const getHeight = () => window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    useEffect(() => {
      // timeoutId for debounce mechanism
      let timeoutId = null;
      const onWindowResize = () => {
        // prevent execution of previous setTimeout
        clearTimeout(timeoutId);
        // change width from the state object after 150 milliseconds
        timeoutId = setTimeout(() => {
          setHeight(getHeight());
          setWidth(getWidth())
        });
      };
      // set resize listener
      window.addEventListener('resize', onWindowResize);

      // clean up function
      return () => {
        // remove resize listener
        window.removeEventListener('resize', onWindowResize);
      }
    }, [setHeight, setWidth])

    return(null)
};

export default UpdateSize;