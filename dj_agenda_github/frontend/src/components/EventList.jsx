import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../contexts/EventContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Filter,
  Music
} from 'lucide-react'

const EventList = () => {
  const { events, loadEvents, deleteEvent, loading } = useEvents()
  const [filteredEvents, setFilteredEvents] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    mes: '',
    ano: new Date().getFullYear().toString(),
    local: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Carregar eventos na inicialização
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...events]

    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(evento =>
        evento.nome_evento.toLowerCase().includes(searchLower) ||
        (evento.cliente && evento.cliente.toLowerCase().includes(searchLower)) ||
        evento.local.toLowerCase().includes(searchLower)
      )
    }

    // Filtro de mês e ano
    if (filters.mes && filters.ano) {
      filtered = filtered.filter(evento => {
        const eventDate = new Date(evento.data)
        return eventDate.getMonth() + 1 === parseInt(filters.mes) &&
               eventDate.getFullYear() === parseInt(filters.ano)
      })
    } else if (filters.ano) {
      filtered = filtered.filter(evento => {
        const eventDate = new Date(evento.data)
        return eventDate.getFullYear() === parseInt(filters.ano)
      })
    }

    // Filtro de local
    if (filters.local) {
      const localLower = filters.local.toLowerCase()
      filtered = filtered.filter(evento =>
        evento.local.toLowerCase().includes(localLower)
      )
    }

    // Ordenar por data
    filtered.sort((a, b) => {
      const dateA = new Date(a.data + ' ' + a.horario_inicio)
      const dateB = new Date(b.data + ' ' + b.horario_inicio)
      return dateB - dateA // Mais recentes primeiro
    })

    setFilteredEvents(filtered)
  }, [events, filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleDeleteEvent = async (id, nomeEvento) => {
    if (window.confirm(`Tem certeza que deseja excluir o evento "${nomeEvento}"?`)) {
      try {
        await deleteEvent(id)
      } catch (error) {
        alert('Erro ao excluir evento. Tente novamente.')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getEventStatus = (data) => {
    const today = new Date()
    const eventDate = new Date(data)
    
    if (eventDate < today) {
      return { status: 'Realizado', color: 'text-gray-500 bg-gray-100' }
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { status: 'Hoje', color: 'text-blue-600 bg-blue-100' }
    } else {
      return { status: 'Agendado', color: 'text-green-600 bg-green-100' }
    }
  }

  // Gerar opções de anos (últimos 3 anos + próximos 2 anos)
  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let year = currentYear - 3; year <= currentYear + 2; year++) {
    yearOptions.push(year.toString())
  }

  const monthOptions = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ]

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
          <h1 className="text-3xl font-bold text-gray-900">Meus Eventos</h1>
          <p className="text-gray-600 mt-1">Gerencie sua agenda musical</p>
        </div>
        <Link to="/novo-evento">
          <Button className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Evento</span>
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Buscar e Filtrar</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Ocultar' : 'Filtros'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar eventos</Label>
            <Input
              id="search"
              placeholder="Nome do evento, cliente ou local..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Filtros avançados */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Ano</Label>
                <Select
                  value={filters.ano}
                  onValueChange={(value) => handleFilterChange('ano', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os anos</SelectItem>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mês</Label>
                <Select
                  value={filters.mes}
                  onValueChange={(value) => handleFilterChange('mes', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os meses</SelectItem>
                    {monthOptions.map(month => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  placeholder="Filtrar por local..."
                  value={filters.local}
                  onChange={(e) => handleFilterChange('local', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Eventos ({filteredEvents.length})
          </CardTitle>
          <CardDescription>
            {filteredEvents.length === 0 && events.length > 0
              ? 'Nenhum evento encontrado com os filtros aplicados'
              : 'Lista de todos os seus eventos'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {events.length === 0 ? 'Nenhum evento cadastrado' : 'Nenhum evento encontrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {events.length === 0 
                  ? 'Comece criando seu primeiro evento musical'
                  : 'Tente ajustar os filtros para encontrar seus eventos'
                }
              </p>
              {events.length === 0 && (
                <Link to="/novo-evento">
                  <Button>Criar Primeiro Evento</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((evento) => {
                const eventStatus = getEventStatus(evento.data)
                
                return (
                  <div
                    key={evento.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Título e Status */}
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {evento.nome_evento}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
                            {eventStatus.status}
                          </span>
                        </div>

                        {/* Cliente */}
                        {evento.cliente && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{evento.cliente}</span>
                          </div>
                        )}

                        {/* Informações do evento */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(evento.data)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {evento.horario_inicio}
                              {evento.horario_fim && ` - ${evento.horario_fim}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{evento.local}</span>
                          </div>
                        </div>

                        {/* Valor */}
                        {evento.valor && (
                          <div className="flex items-center space-x-2 text-green-600 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(evento.valor)}</span>
                          </div>
                        )}

                        {/* Observações */}
                        {evento.observacoes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {evento.observacoes}
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex space-x-2 mt-4 lg:mt-0 lg:ml-6">
                        <Link to={`/editar-evento/${evento.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <Edit className="h-4 w-4" />
                            <span>Editar</span>
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(evento.id, evento.nome_evento)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Excluir</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EventList

