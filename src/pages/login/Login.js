import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import './styles.css';
import { useNavigate, useNavigation } from "react-router-dom";
import { bingoApi } from "../../api/bingoApi";
import { v4 as uuidV4 } from "uuid";
import NavBar from "../../components/NavBar";
import { gameApi } from "../../api/gameApi";
import { stopApi } from "../../api/stopApi";
import { shuffleApi } from "../../api/shuffleApi";

const SOCKET_URL = `${process.env.REACT_APP_SAAPATONA_API_URL}/games`;

const Login = () => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    const [message, setMessage] = useState('');

    const [allowed, setAllowed] = useState(true);

    const [id] = useState(uuidV4());

    const [hasPassword, setHasPassword] = useState(false);
    const [password, setPassword] = useState('');

    const [gameType, setGameType] = useState('BINGO');

    const [connection, setConnection] = useState(null);

    const [tries, setTries] = useState(0);

    const navigate = useNavigate();

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const handleUserNameChange = e => {
        setUsername(e.target.value);
        setAllowed(true);
    }

    const handlePasswordChange = e => {
        setPassword(e.target.value);
    }

    const handleSubmit = async () => {
        try {
            let res;

            if (!username || !name) {
                setAllowed(false);
                setMessage('Informe um nome de usuário e um nome')
                return;
            }

            if (gameType === 'BINGO') {
                res = await bingoApi.join({ name, username: username.replace('@', '').replace(' ', ''), id, password });
            } 
            else if (gameType === 'SHUFFLE') {
                res = await shuffleApi.join({ name, username: username.replace('@', '').replace(' ', ''), id, password });
            }
            else {
                res = await stopApi.join({ name, username: username.replace('@', '').replace(' ', ''), id, password });
            }

            if (res.status == 200) {
                navigate('game', { state: { id, numbers: res.data.numbers, gameType } });
            }

            if (connection) {
                connection.close();
            }

        } catch (e) {
            console.error(e);

            const errors = {
                'Password does not match': 'Senha inválida',
                'Max players reached': 'Número máximo de jogadores atingido',
                'Username is not allowed to play in this session': 'Nome de usuário não está na lista de jogadores',
                'The game is not accepting new players': 'Jogo em andamento. Aguarde o término deste jogo',
                'Game is not running': 'Aguarde o jogo começar',
                'The game already has winners': 'Algém já ganhou o jogo! Aguarde um novo jogo para entrar'
            }

            setAllowed(false);
            setMessage(errors[e?.response?.data?.detail] || 'Ocorreu um erro')
        }
    }

    const handleWatch = () => {
        navigate('watch');
        if (connection) {
            connection.close();
        }
    }

    const fetchHasPassword = async () => {
        try {
            let res;

            if (gameType === 'BINGO') {
                res = await bingoApi.hasPassword();
            }
            else if (gameType === 'STOP') {
                res = await stopApi.hasPassword();
            }
            else if (gameType === 'SHUFFLE') {
                res = await shuffleApi.hasPassword();
            }

            if (res?.status == 200) {
                setHasPassword(res.data.hasPassword);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const fetchGameType = async () => {
        try {
            const res = await gameApi.getConfig();

            if (res?.status == 200) {
                setGameType(res.data.gameType);
            }
        } catch(e) {

        }
    }

    const onGameTypeChanged = (type) => {
        setGameType(type);
    }

    useEffect(() => {
        fetchHasPassword();
    }, [gameType])


    const connect = () => {
        if (tries >= 5) {
            return;
        }

        const sseForUsers = new EventSource(
            `${SOCKET_URL}/watch`,
            {
                withCredentials: false,
            }
        );


        sseForUsers.onopen = (e) => {
            console.log("SSE 3 Connected !");
            setTries(0);
        };

        sseForUsers.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);

            switch (data?.type) {
                case ("GAME_TYPE"):
                    onGameTypeChanged(data.gameType);
                    break;
            }
        })

        sseForUsers.onerror = (error) => {
            console.log("SSE For Users error", error);
            sseForUsers.close();
            setTimeout(connect, 5000);
            setTries(tries + 1);
        };
        setConnection(sseForUsers);
    }

    useEffect(() => {
        window.onbeforeunload = function() {
            if (connection) {
                connection.close();
            }
            return true;
        };
    
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        fetchGameType();
        connect();
    }, []);

    return (
        <>
            <NavBar />
            <div className="container-fluid login-container pt-5 mt-4">
                <form>
                    <fieldset>
                        <legend>Informe seus dados para jogar</legend>
                        <p>Jogo: {gameType === 'BINGO' ? 'Bingo' : gameType === 'STOP' ? 'Stop' : 'Desembaralhar palavras'}</p>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nome</label>
                            <input type="text" id="name" className="form-control" placeholder="Nome" value={name} onChange={handleNameChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Usuário do X (Twitter)</label>
                            <input type="text" id="username" className="form-control" placeholder="Usuário do X (Twitter)" value={username} onChange={handleUserNameChange} spellCheck="false" autoCapitalize="none" autoCorrect="off" />
                        </div>
                        {
                            hasPassword && (
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Senha:</label>
                                    <input type="text" id="password" className="form-control" placeholder="Senha" value={password} onChange={handlePasswordChange} spellCheck="false" autoCapitalize="none" autoCorrect="off" />
                                </div>
                            )
                        }
                        {
                            !allowed && (
                                <div className="mb-3">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )
                        }
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginRight: 8 }}>Jogar</button>
                        <button type="button" className="btn btn-secondary" onClick={handleWatch}>Assistir</button>
                    </fieldset>
                </form>
            </div>
        </>
    );
}

export default Login;
