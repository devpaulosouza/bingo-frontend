import React, { useState } from "react";
import { Button } from "react-bootstrap";

import './styles.css';
import { useNavigate, useNavigation } from "react-router-dom";
import { bingoApi } from "../../api/bingoApi";
import { v4 as uuidV4 } from "uuid";


const Login = () => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    const [allowed, setAllowed] = useState(true);

    const [res, setRes] = useState('');

    const [id] = useState(uuidV4());

    const navigate = useNavigate();

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const handleUserNameChange = e => {
        setUsername(e.target.value);
        setAllowed(true);
    }

    const handleSubmit = async () => {
        try {
            const res = await bingoApi.join({ name, username, id });

            if (res.status == 200) {
                navigate('game', { state: { id, numbers: res.data.numbers } });
            }
        } catch(e) {
            console.error(e);
            setAllowed(false);
        }
    }

    return (
        <div className="container-fluid container pt-5">
            <form>
                <fieldset>
                    <legend>Informe seus dados para jogar</legend>
                    <p>{res}</p>
                    <div className="mb-3">
                        <label htmlFor="disabledTextInput" className="form-label">Nome</label>
                        <input type="text" id="disabledTextInput" className="form-control" placeholder="Nome" value={name} onChange={handleNameChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="disabledTextInput" className="form-label">Usuário do X (Twitter)</label>
                        <input type="text" id="disabledTextInput" className="form-control" placeholder="Usuário do X (Twitter)" value={username} onChange={handleUserNameChange} />
                    </div>
                    {
                        !allowed && (
                            <div className="mb-3">
                                <div class="alert alert-danger" role="alert">
                                    O usuário não está na lista de jogadores
                                </div>
                            </div>
                        )
                    }
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Jogar</button>
                </fieldset>
            </form>
        </div>
    );
}

export default Login;
