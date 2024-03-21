import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
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
  showMore: total => `+ Mostrar más (${total})`,
  noEventsInRange: 'No hay eventos en este rango',
};

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await db.collection('events').get();
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          start: doc.data().start.toDate(),
          end: doc.data().end.toDate(),
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
      }));
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    if (view === 'day' && moment(start).isSame(end, 'day')) {
      const title = prompt('Ingrese el título del evento:');
      if (title) {
        try {
          await db.collection('events').add({
            title,
            start,
            end,
            completed: false,
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
      await db.collection('events').doc(event.id).update(updatedEvent);
      const updatedEvents = events.map(ev => ev.id === event.id ? updatedEvent : ev);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error al actualizar evento: ", error);
    }
  };

  const customDayEvent = ({ event }) => (
    <div className="event-container" style={{ backgroundColor: '#f0f0f0', border: 'none' }}>
      <input
        className='checkbox-input'
        type="checkbox"
        checked={event.completed}
        onChange={() => handleCheckboxChange(event)}
      />
      <span className="event-title" style={{ color: event.completed ? '#009929' : '#ff4040' }}>{event.title}</span>
      <button className='delete-button' onClick={() => handleDeleteEvent(event.id)}>
        <i className="fas fa-trash-alt"></i> 
      </button>
    </div>
  );

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        views={{ day: true, month: true }}
        defaultView={Views.MONTH}
        selectable
        onSelectSlot={handleSelectSlot}
        onView={(view) => setView(view)}
        messages={spanishMessages}
        timeslots={2}
        min={moment().startOf('day').set({ hour: 9, minute: 0 })}
        max={moment().startOf('day').set({ hour: 18, minute: 0 })}
        components={{ event: customDayEvent }}
      />
    </div>
  );
};

export default CalendarComponent;















