import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { db } from "../firebase";
import './Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const spanishMessages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  showMore: total => `+ Mostrar más (${total})`, // Función showMore actualizada
  noEventsInRange: 'No hay eventos en este rango',
};

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month'); // Nuevo estado para almacenar la vista actual

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await db.collection('events').get();
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          start: doc.data().start.toDate(),
          end: doc.data().end.toDate(),
          completed: doc.data().completed,
          color: doc.data().completed ? '#009929' : '#ff4040',
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error al obtener eventos: ", error);
      }
    };

    fetchEvents();

    const unsubscribe = db.collection('events').onSnapshot(async (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        start: doc.data().start.toDate(),
        end: doc.data().end.toDate(),
        completed: doc.data().completed,
        color: doc.data().completed ? '#009929' : '#ff4040',
      }));
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    if (view === 'day') { // Verificar si la vista actual es día
      const title = prompt('Ingrese el título del evento:');
      if (title) {
        try {
          await db.collection('events').add({
            title,
            start,
            end,
            completed: false, // Agregar propiedad para el estado de la casilla
            color: '#ff4040', // Rojo menos claro
          });
        } catch (error) {
          console.error("Error al agregar evento: ", error);
        }
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const shouldDelete = window.confirm("¿Estás seguro de que quieres eliminar este evento?");
    if (shouldDelete) {
      try {
        await db.collection('events').doc(eventId).delete();
      } catch (error) {
        console.error("Error al eliminar evento: ", error);
      }
    }
  };

  const handleCheckboxChange = async (event) => {
    const updatedEvent = { ...event, completed: !event.completed };
    try {
      // Actualizar en Firebase
      await db.collection('events').doc(event.id).update(updatedEvent);

      // Actualizar el estado local después de la actualización exitosa
      const updatedEvents = events.map(ev => ev.id === event.id ? updatedEvent : ev);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error al actualizar evento: ", error);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onView={(view) => setView(view)} // Actualizar el estado de la vista actual
        messages={spanishMessages}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.completed ? '#009929' : '#ff4040', // Usar el color del evento
          },
        })}
        components={{
            event: ({ event }) => (
              <div className="event-container">
                <input
                  className='checkbox-input'
                  type="checkbox"
                  checked={event.completed}
                  onChange={() => handleCheckboxChange(event)}
                />
                <span className="event-title">{event.title}</span>
                <button className='delete-button' onClick={() => handleDeleteEvent(event.id)}>
                <i className="fas fa-trash-alt"></i> 
              </button>
              </div>
            ),
          }}
        />
      </div>
    );
  };
  
  export default CalendarComponent;







