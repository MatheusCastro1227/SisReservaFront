import { useState } from 'react';

export default function Salas() {
  // Gerar salas automaticamente baseado na estrutura solicitada
  const gerarSalas = () => {
    const salas = [];
    let id = 1;

    // Bloco A - Contabilidade (101-113)
    for (let i = 101; i <= 113; i++) {
      salas.push({ id: id++, numero: `${i}`, bloco: 'A', nome: `Sala ${i}`, blocoNome: 'Contabilidade', capacidade: 30, equipamentos: 'Quadro, Projetor' });
    }

    // Bloco B - Tecnológico (1-4)
    for (let i = 1; i <= 4; i++) {
      salas.push({ id: id++, numero: `${i}`, bloco: 'B', nome: `Sala ${i}`, blocoNome: 'Tecnológico', capacidade: 25, equipamentos: 'Computadores, Projetor' });
    }

    // Bloco C - Pedagógico (201-206)
    for (let i = 201; i <= 206; i++) {
      salas.push({ id: id++, numero: `${i}`, bloco: 'C', nome: `Sala ${i}`, blocoNome: 'Pedagógico', capacidade: 35, equipamentos: 'Quadro, Projetor, TV' });
    }

    // Bloco D - Direito (207-211)
    for (let i = 207; i <= 211; i++) {
      salas.push({ id: id++, numero: `${i}`, bloco: 'D', nome: `Sala ${i}`, blocoNome: 'Direito', capacidade: 40, equipamentos: 'Quadro, Projetor' });
    }

    // Bloco E - Saúde (301-321)
    for (let i = 301; i <= 321; i++) {
      salas.push({ id: id++, numero: `${i}`, bloco: 'E', nome: `Sala ${i}`, blocoNome: 'Saúde', capacidade: 30, equipamentos: 'Quadro, Projetor' });
    }

    // Salas Especiais (R1, R2, R3, R4)
    ['R1', 'R2', 'R3', 'R4'].forEach((sala) => {
      salas.push({ id: id++, numero: sala, bloco: 'R', nome: `Sala ${sala}`, blocoNome: 'Reunião', capacidade: 50, equipamentos: 'Ar, Som, Tela grande' });
    });

    return salas;
  };

  const [salas, setSalas] = useState(gerarSalas());
  const [filtroBloco, setFiltroBloco] = useState('');
  const [formData, setFormData] = useState({
    numero: '',
    bloco: 'A',
    capacidade: '',
    equipamentos: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [erros, setErros] = useState({});

  const blocos = [
    { codigo: 'A', nome: 'Contabilidade' },
    { codigo: 'B', nome: 'Tecnológico' },
    { codigo: 'C', nome: 'Pedagógico' },
    { codigo: 'D', nome: 'Direito' },
    { codigo: 'E', nome: 'Saúde' },
    { codigo: 'R', nome: 'Reunião' },
  ];

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.numero.trim()) {
      novosErros.numero = 'Número da sala é obrigatório';
    } else {
      // Verificar se a sala já existe
      const salaJaExiste = salas.some(
        s => s.numero === formData.numero && s.id !== editingId
      );
      if (salaJaExiste) {
        novosErros.numero = 'Esta sala já existe';
      }
    }

    if (!formData.capacidade) {
      novosErros.capacidade = 'Capacidade é obrigatória';
    } else if (formData.capacidade < 1 || formData.capacidade > 100) {
      novosErros.capacidade = 'Capacidade deve estar entre 1 e 100';
    }

    if (!formData.equipamentos.trim()) {
      novosErros.equipamentos = 'Equipamentos é obrigatório';
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

    if (editingId) {
      setSalas(salas.map(s =>
        s.id === editingId
          ? {
              ...s,
              numero: formData.numero,
              bloco: formData.bloco,
              blocoNome: blocos.find(b => b.codigo === formData.bloco)?.nome,
              capacidade: parseInt(formData.capacidade),
              equipamentos: formData.equipamentos,
              nome: `Sala ${formData.numero}`,
            }
          : s
      ));
      setEditingId(null);
    } else {
      const novaSala = {
        id: Math.max(...salas.map(s => s.id), 0) + 1,
        numero: formData.numero,
        bloco: formData.bloco,
        blocoNome: blocos.find(b => b.codigo === formData.bloco)?.nome,
        nome: `Sala ${formData.numero}`,
        capacidade: parseInt(formData.capacidade),
        equipamentos: formData.equipamentos,
      };
      setSalas([...salas, novaSala]);
    }

    setFormData({
      numero: '',
      bloco: 'A',
      capacidade: '',
      equipamentos: '',
    });
  };

  const handleEditar = (sala) => {
    setFormData({
      numero: sala.numero,
      bloco: sala.bloco,
      capacidade: sala.capacidade,
      equipamentos: sala.equipamentos,
    });
    setEditingId(sala.id);
  };

  const handleDeletar = (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta sala?')) {
      setSalas(salas.filter(s => s.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          numero: '',
          bloco: 'A',
          capacidade: '',
          equipamentos: '',
        });
      }
    }
  };

  const handleCancelar = () => {
    setEditingId(null);
    setFormData({
      numero: '',
      bloco: 'A',
      capacidade: '',
      equipamentos: '',
    });
    setErros({});
  };

  // Filtrar salas
  const salasFiltradas = filtroBloco
    ? salas.filter(s => s.bloco === filtroBloco)
    : salas;

  // Agrupar salas por bloco para exibição
  const salasAgrupadas = blocos.reduce((acc, bloco) => {
    acc[bloco.codigo] = salas.filter(s => s.bloco === bloco.codigo);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Gerenciamento de Salas</h2>
        <p className="text-gray-500 mt-2">Cadastre e gerencie as salas disponíveis</p>
      </div>

      {/* Formulário de Cadastro */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {editingId ? 'Editar Sala' : 'Nova Sala'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Número da Sala */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número da Sala
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                placeholder="101"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.numero ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.numero && <p className="text-red-500 text-sm mt-1">{erros.numero}</p>}
            </div>

            {/* Bloco */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bloco
              </label>
              <select
                name="bloco"
                value={formData.bloco}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF] transition text-gray-800"
              >
                {blocos.map(bloco => (
                  <option key={bloco.codigo} value={bloco.codigo}>
                    {bloco.codigo} - {bloco.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidade
              </label>
              <input
                type="number"
                name="capacidade"
                value={formData.capacidade}
                onChange={handleInputChange}
                placeholder="30"
                min="1"
                max="100"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.capacidade ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.capacidade && <p className="text-red-500 text-sm mt-1">{erros.capacidade}</p>}
            </div>

            {/* Equipamentos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipamentos
              </label>
              <input
                type="text"
                name="equipamentos"
                value={formData.equipamentos}
                onChange={handleInputChange}
                placeholder="Quadro, Projetor"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.equipamentos ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.equipamentos && <p className="text-red-500 text-sm mt-1">{erros.equipamentos}</p>}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-[#4E73DF] hover:bg-[#3b59b6] text-white font-semibold py-2 px-6 rounded-lg transition shadow-sm"
            >
              {editingId ? 'Atualizar' : 'Cadastrar'}
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

      {/* Visualização por Blocos */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">Salas por Bloco</h3>

        {blocos.map(bloco => (
          <div key={bloco.codigo} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Cabeçalho do Bloco */}
            <div className="bg-gradient-to-r from-[#4E73DF] to-[#3b59b6] text-white px-6 py-4">
              <h4 className="text-lg font-bold">
                Bloco {bloco.codigo} - {bloco.nome}
              </h4>
              <p className="text-sm text-blue-100 mt-1">
                Total de salas: {salasAgrupadas[bloco.codigo].length}
              </p>
            </div>

            {/* Tabela de Salas */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Número</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Capacidade</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Equipamentos</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {salasAgrupadas[bloco.codigo].length > 0 ? (
                    salasAgrupadas[bloco.codigo].map(sala => (
                      <tr key={sala.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800 font-bold">
                          <span className="bg-blue-100 text-[#4E73DF] px-3 py-1 rounded-full text-xs font-semibold">
                            {sala.numero}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{sala.capacidade} pessoas</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{sala.equipamentos}</td>
                        <td className="px-6 py-4 text-sm text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditar(sala)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletar(sala.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                            >
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                        Nenhuma sala neste bloco
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Total de salas cadastradas:</span> {salas.length}
        </p>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          {blocos.map(bloco => (
            <div key={bloco.codigo} className="text-center">
              <p className="font-semibold text-blue-900">Bloco {bloco.codigo}</p>
              <p className="text-blue-700">{salasAgrupadas[bloco.codigo].length} sala(s)</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}