import React from 'react';
import '../../css/Country.css';

const Country = ({country, showFeed}) => {

    return(
        <div className={`
            d-flex justify-content-center
            `}>
            <div className={`
            text-center
            country-sign-container
            border-bottom border-dark
            ${showFeed ? 'country-show' : 'country-hide'}
            `}>
                <p>{country ? country.properties.name : ''}</p>
            </div>
        </div>
    )
};

export default Country;