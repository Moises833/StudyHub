import { useState, useEffect } from "react";
import { getEvents, addEvent } from "../../helpers/projects";
import { getCurrentUser } from "../../helpers/auth";
import { speak } from "../../helpers/speech";

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", type: "tarea" });

  // Eventos cargados desde localStorage (studyhub_events)
  const [eventos, setEventos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Días del mes siguiente para completar la cuadrícula
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return eventos.filter((evento) => {
      // Parse date strings like 'YYYY-MM-DD' as local dates to avoid timezone shifts
      let eventDate;
      if (typeof evento.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(evento.date)) {
        const [y, m, d] = evento.date.split('-').map(Number);
        eventDate = new Date(y, m - 1, d);
      } else {
        eventDate = new Date(evento.date);
      }
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "proyecto":
        return "bg-blue-500";
      case "tarea":
        return "bg-green-500";
      case "examen":
        return "bg-red-500";
      case "reunion":
        return "bg-purple-500";
      case "presentacion":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split("T")[0];
    setNewEvent({ ...newEvent, date: dateStr });
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      // Persistir evento en localStorage (asociado al usuario actual)
      addEvent({
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time || "00:00",
        type: newEvent.type,
        userId: currentUser?.id || null,
      });
      // Recargar eventos desde storage (filtrados por usuario)
      setEventos(getEvents(currentUser?.id).map(e => ({ ...e })));
      setNewEvent({ title: "", date: "", time: "", type: "tarea" });
      setShowEventModal(false);
      speak(`Evento ${newEvent.title} agregado al calendario`);
    }
  };

  useEffect(() => {
    // Cargar usuario actual y eventos desde localStorage al montar
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const loaded = getEvents(user.id);
      setEventos(loaded.map(e => ({ ...e })));
    } else {
      setEventos([]);
    }

    const onDataChanged = () => {
      const u = getCurrentUser();
      setCurrentUser(u);
      if (u) {
        const loaded = getEvents(u.id);
        setEventos(loaded.map(e => ({ ...e })));
      } else {
        setEventos([]);
      }
    };
    try {
      if (typeof window !== 'undefined') {
        window.addEventListener('studyhub:data-changed', onDataChanged);
      }
    } catch (error) { void error; }

    return () => {
      try {
        if (typeof window !== 'undefined') {
          window.removeEventListener('studyhub:data-changed', onDataChanged);
        }
      } catch (error) { void error; }
    };
  }, []);

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Calendario</h1>
            <p className="text-gray-600 text-lg">
              Organiza tus eventos, tareas y fechas importantes
            </p>
          </div>
          <button
            onClick={() => {
              const today = new Date();
              setNewEvent({
                title: "",
                date: today.toISOString().split("T")[0],
                time: "",
                type: "tarea",
              });
              setShowEventModal(true);
            }}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Evento
          </button>
        </div>

        {/* Navegación del calendario */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 min-w-[200px] text-center">
              {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg font-medium transition-colors"
          >
            Hoy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="text-center text-sm font-semibold text-gray-600 py-2"
              >
                {dia}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.date);
              const isSelected =
                selectedDate &&
                day.date.getDate() === selectedDate.getDate() &&
                day.date.getMonth() === selectedDate.getMonth() &&
                day.date.getFullYear() === selectedDate.getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-all ${!day.isCurrentMonth
                    ? "bg-gray-50 border-gray-200 opacity-50"
                    : "bg-white border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                    } ${isToday(day.date)
                      ? "border-sky-500 border-2 bg-sky-50"
                      : ""
                    } ${isSelected ? "border-sky-600 border-2 bg-sky-100" : ""
                    }`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${isToday(day.date)
                      ? "text-sky-600 font-bold"
                      : day.isCurrentMonth
                        ? "text-gray-800"
                        : "text-gray-400"
                      }`}
                  >
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((evento) => (
                      <div
                        key={evento.id}
                        className={`${getEventTypeColor(
                          evento.type
                        )} text-white text-xs px-1 py-0.5 rounded truncate`}
                        title={evento.title}
                      >
                        {evento.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel lateral - Eventos del día seleccionado */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {selectedDate
              ? `Eventos - ${selectedDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`
              : "Selecciona un día"}
          </h3>

          {selectedDate && selectedDateEvents.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600">No hay eventos para este día</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((evento) => (
                <div
                  key={evento.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`${getEventTypeColor(
                        evento.type
                      )} w-3 h-3 rounded-full mt-1.5 flex-shrink-0`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {evento.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{evento.time}</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {evento.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leyenda */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Leyenda</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Proyecto</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600">Tarea</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600">Examen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-gray-600">Reunión</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-600">Presentación</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar evento */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Nuevo Evento</h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setNewEvent({ title: "", date: "", time: "", type: "tarea" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Nombre del evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="tarea">Tarea</option>
                  <option value="proyecto">Proyecto</option>
                  <option value="examen">Examen</option>
                  <option value="reunion">Reunión</option>
                  <option value="presentacion">Presentación</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setNewEvent({ title: "", date: "", time: "", type: "tarea" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;

