import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 2. Recebemos a prop setEstaLogado
export default function Login({ setEstaLogado }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  
  const navigate = useNavigate(); // 3. Inicializamos o navegador

  // Credenciais do ADM mestre (temporário)
  const ADM_MESTRE = {
    email: 'admin@unifan.edu.br',
    senha: 'admin123',
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
      navigate('/usuarios');
      return;
    }

    // Para outros usuários (simulado)
    console.log('Tentativa de login com:', { email, senha });
    alert('⚠️ Credenciais inválidas. Use admin@unifan.edu.br / admin123 ou cadastre-se como aluno.');
    setErroSenha('E-mail ou senha incorretos');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-12">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-100">
        
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
            <a href="#" className="text-[#4E73DF] hover:underline font-medium">Esqueceu a senha?</a>
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
            <Link to="/cadastro-aluno" className="text-[#4E73DF] hover:underline font-semibold">
              Cadastre-se aqui
            </Link>
          </div>

          {/* Info ADM Temporário */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 mt-4">
            <p className="font-semibold mb-1">👤 Credenciais ADM (Temporário):</p>
            <p>E-mail: <span className="font-mono font-bold">admin@unifan.edu.br</span></p>
            <p>Senha: <span className="font-mono font-bold">admin123</span></p>
          </div>
          
        </form>
      </div>
    </div>
  );
}