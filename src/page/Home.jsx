import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { parse, format } from 'date-fns';
import Dropdown from 'react-bootstrap/Dropdown';

export const Home = () => {
  const [recordatorios, setRecordatorios] = useState([]);
  const [pendientes, setPendientes] = useState([]);

  useEffect(() => {
    const getRecordatorios = async () => {
      db.collection("recordatorios")
        .orderBy("fecha", "asc")
        .onSnapshot((querySnapshot) => {
          const docs = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setRecordatorios(docs);
        });
    };

    getRecordatorios();
  }, []);

  const getPendientes = async () => {
    db.collection("pendientes")
      .orderBy("data", "asc")
      .onSnapshot((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPendientes(docs);
      });
  };

  useEffect(() => {
    getPendientes();
  }, []);

  const handlePendienteClick = (id) => {
    window.location.href = `/Pendientes#${id}`; // Redirige a la página de Pendientes con el fragmento de ID
  };

  useEffect(() => {
    // Scroll al elemento con el ID correspondiente cuando el fragmento de URL cambia
    const hash = window.location.hash.substring(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <>
      <div className="bg-secondary mb-5">
        <h1 className="text-center text-white p-5 ">
          MANTENIMIENTO EN PROGRESO
        </h1>
      </div>

      <div className="container d-grid gap-3 mt-4 mb-4">

        <button type="button" className="btn btn-outline-success">
          <a
            href="/Calendar"
            className="text-decoration-none text-success"
          >
            FECHA DE VISITA
          </a>
        </button>
      </div>
      <hr />

      <div className="container border rounded p-2 mb-5 text-center">

        <button type="button" className="btn btn-outline-warning">
          <a
            href="/Recordatorios"
            className="text-decoration-none text-warning"
          >
            RECORDATORIOS
          </a>
        </button>

        <div className="container mt-3 mb-3">
          {recordatorios.map(recordatorio => (
            <div key={recordatorio.id} className="list-group-item d-flex justify-content-between align-items-center p-2 mb-2">
              <div className="text-center">
                {format(parse(recordatorio.fecha, 'yyyy-MM-dd', new Date()), 'dd/MM/yy')}
              </div>
              <div className="text-center">{recordatorio.descripcion}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <hr />
        <div className="container d-grid gap-3 mt-4 mb-4">

          <button class="btn btn-lg btn-secondary" type="button">
            <a href="/Preventivos" className="text-decoration-none text-info">
              PREVENTIVOS
            </a>
          </button>

          <button class="btn btn-lg btn-secondary" type="button">
            <a href="/Pendientes" className="text-decoration-none text-info">
              CORRECTIVOS
            </a>
          </button>

        </div>
        <hr />
      </div>

      <div className="container mb-5 text-center">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            LISTA DE CLIENTES
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Item 1</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Item 2</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Item 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>


      {/*  <div className="container">
        <h4 className="d-flex justify-content-center p-3 text-light">
          LISTA DE PENDIENTES
        </h4>
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="text-center text-primary">Fecha</th>
              <th className="text-center text-primary">Nombre</th>
              <th className="text-center text-primary">Descripción</th>
            </tr>
          </thead>
          <tbody className="table-secondary border-white">
            {pendientes.map((pendiente) => (
              <tr
                key={pendiente.id}
                className={pendiente.completed ? "completed-task" : ""}
                onClick={() => handlePendienteClick(pendiente.id)} // Manejar evento de clic
                style={{ cursor: 'pointer' }} // Cambiar cursor a puntero
              >
                <td className="text-center">
                  {format(parse(pendiente.data, 'yyyy-MM-dd', new Date()), 'dd/MM/yy')}
                </td>
                <td
                  className={`text-success text-center ${pendiente.completed ? "task-completed" : ""
                    }`}
                >
                  {pendiente.name}
                </td>
                <td
                  className={`task-description text-center ${pendiente.completed ? "task-completed" : ""
                    }`}
                >
                  {pendiente.descripcion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </>
  );
};

export default Home;














