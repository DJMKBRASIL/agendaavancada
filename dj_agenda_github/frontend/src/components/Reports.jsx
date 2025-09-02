import { useState, useEffect } from 'react'
import { useEvents } from '../contexts/EventContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock,
  Download,
  BarChart3
} from 'lucide-react'

const Reports = () => {
  const { getMonthlyReport, getAnnualReport, cleanupExpiredEvents, loading } = useEvents()
  const [reportType, setReportType] = useState('mensal')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [reportData, setReportData] = useState(null)
  const [loadingReport, setLoadingReport] = useState(false)

  // Carregar relatório inicial
  useEffect(() => {
    loadReport()
  }, [reportType, selectedMonth, selectedYear])

  const loadReport = async () => {
    setLoadingReport(true)
    try {
      let data
      if (reportType === 'mensal') {
        data = await getMonthlyReport(selectedMonth, selectedYear)
      } else {
        data = await getAnnualReport(selectedYear)
      }
      setReportData(data)
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
    } finally {
      setLoadingReport(false)
    }
  }

  const handleCleanup = async () => {
    if (window.confirm('Tem certeza que deseja excluir eventos vencidos (mais de 30 dias)?')) {
      try {
        const result = await cleanupExpiredEvents()
        alert(`${result.count} eventos vencidos foram excluídos.`)
        loadReport() // Recarregar relatório
      } catch (error) {
        alert('Erro ao limpar eventos vencidos.')
      }
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  // Gerar opções de anos
  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let year = currentYear - 3; year <= currentYear + 2; year++) {
    yearOptions.push(year)
  }

  const monthOptions = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ]

  // Cores para gráficos
  const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16']

  if (loading || loadingReport) {
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
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análise detalhada da sua performance</p>
        </div>
        <Button
          variant="outline"
          onClick={handleCleanup}
          className="mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Limpar Eventos Vencidos</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ano</Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {reportType === 'mensal' && (
              <div className="space-y-2">
                <Label>Mês</Label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-end">
              <Button onClick={loadReport} className="w-full">
                Atualizar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <>
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportType === 'mensal' ? reportData.total_eventos : reportData.total_eventos_ano}
                </div>
                <p className="text-xs text-muted-foreground">
                  {reportType === 'mensal' 
                    ? `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                    : `Ano ${selectedYear}`
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    reportType === 'mensal' ? reportData.total_faturamento : reportData.total_faturamento_ano
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Receita total do período
                </p>
              </CardContent>
            </Card>

            {reportType === 'mensal' && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        reportData.total_eventos > 0 
                          ? reportData.total_faturamento / reportData.total_eventos 
                          : 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Por evento
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Local Mais Frequente</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold truncate">
                      {reportData.locais_frequentes.length > 0 
                        ? reportData.locais_frequentes[0][0] 
                        : 'N/A'
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {reportData.locais_frequentes.length > 0 
                        ? `${reportData.locais_frequentes[0][1]} evento(s)`
                        : 'Nenhum evento'
                      }
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportType === 'mensal' ? (
              <>
                {/* Eventos por Dia da Semana */}
                <Card>
                  <CardHeader>
                    <CardTitle>Eventos por Dia da Semana</CardTitle>
                    <CardDescription>Distribuição dos eventos ao longo da semana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={Object.entries(reportData.eventos_por_dia_semana).map(([dia, count]) => ({ dia, eventos: count }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="eventos" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Locais Mais Frequentes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Locais Mais Frequentes</CardTitle>
                    <CardDescription>Top 5 locais com mais eventos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.locais_frequentes.slice(0, 5).map(([local, count], index) => ({
                            name: local,
                            value: count,
                            fill: COLORS[index % COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {reportData.locais_frequentes.slice(0, 5).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Eventos por Mês */}
                <Card>
                  <CardHeader>
                    <CardTitle>Eventos por Mês</CardTitle>
                    <CardDescription>Distribuição mensal dos eventos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.dados_mensais}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total_eventos" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Faturamento por Mês */}
                <Card>
                  <CardHeader>
                    <CardTitle>Faturamento por Mês</CardTitle>
                    <CardDescription>Evolução do faturamento ao longo do ano</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reportData.dados_mensais}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Line 
                          type="monotone" 
                          dataKey="faturamento" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Lista de Eventos do Período */}
          {reportType === 'mensal' && reportData.eventos && reportData.eventos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Eventos do Período</CardTitle>
                <CardDescription>
                  Lista completa dos eventos de {monthOptions.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.eventos.map((evento) => (
                    <div key={evento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{evento.nome_evento}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{evento.horario_inicio}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{evento.local}</span>
                            </span>
                          </div>
                          {evento.cliente && (
                            <div>Cliente: {evento.cliente}</div>
                          )}
                        </div>
                      </div>
                      {evento.valor && (
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            {formatCurrency(evento.valor)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default Reports

