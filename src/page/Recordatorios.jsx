import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { parse, format } from 'date-fns';


const Recordatorios = () => {
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [recordatorios, setRecordatorios] = useState([]);

  // Declarar la función fuera del bloque del efecto
  const obtenerRecordatorios = async () => {
    const snapshot = await db.collection('recordatorios').get();
    setRecordatorios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    // Llamar a la función desde el efecto
    obtenerRecordatorios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fecha && descripcion) {
      await db.collection('recordatorios').add({
        fecha,
        descripcion,
      });

      setFecha('');
      setDescripcion('');

      toast("Recordatorio Agregado", {
        type: "success",
        autoClose: 1500,
        position: "top-center",
      });

      obtenerRecordatorios();
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este recordatorio?')) {
      await db.collection('recordatorios').doc(id).delete();

      toast("Recordatorio Eliminado", {
        type: "error",
        autoClose: 1500,
        position: "top-center",
      });

      obtenerRecordatorios();
    }
  };

  return (
    <div className="container mt-5">
      <h4 className="d-flex justify-content-center p-3">Ingresar Recordatorio</h4>

      <form className='card card-body p-4' onSubmit={handleSubmit}>
        <div className="form-group input-group p-1">
          <div className="input-group-text bg-light">
            <i className="material-icons text-primary">event</i>
          </div>
          <input
            type="date"
            className="form-control"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            id="descripcion"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder='Descripcion'
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>

      <table className="table mt-4">
        <thead>
          <tr className=''>
            <th className='text-center'>Fecha</th>
            <th className='text-center'>Descripción</th>

          </tr>
        </thead>
        <tbody>
          {recordatorios.map(recordatorio => (
            <tr key={recordatorio.id}>
              <td className='text-center justify-content-center align-items-center'>
                {format(parse(recordatorio.fecha, 'yyyy-MM-dd', new Date()), 'dd/MM/yy')}
              </td>
              <td className='text-center justify-content-center align-items-center'>{recordatorio.descripcion}</td>
              <td>
                <button className="btn justify-content-center align-items-center">
                  <i
                    className="material-icons text-danger"
                    onClick={() => handleEliminar(recordatorio.id)}
                  >
                    delete
                  </i>
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recordatorios;



