import React, { useState, useEffect } from "react";
import { db } from "../firebase";

export const Home = () => {
  const [recordatorios, setRecordatorios] = useState([]);

  const getRecordatorios = async () => {
    db.collection("recordatorios")
      .orderBy("name", "asc")
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
      <div>
        <hr />
        <div class="container d-grid gap-3 mt-4 mb-4">
          <button class="btn btn-outline-info" type="button">
            <a href="/Pendientes" className="text-decoration-none text-info">
              TAREAS PENDIENTES
            </a>
          </button>
          <button class="btn btn-outline-warning" type="button">
            <a
              href="/Recordatorios"
              className="text-decoration-none text-warning"
            >
              RECORDATORIOS
            </a>
          </button>
        </div>
        <hr />
      </div>
      <div className="col-md-8 mx-auto p-2">
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
          <tbody className="table-active">
            {recordatorios.map((recordatorio) => (
              <tr
                key={recordatorio.id}
                className={recordatorio.completed ? "completed-task" : ""}
              >
                <td>{recordatorio.data}</td>
                <td
                  className={`text-success ${
                    recordatorio.completed ? "task-completed" : ""
                  }`}
                >
                  {recordatorio.name}
                </td>
                <td
                  className={`task-description ${
                    recordatorio.completed ? "task-completed" : ""
                  }`}
                >
                  {recordatorio.descripcion}
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
