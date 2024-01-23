import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { renderDrawnNumbers, renderNumber } from "../../utils/renderNumber";
import { bingoApi } from "../../api/bingoApi";
import { Button } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { drawnApi } from "../../api/drawnApi";

const SOCKET_URL = `${process.env.REACT_APP_SAAPATONA_API_URL}/games/drawn`;

const id = v4();

const WatchDrawn = () => {

    const [connected, setConnected] = useState(false);
    const [number, setNumber] = useState(0);


    const fetchGame = async () => {
        const res = await drawnApi.getAll();

        setNumber(res.data.number);
    }

    useEffect(
        () => {
            fetchGame()
        },
        []
    )

    useEffect(
        () => {
            if (!connected) {
                const sseForUsers = new EventSource(
                    `${SOCKET_URL}/connect/players/${id}`,
                    {
                        withCredentials: false,
                    }
                );


                sseForUsers.onopen = (e) => {
                    console.log("SSE 3 Connected !");
                };

                sseForUsers.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data);

                    switch (data?.type) {
                        default:
                            fetchGame();
                    }
                })

                sseForUsers.onerror = (error) => {
                    console.log("SSE For Users error", error);
                    sseForUsers.close();
                };
                setConnected(true);
            }
        },
        [connected]
    );

    return (
        <>
            <NavBar />
            <div className="container">
                Watch
                <div className="row">
                    <div className="col mt-3">
                        <div className="row">
                            <div className="col">
                                <h3>Modo de jogo: Sorteio</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>Instruções: Aguarde o número sorteado</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        <h1>
                            <div className="row">
                                <div className="col">
                                    {!number ? 'AGUARDE!!!' : number}
                                </div>
                            </div>
                        </h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchDrawn;
