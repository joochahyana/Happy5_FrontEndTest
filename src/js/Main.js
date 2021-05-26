import React from 'react';
import '../css/Main.css';
import { Images } from './Images.js';

export const Main = () => {
    

    return (
        <div>
            <div className="side-bar">
                <img className="side-bar-logo"
                    src={Images.imgHappy5Logo}
                    alt="Happy5 Logo" />
            </div>
        </div>
    );
}