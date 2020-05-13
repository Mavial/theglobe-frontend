import React from 'react';
import '../css/ExpandButton.css';
import '../css/Country.css';
import {ReactComponent as ExpandIcon} from '../assets/icons/expand-icon2.svg';
import {ReactComponent as CloseIcon} from '../assets/icons/close-icon2.svg'


const ExpandButton = ({onExpand, onClose, previewFeed, showFeed}) => {
    return (
        <>
        {
        <div className="d-flex justify-content-center">
            <div className={`
                expand-button-outer-box rounded mb-0
                ${showFeed ? 'show' : 'hide'}
                ${!showFeed ? previewFeed ? 'preview' : '' : ''}
            `}
            >
                <div className={`
                    d-flex justify-content-center
                `}>
                    <div className={`
                        expand-button-container
                    `}>
                        <div onClick={() => showFeed ? onClose() : onExpand()} className="expand-button">
                            {showFeed ? <CloseIcon/> : <ExpandIcon/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    )
};

export default ExpandButton;
