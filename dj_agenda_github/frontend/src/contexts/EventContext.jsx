import { createContext, useContext, useState, useEffect } from 'react'

const EventContext = createContext()

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents deve ser usado dentro de um EventProvider')
  }
  return context
}

const API_BASE_URL = 'https://9yhyi3czl3jw.manus.space/api'

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Função para fazer requisições à API
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Carregar eventos
  const loadEvents = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams(filters).toString()
      const url = queryParams ? `/eventos?${queryParams}` : '/eventos'
      const data = await apiRequest(url)
      setEvents(data.eventos || [])
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Criar evento
  const createEvent = async (eventData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest('/eventos', {
        method: 'POST',
        body: JSON.stringify(eventData),
      })
      await loadEvents() // Recarregar lista
      return data.evento
    } catch (err) {
      console.error('Erro ao criar evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar evento
  const updateEvent = async (id, eventData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest(`/eventos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      })
      await loadEvents() // Recarregar lista
      return data.evento
    } catch (err) {
      console.error('Erro ao atualizar evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Excluir evento
  const deleteEvent = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await apiRequest(`/eventos/${id}`, {
        method: 'DELETE',
      })
      await loadEvents() // Recarregar lista
    } catch (err) {
      console.error('Erro ao excluir evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Obter dados do dashboard
  const getDashboardData = async () => {
    try {
      const data = await apiRequest('/dashboard')
      return data.dashboard
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
      throw err
    }
  }

  // Obter relatório mensal
  const getMonthlyReport = async (mes, ano) => {
    try {
      const params = new URLSearchParams({ mes, ano }).toString()
      const data = await apiRequest(`/relatorios/mensal?${params}`)
      return data.relatorio
    } catch (err) {
      console.error('Erro ao carregar relatório mensal:', err)
      throw err
    }
  }

  // Obter relatório anual
  const getAnnualReport = async (ano) => {
    try {
      const params = new URLSearchParams({ ano }).toString()
      const data = await apiRequest(`/relatorios/anual?${params}`)
      return data.relatorio
    } catch (err) {
      console.error('Erro ao carregar relatório anual:', err)
      throw err
    }
  }

  // Limpar eventos vencidos
  const cleanupExpiredEvents = async () => {
    try {
      const data = await apiRequest('/eventos/cleanup', {
        method: 'POST',
      })
      await loadEvents() // Recarregar lista
      return data
    } catch (err) {
      console.error('Erro ao limpar eventos vencidos:', err)
      throw err
    }
  }

  // Carregar eventos na inicialização
  useEffect(() => {
    loadEvents()
  }, [])

  const value = {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getDashboardData,
    getMonthlyReport,
    getAnnualReport,
    cleanupExpiredEvents,
    setError,
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}

