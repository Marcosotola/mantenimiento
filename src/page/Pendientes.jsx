import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export const Recordatorios = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const initialStateValues = {
    data: "",
    name: "",
    descripcion: "",
  };

  const [values, setValues] = useState(initialStateValues);
  const [recordatorios, setRecordatorios] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [filterName, setFilterName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateData = (str) => {
    return str === "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateData(values.data)) {
      toast("ERROR: Ingrese una Fecha", {
        type: "error",
        autoClose: 2500,
        position: "top-center",
      });
    } else {
      addOrEditRecordatorio(values);
      setValues(initialStateValues);
      setCurrentId("");
    }
  };

  const addOrEditRecordatorio = async (recordatorioObject) => {
    try {
      if (currentId === "") {
        await db.collection("recordatorios").doc().set(recordatorioObject);

        toast("Recordatorio Agregado", {
          type: "success",
          autoClose: 1000,
          position: "top-center",
        });
      } else {
        await db.collection("recordatorios").doc(currentId).update(recordatorioObject);

        toast("Recordatorio Actualizado", {
          type: "info",
          autoClose: 1000,
          position: "top-center",
        });
        setCurrentId("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteRecordatorio = async (id) => {
    if (window.confirm("¿Desea eliminar el recordatorio?")) {
      await db.collection("recordatorios").doc(id).delete();

      toast("Recordatorio Eliminado", {
        type: "error",
        autoClose: 1000,
        position: "top-center",
      });
    }
  };

  const getRecordatorios = async () => {
    db.collection("recordatorios")
      .orderBy("name", "asc")
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });

        // Aplicar filtro por nombre
        const filteredRecordatorios = filterName
          ? docs.filter((recordatorio) =>
              recordatorio.name.toLowerCase().includes(filterName.toLowerCase())
            )
          : docs;

        setRecordatorios(filteredRecordatorios);
      });
  };

  useEffect(() => {
    getRecordatorios();
  }, [filterName]);

  const handleEditReminder = (id) => {
    const reminderToEdit = recordatorios.find((recordatorio) => recordatorio.id === id);
    if (reminderToEdit) {
      setValues({
        data: reminderToEdit.data,
        name: reminderToEdit.name,
        descripcion: reminderToEdit.descripcion,
      });
      setCurrentId(id);
    }
  };

  const handleToggleTask = (id) => {
    // Actualizar el estado de las tareas marcadas como realizadas
    setRecordatorios((prevRecordatorios) =>
      prevRecordatorios.map((recordatorio) =>
        recordatorio.id === id ? { ...recordatorio, completed: !recordatorio.completed } : recordatorio
      )
    );
  };

  return (
    <>
      <div>
        <div className=" col-md-6 mx-auto p-2">
          <h4 className="d-flex justify-content-center p-3">Ingresar Pendiente</h4>
          <form className="card card-body p-4" onSubmit={handleSubmit}>
            <div className="form-group input-group p-1">
              <div className="input-group-text bg-light">
                <i className="material-icons text-primary">event</i>
              </div>
              <input
                type="date"
                className="form-control"
                placeholder="Fecha (DD/MM/AAAA)"
                name="data"
                onChange={handleInputChange}
                value={values.data}
              />
            </div>

            <div className="form-group input-group p-1">
              <div className="input-group-text bg-light">
                <i className="material-icons text-primary">create</i>
              </div>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Cliente"
                onChange={handleInputChange}
                value={values.name}
              />
            </div>
            <div className="form-group p-1">
              <textarea
                name="descripcion"
                rows="3"
                className="form-control"
                placeholder="Descripción"
                onChange={handleInputChange}
                value={values.descripcion}
              ></textarea>
            </div>

            <button className="btn btn-primary btn-block m-1">
              {currentId === "" ? "GUARDAR" : "ACTUALIZAR"}
            </button>
          </form>
        </div>

        <div className=" col-md-8 mx-auto p-2">
          <h4 className="d-flex justify-content-center p-3">Reporte de Pendientes</h4>
          <div className="form-group input-group p-1 mb-3">
            <div className="input-group-text bg-light">
              <i className="material-icons text-primary">search</i>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Filtrar por Cliente"
              onChange={(e) => setFilterName(e.target.value)}
              value={filterName}
            />
          </div>
          {recordatorios.map((recordatorio) => (
            <div
              className={`card mb-1 text-center mb-5 ${
                recordatorio.completed ? "completed-task" : ""
              }`}
              key={recordatorio.id}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <button className="btn btn-lg btn-secundary border">
                      {" "}
                      <input
                        type="checkbox"
                        checked={recordatorio.completed}
                        onChange={() => handleToggleTask(recordatorio.id)}
                      />
                    </button>
                  </div>
                  <div>
                    <h6 className="text-info">{recordatorio.data}</h6>
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4
                      className={`text-success ${
                        recordatorio.completed ? "task-completed" : ""
                      }`}
                    >
                      {recordatorio.name}
                    </h4>
                  </div>
                  <div>
                    <button className="btn">
                      <i
                        className="material-icons text-danger"
                        onClick={() => onDeleteRecordatorio(recordatorio.id)}
                      >
                        delete
                      </i>
                    </button>
                    <button className="btn" onClick={scrollToTop}>
                      <i
                        className="material-icons"
                        onClick={() => handleEditReminder(recordatorio.id)}
                      >
                        edit
                      </i>
                    </button>
                  </div>
                </div>
                <p
                  className={`task-description ${
                    recordatorio.completed ? "task-completed" : ""
                  }`}
                >
                  {recordatorio.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Recordatorios;

