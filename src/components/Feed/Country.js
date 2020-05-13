import React from 'react';
import '../../css/Country.css';

const Country = ({country}) => {

    return(
        <>
        <div className={`
            d-flex justify-content-center
            `}>
            <div className={`
            text-center
            country-sign-container
            border-bottom border-dark
            `}>
                <div>
                    <p>{country ? country.properties.name : ''}</p>
                </div>
            </div>
        </div>
        </>
    )
};

export default Country;