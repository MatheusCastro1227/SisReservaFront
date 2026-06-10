import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 2. Recebemos a prop setEstaLogado
export default function Login({ setEstaLogado }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  
  // Estados para recuperação de senha
  const [telaSolicitacao, setTelaSolicitacao] = useState(false);
  const [telaReset, setTelaReset] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [codigoRecuperacao, setCodigoRecuperacao] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [erroRecuperacao, setErroRecuperacao] = useState('');
  const [sucessoRecuperacao, setSucessoRecuperacao] = useState('');
  
  const navigate = useNavigate(); // 3. Inicializamos o navegador

  // Credenciais do ADM mestre (temporário)
  const ADM_MESTRE = {
    email: 'admin@unifan.edu.br',
    senha: 'admin123',
  };

  // Credenciais de Aluno (temporário)
  const ALUNO_TESTE = {
    email: 'matheus@unifan.edu.br',
    senha: 'aluno123',
    nome: 'Matheus Silva',
    matricula: '2024001',
    curso: 'Engenharia de Software',
    telefone: '(11) 98765-4321',
    tipoUsuario: 'Aluno',
  };

  const validarEmail = (emailInformado) => {
    // Aceita apenas domínios específicos: @gmail.com, @hotmail.com, ou @unifan.edu.br
    const domentosValidos = ['@gmail.com', '@hotmail.com', '@unifan.edu.br'];
    const temDominioValido = domentosValidos.some(dominio => 
      emailInformado.toLowerCase().endsWith(dominio)
    );

    if (!emailInformado) {
      setErroEmail('');
      return false;
    }

    if (!emailInformado.includes('@')) {
      setErroEmail('E-mail deve conter @');
      return false;
    }

    if (!temDominioValido) {
      setErroEmail('Use @gmail.com, @hotmail.com ou @unifan.edu.br');
      return false;
    }

    setErroEmail('');
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Fazemos uma última checagem antes de enviar
    if (!validarEmail(email)) {
      return; 
    }

    // Verificar se a senha está vazia
    if (!senha) {
      setErroSenha('Senha é obrigatória');
      return;
    }

    // Verificar credenciais do ADM mestre
    if (email.toLowerCase() === ADM_MESTRE.email.toLowerCase() && senha === ADM_MESTRE.senha) {
      console.log('Login ADM mestre realizado com sucesso');
      setEstaLogado(true);
      localStorage.setItem('usuarioLogado', JSON.stringify({
        email: ADM_MESTRE.email,
        tipoUsuario: 'Admin',
        nome: 'Administrador'
      }));
      navigate('/usuarios');
      return;
    }

    // Verificar credenciais de Aluno teste
    if (email.toLowerCase() === ALUNO_TESTE.email.toLowerCase() && senha === ALUNO_TESTE.senha) {
      console.log('Login Aluno realizado com sucesso');
      setEstaLogado(true);
      localStorage.setItem('usuarioLogado', JSON.stringify(ALUNO_TESTE));
      navigate('/reservas');
      return;
    }

    // Para outros usuários (simulado)
    console.log('Tentativa de login com:', { email, senha });
    alert('⚠️ Credenciais inválidas. Use admin@unifan.edu.br / admin123 ou matheus@unifan.edu.br / aluno123.');
    setErroSenha('E-mail ou senha incorretos');
  };

  const handleSolicitarRecuperacao = (e) => {
    e.preventDefault();
    
    if (!validarEmail(emailRecuperacao)) {
      return;
    }

    // Simular envio de código
    console.log('Código de recuperação enviado para:', emailRecuperacao);
    setSucessoRecuperacao('✅ Código enviado para seu e-mail. Verifique sua caixa de entrada.');
    
    setTimeout(() => {
      setSucessoRecuperacao('');
      setTelaReset(true);
    }, 2000);
  };

  const handleResetSenha = (e) => {
    e.preventDefault();
    
    if (!codigoRecuperacao) {
      setErroRecuperacao('Por favor, insira o código de recuperação');
      return;
    }

    if (!novaSenha) {
      setErroRecuperacao('Por favor, insira a nova senha');
      return;
    }

    if (novaSenha.length < 6) {
      setErroRecuperacao('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErroRecuperacao('As senhas não coincidem');
      return;
    }

    // Simular atualização de senha
    console.log('Senha atualizada com sucesso');
    setSucessoRecuperacao('✅ Senha atualizada com sucesso! Redirecionando para login...');
    
    setTimeout(() => {
      setTelaSolicitacao(false);
      setTelaReset(false);
      setEmailRecuperacao('');
      setCodigoRecuperacao('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setSucessoRecuperacao('');
      setErroRecuperacao('');
      setEmail('');
      setSenha('');
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-12">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-100">
        
        {/* TELA 1: LOGIN NORMAL */}
        {!telaSolicitacao && !telaReset && (
          <>
            {/* Cabeçalho do Cartão de Login */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Acesso ao Sistema</h2>
              <p className="text-gray-500 mt-2">Reserve sua sala de aula ou laboratório</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* E-mail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  required 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validarEmail(e.target.value);
                  }}
                  placeholder="seu.nome@unifan.edu.br"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E73DF] outline-none transition text-gray-800 ${
                    erroEmail ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#4E73DF]'
                  }`}
                />
                {erroEmail && (
                  <p className="text-red-500 text-sm mt-1 font-medium">{erroEmail}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      if (erroSenha) setErroSenha('');
                    }}
                    placeholder="••••••••"
                    className={`w-full pr-20 px-4 py-2 border rounded-lg focus:ring-2 outline-none transition text-gray-800 ${
                      erroSenha ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#4E73DF] focus:border-[#4E73DF]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#4E73DF] hover:opacity-80 font-medium"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {erroSenha && (
                  <p className="text-red-500 text-sm mt-1 font-medium">{erroSenha}</p>
                )}
              </div>

              {/* Esqueci a senha ou algo assim */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer select-none">
                  <input type="checkbox" className="rounded text-[#4E73DF] mr-2 border-gray-300 focus:ring-[#4E73DF]" />
                  Lembrar-me
                </label>
                <button
                  type="button"
                  onClick={() => setTelaSolicitacao(true)}
                  className="text-[#4E73DF] hover:underline font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão de Submissão */}
              <button
                type="submit"
                disabled={email && erroEmail}
                className={`w-full font-semibold py-2 px-4 rounded-lg transition shadow-sm active:scale-[0.98] ${
                  email && erroEmail
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#4E73DF] hover:bg-[#3b59b6] text-white'
                }`}
              >
                Entrar
              </button>

              {/* Link para Cadastro */}
              <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                Não tem conta?{' '}
                <Link to="/escolha-cadastro" className="text-[#4E73DF] hover:underline font-semibold">
                  Cadastre-se aqui
                </Link>
              </div>

              {/* Info ADM Temporário */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 mt-4 space-y-2">
                <div>
                  <p className="font-semibold mb-1">👤 Admin Master (Temporário):</p>
                  <p>E-mail: <span className="font-mono font-bold">admin@unifan.edu.br</span></p>
                  <p>Senha: <span className="font-mono font-bold">admin123</span></p>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <p className="font-semibold mb-1">📚 Aluno Teste (Temporário):</p>
                  <p>E-mail: <span className="font-mono font-bold">matheus@unifan.edu.br</span></p>
                  <p>Senha: <span className="font-mono font-bold">aluno123</span></p>
                  <p>Matrícula: <span className="font-mono font-bold">2024001</span></p>
                  <p>Curso: <span className="font-mono font-bold">Eng. de Software</span></p>
                </div>
              </div>
              
            </form>
          </>
        )}

        {/* TELA 2: SOLICITAÇÃO DE RECUPERAÇÃO */}
        {telaSolicitacao && !telaReset && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Recuperar Senha</h2>
              <p className="text-gray-500 mt-2">Insira seu e-mail cadastrado</p>
            </div>

            <form onSubmit={handleSolicitarRecuperacao} className="space-y-4">
              {sucessoRecuperacao && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  {sucessoRecuperacao}
                </div>
              )}

              {erroRecuperacao && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {erroRecuperacao}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  placeholder="seu.email@unifan.edu.br"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E73DF] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4E73DF] hover:bg-[#3b59b6] text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Enviar Código
              </button>

              <button
                type="button"
                onClick={() => {
                  setTelaSolicitacao(false);
                  setEmailRecuperacao('');
                  setErroRecuperacao('');
                }}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Voltar
              </button>
            </form>
          </>
        )}

        {/* TELA 3: RESET DE SENHA */}
        {telaReset && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Redefinir Senha</h2>
              <p className="text-gray-500 mt-2">Insira o código e sua nova senha</p>
            </div>

            <form onSubmit={handleResetSenha} className="space-y-4">
              {sucessoRecuperacao && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  {sucessoRecuperacao}
                </div>
              )}

              {erroRecuperacao && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {erroRecuperacao}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Recuperação
                </label>
                <input
                  type="text"
                  value={codigoRecuperacao}
                  onChange={(e) => setCodigoRecuperacao(e.target.value)}
                  placeholder="Código enviado para seu e-mail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E73DF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E73DF] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#4E73DF] hover:opacity-80"
                  >
                    {showNewPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E73DF] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#4E73DF] hover:opacity-80"
                  >
                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4E73DF] hover:bg-[#3b59b6] text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Redefinir Senha
              </button>

              <button
                type="button"
                onClick={() => {
                  setTelaReset(false);
                  setTelaSolicitacao(true);
                  setCodigoRecuperacao('');
                  setNovaSenha('');
                  setConfirmarNovaSenha('');
                  setErroRecuperacao('');
                }}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Voltar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}