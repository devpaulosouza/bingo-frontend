import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate, useNavigation } from "react-router-dom";
import Swal from "sweetalert2";
import './styles.css';


const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClickHome = (e) => {
        e?.preventDefault();
        navigate('/');
    }

    const handleClickVote = (e) => {
        e?.preventDefault();
        navigate('/vote');
    }

    const handleClickAdmin = async () => {
        const result = await Swal.fire({
            title: "Você pode mesmo entrar aqui?",
            text: "Me prove isso!",
            input: 'password',
            showCancelButton: true,
            confirmButtonColor: 'green'
        });

        if (result.value) {
            console.log('set', result.value)
            localStorage.setItem('password', result.value);
            console.log('set', result.value)
            navigate('/admin')
        }
    }

    const handleClickAdminVote = async () => {
        const result = await Swal.fire({
            title: "Você pode mesmo entrar aqui?",
            text: "Me prove isso!",
            input: 'password',
            showCancelButton: true,
            confirmButtonColor: 'green'
        });

        if (result.value) {
            console.log('set', result.value)
            localStorage.setItem('password', result.value);
            console.log('set', result.value)
            navigate('/admin/vote')
        }
    }


    return (
        <Navbar
            sticky="top"
            id="navbar"
            expand="lg"
            className="navbar navbar-expand-lg navbar-dark navbar-custom"
            collapseOnSelect={true}
        >
            <a className="navbar-brand" onClick={handleClickHome} href="/" style={{ marginLeft: 32 }}>Stoom</a>

            <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggle" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Link
                        activeClass={location.pathname === '/' ? "active" : "inactive"}
                        to="/"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={800}
                        className="nav-link"
                        onClick={handleClickHome}
                    >
                        Início
                    </Link>
                    <Link
                        activeClass={location.pathname === '/admin' ? "active" : "inactive"}
                        to="#"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={800}
                        className="nav-link"
                        onClick={handleClickAdmin}
                    >
                        Admin
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        // <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        //     <div className="container-fluid">
        //         <a className="navbar-brand" onClick={handleClickHome} href="#">Saapatona</a>
        //         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        //             <span className="navbar-toggler-icon"></span>
        //         </button>
        //         <div className="collapse navbar-collapse" id="navbarCollapse">
        //             <ul className="navbar-nav me-auto mb-2 mb-md-0">
        //                 <li className="nav-item">
        //                     <a className={`nav-link ${location.pathname === '' && 'active'}`} aria-current={`${ location.pathname === '/' && "page"}`} href="#" onClick={handleClickHome}>Início</a>
        //                 </li>
        //             </ul>
        //         </div>
        //     </div>
        // </nav>
    )
}

export default NavBar;
