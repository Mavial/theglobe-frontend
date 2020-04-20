import React from 'react';
import '../Country.css';

const Country = ({country, showFeed}) => {


    return(
        <div className={`
            d-flex justify-content-center border border-top-0 border-dark
            ${showFeed ? 'block' : 'none'}
            `}>
            <div className="text-center country-sign-container">
                <h2>{country ? country.properties.name : ''}</h2>
            </div>
        </div>
    )
};

export default Country;