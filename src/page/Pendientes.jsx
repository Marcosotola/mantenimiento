import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { toast } from "react-toastify";
import { format } from 'date-fns';

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
    imageUrl: "",
  };

  const [values, setValues] = useState(initialStateValues);
  const [pendientes, setPendientes] = useState([]);  // Cambié el nombre de la variable a "pendientes"
  const [currentId, setCurrentId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateData = (str) => {
    return str === "";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateData(values.data)) {
      toast("ERROR: Ingrese una Fecha", {
        type: "error",
        autoClose: 2500,
        position: "top-center",
      });
    } else {
      let fileUrl = "";
      if (file) {
        const fileRef = storage.ref(`images/${file.name}`);
        await fileRef.put(file);
        fileUrl = await fileRef.getDownloadURL();
      }

      addOrEditPendiente({ ...values, imageUrl: fileUrl });  // Cambié el nombre de la función a "addOrEditPendiente"
      setFile(null);

      setValues(initialStateValues);
      setCurrentId("");
    }
  };

  const addOrEditPendiente = async (pendienteObject) => {  // Cambié el nombre de la función a "addOrEditPendiente"
    try {
      if (currentId === "") {
        await db.collection("pendientes").doc().set(pendienteObject);  // Cambié la colección a "pendientes"

        toast("Pendiente Agregado", {
          type: "success",
          autoClose: 1000,
          position: "top-center",
        });
      } else {
        await db.collection("pendientes").doc(currentId).update(pendienteObject);  // Cambié la colección a "pendientes"

        toast("Pendiente Actualizado", {
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

  const onDeletePendiente = async (id) => {  // Cambié el nombre de la función a "onDeletePendiente"
    if (window.confirm("¿Desea eliminar el pendiente?")) {
      await db.collection("pendientes").doc(id).delete();  // Cambié la colección a "pendientes"

      toast("Pendiente Eliminado", {
        type: "error",
        autoClose: 1000,
        position: "top-center",
      });
    }
  };

  const getPendientes = async () => {  // Cambié el nombre de la función a "getPendientes"
    db.collection("pendientes")
      .orderBy("name", "asc")
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });

        const filteredPendientes = filterName
          ? docs.filter((pendiente) =>
              pendiente.name.toLowerCase().includes(filterName.toLowerCase())
            )
          : docs;

        setPendientes(filteredPendientes);
      });
  };

  useEffect(() => {
    getPendientes();
  }, [filterName],);

  const handleEditReminder = (id) => {
    const reminderToEdit = pendientes.find((pendiente) => pendiente.id === id);
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
    setPendientes((prevPendientes) =>
      prevPendientes.map((pendiente) =>
        pendiente.id === id ? { ...pendiente, completed: !pendiente.completed } : pendiente
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

            <div className="form-group input-group p-1">
              <div className="input-group-text bg-light">
                <i className="material-icons text-primary">attach_file</i>
              </div>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                name="file"
                onChange={handleFileChange}
              />
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
          {pendientes.map((pendiente) => (  // Cambié el nombre de la variable a "pendientes"
            <div
              className={`card mb-1 text-center mb-5 ${pendiente.completed ? "completed-task" : ""}`}
              key={pendiente.id}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <button className="btn btn-lg btn-secundary border">
                      <input
                        type="checkbox"
                        checked={pendiente.completed}
                        onChange={() => handleToggleTask(pendiente.id)}
                      />
                    </button>
                  </div>
                  <div>
                    <h6 className="text-info">{format(new Date(pendiente.data), "dd/MM/yy")}</h6>
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4
                      className={`text-success ${pendiente.completed ? "task-completed" : ""}`}
                    >
                      {pendiente.name}
                    </h4>
                  </div>
                  <div>
                    <button className="btn">
                      <i
                        className="material-icons text-danger"
                        onClick={() => onDeletePendiente(pendiente.id)}
                      >
                        delete
                      </i>
                    </button>
                    <button className="btn" onClick={scrollToTop}>
                      <i
                        className="material-icons"
                        onClick={() => handleEditReminder(pendiente.id)}
                      >
                        edit
                      </i>
                    </button>
                  </div>
                </div>
                <p
                  className={`task-description ${pendiente.completed ? "task-completed" : ""}`}
                >
                  {pendiente.descripcion}
                </p>

                {pendiente.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={pendiente.imageUrl}
                      alt="Imagen adjunta"
                      style={{ width: "100px", cursor: "pointer" }}
                      onClick={() => window.open(pendiente.imageUrl, "_blank")}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Recordatorios;


