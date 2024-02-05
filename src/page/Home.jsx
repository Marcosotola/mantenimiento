import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { parse, format } from 'date-fns';

export const Home = () => {
  const [pendientes, setPendientes] = useState([]);  // Cambié el nombre de la variable a "pendientes"

  const getPendientes = async () => {  // Cambié el nombre de la función a "getPendientes"
    db.collection("pendientes")  // Cambié la colección de "recordatorios" a "pendientes"
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

  const [recordatorios, setRecordatorios] = useState([]);  // Cambié el nombre de la variable a "pendientes"

  const getRecordatorios = async () => {  // Cambié el nombre de la función a "getPendientes"
    db.collection("recordatorios")  // Cambié la colección de "recordatorios" a "pendientes"
      .orderBy("fecha", "asc")
      .onSnapshot((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setRecordatorios(docs);
      });
  };

  useEffect(() => {
    getRecordatorios();
  }, []);


  return (
    <>
      <div className="bg-secondary mb-5">
        <h1 className="text-center text-white p-5 ">
          MANTENIMIENTO EN PROGRESO
        </h1>
      </div>
      <div className="container border rounded p-2 mb-5">
        <h4 className="d-flex justify-content-center text-danger">
          No Olvidar
        </h4>
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
          <button type="button" className="btn btn-outline-warning">
            <a
              href="/Recordatorios"
              className="text-decoration-none text-warning"
            >
              RECORDATORIOS
            </a>
          </button>
          <button type="button" className="btn btn-outline-info">
            <a href="/Pendientes" className="text-decoration-none text-info">
              TAREAS PENDIENTES
            </a>
          </button>

        </div>
        <hr />
      </div>
      <div className="container">
        <h4 className="d-flex justify-content-center p-3">
          Lista de Pendientes
        </h4>
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="text-center">Fecha</th>
              <th className="text-center">Nombre</th>
              <th className="text-center">Descripción</th>
            </tr>
          </thead>
          <tbody className="table-secondary border-white">
            {pendientes.map((pendiente) => (
              <tr
                key={pendiente.id}
                className={pendiente.completed ? "completed-task" : ""}
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
      </div>
    </>
  );
};

export default Home;
