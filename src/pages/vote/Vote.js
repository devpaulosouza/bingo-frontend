import React, { useEffect, useMemo, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { voteApi } from "../../api/voteApi";
import { Button } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";

const Vote = () => {

    const [pollId, setPollId] = useState('');
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [options, setOptions] = useState([]);
    const [recaptcha, setRecaptcha] = useState('');
    const [error, setError] = useState('');

    const [voted, setVoted] = useState(false);

    const recaptchaRef = useRef(null);

    const handleVerify = (value) => {
        setRecaptcha(value);
    }

    const handleUsernameChange = (_username) => {
        setUsername(_username);
    }

    const handleVoteAgain = () => {
        setVoted(false);
    }

    const handleRefreshPage = () => {
        window.location.reload();
    }

    const handleVote = async () => {
        try {
            const res = await voteApi.vote(pollId, username, recaptcha);

            if (res.status === 204) {
                setUsername('')
                setVoted(true);
            } else {
                // setError(res.data.detail)
                setUsername('')
                setVoted(true);
            }
        } catch (e) {
            // console.log(e);
            // setError(e.message)
            setUsername('')
            setVoted(true);
        }
        try {
            recaptchaRef.current.reset()
            setRecaptcha('')
        } catch (e) {
            console.log(e)
        }
    }

    const fetchVotes = async () => {
        try {
            const res = await voteApi.getAll();

            if (res.status === 200 && res.data.content.length) {
                const pRes = await voteApi.getById(res.data.content[0].id);

                if (pRes.status === 200) {
                    setPollId(pRes.data.id);
                    setOptions(pRes.data.options);
                    setTitle(pRes.data.title);
                    setSubtitle(pRes.data.subtitle);
                }

            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        console.log('fetching')
        fetchVotes();
    }, []);

    console.log(recaptcha)

    return (
        <>
            <NavBar />
            <div className="container">
                {
                    error && (
                        <div className="container">
                            <div className="row mt-5">
                                <div className="col">
                                    <div class="alert alert-danger" role="alert">
                                        Erro: {error}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col">
                                    <Button className="mt-3" onClick={handleRefreshPage}>TENTAR NOVAMENTE</Button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    voted && !error && (
                        <div className="container">
                            <div className="row mt-5">
                                <div className="col">
                                    <div class="alert alert-success" role="alert">
                                        Voto salvo com sucesso!
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col">
                                    <Button className="mt-3" onClick={handleVoteAgain}>VOTAR NOVAMENTE</Button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    !voted && !error && (
                        <>
                            <div className="row">
                                <div className="col">
                                    <h4>{title}</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p>{subtitle}</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <form>
                                        {
                                            options.map(option => (
                                                <div class="form-check">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id={`flexRadioDefault-${option.username}`} onChange={() => handleUsernameChange(option.username)} checked={option.username === username} />
                                                    <label class="form-check-label" for={`flexRadioDefault-${option.username}`}>
                                                        @{option.username} - {option.name}
                                                    </label>
                                                </div>
                                            ))
                                        }

                                        <div className="row mt-5">
                                            <div className="col">
                                                <ReCAPTCHA
                                                    style={{ display: "inline-block" }}
                                                    ref={recaptchaRef}
                                                    sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                                                    onChange={handleVerify}
                                                />
                                            </div>
                                        </div>
                                        <div className="rol">
                                            <div className="col">
                                                <Button className="mt-3" onClick={handleVote} disabled={!username || !recaptcha}>VOTAR</Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </>

    )
}

export default Vote;
