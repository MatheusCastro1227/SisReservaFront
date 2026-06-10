import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CadastroAdmin() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    departamento: 'Administrativo',
    nivelAcesso: 'Editor',
    chaveAdministrador: '',
  });

  const [erros, setErros] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const navigate = useNavigate();

  // Chave de administrador (para validação)
  const CHAVE_ADMIN_VALIDA = 'ADMIN2024SISRESERVA';

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/@(gmail\.com|hotmail\.com|unifan\.edu\.br)$/.test(formData.email.toLowerCase())) {
      novosErros.email = 'Use @gmail.com, @hotmail.com ou @unifan.edu.br';
    }

    if (!formData.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      novosErros.telefone = 'Formato: (XX) XXXXX-XXXX';
    }

    if (!formData.chaveAdministrador.trim()) {
      novosErros.chaveAdministrador = 'Chave de administrador é obrigatória';
    } else if (formData.chaveAdministrador !== CHAVE_ADMIN_VALIDA) {
      novosErros.chaveAdministrador = 'Chave de administrador inválida';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;

    // Formatar telefone automaticamente
    if (name === 'telefone') {
      const apenasNumeros = value.replace(/\D/g, '');

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

    // Simular registro de admin
    console.log('Admin cadastrado:', formData);
    setCadastroSucesso(true);

    // Redirecionar para login após 2 segundos
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (cadastroSucesso) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-12">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-green-200 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Cadastro Realizado!</h2>
          <p className="text-gray-600 mb-4">Sua conta de administrador foi criada com sucesso. Redirecionando para login...</p>
          <Link
            to="/"
            className="inline-block bg-[#4E73DF] hover:bg-[#3b59b6] text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-12 pb-8">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl border border-gray-100">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Cadastro de Administrador</h2>
          <p className="text-gray-500 mt-2">Crie sua conta de administrador do sistema</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Nome Completo */}
            <div className="md:col-span-2">
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
                placeholder="admin@unifan.edu.br"
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

            {/* Departamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF] transition text-gray-800"
              >
                <option value="Administrativo">Administrativo</option>
                <option value="TI">TI (Tecnologia da Informação)</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Acadêmico">Acadêmico</option>
              </select>
            </div>

            {/* Nível de Acesso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Acesso
              </label>
              <select
                name="nivelAcesso"
                value={formData.nivelAcesso}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF] transition text-gray-800"
              >
                <option value="Visualizador">Visualizador</option>
                <option value="Editor">Editor</option>
                <option value="Administrador">Administrador</option>
                <option value="SuperAdmin">Super Administrador</option>
              </select>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pr-20 px-4 py-2 border rounded-lg outline-none transition ${
                    erros.senha ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#4E73DF] hover:opacity-80 font-medium"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {erros.senha && <p className="text-red-500 text-sm mt-1">{erros.senha}</p>}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pr-20 px-4 py-2 border rounded-lg outline-none transition ${
                    erros.confirmarSenha ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#4E73DF] hover:opacity-80 font-medium"
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {erros.confirmarSenha && <p className="text-red-500 text-sm mt-1">{erros.confirmarSenha}</p>}
            </div>

            {/* Chave de Administrador */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chave de Administrador *
              </label>
              <input
                type="password"
                name="chaveAdministrador"
                value={formData.chaveAdministrador}
                onChange={handleInputChange}
                placeholder="Digite a chave de administrador"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                  erros.chaveAdministrador ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                }`}
              />
              {erros.chaveAdministrador && <p className="text-red-500 text-sm mt-1">{erros.chaveAdministrador}</p>}
              <p className="text-xs text-gray-500 mt-1">Chave de segurança necessária para criar conta de admin</p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#4E73DF] hover:bg-[#3b59b6] text-white font-semibold py-2 px-6 rounded-lg transition shadow-sm"
            >
              Cadastrar
            </button>
            <Link
              to="/"
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition shadow-sm text-center"
            >
              Cancelar
            </Link>
          </div>

          {/* Link para Cadastro de Aluno */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Deseja se cadastrar como aluno?{' '}
            <Link to="/cadastro-aluno" className="text-[#4E73DF] hover:underline font-semibold">
              Clique aqui
            </Link>
          </p>

          {/* Info da Chave */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 mt-4">
            <p className="font-semibold mb-1">🔑 Chave de Administrador (Teste):</p>
            <p className="font-mono break-all">{CHAVE_ADMIN_VALIDA}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
