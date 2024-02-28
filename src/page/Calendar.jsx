import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Import Spanish locale for moment
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
  showMore: 'Ver más',
  noEventsInRange: 'No hay eventos en este rango',
  // Add more message translations if needed
};

// Function to generate a random color using Math.random
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await db.collection('events').get();
        const fetchedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          start: doc.data().start.toDate(),
          end: doc.data().end.toDate(),
          extendedProps: { // Add extendedProps for color
            color: generateRandomColor(),
          },
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();

    const unsubscribe = db.collection('events').onSnapshot(snapshot => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        start: doc.data().start.toDate(),
        end: doc.data().end.toDate(),
        extendedProps: {
          color: generateRandomColor(),
        },
      }));
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    const title = prompt('Ingrese el título del evento:');
    if (title) {
      try {
        await db.collection('events').add({
          title,
          start,
          end,
          extendedProps: {
            color: generateRandomColor(), // Generate random color on adding event
          },
        });
      } catch (error) {
        console.error("Error adding event: ", error);
      }
    }
  };

  const handleSelectEvent = async (event) => {
    const shouldDelete = window.confirm(`¿Estás seguro de que quieres eliminar el evento "${event.title}"?`);
    if (shouldDelete) {
      try {
        await db.collection('events').doc(event.id).delete();
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
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
        onSelectEvent={handleSelectEvent}
        messages={spanishMessages}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.extendedProps.color, // Use the color from extendedProps
          },
        })}
      />
    </div>
  );
};

export default CalendarComponent;
