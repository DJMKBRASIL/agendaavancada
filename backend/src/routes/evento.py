from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from sqlalchemy import extract, func, and_
from src.models.user import db
from src.models.evento import Evento

evento_bp = Blueprint('evento', __name__)

@evento_bp.route('/eventos', methods=['GET'])
def get_eventos():
    """Listar todos os eventos com filtros opcionais"""
    try:
        # Parâmetros de filtro
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        local = request.args.get('local')
        mes = request.args.get('mes')
        ano = request.args.get('ano')
        
        query = Evento.query
        
        # Aplicar filtros
        if data_inicio:
            data_inicio_obj = datetime.strptime(data_inicio, '%Y-%m-%d').date()
            query = query.filter(Evento.data >= data_inicio_obj)
        
        if data_fim:
            data_fim_obj = datetime.strptime(data_fim, '%Y-%m-%d').date()
            query = query.filter(Evento.data <= data_fim_obj)
        
        if local:
            query = query.filter(Evento.local.ilike(f'%{local}%'))
        
        if mes and ano:
            query = query.filter(
                extract('month', Evento.data) == int(mes),
                extract('year', Evento.data) == int(ano)
            )
        elif ano:
            query = query.filter(extract('year', Evento.data) == int(ano))
        
        # Ordenar por data e horário
        eventos = query.order_by(Evento.data.asc(), Evento.horario_inicio.asc()).all()
        
        return jsonify({
            'success': True,
            'eventos': [evento.to_dict() for evento in eventos],
            'total': len(eventos)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/eventos', methods=['POST'])
def create_evento():
    """Criar um novo evento"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('nome_evento'):
            return jsonify({
                'success': False,
                'error': 'Nome do evento é obrigatório'
            }), 400
        
        if not data.get('local'):
            return jsonify({
                'success': False,
                'error': 'Local é obrigatório'
            }), 400
        
        if not data.get('data'):
            return jsonify({
                'success': False,
                'error': 'Data é obrigatória'
            }), 400
        
        if not data.get('horario_inicio'):
            return jsonify({
                'success': False,
                'error': 'Horário de início é obrigatório'
            }), 400
        
        # Criar evento
        evento = Evento.from_dict(data)
        db.session.add(evento)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'evento': evento.to_dict(),
            'message': 'Evento criado com sucesso'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/eventos/<int:evento_id>', methods=['GET'])
def get_evento(evento_id):
    """Obter um evento específico"""
    try:
        evento = Evento.query.get_or_404(evento_id)
        return jsonify({
            'success': True,
            'evento': evento.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/eventos/<int:evento_id>', methods=['PUT'])
def update_evento(evento_id):
    """Atualizar um evento"""
    try:
        evento = Evento.query.get_or_404(evento_id)
        data = request.get_json()
        
        evento.update_from_dict(data)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'evento': evento.to_dict(),
            'message': 'Evento atualizado com sucesso'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/eventos/<int:evento_id>', methods=['DELETE'])
def delete_evento(evento_id):
    """Excluir um evento"""
    try:
        evento = Evento.query.get_or_404(evento_id)
        db.session.delete(evento)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Evento excluído com sucesso'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/eventos/cleanup', methods=['POST'])
def cleanup_eventos_vencidos():
    """Excluir eventos vencidos (mais de 30 dias)"""
    try:
        data_limite = date.today() - timedelta(days=30)
        eventos_vencidos = Evento.query.filter(Evento.data < data_limite).all()
        
        count = len(eventos_vencidos)
        for evento in eventos_vencidos:
            db.session.delete(evento)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'{count} eventos vencidos foram excluídos',
            'count': count
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/relatorios/mensal', methods=['GET'])
def relatorio_mensal():
    """Relatório de eventos por mês"""
    try:
        mes = request.args.get('mes', datetime.now().month)
        ano = request.args.get('ano', datetime.now().year)
        
        # Eventos do mês
        eventos = Evento.query.filter(
            extract('month', Evento.data) == int(mes),
            extract('year', Evento.data) == int(ano)
        ).all()
        
        # Estatísticas
        total_eventos = len(eventos)
        total_faturamento = sum(evento.valor for evento in eventos if evento.valor)
        
        # Locais mais frequentes
        locais = {}
        for evento in eventos:
            locais[evento.local] = locais.get(evento.local, 0) + 1
        
        locais_frequentes = sorted(locais.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Eventos por dia da semana
        dias_semana = {0: 'Segunda', 1: 'Terça', 2: 'Quarta', 3: 'Quinta', 4: 'Sexta', 5: 'Sábado', 6: 'Domingo'}
        eventos_por_dia = {dia: 0 for dia in dias_semana.values()}
        
        for evento in eventos:
            dia_semana = evento.data.weekday()
            eventos_por_dia[dias_semana[dia_semana]] += 1
        
        return jsonify({
            'success': True,
            'relatorio': {
                'mes': int(mes),
                'ano': int(ano),
                'total_eventos': total_eventos,
                'total_faturamento': total_faturamento,
                'locais_frequentes': locais_frequentes,
                'eventos_por_dia_semana': eventos_por_dia,
                'eventos': [evento.to_dict() for evento in eventos]
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/relatorios/anual', methods=['GET'])
def relatorio_anual():
    """Relatório de eventos por ano"""
    try:
        ano = request.args.get('ano', datetime.now().year)
        
        # Eventos por mês
        eventos_por_mes = db.session.query(
            extract('month', Evento.data).label('mes'),
            func.count(Evento.id).label('total'),
            func.sum(Evento.valor).label('faturamento')
        ).filter(
            extract('year', Evento.data) == int(ano)
        ).group_by(
            extract('month', Evento.data)
        ).all()
        
        # Organizar dados
        meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        
        dados_mensais = []
        for i in range(1, 13):
            mes_data = next((item for item in eventos_por_mes if item.mes == i), None)
            dados_mensais.append({
                'mes': meses[i-1],
                'numero_mes': i,
                'total_eventos': mes_data.total if mes_data else 0,
                'faturamento': float(mes_data.faturamento) if mes_data and mes_data.faturamento else 0
            })
        
        # Totais do ano
        total_eventos_ano = sum(item['total_eventos'] for item in dados_mensais)
        total_faturamento_ano = sum(item['faturamento'] for item in dados_mensais)
        
        return jsonify({
            'success': True,
            'relatorio': {
                'ano': int(ano),
                'total_eventos_ano': total_eventos_ano,
                'total_faturamento_ano': total_faturamento_ano,
                'dados_mensais': dados_mensais
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@evento_bp.route('/dashboard', methods=['GET'])
def dashboard():
    """Dados para o dashboard principal"""
    try:
        hoje = date.today()
        inicio_mes = hoje.replace(day=1)
        
        # Eventos do mês atual
        eventos_mes = Evento.query.filter(
            Evento.data >= inicio_mes,
            Evento.data <= hoje.replace(day=31) if hoje.month != 12 else hoje.replace(month=1, year=hoje.year+1, day=31)
        ).all()
        
        # Próximos eventos (próximos 7 dias)
        proximos_eventos = Evento.query.filter(
            Evento.data >= hoje,
            Evento.data <= hoje + timedelta(days=7)
        ).order_by(Evento.data.asc(), Evento.horario_inicio.asc()).limit(5).all()
        
        # Estatísticas
        total_eventos_mes = len(eventos_mes)
        faturamento_mes = sum(evento.valor for evento in eventos_mes if evento.valor)
        
        return jsonify({
            'success': True,
            'dashboard': {
                'total_eventos_mes': total_eventos_mes,
                'faturamento_mes': faturamento_mes,
                'proximos_eventos': [evento.to_dict() for evento in proximos_eventos],
                'mes_atual': hoje.strftime('%B %Y')
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

