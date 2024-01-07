import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import './styles.css';
import { useNavigate, useNavigation } from "react-router-dom";
import { bingoApi } from "../../api/bingoApi";
import { v4 as uuidV4 } from "uuid";
import NavBar from "../../components/NavBar";
import { gameApi } from "../../api/gameApi";
import { stopApi } from "../../api/stopApi";

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

    const[connection, setConnection] = useState(null);

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

            if (gameType === 'BINGO') {
                res = await bingoApi.join({ name, username: username.replace('@', '').replace(' ', ''), id, password });
            } else {
                res = await stopApi.join({ name, username: username.replace('@', '').replace(' ', ''), id, password });
            }

            if (res.status == 200) {
                navigate('game', { state: { id: res.data.player.id, numbers: res.data.numbers, gameType } });
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
                'The game is not accepting new players': 'Jogo em andamento. Aguarde o término deste jogo'
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
            const res = await bingoApi.hasPassword();

            if (res.status == 200) {
                setHasPassword(res.data.hasPassword);
            }

            const configRes = await gameApi.getConfig();

            if (configRes.status == 200) {
                setGameType(configRes.data.gameType);
            }

        } catch(e) {
            console.error(e);
        }
    }

    const onGameTypeChanged = (type) => {
        setGameType(type)
    }


    const connect = () => {
        const sseForUsers = new EventSource(
            `${SOCKET_URL}/watch`,
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
                case ("GAME_TYPE"):
                    onGameTypeChanged(data.gameType);
                    break;
            }
        })

        sseForUsers.onerror = (error) => {
            console.log("SSE For Users error", error);
            sseForUsers.close();
            connect();
        };
        setConnection(sseForUsers);
    }

    useEffect(() => {
        connect();
        fetchHasPassword();
    }, []);

    return (
        <>
        <NavBar />
        <div className="container-fluid login-container pt-5 mt-4">
            <form>
                <fieldset>
                    <legend>Informe seus dados para jogar</legend>
                    <p>Jogo: {gameType === 'BINGO' ? 'Bingo' : 'Stop'}</p>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nome</label>
                        <input type="text" id="name" className="form-control" placeholder="Nome" value={name} onChange={handleNameChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Usuário do X (Twitter)</label>
                        <input type="text" id="username" className="form-control" placeholder="Usuário do X (Twitter)" value={username} onChange={handleUserNameChange} />
                    </div>
                    {
                        hasPassword && (
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Senha:</label>
                                <input type="text" id="password" className="form-control" placeholder="Senha" value={password} onChange={handlePasswordChange} />
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
                    <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{marginRight: 8}}>Jogar</button>
                    <button type="button" className="btn btn-secondary" onClick={handleWatch}>Assistir</button>
                </fieldset>
            </form>
        </div>
        </>
    );
}

export default Login;
