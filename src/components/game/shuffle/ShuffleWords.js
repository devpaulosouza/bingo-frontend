import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { stopApi } from "../../../api/stopApi";
import { debounce } from "../../utils";
import { Button } from "react-bootstrap";

const arePropEquals = (prev, next) => {
    // console.log('prop', prev.words.map((w, i) => next[i] == w).reduce((p, c) => p && c, true))
    return (
        prev.words.map((w, i) => next[i] == w).reduce((p, c) => p && c, true)
    )
}



const Line = ({ name, value, idx, words, setWords, validWords, disabled, onBlur }) => {

    const handleValueChange = (e) => {
        const w = JSON.parse(JSON.stringify(words));

        // console.log(words, e.target.value)

        for (let i = 0; i < words.length; ++i) {
            if (i === idx) {
                // console.log(i, idx, e.target.value)
                w[i] = e.target.value.replaceAll(' ', '');

                // console.log('w', w)
                setWords(w);
            }
        }
    }

    const handleSetWord = () => {
        // onBlur(words);
    }

    // console.log(words)


    return (
        <div className="mb-3">
            <label htmlFor="name" className="form-label">{name}</label>
            <input type="text" id="name" disabled={disabled} onBlur={handleSetWord} className={`form-control ${validWords.length && validWords[idx] ? 'is-valid' : 'is-invalid'}`} placeholder={name} value={words[idx] || ''} onChange={(e) => { handleValueChange(e) }} autoComplete="off" role="presentation" />
        </div>
    )
}

const MemoLine = React.memo(Line, arePropEquals)

const ShuffleWords = ({ drawnWords, values, onSend, validWords, disabled, onFinish, unfocusTime, setValues, finished }) => {

    // console.log(!unfocusTime, values)
    const [words, setWords] = useState(values?.length ? values : drawnWords.map(d => ''));

    // useEffect(() => {
    //     if (disabled) {
    //         // onFinish(words);
    //     }
    // }, [words, disabled])

    console.log(words, finished)


    useEffect(() => {
        const focusHandler = () => {
            setValues(words)
        };
        window.addEventListener("blur", focusHandler);
        return () => window.removeEventListener("blur", focusHandler);
    }, [words]);

    useEffect(() => {
        if (finished) {
            console.log(words);
            onFinish(words);
        }
    }, [finished])


    // console.log(useMemo(() => <></>), [JSON.stringify(words)])

    return useMemo(
        () => <div className="container-fluid login-container pt-5 mt-4">
            <form>
                <fieldset>
                    {drawnWords?.map((i, idx) => <MemoLine name={i} value={''} idx={idx} key={i} words={words} validWords={validWords} disabled={disabled} setWords={v => {
                        // console.log('value', v[idx]);
                        setWords(v)
                    }} />)}
                </fieldset>
                {!disabled && <Button onClick={() => onSend(words)}>Enviar</Button>}
            </form>
        </div>
        , [JSON.stringify(words), JSON.stringify(validWords)])

}

export default React.memo(ShuffleWords);
