import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../contexts/EventContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, DollarSign, Music, Clock, MapPin, Plus } from 'lucide-react'

const Dashboard = () => {
  const { getDashboardData, loading } = useEvents()
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      }
    }

    loadDashboard()
  }, [getDashboardData])

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatTime = (timeString) => {
    return timeString
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral da sua agenda musical</p>
        </div>
        <Link to="/novo-evento">
          <Button className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Evento</span>
          </Button>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.total_eventos_mes}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.mes_atual}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.faturamento_mes)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita do mês atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.proximos_eventos.length}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>
            Seus eventos agendados para os próximos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.proximos_eventos.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum evento agendado para os próximos dias</p>
              <Link to="/novo-evento">
                <Button>Agendar Primeiro Evento</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.proximos_eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{evento.nome_evento}</h3>
                    {evento.cliente && (
                      <p className="text-sm text-gray-600">Cliente: {evento.cliente}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(evento.data)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(evento.horario_inicio)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{evento.local}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {evento.valor && (
                      <p className="font-semibold text-green-600">
                        {formatCurrency(evento.valor)}
                      </p>
                    )}
                    <Link to={`/editar-evento/${evento.id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Link to="/eventos">
                  <Button variant="outline">Ver Todos os Eventos</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/novo-evento">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>Novo Evento</span>
              </Button>
            </Link>
            
            <Link to="/calendario">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Calendário</span>
              </Button>
            </Link>
            
            <Link to="/eventos">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Music className="h-6 w-6" />
                <span>Meus Eventos</span>
              </Button>
            </Link>
            
            <Link to="/relatorios">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <DollarSign className="h-6 w-6" />
                <span>Relatórios</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

