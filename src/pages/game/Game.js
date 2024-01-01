import React, { useEffect, useState } from "react";
import { json, useLocation, useNavigate, useNavigation } from "react-router-dom";
import './styles.css'
import { Button } from "react-bootstrap";
import SockJsClient from 'react-stomp';
import { bingoApi } from "../../api/bingoApi";


const SOCKET_URL = 'http://192.168.100.97:8080/game';

const Game = () => {

    const location = useLocation();
    const id = location.state?.id;
    const [numbers, setNumbers] = useState(location.state?.numbers);
    const [topics, setTopics] = useState([]);
    const [number, setNumber] = useState(0);
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const [winner, setWinner] = useState('');

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
        try {
            const res = await bingoApi.getByPlayerId(id);

            setNumbers(res.data.card.numbers);
            setDrawnNumbers(res.data.drawnNumbers);
            setNumber(res.data.number);
            setStarted(res.data.gameRunning);
            setMarkedNumbers(res.data.card.markedNumbers)
        } catch(e) {
            console.error(e);
            navigate('/');
        }
    }


    const handleClickNumber = async (i, j) => {
        setMarkedNumbers(markedNumbers.map((r, _i) => r.map((c, _j) => {
            return (i === _i && j === _j) ? !markedNumbers[_i][_j] : markedNumbers[_i][_j];
        })));

        await bingoApi.mark({ playerId: id, i, j, marked: !markedNumbers[i][j] });
    }

    const handleClickBingo = async () => {
        await bingoApi.bingo(id);
    }

    const renderButtom = (number, i, j) => {

        if (i === 2 && j === 2) {
            return <></>
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

    useEffect(() => {
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

            switch (data.type) {
                case ("START"):
                    onStart(data.started);
                    break;
                case ("DRAWN_NUMBER"):
                    onDrawnNumber(data.number, data.drawnNumbers);
                    break;
                case ("WINNER"):
                    onWinner(data.playerId, data.playerName);
                    break;
                case("CLEAN"):
                    onClean();
                    break;
            }
        })

        sseForUsers.onerror = (error) => {
            console.log("SSE For Users error", error);
            sseForUsers.close();
        };

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

    const renderNumber = (n) => {
        let letter;
        let color;

        if (n <= 15) {
            letter = 'B';
            color = '#dc3545'
        }
        else if (n <= 30) {
            letter = 'I';
            color = '#6610f2'
        }
        else if (n <= 45) {
            letter = 'N';
            color = '#ffc107'
        }
        else if (n <= 60) {
            letter = 'G';
            color = '#198754'
        }
        else {
            letter = 'O';
            color = '#fd7e14'
        }

        return (
            <>
                <div className="row">
                    <div className="col" style={{ 'color': color }}>
                        {letter}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {n}
                    </div>
                </div>
            </>
        );
    }

    const renderDrawnNumbers = () => {
        return (
            drawnNumbers?.slice(drawnNumbers.length - 6, drawnNumbers.length - 1)?.map(n => <div className="col text-center"><h4>{renderNumber(n)}</h4></div>)
        )
    }

    if (winner) {
        return(
            <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                {winner} Ganhou. Aguarde a próxima rodada.
            </div>
        )
    }


    return (
        <>
            {/* <SockJsClient url={SOCKET_URL} topics={topics} onMessage={handleMessage} onConnect={handleConnected} /> */}

            <div className="container container-fluid">
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        <h1>{renderNumber(number)}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3  bingo-container jumbotron d-flex align-items-center justify-content-center">
                        {renderDrawnNumbers()}
                    </div>
                </div>
                <div className="row mt-4">
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
