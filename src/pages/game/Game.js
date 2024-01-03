import React, { useEffect, useState } from "react";
import { json, useLocation, useNavigate, useNavigation } from "react-router-dom";
import './styles.css'
import { Button } from "react-bootstrap";
import SockJsClient from 'react-stomp';
import { bingoApi } from "../../api/bingoApi";
import { renderDrawnNumbers, renderNumber } from "../../utils/renderNumber";


// const SOCKET_URL = 'http://localhost:8080/game';
const SOCKET_URL = 'https://sapalimpiadas-backend-76a8b1cd1095.herokuapp.com/game';

const Game = () => {

    const location = useLocation();
    const id = location.state?.id;
    const [numbers, setNumbers] = useState(location.state?.numbers);
    const [topics, setTopics] = useState([]);
    const [number, setNumber] = useState(0);
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const [winner, setWinner] = useState('');
    const [gameMode, setGameMode] = useState('');

    const navigate = useNavigate();

    const [markedNumbers, setMarkedNumbers] = useState([
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ]);

    const [started, setStarted] = useState(false);

    const resetBoard = async () => {
        let tries = 10;
        try {
            while (tries > 0) {
                const res = await bingoApi.getByPlayerId(id);

                setNumbers(res.data.card.numbers);
                setDrawnNumbers(res.data.drawnNumbers);
                setNumber(res.data.number);
                setStarted(res.data.gameRunning);
                setMarkedNumbers(res.data.card.markedNumbers)
                setGameMode(res.data.mode)

                tries = 0;
            }
        } catch (e) {
            console.log(e);
            tries = tries - 1;

            if (tries <= 0) {

                navigate('/');
            }
        }

    }


    const handleClickNumber = async (i, j) => {
        setMarkedNumbers(markedNumbers.map((r, _i) => r.map((c, _j) => {
            return (i === _i && j === _j) ? !markedNumbers[_i][_j] : markedNumbers[_i][_j];
        })));

        try {
            await bingoApi.mark({ playerId: id, i, j, marked: !markedNumbers[i][j] });
        } catch(e) {
            console.log(e);
            setMarkedNumbers(markedNumbers.map((r, _i) => r.map((c, _j) => {
                return (i === _i && j === _j) ? markedNumbers[_i][_j] : markedNumbers[_i][_j];
            })));
        }
    }

    const handleClickBingo = async () => {
        try {
            await bingoApi.bingo(id);
        } catch(e) {
            console.log(e);
        }
    }

    const renderButtom = (number, i, j) => {

        if (i === 2 && j === 2) {
            return <Button className='btn-danger bingo-button' disabled> </Button>
        }

        return (
            <Button className={`bingo-button ${markedNumbers[i][j] && 'btn-danger'} fw-bold`} onClick={() => handleClickNumber(i, j)} disabled={!started}>
                {number}
            </Button>
        );
    }

    const onStart = isStarted => {
        setStarted(isStarted);
    }

    const onDrawnNumber = (n, dn) => {
        setNumber(n);
        setDrawnNumbers(dn);
        if (!started) {
            setStarted(true);
        }
    }

    const onWinner = (playerId, playerName) => {
        if (playerId === id) {
            navigate('/winner');
        }
        setWinner(playerName);
    }

    const onClean = async () => {
        await resetBoard();
        setWinner('');
    }

    const onGameMode = (mode) => {
        setGameMode(mode);
    }

    const connect = () => {
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
                case ("START"):
                    onStart(data.started);
                    break;
                case ("DRAWN_NUMBER"):
                    onDrawnNumber(data.number, data.drawnNumbers);
                    break;
                case ("WINNER"):
                    onWinner(data.playerId, data.playerName);
                    break;
                case ("CLEAN"):
                    onClean();
                    break;
                case ("GAME_MODE"):
                    onGameMode(data.mode);
                    break;
            }
        })

        sseForUsers.onerror = (error) => {
            console.log("SSE For Users error", error);
            sseForUsers.close();
            connect();
        };
    }

    useEffect(() => {
        connect();
        resetBoard();
    }, []);


    const renderRows = () => {
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
                    {numbers?.map((r, i) => <tr key={r[0]}>{r.map((c, j) => <td key={c}>{renderButtom(c, i, j)}</td>)}</tr>) || <></>}
                </tbody>
            </table>
        )
    }

    if (winner) {
        return (
            <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                {winner} Ganhou. Aguarde a próxima rodada.
            </div>
        )
    }


    return (
        <>
            {/* <SockJsClient url={SOCKET_URL} topics={topics} onMessage={handleMessage} onConnect={handleConnected} /> */}

            <div className="container container-fluid">

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
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3  bingo-container jumbotron d-flex align-items-center justify-content-center">
                        Números restantes: {75 - (drawnNumbers?.length || 0)}
                    </div>
                </div>
                <div className="row mt-4 d-flex justify-content-center">
                    <div className="col bingo-container jumbotron d-flex align-items-center justify-content-center">
                        {renderRows()}
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        <Button className="btn-success" disabled={!started} onClick={handleClickBingo}>BINGO!</Button>
                    </div>
                </div>
            </ div>
        </>
    )
}

export default Game;
