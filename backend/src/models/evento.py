from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, time
from src.models.user import db

class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_evento = db.Column(db.String(200), nullable=False)
    cliente = db.Column(db.String(200), nullable=True)
    local = db.Column(db.String(300), nullable=False)
    data = db.Column(db.Date, nullable=False)
    horario_inicio = db.Column(db.Time, nullable=False)
    horario_fim = db.Column(db.Time, nullable=True)
    valor = db.Column(db.Float, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Evento {self.nome_evento} - {self.data}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome_evento': self.nome_evento,
            'cliente': self.cliente,
            'local': self.local,
            'data': self.data.isoformat() if self.data else None,
            'horario_inicio': self.horario_inicio.strftime('%H:%M') if self.horario_inicio else None,
            'horario_fim': self.horario_fim.strftime('%H:%M') if self.horario_fim else None,
            'valor': self.valor,
            'observacoes': self.observacoes,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
            'atualizado_em': self.atualizado_em.isoformat() if self.atualizado_em else None
        }

    @staticmethod
    def from_dict(data):
        evento = Evento()
        evento.nome_evento = data.get('nome_evento')
        evento.cliente = data.get('cliente')
        evento.local = data.get('local')
        
        # Converter string de data para objeto date
        if data.get('data'):
            if isinstance(data['data'], str):
                evento.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
            else:
                evento.data = data['data']
        
        # Converter string de horário para objeto time
        if data.get('horario_inicio'):
            if isinstance(data['horario_inicio'], str):
                evento.horario_inicio = datetime.strptime(data['horario_inicio'], '%H:%M').time()
            else:
                evento.horario_inicio = data['horario_inicio']
        
        if data.get('horario_fim'):
            if isinstance(data['horario_fim'], str):
                evento.horario_fim = datetime.strptime(data['horario_fim'], '%H:%M').time()
            else:
                evento.horario_fim = data['horario_fim']
        
        evento.valor = data.get('valor')
        evento.observacoes = data.get('observacoes')
        
        return evento

    def update_from_dict(self, data):
        if 'nome_evento' in data:
            self.nome_evento = data['nome_evento']
        if 'cliente' in data:
            self.cliente = data['cliente']
        if 'local' in data:
            self.local = data['local']
        if 'data' in data:
            if isinstance(data['data'], str):
                self.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
            else:
                self.data = data['data']
        if 'horario_inicio' in data:
            if isinstance(data['horario_inicio'], str):
                self.horario_inicio = datetime.strptime(data['horario_inicio'], '%H:%M').time()
            else:
                self.horario_inicio = data['horario_inicio']
        if 'horario_fim' in data:
            if isinstance(data['horario_fim'], str):
                self.horario_fim = datetime.strptime(data['horario_fim'], '%H:%M').time()
            else:
                self.horario_fim = data['horario_fim']
        if 'valor' in data:
            self.valor = data['valor']
        if 'observacoes' in data:
            self.observacoes = data['observacoes']
        
        self.atualizado_em = datetime.utcnow()

