import React, { useCallback, useEffect, useMemo, useState } from "react";
import { stopApi } from "../../../api/stopApi";
import { debounce } from "../../utils";

const StopWords = ({ drawnWords, words, clear, setClear, letter, id }) => {
    const Line = ({ name, value, idx, clear, setClear }) => {

        const [v, setV] = useState(value || '');

        useEffect(() => {
            if (clear) {
                console.log('clear')
                setV('');
                setClear(false);
            }
        }, [clear])


        const handleValueChange = (e) => {

            if (!e.target.value.toUpperCase()
                .replace("Ã", "A")
                .replace("Õ", "O")
                .replace("Ç", "C")
                .replace("Á", "A")
                .replace("Ó", "O")
                .replace("Ê", "E")
                .replace("É", "E")
                .replace("Ú", "U")
                .startsWith(letter) && e.target.value !== '') {
                return;
            }

            setV(e.target.value);
            debounce(async () => {
                try {
                    await stopApi.setWord(id, { playerId: id, position: idx, word: e.target.value })
                } catch (e) {
                    console.error(e);
                }
            })();
        }


        return (
            <div className="mb-3">
                {/* <label htmlFor="name" className="form-label">Nome</label> */}
                <input type="text" id="name" className="form-control" placeholder={name} value={v} onChange={(e) => { handleValueChange(e) }} autoComplete="off" role="presentation" />
            </div>
        )
    }

    const renderLines = () => {
        return (
            <div className="container-fluid login-container pt-5 mt-4">
                <form>
                    <fieldset>
                        {drawnWords?.map((i, idx) => <Line name={i} value={words[idx]} idx={idx} key={JSON.stringify(i)} clear={clear} setClear={setClear} />)}
                    </fieldset>
                </form>
            </div>
        )
    }

    console.log('render1')

    return (
        useMemo(renderLines, [drawnWords, words, clear, letter, id])
    )
}

export default React.memo(StopWords);
