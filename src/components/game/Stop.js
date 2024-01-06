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

    const location = useLocation();

    const id = location.state?.id;

    const navigate = useNavigate();

    const handleClickStop = () => {
        
    }

    let range = function* (start, stop, step = 1) {
        if (stop == null) { stop = start; start = 0; }
        let l = Math.ceil((stop - start) / step);
        for (let i = 0; i < l; i++)yield start + i * step;
    };

    const Line = ({ idx }) => {
        const [value, setValue] = useState('');

        const handleValueChange = (e) => {
            setValue(e.target.value);
        }

        return (
            <div className="mb-3">
                {/* <label htmlFor="name" className="form-label">Nome</label> */}
                <input type="text" id="name" className="form-control" placeholder="Nome" value={value} onChange={handleValueChange} autoComplete="off" role="presentation" />
            </div>
        )
    }

    const Lines = () => {


        return (
            <div className="container-fluid login-container pt-5 mt-4">
                <form>
                    <fieldset>
                        {[...range(0, 10)].map(i => <Line idx={i} key={JSON.stringify(i)}/>)}
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

    const onKick = () => {
        navigate('/');
    }


    const resetGame = async () => {
        try {
            const res = await stopApi.get(id);

            if (res.status === 200) {
                setLetter(res.data.letter);
                setWords(res.data.words)
            }
        } catch(e) {
            console.error(e);
        }

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
