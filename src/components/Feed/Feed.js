import React, { useState, useRef, useEffect } from 'react';
import '../../css/Feed.css';
import Article from './Article';
import Country from './Country'

const Feed = ({country, previewFeed, showFeed}) => {

    const [btn1clicked, setBtn1Clicked] = useState(true)
    const [btn2clicked, setBtn2Clicked] = useState(false)
    const [btn1hover, setBtn1Hover] = useState(false)
    const [btn2hover, setBtn2Hover] = useState(false)
    const [hotList, setHotList] = useState([])

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

    const newList = [
        {
            title: "pellentesque habitant morbi tristique senectus et",
            description: "odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel",
            publisher: "cnn.de"
        },
        {
            title: "pellentesque habitant morbi tristique senectus et",
            description: "odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel",
            publisher: "cnn.de"
        }
    ];

    return(
        <>
        <div className="d-flex justify-content-center">
        <div
            className={`
                sm-feed feed rounded mb-0
                ${showFeed ? 'show' : 'hide'}
                ${!showFeed ? previewFeed ? 'preview' : '' : ''}
            `}
        >
            <Country country={country}/>
            <div className="button-container">
                <button
                    onMouseEnter={() => setBtn1Hover(true)}
                    onMouseLeave={() => setBtn1Hover(false)}
                    onClick={() => clicked1()}
                    style={{backgroundColor: `${btn1clicked ? '#555' : 'white'}`, color: `${btn1clicked ? 'white' : '#555'}`}}
                    className={`
                        border border-bottom-0 border-left-0 border-right-0 border-dark feed-button
                        ${btn1hover ? 'feed-button-hover' : 'feed-button-nohover'}

                    `}
                >
                    HOT
                </button>
                <button
                    onMouseEnter={() => setBtn2Hover(true)}
                    onMouseLeave={() => setBtn2Hover(false)}
                    onClick={() => clicked2()}
                    style={{backgroundColor: `${btn2clicked ? '#555' : 'white'}`, color: `${btn2clicked ? 'white' : '#555'}`}}
                    className={`
                        border border-bottom-0 border-left-0 border-right-0 border-dark feed-button
                        ${btn2hover ? 'feed-button-hover' : 'feed-button-nohover'}

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