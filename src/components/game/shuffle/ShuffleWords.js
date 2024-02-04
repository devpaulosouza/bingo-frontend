import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { stopApi } from "../../../api/stopApi";
import { debounce } from "../../utils";
import { Button } from "react-bootstrap";

const arePropEquals = (prev, next) => {
    console.log(prev.name === next.name);
    console.log(prev.value === next.value);
    console.log(prev.idx === next.idx);
    console.log(prev.clear === next.clear);
    return (
        prev.name === next.name
        && prev.value === next.value
        && prev.idx === next.idx
        && prev.clear === next.clear
    )
}



const Line = ({ name, value, idx, clear, setClear, words, setWords }) => {

    const [v, setV] = useState(value || '');
    const ref = useRef(null);

    useEffect(() => {
        if (clear) {
            console.log('clear')
            setV('');
            setClear(false);
        }
    }, [clear])


    const handleValueChange = (e) => {
        setV(e.target.value);

        const w = JSON.parse(JSON.stringify(words));

        console.log(words, w)

        for (let i = 0; i < words.length; ++i) {
            if (i === idx) {
                w[i] = e.target.value;
                setWords(w);
            }
        }
    }


    return (
        <div className="mb-3">
            <label htmlFor="name" className="form-label">{name}</label>
            <input type="text" id="name" className="form-control" placeholder={name} value={v} onChange={(e) => { handleValueChange(e) }} autoComplete="off" role="presentation" ref={ref} />
        </div>
    )
}

const MemoLine = React.memo(Line, arePropEquals)

const ShuffleWords = ({ drawnWords, words, clear, setClear, onSend }) => {
    const [w, setW] = useState(drawnWords.map(w => ''));

    console.log(w)

    return useMemo(
        () => <div className="container-fluid login-container pt-5 mt-4">
            <form>
                <fieldset>
                    {drawnWords?.map((i, idx) => <MemoLine name={i} value={''} idx={idx} key={i} clear={clear} setClear={setClear} words={w} setWords={setW} />)}
                </fieldset>
                <Button onClick={() => onSend(w)}>Enviar</Button>
            </form>
        </div>
    , [w])

}

export default React.memo(ShuffleWords);
