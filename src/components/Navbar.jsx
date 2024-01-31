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
          <a className="navbar-brand" href="#">
            Mantenimiento
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor03"
            aria-controls="navbarColor03"
            aria-expanded={isNavOpen} // Update aria-expanded state
            aria-label="Toggle navigation"
            onClick={toggleNav} // Add onClick handler
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} // Conditionally apply "show" class
            id="navbarColor03"
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" href="Home">
                  Inicio
                  <span className="visually-hidden">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Pendientes">
                  Pendientes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Recordatorios">
                  Recordatorios
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

