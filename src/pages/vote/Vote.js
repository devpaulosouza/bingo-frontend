import React from "react";
import NavBar from "../../components/NavBar";
import ReCAPTCHA from "react-google-recaptcha";

const Vote = () => {

    const handleChange = (e) => {
        console.log(e);
    }

    return(
        <>
            <NavBar />
            <div className="container">
                <div className="row mt-5">
                    <div className="col">
                        <h3>Votação BBBB24</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                            onChange={handleChange}
                        >

                        </ReCAPTCHA>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Vote;
