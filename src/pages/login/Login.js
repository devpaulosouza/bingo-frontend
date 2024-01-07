import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import './styles.css';
import { useNavigate, useNavigation } from "react-router-dom";
import { bingoApi } from "../../api/bingoApi";
import { v4 as uuidV4 } from "uuid";
import NavBar from "../../components/NavBar";


const Login = () => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    const [message, setMessage] = useState('');

    const [allowed, setAllowed] = useState(true);

    const [res, setRes] = useState('');

    const [id] = useState(uuidV4());

    const [hasPassword, setHasPassword] = useState(false);
    const [password, setPassword] = useState('');

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
            const res = await bingoApi.join({ name, username: username.replace('@', '').replace(' ', ''), id, password });

            if (res.status == 200) {
                navigate('game', { state: { id: res.data.player.id, numbers: res.data.numbers } });
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
    }

    const fetchHasPassword = async () => {
        try {
            const res = await bingoApi.hasPassword();

            if (res.status == 200) {
                setHasPassword(res.data.hasPassword);
            }
        } catch(e) {
            console.error(e);
        }
    }

    useEffect(() => { fetchHasPassword()}, [])

    return (
        <>
        <NavBar />
        <div className="container-fluid login-container pt-5 mt-4">
            <form>
                <fieldset>
                    <legend>Informe seus dados para jogar</legend>
                    <p>{res}</p>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nome</label>
                        <input type="text" id="name" className="form-control" placeholder="Nome" value={name} onChange={handleNameChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Usuário do X (Twitter)</label>
                        <input type="text" id="username" className="form-control" placeholder="Usuário do X (Twitter)" value={username} onChange={handleUserNameChange} spellCheck="false" autoCapitalize="none" autoCorrect="false"/>
                    </div>
                    {
                        hasPassword && (
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Senha:</label>
                                <input type="text" id="password" className="form-control" placeholder="Senha" value={password} onChange={handlePasswordChange} spellCheck="false" autoCapitalize="none" autoCorrect="false" />
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
