import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { toast } from "react-toastify";
import { parse, format } from 'date-fns';

export const Pendientes = () => {
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
  const [pendientes, setPendientes] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [file, setFile] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [hashFragment, setHashFragment] = useState("");

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

  const addOrEditPendiente = async (pendienteObject) => {
    try {
      if (currentId === "") {
        await db.collection("pendientes").doc().set(pendienteObject);

        toast("Pendiente Agregado", {
          type: "success",
          autoClose: 1000,
          position: "top-center",
        });
      } else {
        await db.collection("pendientes").doc(currentId).update(pendienteObject);

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

  const onDeletePendiente = async (id) => {
    if (window.confirm("¿Desea eliminar el pendiente?")) {
      await db.collection("pendientes").doc(id).delete();

      toast("Pendiente Eliminado", {
        type: "error",
        autoClose: 1000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    const getPendientes = async () => {
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

    getPendientes();
  }, [filterName]);

  const handleToggleTask = (id) => {
    setPendientes((prevPendientes) =>
      prevPendientes.map((pendiente) =>
        pendiente.id === id ? { ...pendiente, completed: !pendiente.completed } : pendiente
      )
    );
  };

  const handleEditReminder = (id) => {
    const reminderToEdit = pendientes.find((pendiente) => pendiente.id === id);
    if (reminderToEdit) {
      setValues({
        data: reminderToEdit.data,
        name: reminderToEdit.name,
        descripcion: reminderToEdit.descripcion,
      });
      setCurrentId(id);
      setMostrarFormulario(true); // Mostrar el formulario al editar
    }
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

      addOrEditPendiente({ ...values, imageUrl: fileUrl });
      setFile(null);

      setValues(initialStateValues);
      setCurrentId("");
      setMostrarFormulario(false); // Ocultar el formulario después de enviar
    }
  };

  useEffect(() => {
    // Scroll al elemento con el ID correspondiente cuando el fragmento de URL cambia
    const handleHashChange = () => {

      const hash = window.location.hash.substring(1);

      setHashFragment(hash);
    };

    const handlePageLoad = () => {

      const hash = window.location.hash.substring(1);

      setHashFragment(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("load", handlePageLoad);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  useEffect(() => {
    // Scroll al elemento con el ID correspondiente después de que la página se haya cargado completamente
    const handleScrollToElement = () => {
      if (hashFragment) {

        // Retrasar la búsqueda del elemento hasta que la página esté completamente cargada
        const interval = setInterval(() => {
          const element = document.getElementById(hashFragment);

          if (element) {
            clearInterval(interval);
            element.scrollIntoView({ behavior: "smooth", block: "start" });

          }
        }, 100); // Intenta cada 100ms
      }
    };
  
    handleScrollToElement();
  
    return () => {
      handleScrollToElement();
    };
  }, [hashFragment]);
  

  return (
    <>
      <div>
        <div className=" col-md-6 mx-auto p-2">
          {!mostrarFormulario ? (
            <button
              className="btn btn-primary"
              onClick={() => setMostrarFormulario(true)}
            >
              <i className="material-icons">add</i> Agregar Correctivo
            </button>
          ) : (
            <>
              <h4 className="d-flex justify-content-center p-3">Ingresar Correctivo</h4>
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
            </>
          )}
        </div>

        <div className=" col-md-8 mx-auto p-2">
          <h4 className="d-flex justify-content-center p-3">Correctivos</h4>
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
          {pendientes.map((pendiente) => (
            <div
              className={`card mb-1 text-center mb-5 ${pendiente.completed ? "completed-task" : ""}`}
              key={pendiente.id}
              id={pendiente.id} // Asignar el ID del pendiente como ID del elemento
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
                    <h6 className="text-info">
                      {format(parse(pendiente.data, 'yyyy-MM-dd', new Date()), 'dd/MM/yy')}
                    </h6>
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

export default Pendientes;



