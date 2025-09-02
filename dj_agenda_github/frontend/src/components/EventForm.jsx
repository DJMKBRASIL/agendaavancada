import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEvents } from '../contexts/EventContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Calendar, Clock, MapPin, User, DollarSign, FileText } from 'lucide-react'

const EventForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { events, createEvent, updateEvent, loading } = useEvents()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    nome_evento: '',
    cliente: '',
    local: '',
    data: '',
    horario_inicio: '',
    horario_fim: '',
    valor: '',
    observacoes: ''
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Carregar dados do evento para edição
  useEffect(() => {
    if (isEditing && events.length > 0) {
      const evento = events.find(e => e.id === parseInt(id))
      if (evento) {
        setFormData({
          nome_evento: evento.nome_evento || '',
          cliente: evento.cliente || '',
          local: evento.local || '',
          data: evento.data || '',
          horario_inicio: evento.horario_inicio || '',
          horario_fim: evento.horario_fim || '',
          valor: evento.valor || '',
          observacoes: evento.observacoes || ''
        })
      }
    }
  }, [isEditing, id, events])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome_evento.trim()) {
      newErrors.nome_evento = 'Nome do evento é obrigatório'
    }

    if (!formData.local.trim()) {
      newErrors.local = 'Local é obrigatório'
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória'
    }

    if (!formData.horario_inicio) {
      newErrors.horario_inicio = 'Horário de início é obrigatório'
    }

    // Validar se horário de fim é posterior ao de início
    if (formData.horario_inicio && formData.horario_fim) {
      if (formData.horario_fim <= formData.horario_inicio) {
        newErrors.horario_fim = 'Horário de fim deve ser posterior ao de início'
      }
    }

    // Validar valor se fornecido
    if (formData.valor && isNaN(parseFloat(formData.valor))) {
      newErrors.valor = 'Valor deve ser um número válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const eventData = {
        ...formData,
        valor: formData.valor ? parseFloat(formData.valor) : null
      }

      if (isEditing) {
        await updateEvent(parseInt(id), eventData)
      } else {
        await createEvent(eventData)
      }

      navigate('/eventos')
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
      setErrors({ submit: 'Erro ao salvar evento. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Evento' : 'Novo Evento'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Atualize as informações do evento' : 'Adicione um novo evento à sua agenda'}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Informações do Evento</span>
          </CardTitle>
          <CardDescription>
            Preencha os dados do evento musical
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Evento */}
            <div className="space-y-2">
              <Label htmlFor="nome_evento" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Nome do Evento *</span>
              </Label>
              <Input
                id="nome_evento"
                name="nome_evento"
                value={formData.nome_evento}
                onChange={handleChange}
                placeholder="Ex: Festa de Aniversário, Casamento, Show..."
                className={errors.nome_evento ? 'border-red-500' : ''}
              />
              {errors.nome_evento && (
                <p className="text-sm text-red-500">{errors.nome_evento}</p>
              )}
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Cliente</span>
              </Label>
              <Input
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Nome do cliente ou contratante"
              />
            </div>

            {/* Local */}
            <div className="space-y-2">
              <Label htmlFor="local" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Local *</span>
              </Label>
              <Input
                id="local"
                name="local"
                value={formData.local}
                onChange={handleChange}
                placeholder="Endereço ou nome do local do evento"
                className={errors.local ? 'border-red-500' : ''}
              />
              {errors.local && (
                <p className="text-sm text-red-500">{errors.local}</p>
              )}
            </div>

            {/* Data e Horários */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Data *</span>
                </Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                  className={errors.data ? 'border-red-500' : ''}
                />
                {errors.data && (
                  <p className="text-sm text-red-500">{errors.data}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario_inicio" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Início *</span>
                </Label>
                <Input
                  id="horario_inicio"
                  name="horario_inicio"
                  type="time"
                  value={formData.horario_inicio}
                  onChange={handleChange}
                  className={errors.horario_inicio ? 'border-red-500' : ''}
                />
                {errors.horario_inicio && (
                  <p className="text-sm text-red-500">{errors.horario_inicio}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario_fim" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Fim</span>
                </Label>
                <Input
                  id="horario_fim"
                  name="horario_fim"
                  type="time"
                  value={formData.horario_fim}
                  onChange={handleChange}
                  className={errors.horario_fim ? 'border-red-500' : ''}
                />
                {errors.horario_fim && (
                  <p className="text-sm text-red-500">{errors.horario_fim}</p>
                )}
              </div>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Valor (R$)</span>
              </Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0,00"
                className={errors.valor ? 'border-red-500' : ''}
              />
              {errors.valor && (
                <p className="text-sm text-red-500">{errors.valor}</p>
              )}
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Informações adicionais sobre o evento..."
                rows={4}
              />
            </div>

            {/* Erro de submissão */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={submitting || loading}
                className="flex items-center space-x-2 flex-1"
              >
                <Save className="h-4 w-4" />
                <span>
                  {submitting 
                    ? 'Salvando...' 
                    : isEditing 
                      ? 'Atualizar Evento' 
                      : 'Criar Evento'
                  }
                </span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EventForm

