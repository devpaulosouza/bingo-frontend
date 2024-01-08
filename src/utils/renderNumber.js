const renderNumber = (n) => {
    let letter;
    let color;

    if (n <= 15) {
        letter = 'B';
        color = '#dc3545'
    }
    else if (n <= 30) {
        letter = 'I';
        color = '#6610f2'
    }
    else if (n <= 45) {
        letter = 'N';
        color = '#ffc107'
    }
    else if (n <= 60) {
        letter = 'G';
        color = '#198754'
    }
    else {
        letter = 'O';
        color = '#fd7e14'
    }

    return (
        <>
            <div className="row">
                <div className="col" style={{ 'color': color }}>
                    {letter}
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {n}
                </div>
            </div>
        </>
    );
}

const renderDrawnNumbers = (drawnNumbers) => {
    if (drawnNumbers?.length < 6) {
        return (
            drawnNumbers?.slice(0, drawnNumbers.length - 1)?.reverse()?.map(n => <div className="col text-center"><h4>{renderNumber(n)}</h4></div>)
        )
    }

    return (
        drawnNumbers?.slice(drawnNumbers.length - 6, drawnNumbers.length - 1)?.reverse()?.map(n => <div className="col text-center"><h4>{renderNumber(n)}</h4></div>)
    )
}

const renderAllDrawnNumbers = (drawnNumbers) => {

    const numbers = JSON.parse(JSON.stringify(drawnNumbers));

    const elements = [];

        elements.push(
            <div className="row">
                {numbers?.reverse()?.map((n, i) => <><div className="col text-center" style={{maxWidth: 50}}><h4>{renderNumber(n)}</h4></div>{i%10 === 0 && <br />}</>)}
            </div>
        )

    return (elements);
}


export {
    renderDrawnNumbers,
    renderAllDrawnNumbers,
    renderNumber
};
