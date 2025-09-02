import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Music, Calendar, List, BarChart3, Plus } from 'lucide-react'

const Header = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">DJ Agenda</span>
          </Link>

          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/eventos">
              <Button
                variant={isActive('/eventos') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <List className="h-4 w-4" />
                <span>Eventos</span>
              </Button>
            </Link>
            
            <Link to="/calendario">
              <Button
                variant={isActive('/calendario') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendário</span>
              </Button>
            </Link>
            
            <Link to="/relatorios">
              <Button
                variant={isActive('/relatorios') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Relatórios</span>
              </Button>
            </Link>
          </nav>

          {/* Botão Adicionar Evento */}
          <Link to="/novo-evento">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Evento</span>
            </Button>
          </Link>
        </div>

        {/* Navegação Mobile */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/eventos">
              <Button
                variant={isActive('/eventos') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-1"
              >
                <List className="h-4 w-4" />
                <span>Eventos</span>
              </Button>
            </Link>
            
            <Link to="/calendario">
              <Button
                variant={isActive('/calendario') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendário</span>
              </Button>
            </Link>
            
            <Link to="/relatorios">
              <Button
                variant={isActive('/relatorios') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Relatórios</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

