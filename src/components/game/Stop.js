import React, { useEffect, useState } from "react";
import { Button, Navbar } from "react-bootstrap";
import NavBar from "../NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { stopApi } from "../../api/stopApi";



const SOCKET_URL = `${process.env.REACT_APP_SAAPATONA_API_URL}/games/stop`;

const GameStop = () => {

    const [letter, setLetter] = useState('');
    const [words, setWords] = useState('');
    const [drawnWords, setDrawnWords] = useState([]);

    const [stopUsername, setStopUsername] = useState('');
    const [stopped, setStopped] = useState(false);

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

    const onStart = (started) => {
        if (!started) {
            setLetter('');
        }
        else {
            resetGame();
        }
    }

    const onStop = (un, s) =>{
        setStopUsername(un);
        setStopped(s);
    }

    const onKick = () => {
        navigate('/');
    }


    const resetGame = async () => {
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
            }
        } catch (e) {
            console.error(e);
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
        resetGame();
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
                        <Button className="btn-success" disabled={!letter} onClick={handleClickStop}>STOP!</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameStop;
