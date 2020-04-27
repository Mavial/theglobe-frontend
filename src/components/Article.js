import React, {} from 'react';
import { MDBCol, MDBRow } from 'mdbreact';
import ClampLines from 'react-clamp-lines';
import testPicture from '../assets/test-picture.jpg';

import '../Article.css';

const Article = ({country}) => {

    return(

        <MDBRow center className=" article no-gutters">
            <MDBCol size={window.innerWidth >= 576 ? "auto" : "4"} className="">
                <div className="aspect-ratio-picture">
                    <div className="aspect-ratio-picture-inside"><img src={testPicture} alt="Thumbnail" height="100%"></img></div>
                </div>
            </MDBCol>
            <MDBCol size="7" className="">
                <div className="aspect-ratio-content">
                    <div className="aspect-ratio-content-inside">
                        <div className="headline  font-weight-bolder">
                        <ClampLines
                            text={'Thousands of Israelis protest against Netanyahu, two meters apart'}
                            id="really-unique-id"
                            lines={3}
                            ellipsis="..."
                            className="hide-expand"
                            innerElement="p"
                        />
                        </div>
                        <div className="description">
                        <ClampLines
                            text={'response'}
                            id="really-unique-id2"
                            //lines={window.innerWidth >= 860 ? 1 : 3}
                            lines= {8}
                            ellipsis="..."
                            className="hide-expand"
                            innerElement="p"
                        />
                        </div>
                        <div className="publisher ">
                            <p>cnn.com</p>
                        </div>
                        {/* <MDBRow className="border border-dark">
                            <MDBCol size="4" className="border border-dark publisher">
                                <p>ccn.com</p>
                            </MDBCol>
                            <MDBCol size="4">
                            </MDBCol>
                            <MDBCol size="4">
                            </MDBCol>
                        </MDBRow> */}
                    </div>
                </div>
            </MDBCol>
        </MDBRow>



    )
};

export default Article;