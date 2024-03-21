import React, { useState } from "react";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
        <div className="container-fluid">
         
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor03"
            aria-controls="navbarColor03"
            aria-expanded={isNavOpen} 
            aria-label="Toggle navigation"
            onClick={toggleNav} 
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} 
            id="navbarColor03"
          >
            <ul className="navbar-nav me-auto">
            <li className="nav-item ">
                <a className="nav-link border p-2 mb-1 mt-1" href="/">
                 INICIO
                  <span className="visually-hidden">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link border p-2 mb-1 " href="/calendar">
                  FECHA DE VISITA
                  <span className="visually-hidden">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link border p-2 mb-1" href="Recordatorios">
                  RECORDATORIOS
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link border p-2 mb-1" href="Preventivos">
                PREVENTIVOS
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link border p-2 mb-1" href="Pendientes">
                  CORRECTIVOS
                </a>
              </li>


            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

