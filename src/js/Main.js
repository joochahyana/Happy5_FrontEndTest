import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from './API.js';
import { Board } from './Board.js';
import { Images } from './Images.js';
import '../css/Main.css';

export const Main = () => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        GetBoards();
    }, []);

    const GetBoards = () => {
        axios.get("https://hapi5-api.herokuapp.com/boards", {
            headers: {
                "Authorization": API.token
            }
        })
        .then( (response) => {
            // console.log(response);
            if (response.data.length > 0){
                response.data.map((board) =>
                    setBoards((prev) => [
                        ...prev,
                        {
                            "id": board.id,
                            "title": board.title,
                            "description": board.description
                        }
                    ])
                );
            }
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <div>
            <div className="side-bar">
                <img className="side-bar-logo"
                    src={Images.imgHappy5Logo}
                    alt="Happy5-logo" />
            </div>
            <div className="main">
                <header>
                    <h1 className="main-header">Product Roadmap</h1>
                </header>
                <div className ="boards">
                    {boards.length > 0 &&
                        boards.map((board) =>
                            <Board
                                key={board.id}
                                id={board.id}
                                year={board.title}
                                month={board.description}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}