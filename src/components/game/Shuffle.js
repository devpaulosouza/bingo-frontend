import React, { useEffect, useMemo, useState } from "react";
import { Button, Navbar } from "react-bootstrap";
import NavBar from "../NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { stopApi } from "../../api/stopApi";
import moment from "moment";
import { bingoApi } from "../../api/bingoApi";
import Swal from "sweetalert2";
import StopWords from "./stop/StopWords";
import { shuffleApi } from "../../api/shuffleApi";
import ShuffleWords from "./shuffle/ShuffleWords";



const SOCKET_URL = `${process.env.REACT_APP_SAAPATONA_API_URL}/games/shuffle`;

const GameShuffle = () => {

    const [letter, setLetter] = useState('');

    const [shuffledWords, setShuffledWords] = useState([]);
    const [winners, setWinners] = useState([]);

    const [hiddenWords, setHiddenWords] = useState([])

    const [tries, setTries] = useState(0);

    const [playersCount, setPlayersCount] = useState(1);

    const [winner, setWinner] = useState(false);

    const [focused, setFocused] = useState(true);

    const [visibilityState, setVisibilityState] = useState('visible')


    const location = useLocation();

    const id = location.state?.id;

    const navigate = useNavigate();



    const onHidden = async () => {
        if (focused) {
            try {
                await shuffleApi.unfocus(id);
                console.log('unfocus', focused)
                setFocused(false)
            } catch (e) {

            }
        }
    }

    useEffect(() => {
        const focusHandler = () => {
            if (focused) {
                onHidden()
            };
        };
        window.addEventListener("blur", focusHandler);
        return () => window.removeEventListener("blur", focusHandler);
    }, [focused]);

    useEffect(() => {
        setVisibilityState(document.visibilityState)

        if (document.visibilityState === 'hidden') {
            onHidden();
        }
    }, [document.visibilityState])

    const resetGame = async (callback = () => { }) => {
        try {
            if (!id) {
                navigate('/');
                return;
            }

            const res = await shuffleApi.getByPlayerId(id);

            setShuffledWords(res.data.shuffledWords);
            setHiddenWords(res.data.words);
            setWinners(res.data.winners)
            setFocused(res.data.focused)
            setPlayersCount(res.data.playersCount)

        } catch (e) {
            console.error(e, e?.response?.data?.detail);
            if (e?.response?.data?.detail === 'Player was not found') {
                navigate('/')
            }
        }

    }

    const fetchPlayersCount = async () => {
        try {
            // const res = await shuffleApi.getByPlayerId(id);

            // setPlayersCount(res.data.playersCount);
        } catch (e) {

        }
    }

    const handleSend = async (w) => {
        try {
            const res = await shuffleApi.setWords(id, { words: w })

            if (res.status === 200) {
                setWinner(res.data.winner);
            }
        } catch (e) {

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
                case ('PING'):
                    break;
                case ('JOIN'):
                    fetchPlayersCount();
                    break;
                case ('WINNER'):
                    resetGame();
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

    const OnlinePlayers = () => {

        return <div className="row">
            <div className="col text-center">
                <p>Jogadores online: {playersCount}</p>
            </div>
        </div>
    }

    useEffect(() => {
        connect();
        resetGame();
    }, []);

    const Words = () => {
        return (
            <ShuffleWords drawnWords={shuffledWords} onSend={handleSend} />
        )
    }

    if (winner) {
        return (
            <>
                <NavBar />
                <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                    Parabéns, você ganhou!
                </div>
            </>
        )
    }

    if (winners.length) {
        return (
            <>
                <NavBar />
                <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                    {winners[0].username} ganhou!
                </div>
            </>
        )
    }

    if (!focused) {
        return (
            <>
                <NavBar />
                <div className="container d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                    Desclassificado! Você saiu da tela.
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
                            <h3>Desembaralhar palavras</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <h5>Não saia da página, ou irá perder automáticamente!</h5>
                        </div>
                    </div>
                    <div className="row">
                        <Words />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameShuffle;
