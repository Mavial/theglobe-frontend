import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import '../Feed.css';

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
        <div
            style={{border: '1px solid black'}}
            className={`
                sm-feed feed
                ${showFeed ? 'isShow' : 'isnotShow'}
            `}
        >
        <MDBContainer fluid>
            {/* <MDBRow>
                <MDBCol size='12'>
                    <h1 className="font-weight-bold">
                        {country ? country.properties.name : ''}
                    </h1>
                </MDBCol>
            </MDBRow> */}
            <MDBRow >
                <MDBCol
                    size='6'
                >
                        <MDBRow
                            className={`
                                border border-top-0 border-left-0 border-dark
                                ${btn1clicked ? 'border-right' : 'border-right-0'}
                            `}
                        >
                            <button
                                onMouseEnter={() => setBtn1Hover(true)}
                                onMouseLeave={() => setBtn1Hover(false)}
                                onClick={() => clicked1()}
                                style={{backgroundColor: `${btn1clicked ? 'rgb(167, 167, 167)' : 'white'}`}}
                                className={`
                                    border border-0 feed-button
                                    ${btn1hover ? 'feed-button-hover' : 'feed-button-nohover'}
                                `}
                            >
                                HOT
                            </button>
                        </MDBRow>
                </MDBCol>
                <MDBCol
                    size='6'
                >
                        <MDBRow
                            className={`
                                border border-top-0 border-right-0 border-dark
                                ${btn2clicked ? 'border-left' : 'border-left-0'}
                            `}
                        >
                            <button
                                onMouseEnter={() => setBtn2Hover(true)}
                                onMouseLeave={() => setBtn2Hover(false)}
                                onClick={() => clicked2()}
                                style={{backgroundColor: `${btn2clicked ? 'rgb(167, 167, 167)' : 'white'}`}}
                                className={`
                                    border border-0 feed-button
                                    ${btn2hover ? 'feed-button-hover' : 'feed-button-nohover'}
                                `}
                            >
                                NEW
                            </button>
                        </MDBRow>
                </MDBCol>
            </MDBRow>

            <MDBRow className="overflow-auto article-container" style={{height: 'calc(54vh + 1px)'}}>
                <MDBCol size='12'>
                        Articles
                </MDBCol>
                <MDBCol size='12'>
                        Articles
                </MDBCol>
                <MDBCol size='12'>
                        Articles
                </MDBCol>
                <MDBCol size='12'>
                        Articles
                </MDBCol>
                <MDBCol size='12'>
                        Articles
                </MDBCol>
                <MDBCol size='12'>
                        Articles
                </MDBCol>
                <MDBCol size='12'>
                        Articles
                </MDBCol>
                <MDBCol size='12'>
                        Articles
                </MDBCol>

            </MDBRow>
        </MDBContainer>
        </div>
        </>
    )
};

export default Feed;