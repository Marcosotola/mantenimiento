import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { toast } from "react-toastify";
import { format } from 'date-fns';

export const Holcim = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const initialStateValues = {
    data: "",
    imageUrl: "",
  };

  const [values, setValues] = useState(initialStateValues);
  const [pendientes, setPendientes] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [file, setFile] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [hashFragment, setHashFragment] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
        await db.collection("holcim").doc().set(pendienteObject);

        toast("Pendiente Agregado", {
          type: "success",
          autoClose: 1000,
          position: "top-center",
        });
      } else {
        await db.collection("holcim").doc(currentId).update(pendienteObject);

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
      await db.collection("holcim").doc(id).delete();

      toast("Pendiente Eliminado", {
        type: "error",
        autoClose: 1000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    const getPendientes = async () => {
      let query = db.collection("holcim").orderBy("data", "asc");
      if (filterDate !== "") {
        query = query.where("data", "==", filterDate);
      }
      query.onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });

        setPendientes(docs);
      });
    };

    getPendientes();
  }, [filterDate]);

  const handleEditReminder = (id) => {
    const reminderToEdit = pendientes.find((pendiente) => pendiente.id === id);
    if (reminderToEdit) {
      setValues({
        data: reminderToEdit.data,
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
        <h1 className="text-center text-primary m-5">Holcim OT</h1>
        <div className=" col-md-6 mx-auto p-2">
          {!mostrarFormulario ? (
            <button
              className="btn btn-primary"
              onClick={() => setMostrarFormulario(true)}
            >
              <i className="material-icons">add</i> Agregar OT
            </button>
          ) : (
            <>
              <h4 className="d-flex justify-content-center p-3">Ingresar OT</h4>
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
          <h4 className="d-flex justify-content-center p-3">Ordenes de Trabajo</h4>
          <div className="form-group input-group p-1 mb-3">
            <div className="input-group-text bg-light">
              <i className="material-icons text-primary">search</i>
            </div>
            <input
              type="date"
              className="form-control"
              placeholder="Filtrar por Fecha"
              onChange={(e) => setFilterDate(e.target.value)}
              value={filterDate}
            />
          </div>
          {pendientes.map((pendiente) => (
            <div
              className={`card mb-1 text-center mb-5`}
              key={pendiente.id}
              id={pendiente.id} // Asignar el ID del pendiente como ID del elemento
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-info">
                      {format(new Date(pendiente.data), 'dd/MM/yyyy')}
                    </h6>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
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
                </div>
                

                {pendiente.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={pendiente.imageUrl}
                      alt="Imagen adjunta"
                      style={{ width: "50px", cursor: "pointer" }}
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

export default Holcim;
