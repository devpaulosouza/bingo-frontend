import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { voteApi } from "../../api/voteApi";
import { Button } from "react-bootstrap";
import Chart from "react-google-charts";

const VoteAdmin = () => {

    const password = localStorage.getItem('password');

    const [pollId, setPollId] = useState('');
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [options, setOptions] = useState([]);
    const [recaptcha, setRecaptcha] = useState('');
    const [error, setError] = useState('');

    const [voted, setVoted] = useState(false);

    console.log(password)

    const fetchVotes = async () => {
        try {
            const res = await voteApi.getAllAdmin(password);

            if (res.status === 200 && res.data.content.length) {
                const pRes = await voteApi.getByIdAdmin(password, res.data.content[0].id);

                if (pRes.status === 200) {
                    setPollId(pRes.data.id);
                    setOptions(pRes.data.summarizedVotes);
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

    return (
        <>
            <NavBar />
            <div className="container">
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
                        <p>Votos totais: {options?.map(o => o.votes)?.reduce((p, c) => p + c, 0)}</p>
                    </div>
                </div>
                {
                    options.map(option => (
                        <div className="row">
                            <div className="col">
                                @{option.username}: {option.votes}
                            </div>
                        </div>
                    ))
                }
                <div className="row">
                    <div className="col">
                        <Chart
                            chartType="PieChart"
                            data={[ ['username', 'votos'], ...options.map(o => [o.username, o.votes]) ]}
                            options={{ title: 'Votação' }}
                            width={"100%"}
                            height={"400px"}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default VoteAdmin;
