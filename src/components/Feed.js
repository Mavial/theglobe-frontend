import React, { useState } from 'react';
import '../Feed.css';
import Article from './Article';
import Country from './Country'

const Feed = ({country, showFeed}) => {

    const [btn1clicked, setBtn1Clicked] = useState(true)
    const [btn2clicked, setBtn2Clicked] = useState(false)
    const [btn1hover, setBtn1Hover] = useState(false)
    const [btn2hover, setBtn2Hover] = useState(false)

    const clicked1 = () => {
        setBtn1Clicked(true)
        setBtn2Clicked(false)
    }
    const clicked2 = () => {
        setBtn2Clicked(true)
        setBtn1Clicked(false)
    }

    return(
        <>
        <div className="d-flex justify-content-center">
        <div
            style={{border: '1px solid black'}}
            className={`
                sm-feed feed rounded mb-0
                ${showFeed ? 'show' : 'hide'}
            `}
        >
            <Country country={country} showFeed={showFeed}/>
            <div className="button-container">
                <button
                    onMouseEnter={() => setBtn1Hover(true)}
                    onMouseLeave={() => setBtn1Hover(false)}
                    onClick={() => clicked1()}
                    style={{backgroundColor: `${btn1clicked ? 'rgb(167, 167, 167)' : 'white'}`}}
                    className={`
                        border border-left-0 border-dark feed-button
                        ${btn1hover ? 'feed-button-hover' : 'feed-button-nohover'}
                        ${btn1clicked ? 'border-right' : 'border-right-0'}
                    `}
                >
                    HOT
                </button>
                <button
                    onMouseEnter={() => setBtn2Hover(true)}
                    onMouseLeave={() => setBtn2Hover(false)}
                    onClick={() => clicked2()}
                    style={{backgroundColor: `${btn2clicked ? 'rgb(167, 167, 167)' : 'white'}`}}
                    className={`
                        border border-right-0 border-dark feed-button
                        ${btn2hover ? 'feed-button-hover' : 'feed-button-nohover'}
                        ${btn2clicked ? 'border-left' : 'border-left-0'}
                    `}
                >
                    NEW
                </button>
            </div>
            <div className="overflow-auto article-outer-container d-flex justify-content-center">
                {/* Get articles with API */}
                {btn1clicked ?
                    <div className="article-inner-container">
                        <Article country={country}/>
                        <Article country={country}/>
                        <Article country={country}/>
                        <Article country={country}/>
                    </div>
                : btn2clicked ?
                    <div className="article-inner-container">
                        <Article country={country}/>
                        <Article country={country}/>
                    </div>
                : ''}
            </div>
        </div>
        </div>
        </>
    )
};

export default Feed;