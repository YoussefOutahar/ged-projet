import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment"
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { CourrielBureauOrdre } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre';
import axios from 'axios';

interface MyEventType {
  id: number;
  title: string;
  start: Date | null;
  end: Date | null;
  status: string;
  creator: string;
}

const index = () => {
  const { t } = useTranslation();
  const localizer = momentLocalizer(moment);
  const [courriels, setCourriels] = useState<CourrielBureauOrdre[]>([]);
  const [events, setEvents] = useState<MyEventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MyEventType | null>(null);

  useEffect(()=>{
    axios.get(`${process.env.NEXT_PUBLIC_COURRIEL_URL}`)
    .then((response)=>setCourriels(response.data))
    .catch((error)=> console.error("error lors get couriels",error))
  },[])

  const formatTachesToEvents = (tachesData: CourrielBureauOrdre[]) => {
    return tachesData.map((tache) => {
      return {
        id: tache.id,
        title: tache.sujet,
        start: tache.dateReception
          ? new Date(tache.dateReception)
          : new Date(),
        end: tache.dateEcheance ? new Date(tache.dateEcheance) : new Date(),
        creator: tache.intervenants ? tache.intervenants.map(intervenant =>
          intervenant.responsables.map(resp => `${resp.nom} ${resp.prenom}`).join(', ')
        ).join(', ') : ' ',
        status: tache.etatAvancement,
      };
    });
  };
  useEffect(()=>{
    if (courriels && courriels.length > 0) {
      const formattedEvents = formatTachesToEvents(courriels);
      setEvents(formattedEvents as MyEventType[]);
    } else {
      console.log("Aucune tâche disponible pour le moment.");
    }
  },[courriels])


  const eventStyleGetter = (event: MyEventType, start: Date, end: Date, isSelected: boolean ) => {
    let backgroundColor;
    switch (event.status) {
      case "TERMINE":
        backgroundColor = "#37df25";
        break;
      case "EN_ATTENTE":
        backgroundColor = "#df7625";
        break;
      case "REJETE":
        backgroundColor = "#df2525";
        break;
      case "EN_COURS":
        backgroundColor = "#a53c9b";
        break;
      default:
        backgroundColor = "#3c68a5";
    }
    const style = {
      backgroundColor,
      color: "white",
      border: "none",
    };

    return {
      style,
    };
  };

  const handleSelectEvent = (event: MyEventType) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };
  const renderStatusColor = () => {
    let color;
    if(selectedEvent)
    switch (selectedEvent.status) {
      case 'TERMINE':
        color = '#37df25';
        break;
      case 'EN_ATTENTE':
        color = '#df7625';
        break;
      case 'REJETE':
        color = '#df2525';
        break;
      case 'EN_COURS':
        color = '#a53c9b';
        break;
      default:
        color = "#3c68a5"
        break;
    }
    return color;
  };

const calculateRemainingTime = (endTime: Date | null): string => {
  if (!endTime) return '';

  const currentTime = new Date();
  const remainingTimeMs = endTime.getTime() - currentTime.getTime();

  if (remainingTimeMs <= 0) return 'Terminé';

  const remainingDays = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));

  const remainingTimeString = [];

  if (remainingDays > 0) {
    remainingTimeString.push(`${remainingDays} jour${remainingDays > 1 ? 's' : ''}`);
  }

  if (remainingHours > 0) {
    remainingTimeString.push(`${remainingHours} heure${remainingHours > 1 ? 's' : ''}`);
  }

  if (remainingMinutes > 0) {
    remainingTimeString.push(`${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`);
  }

  return remainingTimeString.join(' ');
};


  return (
    <div className='card'>
        <div className='flex flex-row'>
            <h2 className='mr-8'>Planning des Taches</h2>
        </div>
        <div>
            <Calendar
              localizer={localizer}
              defaultView='month'
              eventPropGetter={eventStyleGetter}
              events={events as MyEventType[]}
              backgroundEvents={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "650px", width: "100%" }}
              onSelectEvent={handleSelectEvent}
            /> 
        </div>
        {selectedEvent && (
          <Dialog visible={true} onHide={handleCloseDialog} header="Détails de l'événement" style={{ width: '40vw' }}
            modal
            className="p-fluid">
            <div className="p-grid p-dir-col">
              <div className="p-col mb-2">
                <span className="p-d-inline-flex p-ai-center font-bold text-2xl" style={{ color: renderStatusColor(), marginRight: '10px' }}>
                <span className="p-rounded-circle" style={{ width: '12px', height: '10px', backgroundColor: renderStatusColor(), marginRight: '5px' }}><i className='pi pi-calendar' /></span>
                  <strong>{selectedEvent.title.toLocaleUpperCase()}</strong>
                </span>
              </div>
              <div className="p-col mb-4">
              {`${selectedEvent.start?.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })} - ${selectedEvent.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} <strong>To </strong> {`${selectedEvent.end?.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })} - ${selectedEvent.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </div>
              <div className="p-col mb-2">
                <i className="pi pi-calendar-times mr-2" style={{ fontSize: '1.5rem' }}></i> {selectedEvent.creator}
              </div>
              <div className="p-col">
                <i className="pi pi-bell mr-2" style={{ fontSize: '1.5rem' }}></i> {calculateRemainingTime(selectedEvent.end)}
              </div>
            </div>
          </Dialog>
        )}
    </div>
  )
}

export default index
