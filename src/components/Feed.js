import React, { useState, useRef, useEffect } from 'react';
import '../Feed.css';
import Article from './Article';
import Country from './Country'

const Feed = ({country, showFeed}) => {

    const [btn1clicked, setBtn1Clicked] = useState(true)
    const [btn2clicked, setBtn2Clicked] = useState(false)
    const [btn1hover, setBtn1Hover] = useState(false)
    const [btn2hover, setBtn2Hover] = useState(false)

    const articleContainerRef = useRef(null)

    const clicked1 = () => {
        setBtn1Clicked(true)
        setBtn2Clicked(false)
    }
    const clicked2 = () => {
        setBtn2Clicked(true)
        setBtn1Clicked(false)
    }

    useEffect(() => {
        articleContainerRef.current.scrollTop = 0;
    }, [country, btn1clicked, btn2clicked])

    // Test
    const hotList = [
        {
            title: "This is a test title hello",
            description: "This is a test description and has to be a bit longher the the actual title, because it is how it is.",
            publisher: "heinz.de"
        },
        {
            title: "This is a test ddddddddddddddddtitle hello",
            description: "This is a test daaaadescription and has to be a bit longher the the actual title, because it is how it is.",
            publisher: "heinz.de"
        },
        {
            title: "This is a test titddddddddddddle hello",
            description: "This is a test dddescription and has to be a bit longher the the actual title, because it is how it is.",
            publisher: "heinz.de"
        }
    ];
    const newList = [
        {
            title: "This is the aaaaaaaatest title for new news",
            description: "This is a tesdddt description for new news and has to be a bit longher the the actual title, because it is how it is.",
            publisher: "heinz.de"
        },
        {
            title: "This is thedddddd test title for new news",
            description: "This is a test descripthhhhhion for new news and has to be a bit longher the the actual title, because it is how it is.",
            publisher: "heinz.de"
        }
    ];

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
            <div ref={articleContainerRef} className="overflow-auto article-outer-container d-flex justify-content-center">
                {/* Get articles with API */}
                <div className="article-inner-container">
                    {(btn1clicked ? hotList : newList).map((item, index) => (
                        <Article key={index} item={item} />
                    ))}
                </div>
            </div>
        </div>
        </div>
        </>
    )
};

export default Feed;