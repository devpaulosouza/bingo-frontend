import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { renderDrawnNumbers, renderNumber } from "../../utils/renderNumber";
import { bingoApi } from "../../api/bingoApi";
import { Button } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { stopApi } from "../../api/stopApi";

const SOCKET_URL = `${process.env.REACT_APP_SAAPATONA_API_URL}/games/stop`;

const id = v4();

const WatchStop = () => {

    const [connected, setConnected] = useState(false);
    const [drawnWords, setDrawnWords] = useState([]);
    const [games, setGames] = useState([]);
    const [winners, setWinners] = useState([]);
    const [validateWordCount, setValidateWordCount] = useState(null);

    const fetchGame = async () => {
        try {
            const res = await stopApi.getAll();

            setGames(res.data.games);
            setDrawnWords(res.data.drawnWords);
            setWinners([...res.data.winners, ...winners]);
            setValidateWordCount(res.data.validateWordCount);
        } catch(e) {
            console.error(e);
        }
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
                    `${SOCKET_URL}/connect/players/${id}?isAdmin=true`,
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

    console.log(validateWordCount)

    const renderBoards = () => {

        return (
            <div className="row">
                <div className="col">
                    <div className="container">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="text-center"  scope="col">#</th>
                                        <th className="text-center"  scope="col">Nome</th>
                                        <th className="text-center"  scope="col">@</th>
                                        {drawnWords?.map(w => <th className="text-center"  scope="col">{w}</th>)}
                                        <th className="text-center"  scope="col">Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        games
                                            ?.sort((g1, g2) => g2.score - g1.score)
                                            ?.map((g, i) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{i}</th>
                                                        <td className="text-center" >{g?.player?.name}</td>
                                                        <td className="text-center" >{g?.player?.username}</td>
                                                        {g?.words?.map((w, i) => <td className="text-center" style={{color: g?.scores && g?.scores[i] ? 'black': 'red',}}>{((validateWordCount >= 0) && g?.scores && g?.scores[i]) ? w + " (" + g.scores[i] + ")" : w } </td>)}
                                                        <td className="text-center" >{g?.score}</td>
                                                    </tr>
                                                )
                                            })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderWinners = () => {
        return (
            winners.map(
                winner => (
                    <>
                        <div className="row mt-3">
                            <div className="col">
                                Ganhador: {winner.name}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                @{winner.username}
                            </div>
                        </div>
                    </>
                )
            )
        )
    }

    return (
        <>
            <NavBar />
            <div className="container mt-4">
                Watch
                <div className="row">
                    <div className="col">
                        {renderWinners()}
                    </div>
                </div>

                {/* <div className="mb-3">
                <label htmlFor="disabledTextInput" className="form-label">Filtrar por usuário</label>
                <input type="text" id="disabledTextInput" className="form-control" placeholder="Filtrar por usuário" value={username} onChange={handleUserNameChange} />
            </div> */}
                <hr />
                Número de jogadores: {games?.length}
                <div className="row">
                    <div className="col">
                        {
                            renderBoards()
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchStop;
