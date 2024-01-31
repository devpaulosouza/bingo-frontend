import React, { useEffect, useState } from "react";
import { Button, Navbar } from "react-bootstrap";
import NavBar from "../NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { stopApi } from "../../api/stopApi";
import moment from "moment";
import { bingoApi } from "../../api/bingoApi";
import Swal from "sweetalert2";
import StopWords from "./stop/StopWords";



const SOCKET_URL = `${process.env.REACT_APP_SAAPATONA_API_URL}/games/stop`;

const GameStop = () => {

    const [letter, setLetter] = useState('');
    const [words, setWords] = useState([]);
    const [drawnWords, setDrawnWords] = useState(['Arvore']);

    const [started, setStarted] = useState(false);

    const [stopUsername, setStopUsername] = useState('');
    const [stopped, setStopped] = useState(false);

    const [validateWordCount, setValidateWordCount] = useState(null);
    const [otherPlayersWords, setOtherPlayersWords] = useState([]);
    const [otherPlayersPosition, setOtherPlayersPosition] = useState([]);

    const [tries, setTries] = useState(0);
    const [scores, setScores] = useState([]);

    const [winners, setWinners] = useState([]);

    const [showingResults, setShowingResults] = useState(false);

    const [validatingWords, setValidatingWords] = useState(false);

    const [winnerId, setWinnerId] = useState('');
    const [winnerName, setWinnerName] = useState('');

    const [canStop, setCanStop] = useState(false)

    const [refresh, setRefresh] = useState(false);

    const [draw, setDraw] = useState(false);

    const [games, setGames] = useState([]);

    const [connection, setConnection] = useState(null);

    const [clear, setClear] = useState(false);

    const [playersCount, setPlayersCount] = useState(1);

    const location = useLocation();

    const id = location.state?.id;

    const navigate = useNavigate();

    const isWordValid = (w) => {
        if (!w) {
            return false;
        }

        return w.toLowerCase().replaceAll(w.toLowerCase().charAt(0), "").length !== 0
    }

    const handleClickStop = async () => {
        try {
            const res = await stopApi.stop(id);

            if (!res.data) {
                Swal
                    .fire(
                        {
                            text: "Você tem que preencher todas as palavras para apertar STOP!"
                        }
                    )
            }

        } catch (e) {
            console.error(e);
        }
    }

    const InvalidateButton = ({ word, position }) => {
        const [disabled, setDisabled] = useState(false);

        return (
            <Button
                className={`fw-bold btn-danger btn-danger-stop`}
                disabled={disabled}
                onClick={() => {
                    setDisabled(true)
                    handleClickWord(position)
                }}
            >
                Invalido
            </Button>
        )
    }
    //
    const TableWinners = () => {
        return (
            <div className="row">
                <div className="col">
                    <div className="container">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="text-center" scope="col">#</th>
                                        <th className="text-center" scope="col">Nome</th>
                                        <th className="text-center" scope="col">@</th>
                                        {drawnWords?.map(w => <th className="text-center" scope="col">{w}</th>)}
                                        <th className="text-center" scope="col">Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        games
                                            ?.sort((g1, g2) => g2.score - g1.score)
                                            ?.map((g, i) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{i + 1}</th>
                                                        <td className="text-center" >{g?.player?.name}</td>
                                                        <td className="text-center" >{g?.player?.username}</td>
                                                        {g?.words?.map((w, i) => <td className="text-center" style={{ color: g?.scores && g?.scores[i] ? 'black' : 'red', }}>{w + " (" + g.scores[i] + ")"} </td>)}
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

    const onStart = (started) => {
        setDraw(false);

        setStarted(started);

        resetGame();
        fetchGame();
    }

    // useEffect(() => {
    //     resetGame();
    //     fetchGame();
    // }, [started]);

    const onStop = (un, s) => {
        setStopUsername(un);
        setStopped(s);
        fetchGame();
    }

    const onKick = () => {
        navigate('/');
    }

    const onValidateWordCount = count => {
        setStopped(false);
        setValidatingWords(false)
        resetGame();
        fetchGame();
    }

    const onWinner = (playerId, playerName) => {
        setWinnerId(playerId);
        setWinnerName(playerName);
        fetchGame();
    }

    const onDraw = () => {
        setDraw(true);
        setCanStop(false);
        setClear(true);
        setLetter('');
    }

    const fetchGame = async () => {
        try {

            const res = await stopApi.getAll();

            setGames(res.data.games);
            setWinners(res.data.winners);
            setShowingResults(res.data.showingResults);
            setPlayersCount(res.data.playersCount);
            if (res?.data?.winners?.length) {
                setWinnerName(res?.data.winners[0].name);
                setWinnerId(res?.data.winners[0].id);
            }
        } catch(e) {
            console.error(e);
        }
    }

    const handleClickWord = (position) => {
        try {
            stopApi.invalidate(id, { playerPosition: position, position: validateWordCount, valid: false, points: -1 })
        } catch(e) {
            console.error(e);
        }
    }

    const resetGame = async (callback = () => { }) => {
        try {
            if (!id) {
                navigate('/');
                return;
            }
            const res = await stopApi.get(id);

            if (res.status === 200) {
                setLetter(res.data.letter);
                setDrawnWords(res.data.drawnWords);
                setValidateWordCount(res.data.validateWordCount);
                setOtherPlayersWords(res.data.otherPlayersWords);
                setOtherPlayersPosition(res.data.otherPlayersPosition);
                setStopped(res.data.stopped);
                setValidatingWords(res.data.validatingWords);
                setScores(res.data.scores);
                setPlayersCount(res.data.playersCount);

                setCanStop(res.data.canStop);
                setStarted(!!res.data.letter);
            }
        } catch (e) {
            console.error(e, e?.response?.data?.detail);
            if (e?.response?.data?.detail === 'Player was not found') {
                navigate('/')
            }
        }

    }

    const onPing = async () => {

        if (showingResults) {
            fetchGame();
        }

    }

    const connect = () => {

        if (tries > 10) {
            navigate('/');
            return;
        }

        if (!id) {
            navigate('/');
            return;
        }
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
                case ("STOP_STOPPED"):
                    onStop(data.playerName, data.stopped);
                    break;
                case ("KICK"):
                    sseForUsers.close();
                    onKick();
                    break;
                case ('STOP_VALIDATE_WORD'):
                    onValidateWordCount(data.count);
                    break;
                case ('PING'):
                    onPing();
                    break;
                case('JOIN'):
                    resetGame();
                    break;
                case ('WINNER'):
                    onWinner(data.playerId, data.playerName);
                    break;
                case ('CAN_STOP'):
                    setCanStop(true);
                    break;
                case ('STOP_RESTART'):
                    onDraw();
                    break;
            }
        })

        sseForUsers.onerror = (error) => {
            console.log("SSE For Users error", error);
            setTimeout(connect, 3000)
            sseForUsers.close();
            setTries(tries + 1);
        };
        // setConnection(sseForUsers);
    }

    useEffect(() => {
        connect();
        resetGame();
        fetchGame();
    }, []);

    if (!started) {
        return (
            <>
                <NavBar />
                <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                    Aguarde o jogo começar<br/><br/>

                    Jogadores online: {playersCount}
                </div>
            </>
        )
    }


    if (stopped && validateWordCount === null) {
        return (
            <>
                <NavBar />
                <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                    {stopUsername ? `${stopUsername} parou o jogo! Aguarde para revisar as palavras` : `O tempo acabou! Aguarde para revisar as palavras`}
                </div>
            </>
        )
    }

    if (showingResults) {
        return (
            <>
                <NavBar />
                <div style={{ height: '100%' }}>
                    {/* <div className="row">
                        <div className="col">
                            {winnerId === id ? `Parabéns! Você ganhou` : `${winnerName} ganhou o jogo!`}
                        </div>
                    </div> */}
                    <TableWinners />
                </div>
            </>
        )
    }
    if (draw) {
        return (
            <>
                <NavBar />
                <div style={{ height: '100%' }}>
                    <div className="row">
                        <div className="col">
                            Deu empate!!!

                            O jogo vai reiniciar em instantes com os melhores jogadores
                        </div>
                    </div>
                    <TableWinners />
                </div>
            </>
        )
    }

    if (validateWordCount !== null) {
        return (
            <>
                <NavBar />
                <div className="container" style={{ height: '100%' }}>
                    <div className="row">
                        <div className="col text-center">
                            <h3>Letra: {letter}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p>Tema: {drawnWords[validateWordCount]}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <h3>Invalide caso a palavra não se encaixe no tema, ou se estiver escrita de forma errada</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Tema</th>
                                        <th scope="col">Palavra escolhida</th>
                                        <th scope="col">Validação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        otherPlayersWords?.map((w, i) => {

                                            if (!!w) {
                                                return (
                                                    <tr>
                                                        <th scope="row">{i}</th>
                                                        <td>{drawnWords[validateWordCount]}</td>
                                                        <td>{w}</td>
                                                        <td>
                                                            <InvalidateButton word={w} position={otherPlayersPosition[i]} />
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        })

                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <NavBar />
            <div className="container">

                <div className="col mt-3">
                    <div className="row">
                        <div className="col text-center">
                            <h3>Letra: {letter}</h3>
                        </div>
                    </div>
                </div>
                <StopWords clear={clear} drawnWords={drawnWords} words={words} setClear={setClear} letter={letter} id={id} />
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        {canStop && <Button className="btn-danger" disabled={!canStop} onClick={handleClickStop}>STOP!</Button>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameStop;
