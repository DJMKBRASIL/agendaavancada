import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../contexts/EventContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, MapPin, DollarSign } from 'lucide-react'

const Calendar = () => {
  const { events, loadEvents, loading } = useEvents()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [monthEvents, setMonthEvents] = useState([])

  // Carregar eventos na inicialização
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Filtrar eventos do mês atual
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const filtered = events.filter(evento => {
      const eventDate = new Date(evento.data)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
    
    setMonthEvents(filtered)
  }, [events, currentDate])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatTime = (timeString) => {
    return timeString
  }

  // Navegação do calendário
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDateObj = new Date(startDate)
    
    for (let i = 0; i < 42; i++) { // 6 semanas x 7 dias
      const dayEvents = monthEvents.filter(evento => {
        const eventDate = new Date(evento.data)
        return eventDate.toDateString() === currentDateObj.toDateString()
      })
      
      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
        events: dayEvents
      })
      
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  // Eventos do dia selecionado
  const selectedDateEvents = selectedDate 
    ? monthEvents.filter(evento => {
        const eventDate = new Date(evento.data)
        return eventDate.toDateString() === selectedDate.toDateString()
      })
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
          <p className="text-gray-600 mt-1">Visualize seus eventos por data</p>
        </div>
        <Link to="/novo-evento">
          <Button className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Evento</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Hoje
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {/* Cabeçalho dos dias da semana */}
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Dias do calendário */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      p-2 min-h-[80px] border border-gray-100 cursor-pointer transition-colors
                      ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'}
                      ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}
                      ${selectedDate && selectedDate.toDateString() === day.date.toDateString() 
                        ? 'bg-indigo-50 border-indigo-200' : ''
                      }
                    `}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {day.date.getDate()}
                    </div>
                    
                    {/* Indicadores de eventos */}
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map((evento, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded truncate"
                          title={evento.nome_evento}
                        >
                          {evento.horario_inicio} {evento.nome_evento}
                        </div>
                      ))}
                      
                      {day.events.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{day.events.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel lateral */}
        <div className="space-y-6">
          {/* Resumo do mês */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Mês</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total de Eventos</span>
                <span className="font-semibold">{monthEvents.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Faturamento</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(monthEvents.reduce((sum, evento) => sum + (evento.valor || 0), 0))}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Eventos do dia selecionado */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length} evento(s) agendado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-4">Nenhum evento neste dia</p>
                    <Link to="/novo-evento">
                      <Button size="sm">Agendar Evento</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateEvents.map((evento) => (
                      <div key={evento.id} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {evento.nome_evento}
                        </h4>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(evento.horario_inicio)}
                              {evento.horario_fim && ` - ${formatTime(evento.horario_fim)}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{evento.local}</span>
                          </div>
                          
                          {evento.valor && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-semibold">{formatCurrency(evento.valor)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <Link to={`/editar-evento/${evento.id}`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Próximos eventos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const today = new Date()
                const upcomingEvents = events
                  .filter(evento => new Date(evento.data) >= today)
                  .sort((a, b) => new Date(a.data) - new Date(b.data))
                  .slice(0, 3)

                return upcomingEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum evento próximo
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((evento) => (
                      <div key={evento.id} className="text-sm">
                        <div className="font-medium text-gray-900">
                          {evento.nome_evento}
                        </div>
                        <div className="text-gray-600">
                          {new Date(evento.data).toLocaleDateString('pt-BR')} às {formatTime(evento.horario_inicio)}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Calendar

