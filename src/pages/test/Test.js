import React, { useEffect, useState } from "react";  
import NavBar from "../../components/NavBar";
import { Button } from "react-bootstrap";
import { v4 } from "uuid";
import { stopApi } from "../../api/stopApi";
import StopWords from "../../components/game/stop/StopWords";

const Test = () => {

    const [drawnWords, setDrawnWords] = useState(['Nome']);
    const [words, setWords] = useState([null])
    const [clear, setClear] = useState(false);

    const [canstop, setCanStop] = useState(false);

    const id = '14d71213-e569-401d-9c82-134c234a3180';

    const letter = 'A';

    setTimeout(() =>setCanStop(true), 10000)

    return(
        <>
            <NavBar />
            <StopWords words={words} drawnWords={drawnWords} clear={clear} id={id} letter={letter} setClear={()=>{}} />
            <Button onClick={() => setClear(true)}>Clear</Button>
            <Button disabled={!canstop} onClick={() => setClear(true)}>Clear</Button>
        </>
    )

}


export default Test;
