import React, { useEffect, useState } from "react";
import WatchBingo from "../../components/watch/WatchBingo";
import NavBar from "../../components/NavBar";
import WatchStop from "../../components/watch/WatchStop";
import { gameApi } from "../../api/gameApi";
import WatchDrawn from "../../components/watch/WatchDrawn";

const Watch = () => {

    const [gameType, setGameType] = useState('');


    const fetchConfig = async () => {
        const res = await gameApi.getConfig();
        setGameType(res.data.gameType);
    }

    useEffect(() => {
        fetchConfig();
    })

    if (gameType === 'STOP') {
        return (
            <WatchStop />
        )
    }

    else if (gameType === 'BINGO') {
        return (
            <WatchBingo />
        )
    }


    else if (gameType === 'DRAWN') {
        return (
            <WatchDrawn />
        )
    }

    return(
        <NavBar />
    )
}

export default Watch;
