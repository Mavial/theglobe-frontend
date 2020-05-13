export const roundPos = axis => {
    return (Math.round(axis * 1e3) / 1e3);
}

export const calcActualClick = (array1, array2, accuracy) => {
    var i;
    var calc = true;
    for (i = 0; i < 3; i++) {
        calc = (calc && Math.abs(array1[i] - array2[i]) < accuracy)
    }
    return calc
}

export function getCountryLocation(name, countries) {
    const match = countries.features.find(element => element.properties.name === name)
    if (match) {return {lat: match.properties.latitude, lng:  match.properties.longitude}} else {return false}
  };