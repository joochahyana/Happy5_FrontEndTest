import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Main.css';
import { Images } from './Images.js';
import { Board } from './Board.js';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoxMjl9.uH_fONvgDZcyNlrsAnaJCuT51XAEfto6Dmtp_xlp3dk";

export const Main = () => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        GetBoards();
    }, []);

    const GetBoards = () => {
        axios.get("https://hapi5-api.herokuapp.com/boards", {
            headers: {
                "Authorization": token
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
                    alt="Happy5 Logo" />
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