import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { renderDrawnNumbers, renderNumber } from "../../utils/renderNumber";
import { bingoApi } from "../../api/bingoApi";
import { Button } from "react-bootstrap";

// const SOCKET_URL = 'http://localhost:8080/game';
const SOCKET_URL = 'https://murmuring-bastion-37173-86d7c2307b3e.herokuapp.com/game';

const id = v4();

const Watch = () => {

    const [connected, setConnected] = useState(false);
    const [number, setNumber] = useState(0);
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const [cards, setCards] = useState([]);
    const [started, setStarted] = useState(false);
    const [winners, setWinners] = useState([]);
    const [gameMode, setGameMode] = useState('');

    const onDrawnNumber = (n, dn) => {
        setNumber(n);
        setDrawnNumbers(dn);
    }

    const fetchGame = async () => {
        const res = await bingoApi.getAll();

        setCards(res.data.cards);
        setDrawnNumbers(res.data.drawnNumbers);
        setNumber(res.data.number);
        setStarted(res.data.gameRunning);
        setWinners(res.data.winners);
        setGameMode(res.data.mode);
    }

    const handleStart = async () => {
        await bingoApi.start();
    }

    const handleRestart = async () => {
        await bingoApi.restart();
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

                    switch (data.type) {
                        case ("DRAWN_NUMBER"):
                            onDrawnNumber(data.number, data.drawnNumbers);
                            break;
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


    const renderButtom = (number, i, j, markedNumbers) => {

        if (i === 2 && j === 2) {
            return <></>
        }

        return (
            <Button className={`bingo-button ${markedNumbers[i][j] && 'btn-danger'} fw-bold`} disabled={true}>
                {number}
            </Button>
        );
    }


    const renderRows = (card) => {
        const numbers = card.numbers;
        const markedNumbers = card.markedNumbers;

        return (
            <table className="bingo-card">
                <thead>
                    <tr>
                        <th style={{ color: '#dc3545' }}>B</th>
                        <th style={{ color: '#6610f2' }}>I</th>
                        <th style={{ color: '#ffc107' }}>N</th>
                        <th style={{ color: '#198754' }}>G</th>
                        <th style={{ color: '#fd7e14' }}>O</th>
                    </tr>
                </thead>
                <tbody>
                    {numbers?.map((r, i) => <tr key={r[0]}>{r.map((c, j) => <td key={c}>{renderButtom(c, i, j, markedNumbers)}</td>)}</tr>) || <></>}
                </tbody>
            </table>
        )
    }

    const renderBoards = () => {

        return (

            cards?.map(
                card => (
                    <>
                        <div className="row">
                            <div className="col text-center">
                                Jogador: {card.player.name}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-center">
                                Usuário: {card.player.username}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col bingo-container jumbotron d-flex align-items-center justify-content-center">
                                {renderRows(card)}
                            </div>
                        </div>
                    </>
                )
            )
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
                                @: {winner.username}
                            </div>
                        </div>
                    </>
                )
            )
        )
    }

    return (
        <div>
            Watch
            <div className="row">
                <div className="col mt-3">
                    <div className="row">
                        <div className="col">
                            <h3>Modo de jogo: {gameMode === 'STANDARD' ? 'Padrão' : 'Blackout'}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p>Instruções: {gameMode === 'STANDARD' ? 'Marque linha, coluna ou diagonal para ganhar' : 'Marque todos os números para ganhar'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col d-flex justify-content-center mt-3">
                    <h1>{renderNumber(number)}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col d-flex justify-content-center mt-3  bingo-container jumbotron d-flex align-items-center justify-content-center">
                    {renderDrawnNumbers(drawnNumbers)}
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col">
                    {renderWinners()}
                </div>
            </div>
            <hr />
            {
                renderBoards()
            }
        </div>
    )
}

export default Watch;