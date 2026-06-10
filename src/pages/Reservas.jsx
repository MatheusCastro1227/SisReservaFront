import { useState, useEffect } from 'react';

export default function Reservas() {
  // Recuperar usuário do localStorage
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  
  useEffect(() => {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      setUsuarioLogado(JSON.parse(usuario));
    }
  }, []);
  // Salas disponíveis (mesma estrutura de Salas.jsx)
  const salasDisponiveis = [
    // Bloco A
    { numero: '101', bloco: 'A', blocoNome: 'Contabilidade' },
    { numero: '102', bloco: 'A', blocoNome: 'Contabilidade' },
    { numero: '103', bloco: 'A', blocoNome: 'Contabilidade' },
    { numero: '104', bloco: 'A', blocoNome: 'Contabilidade' },
    { numero: '105', bloco: 'A', blocoNome: 'Contabilidade' },
    // Bloco B
    { numero: '1', bloco: 'B', blocoNome: 'Tecnológico' },
    { numero: '2', bloco: 'B', blocoNome: 'Tecnológico' },
    { numero: '3', bloco: 'B', blocoNome: 'Tecnológico' },
    { numero: '4', bloco: 'B', blocoNome: 'Tecnológico' },
    // Bloco C
    { numero: '201', bloco: 'C', blocoNome: 'Pedagógico' },
    { numero: '202', bloco: 'C', blocoNome: 'Pedagógico' },
    // Bloco R
    { numero: 'R1', bloco: 'R', blocoNome: 'Especial' },
    { numero: 'R2', bloco: 'R', blocoNome: 'Especial' },
    { numero: 'R3', bloco: 'R', blocoNome: 'Especial' },
    { numero: 'R4', bloco: 'R', blocoNome: 'Especial' },
  ];

  const [tipoUsuario, setTipoUsuario] = useState('Aluno'); // Aluno, Professor, Admin
  const [reservas, setReservas] = useState([
    {
      id: 1,
      sala: '101',
      blocoNome: 'Contabilidade',
      data: '2026-06-15',
      horaInicio: '08:00',
      horaFim: '09:30',
      solicitante: 'João Silva',
      motivo: 'Aula de Contabilidade',
      tipoSolicitante: 'Professor',
      status: 'Aprovada',
      dataSolicitacao: '2026-06-08',
    },
  ]);

  const [formData, setFormData] = useState({
    sala: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    motivo: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [erros, setErros] = useState({});
  const [abaAtiva, setAbaAtiva] = useState('minhas-reservas'); // alunos veem "minhas-reservas", outros veem "nova-reserva"

  // Determinar tipo de usuário ativo
  const tipoUsuarioAtivo = (usuarioLogado && usuarioLogado.tipoUsuario) || tipoUsuario;
  const [filtroStatus, setFiltroStatus] = useState('');

  // Formatar data para exibição
  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  // Gerar horários disponíveis
  const gerarHorarios = () => {
    const horarios = [];
    for (let h = 7; h < 22; h++) {
      for (let m = 0; m < 60; m += 30) {
        horarios.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return horarios;
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.sala) {
      novosErros.sala = 'Sala é obrigatória';
    }

    if (!formData.data) {
      novosErros.data = 'Data é obrigatória';
    } else {
      const dataReserva = new Date(formData.data);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (dataReserva < hoje) {
        novosErros.data = 'Data não pode ser no passado';
      }
    }

    if (!formData.horaInicio) {
      novosErros.horaInicio = 'Hora de início é obrigatória';
    }

    if (!formData.horaFim) {
      novosErros.horaFim = 'Hora de fim é obrigatória';
    } else if (formData.horaInicio && formData.horaFim <= formData.horaInicio) {
      novosErros.horaFim = 'Hora de fim deve ser após hora de início';
    }

    if (!formData.motivo.trim()) {
      novosErros.motivo = 'Motivo é obrigatório';
    }

    // Verificar sobreposição de reservas
    if (formData.sala && formData.data && formData.horaInicio && formData.horaFim) {
      const temSobreposicao = reservas.some(r => {
        const mesmaData = r.data === formData.data;
        const mesmaSala = r.sala === formData.sala;
        const statusValido = ['Aprovada', 'Pendente'].includes(r.status);

        if (editingId && r.id === editingId) return false;

        if (mesmaData && mesmaSala && statusValido) {
          const novaInicio = formData.horaInicio;
          const novaFim = formData.horaFim;
          const existInicio = r.horaInicio;
          const existFim = r.horaFim;

          return novaInicio < existFim && novaFim > existInicio;
        }
        return false;
      });

      if (temSobreposicao) {
        novosErros.conflito = 'Já existe uma reserva neste horário para esta sala';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const salaSelecionada = salasDisponiveis.find(s => s.numero === formData.sala);

    if (editingId) {
      setReservas(reservas.map(r =>
        r.id === editingId
          ? {
              ...r,
              sala: formData.sala,
              blocoNome: salaSelecionada.blocoNome,
              data: formData.data,
              horaInicio: formData.horaInicio,
              horaFim: formData.horaFim,
              motivo: formData.motivo,
              status: tipoUsuarioAtivo === 'Admin' ? r.status : 'Pendente',
            }
          : r
      ));
      setEditingId(null);
    } else {
      const novaReserva = {
        id: Math.max(...reservas.map(r => r.id), 0) + 1,
        sala: formData.sala,
        blocoNome: salaSelecionada.blocoNome,
        data: formData.data,
        horaInicio: formData.horaInicio,
        horaFim: formData.horaFim,
        motivo: formData.motivo,
        solicitante: usuarioLogado ? usuarioLogado.nome : 'Usuário Atual',
        tipoSolicitante: tipoUsuarioAtivo,
        status: 'Pendente',
        dataSolicitacao: new Date().toISOString().split('T')[0],
      };
      setReservas([...reservas, novaReserva]);
    }

    setFormData({
      sala: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      motivo: '',
    });
  };

  const handleEditar = (reserva) => {
    setFormData({
      sala: reserva.sala,
      data: reserva.data,
      horaInicio: reserva.horaInicio,
      horaFim: reserva.horaFim,
      motivo: reserva.motivo,
    });
    setEditingId(reserva.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletar = (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta reserva?')) {
      setReservas(reservas.filter(r => r.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          sala: '',
          data: '',
          horaInicio: '',
          horaFim: '',
          motivo: '',
        });
      }
    }
  };

  const handleCancelar = () => {
    setEditingId(null);
    setFormData({
      sala: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      motivo: '',
    });
    setErros({});
  };

  const handleAprovar = (id) => {
    setReservas(reservas.map(r =>
      r.id === id ? { ...r, status: 'Aprovada' } : r
    ));
  };

  const handleRejeitar = (id) => {
    setReservas(reservas.map(r =>
      r.id === id ? { ...r, status: 'Rejeitada' } : r
    ));
  };

  const handleCancelarReserva = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      setReservas(reservas.filter(r => r.id !== id));
    }
  };

  // Filtrar reservas do aluno logado
  const minhasReservas = usuarioLogado
    ? reservas.filter(r => r.solicitante === usuarioLogado.nome)
    : [];

  // Filtrar reservas - Minhas Reservas
  const minhasReservasFiltradas = filtroStatus
    ? minhasReservas.filter(r => r.status === filtroStatus)
    : minhasReservas;

  // Filtrar reservas - Todas as Reservas (para admin/professor)
  const todasReservasFiltradas = filtroStatus
    ? reservas.filter(r => r.status === filtroStatus)
    : reservas;

  // Verificar permissões
  const temPermissaoEdicao = ['Professor', 'Admin'].includes(tipoUsuarioAtivo);
  const podeEditar = (reserva) => tipoUsuarioAtivo === 'Admin' || (tipoUsuarioAtivo === 'Professor' && reserva.tipoSolicitante === 'Professor');

  const horarios = gerarHorarios();

  return (
    <div className="space-y-8">
      {/* Informações do Aluno Logado ou Seletor de Tipo de Usuário */}
      {usuarioLogado && usuarioLogado.tipoUsuario === 'Aluno' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">📚 Informações do Aluno</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-blue-700 font-medium">Nome</p>
              <p className="text-gray-800 font-semibold">{usuarioLogado.nome}</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">E-mail</p>
              <p className="text-gray-800 font-semibold">{usuarioLogado.email}</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Matrícula</p>
              <p className="text-gray-800 font-semibold">{usuarioLogado.matricula}</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Curso</p>
              <p className="text-gray-800 font-semibold">{usuarioLogado.curso}</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Telefone</p>
              <p className="text-gray-800 font-semibold">{usuarioLogado.telefone}</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Tipo</p>
              <p className="text-gray-800 font-semibold">{usuarioLogado.tipoUsuario}</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3">
            ✅ Você pode reservar salas para suas aulas e eventos
          </p>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-yellow-800 mb-2">
            👤 Tipo de Usuário (Para Teste):
          </label>
          <div className="flex gap-3">
            {['Aluno', 'Professor', 'Admin'].map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoUsuario(tipo)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  tipoUsuario === tipo
                    ? 'bg-[#4E73DF] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            Logado como: <span className="font-bold">{tipoUsuario}</span>
          </p>
        </div>
      )}

      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Reservas de Salas</h2>
        <p className="text-gray-500 mt-2">Solicite e gerencie suas reservas de sala</p>
      </div>

      {/* ABAS - Se for Aluno, mostrar "Minhas Reservas" e "Nova Reserva"; Se for Admin/Professor, mostrar "Nova Reserva" e "Todas as Reservas" */}
      {tipoUsuarioAtivo === 'Aluno' ? (
        <div className="flex gap-2 border-b border-gray-300">
          <button
            onClick={() => {
              setAbaAtiva('minhas-reservas');
              setFiltroStatus('');
            }}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              abaAtiva === 'minhas-reservas'
                ? 'border-[#4E73DF] text-[#4E73DF]'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Minhas Reservas ({minhasReservas.length})
          </button>
          <button
            onClick={() => {
              setAbaAtiva('nova-reserva');
              setFiltroStatus('');
            }}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              abaAtiva === 'nova-reserva'
                ? 'border-[#4E73DF] text-[#4E73DF]'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            ➕ Nova Reserva
          </button>
        </div>
      ) : (
        <div className="flex gap-2 border-b border-gray-300">
          <button
            onClick={() => {
              setAbaAtiva('nova-reserva');
              setFiltroStatus('');
            }}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              abaAtiva === 'nova-reserva'
                ? 'border-[#4E73DF] text-[#4E73DF]'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            ➕ Nova Reserva
          </button>
          <button
            onClick={() => {
              setAbaAtiva('todas-reservas');
              setFiltroStatus('');
            }}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              abaAtiva === 'todas-reservas'
                ? 'border-[#4E73DF] text-[#4E73DF]'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Todas as Reservas ({reservas.length})
          </button>
        </div>
      )}

      {/* Conteúdo da Aba - Nova Reserva */}
      {(abaAtiva === 'nova-reserva' || tipoUsuarioAtivo !== 'Aluno') && (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? '✏️ Editar Reserva' : '📝 Nova Solicitação de Reserva'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
          {erros.conflito && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {erros.conflito}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sala */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sala *
              </label>
              <select
                name="sala"
                value={formData.sala}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.sala ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              >
                <option value="">Selecione uma sala</option>
                {salasDisponiveis.map(sala => (
                  <option key={sala.numero} value={sala.numero}>
                    Sala {sala.numero} - Bloco {sala.bloco} ({sala.blocoNome})
                  </option>
                ))}
              </select>
              {erros.sala && <p className="text-red-500 text-sm mt-1">{erros.sala}</p>}
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.data ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.data && <p className="text-red-500 text-sm mt-1">{erros.data}</p>}
            </div>

            {/* Hora Início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Início *
              </label>
              <select
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.horaInicio ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              >
                <option value="">Selecione</option>
                {horarios.map(hora => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
              {erros.horaInicio && <p className="text-red-500 text-sm mt-1">{erros.horaInicio}</p>}
            </div>

            {/* Hora Fim */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Fim *
              </label>
              <select
                name="horaFim"
                value={formData.horaFim}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.horaFim ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              >
                <option value="">Selecione</option>
                {horarios
                  .filter(hora => !formData.horaInicio || hora > formData.horaInicio)
                  .map(hora => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
              </select>
              {erros.horaFim && <p className="text-red-500 text-sm mt-1">{erros.horaFim}</p>}
            </div>

            {/* Motivo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo/Descrição *
              </label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                placeholder="Descreva o motivo da reserva"
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition resize-none ${
                  erros.motivo ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.motivo && <p className="text-red-500 text-sm mt-1">{erros.motivo}</p>}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-[#4E73DF] hover:bg-[#3b59b6] text-white font-semibold py-2 px-6 rounded-lg transition shadow-sm"
            >
              {editingId ? 'Atualizar Reserva' : 'Solicitar Reserva'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelar}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition shadow-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
          </div>
        </>
      )}

      {/* Conteúdo da Aba - Minhas Reservas (Apenas para Alunos) */}
      {tipoUsuarioAtivo === 'Aluno' && abaAtiva === 'minhas-reservas' && (
        <>
          {/* Filtro de Status - Minhas Reservas */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltroStatus('')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filtroStatus === ''
                  ? 'bg-[#4E73DF] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas ({minhasReservas.length})
            </button>
            {['Pendente', 'Aprovada', 'Rejeitada'].map(status => {
              const count = minhasReservas.filter(r => r.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filtroStatus === status
                      ? 'bg-[#4E73DF] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          {/* Listagem - Minhas Reservas */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Minhas Reservas</h3>

            {minhasReservasFiltradas.length > 0 ? (
              <div className="space-y-4">
                {minhasReservasFiltradas.map(reserva => (
                  <div key={reserva.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Sala</p>
                        <p className="font-bold text-lg text-[#4E73DF]">{reserva.sala}</p>
                        <p className="text-xs text-gray-500">{reserva.blocoNome}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Data</p>
                        <p className="font-bold">{formatarData(reserva.data)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Horário</p>
                        <p className="font-bold">{reserva.horaInicio} - {reserva.horaFim}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          reserva.status === 'Aprovada'
                            ? 'bg-green-100 text-green-800'
                            : reserva.status === 'Pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {reserva.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Data Solicitação</p>
                        <p className="text-sm">{formatarData(reserva.dataSolicitacao)}</p>
                      </div>
                    </div>

                    <div className="mb-3 pb-3 border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-600">Motivo</p>
                      <p className="text-gray-800">{reserva.motivo}</p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 flex-wrap">
                      {reserva.status === 'Pendente' && (
                        <button
                          onClick={() => handleCancelarReserva(reserva.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          ✗ Cancelar Reserva
                        </button>
                      )}
                      {reserva.status === 'Aprovada' && (
                        <span className="px-4 py-1 text-sm text-green-700 font-semibold">
                          ✓ Reserva Confirmada
                        </span>
                      )}
                      {reserva.status === 'Rejeitada' && (
                        <span className="px-4 py-1 text-sm text-red-700 font-semibold">
                          ✗ Reserva Rejeitada
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 font-medium">Você ainda não tem nenhuma reserva</p>
                <button
                  onClick={() => setAbaAtiva('nova-reserva')}
                  className="mt-4 bg-[#4E73DF] hover:bg-[#3b59b6] text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Fazer uma Reserva
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Conteúdo da Aba - Todas as Reservas (Admin/Professor) */}
      {tipoUsuarioAtivo !== 'Aluno' && abaAtiva === 'todas-reservas' && (
        <>
          {/* Filtro de Status - Todas as Reservas */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFiltroStatus('')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filtroStatus === ''
              ? 'bg-[#4E73DF] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({todasReservasFiltradas.length})
        </button>
        {['Pendente', 'Aprovada', 'Rejeitada'].map(status => {
          const count = reservas.filter(r => r.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filtroStatus === status
                  ? 'bg-[#4E73DF] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Listagem de Reservas */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Todas as Reservas</h3>

        {todasReservasFiltradas.length > 0 ? (
          <div className="space-y-4">
            {todasReservasFiltradas.map(reserva => (
              <div key={reserva.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Sala</p>
                    <p className="font-bold text-lg text-[#4E73DF]">{reserva.sala}</p>
                    <p className="text-xs text-gray-500">{reserva.blocoNome}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-bold">{formatarData(reserva.data)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Horário</p>
                    <p className="font-bold">{reserva.horaInicio} - {reserva.horaFim}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      reserva.status === 'Aprovada'
                        ? 'bg-green-100 text-green-800'
                        : reserva.status === 'Pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reserva.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Solicitante</p>
                    <p className="font-semibold text-sm">{reserva.solicitante}</p>
                  </div>
                </div>

                <div className="mb-3 pb-3 border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-600">Motivo</p>
                  <p className="text-gray-800">{reserva.motivo}</p>
                </div>

                {/* Ações */}
                <div className="flex gap-2 flex-wrap">
                  {/* Editar - Apenas professor que criou ou admin */}
                  {podeEditar(reserva) && (
                    <button
                      onClick={() => handleEditar(reserva)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                    >
                      ✏️ Editar
                    </button>
                  )}

                  {/* Deletar - Apenas professor que criou ou admin */}
                  {podeEditar(reserva) && (
                    <button
                      onClick={() => handleDeletar(reserva.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                    >
                      🗑️ Deletar
                    </button>
                  )}

                  {/* Aprovar/Rejeitar - Apenas Admin */}
                  {tipoUsuarioAtivo === 'Admin' && reserva.status === 'Pendente' && (
                    <>
                      <button
                        onClick={() => handleAprovar(reserva.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        onClick={() => handleRejeitar(reserva.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                      >
                        ✗ Rejeitar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 font-medium">Nenhuma reserva encontrada</p>
          </div>
        )}
      </div>
        </>
      )}

      {/* Resumo de Permissões */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-2">📋 Permissões do {tipoUsuarioAtivo}:</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Fazer solicitações de reserva</li>
          {tipoUsuarioAtivo === 'Professor' && (
            <>
              <li>✓ Editar suas próprias reservas</li>
              <li>✓ Deletar suas próprias reservas</li>
            </>
          )}
          {tipoUsuarioAtivo === 'Admin' && (
            <>
              <li>✓ Editar todas as reservas</li>
              <li>✓ Deletar todas as reservas</li>
              <li>✓ Aprovar/Rejeitar reservas pendentes</li>
            </>
          )}
          {tipoUsuarioAtivo === 'Aluno' && (
            <li>• Apenas visualizar suas reservas (sem edição)</li>
          )}
        </ul>
      </div>
    </div>
  );
}