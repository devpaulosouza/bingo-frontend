import React from "react";
import GameBingo from "../../components/game/Bingo";
import { useLocation } from "react-router-dom";
import GameStop from "../../components/game/Stop";

const Game = () => {
    const location = useLocation();
    
    console.log(location.state)

    if (location.state?.gameType === 'BINGO') {
        return (
            <GameBingo />
        )
    }

    return(
        <GameStop />
    )
}

export default Game;
