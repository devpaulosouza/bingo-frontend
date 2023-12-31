import React, { useEffect, useState } from "react";
import { json, useLocation, useNavigation } from "react-router-dom";
import './styles.css'
import { Button } from "react-bootstrap";
import SockJsClient from 'react-stomp';
import { bingoApi } from "../../api/bingoApi";


const SOCKET_URL = 'http://192.168.100.97:8080/game';

const Game = () => {

    const location = useLocation();
    const id = location.state.id;
    const numbers = location.state.numbers;
    const [topics, setTopics] = useState([]);
    const [number, setNumber] = useState(0);

    const [markedNumbers, setMarkedNumbers] = useState([
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ]);

    const [started, setStarted] = useState(false);



    const handleClickNumber = async (i, j) => {
        setMarkedNumbers(markedNumbers.map((r, _i) => r.map((c, _j) => {
            return (i === _i && j === _j) ? !markedNumbers[_i][_j] : markedNumbers[_i][_j];
        })));

        await bingoApi.mark({ playerId: id, i, j, marked: !markedNumbers[i][j] });
    }

    const handleClickBingo = async() => {
        await bingoApi.bingo(id);
    }

    const renderButtom = (number, i, j) => {

        if (i === 2 && j === 2) {
            return <></>
        }

        return (
            <Button className={`bingo-button ${markedNumbers[i][j] && 'btn-danger'}`} onClick={() => handleClickNumber(i, j)} disabled={!started}>
                {number}
            </Button>
        );
    }

    const onStart = isStarted => {
        setStarted(isStarted);
    }

    const onDrawnNumber = n => {
        setNumber(n);
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
                    onDrawnNumber(data.number);
                    break;
                case ("WINNER"): 
                    alert(`${data.playerName} venceu!`);
                    break;
            }
        })

        sseForUsers.onerror = (error) => {
            console.log("SSE For Users error", error);
            sseForUsers.close();
        };
    }, []);


    const renderRows = () => {

        return (
            <table className="bingo-card">
                <thead>
                    <tr>
                        <th>B</th>
                        <th>I</th>
                        <th>N</th>
                        <th>G</th>
                        <th>O</th>
                    </tr>
                </thead>
                <tbody>
                    {numbers.map((r, i) => <tr key={r[0]}>{r.map((c, j) => <td key={c}>{renderButtom(c, i, j)}</td>)}</tr>)}
                </tbody>
            </table>
        )
    }



    return (
        <>
            {/* <SockJsClient url={SOCKET_URL} topics={topics} onMessage={handleMessage} onConnect={handleConnected} /> */}

            <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        <h1>{number}</h1>
                    </div>
                </div>
            <div className="container container-fluid">
                <div className="row">
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
