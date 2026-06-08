import { useState } from 'react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@gmail.com', telefone: '(11) 99999-0001', cargo: 'Professor' },
    { id: 2, nome: 'Maria Santos', email: 'maria@hotmail.com', telefone: '(11) 99999-0002', cargo: 'Administrador' },
  ]);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: 'Professor',
  });

  const [editingId, setEditingId] = useState(null);
  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/@(gmail\.com|hotmail\.com|unifan\.edu\.br)$/.test(formData.email.toLowerCase())) {
      novosErros.email = 'Use @gmail.com, @hotmail.com ou @unifan.edu.br';
    }

    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      novosErros.telefone = 'Formato: (XX) XXXXX-XXXX';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let novoValor = value;
    
    // Formatar telefone automaticamente
    if (name === 'telefone') {
      // Remove tudo que não é número
      const apenasNumeros = value.replace(/\D/g, '');
      
      // Aplica máscara: (XX) XXXXX-XXXX
      if (apenasNumeros.length <= 2) {
        novoValor = apenasNumeros;
      } else if (apenasNumeros.length <= 7) {
        novoValor = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
      } else {
        novoValor = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: novoValor,
    }));
    // Limpar erro ao digitar
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
      // Editar usuário existente
      setUsuarios(usuarios.map(u =>
        u.id === editingId ? { ...u, ...formData } : u
      ));
      setEditingId(null);
    } else {
      // Adicionar novo usuário
      const novoUsuario = {
        id: Math.max(...usuarios.map(u => u.id), 0) + 1,
        ...formData,
      };
      setUsuarios([...usuarios, novoUsuario]);
    }

    // Limpar formulário
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cargo: 'Professor',
    });
  };

  const handleEditar = (usuario) => {
    setFormData(usuario);
    setEditingId(usuario.id);
  };

  const handleDeletar = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cargo: 'Professor',
        });
      }
    }
  };

  const handleCancelar = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cargo: 'Professor',
    });
    setErros({});
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
        <p className="text-gray-500 mt-2">Cadastre e gerencie os usuários do sistema</p>
      </div>

      {/* Formulário de Cadastro */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {editingId ? 'Editar Usuário' : 'Novo Usuário'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="João Silva"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.nome ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="joao@gmail.com"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.email ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.email && <p className="text-red-500 text-sm mt-1">{erros.email}</p>}
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(11) 99999-0000"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.telefone ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.telefone && <p className="text-red-500 text-sm mt-1">{erros.telefone}</p>}
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <select
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF] transition text-gray-800"
              >
                <option value="Professor">Professor</option>
                <option value="Administrador">Administrador</option>
                <option value="Aluno">Aluno</option>
                <option value="Técnico">Técnico</option>
              </select>
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

      {/* Tabela de Listagem */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          {/* Cabeçalho */}
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">E-mail</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Telefone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Cargo</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800">Ações</th>
            </tr>
          </thead>

          {/* Corpo da Tabela */}
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{usuario.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{usuario.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{usuario.telefone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-block bg-blue-100 text-[#4E73DF] px-3 py-1 rounded-full text-xs font-semibold">
                      {usuario.cargo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditar(usuario)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(usuario.id)}
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
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">
                  Nenhum usuário cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resumo */}
      {usuarios.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Total de usuários: <span className="font-semibold text-gray-800">{usuarios.length}</span>
        </div>
      )}
    </div>
  );
}