import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import EventList from './components/EventList'
import EventForm from './components/EventForm'
import Reports from './components/Reports'
import Calendar from './components/Calendar'
import { EventProvider } from './contexts/EventContext'
import './App.css'

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/eventos" element={<EventList />} />
              <Route path="/novo-evento" element={<EventForm />} />
              <Route path="/editar-evento/:id" element={<EventForm />} />
              <Route path="/calendario" element={<Calendar />} />
              <Route path="/relatorios" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EventProvider>
  )
}

export default App

