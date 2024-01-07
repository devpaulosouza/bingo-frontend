import React, { useEffect, useState } from "react";
import { Button, Navbar } from "react-bootstrap";
import NavBar from "../NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { stopApi } from "../../api/stopApi";
import moment from "moment";



const SOCKET_URL = `${process.env.REACT_APP_SAAPATONA_API_URL}/games/stop`;

const GameStop = () => {

    const [letter, setLetter] = useState('');
    const [words, setWords] = useState('');
    const [drawnWords, setDrawnWords] = useState([]);

    const [stopUsername, setStopUsername] = useState('');
    const [stopped, setStopped] = useState(false);

    const [validateWordCount, setValidateWordCount] = useState(null);
    const [otherPlayersWords, setOtherPlayersWords] = useState([]);
    const [otherPlayersPosition, setOtherPlayersPosition] = useState([]);

    const [validatingWords, setValidatingWords] = useState(false);

    const [winnerId, setWinnerId] = useState('');
    const [winnerName, setWinnerName] = useState('');

    const [canStopAt, setCanStopAt] = useState(moment())
    const [canStop, setCanStop] = useState(false)

    const [draw, setDraw] = useState(false);

    const [games, setGames] = useState([]);

    const location = useLocation();

    const id = location.state?.id;

    const navigate = useNavigate();

    const handleClickStop = async () => {
        try {
            const res = await stopApi.stop(id);

        } catch (e) {
            console.error(e);
        }
    }

    const debounce = (mainFunction, delay) => {
        // Declare a variable called 'timer' to store the timer ID
        let timer;

        // Return an anonymous function that takes in any number of arguments
        return function (...args) {
            // Clear the previous timer to prevent the execution of 'mainFunction'
            clearTimeout(timer);

            // Set a new timer that will execute 'mainFunction' after the specified delay
            timer = setTimeout(() => {
                mainFunction(...args);
            }, delay);
        };
    };

    const Line = ({ name, word, idx }) => {
        const [value, setValue] = useState(word);

        const handleValueChange = (e) => {
            setValue(e.target.value);

            debounce(async () => {
                try {
                    await stopApi.setWord(id, { playerId: id, position: idx, word: e.target.value })
                } catch (e) {
                    console.error(e);
                }
            })();
        }

        return (
            <div className="mb-3">
                {/* <label htmlFor="name" className="form-label">Nome</label> */}
                <input type="text" id="name" className="form-control" placeholder={name} value={value} onChange={handleValueChange} autoComplete="off" role="presentation" />
            </div>
        )
    }

    const Lines = () => {
        return (
            <div className="container-fluid login-container pt-5 mt-4">
                <form>
                    <fieldset>
                        {drawnWords?.map((i, idx) => <Line name={i} word={words[idx]} idx={idx} key={JSON.stringify(i)} />)}
                    </fieldset>
                </form>
            </div>
        )
    }

    const InvalidateButton = ({ word, position }) => {
        const [disabled, setDisabled] = useState(false);

        return (
            <Button
                className={`fw-bold`}
                disabled={disabled}
                onClick={() => {
                    setDisabled(true)
                    handleClickWord(position)
                }}
            >
                <i class="bi bi-trash3"></i>
                Invalidar
            </Button>
        )
    }

    const TableWinners = () => {
        return (
            <div className="row">
                <div className="col">
                    <div className="container">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">@</th>
                                        {drawnWords?.map(w => <th scope="col">{w}</th>)}
                                        <th scope="col">Pontos</th>
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
                                                        <td>{g?.player?.name}</td>
                                                        <td>{g?.player?.username}</td>
                                                        {g?.words?.map(w => <td>{w}</td>)}
                                                        <td>{g?.score}</td>
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
        if (!started) {
            setLetter('');
        }
        else {
            resetGame();
        }
    }

    const onStop = (un, s) => {
        setStopUsername(un);
        setStopped(s);
    }

    const onKick = () => {
        navigate('/');
    }

    const onValidateWordCount = count => {
        setStopped(false);
        resetGame();
    }

    const onWinner = (playerId, playerName) => {
        setWinnerId(playerId);
        setWinnerName(playerName);

        fetchGame();
    }

    const onDraw = () => {
        setDraw(true);
    }

    const fetchGame = async () => {
        const res = await stopApi.getAll();

        setGames(res.data.games)
    }

    const handleClickWord = (position) => {
        stopApi.invalidate(id, { playerPosition: position, position: validateWordCount, valid: false })
    }

    console.log(canStopAt)

    const resetGame = async (callback = () => { }) => {
        try {
            if (!id) {
                navigate('/');
                return;
            }
            const res = await stopApi.get(id);

            if (res.status === 200) {
                setLetter(res.data.letter);
                setWords(res.data.words)
                setDrawnWords(res.data.drawnWords);
                setValidateWordCount(res.data.validateWordCount);
                setOtherPlayersWords(res.data.otherPlayersWords);
                setOtherPlayersPosition(res.data.otherPlayersPosition);
                setStopped(res.data.stopped);
                setValidatingWords(res.data.validatingWords);

                if (!canStop) {
                    setTimeout(() => { setCanStop(true); resetGame() }, 20000)
                }
            }
        } catch (e) {
            console.error(e, e?.response?.data?.detail);
            if (e?.response?.data?.detail === 'Player was not found') {
                navigate('/')
            } else {
                callback();
            }
        }

    }

    const connect = () => {
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
                    onKick();
                    sseForUsers.close();
                    break;
                case ('STOP_VALIDATE_WORD'):
                    onValidateWordCount(data.count);
                    break;
                case ('PING'):
                    break;
                case ('WINNER'):
                    onWinner(data.playerId, data.playerName);
                    break;
                case ('STOP_RESTART'):
                    onDraw();
                    break;
            }
        })

        sseForUsers.onerror = (error) => {
            console.log("SSE For Users error", error);
            resetGame(() => setTimeout(connect, 3000));
            sseForUsers.close();
        };
    }

    useEffect(() => {
        connect();
        resetGame();
        fetchGame();
    }, []);


    if (!letter) {
        return (
            <>
                <NavBar />
                <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                    Aguarde o jogo começar
                </div>
            </>
        )
    }


    if (stopped) {
        return (
            <>
                <NavBar />
                <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                    {stopUsername ? `${stopUsername} parou o jogo! Aguarde para revisar as palavras` : `O tempo acabou! Aguarde para revisar as palavras`}
                </div>
            </>
        )
    }

    console.log(games)
    if (winnerId) {
        return (
            <>
                <NavBar />
                <div style={{ height: '100%' }}>
                    <div className="row">
                        <div className="col">
                            {winnerId === id ? `Parabéns! Você ganhou` : `O jogador ${winnerName} ganhou!`}
                        </div>
                    </div>
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

    console.log(words.length, drawnWords.length)

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
                        <div className="col">
                            <p>Valide as palavras!</p>
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
                                        <th scope="col">Valido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        otherPlayersWords?.map((w, i) => (
                                            <tr>
                                                <th scope="row">{i}</th>
                                                <td>{drawnWords[validateWordCount]}</td>
                                                <td>{w}</td>
                                                <td>
                                                    <InvalidateButton word={w} position={otherPlayersPosition[i]} />
                                                </td>
                                            </tr>
                                        ))
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
                <Lines />
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        <Button className="btn-success" disabled={(!canStop) || (words?.filter(w => !!w)?.length !== drawnWords?.length)} onClick={handleClickStop}>STOP!</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameStop;
