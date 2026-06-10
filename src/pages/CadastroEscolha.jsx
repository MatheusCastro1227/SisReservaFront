import { Link } from 'react-router-dom';

export default function CadastroEscolha() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-12">
      <div className="w-full max-w-4xl">
        
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao SisReserva</h1>
          <p className="text-gray-600 text-lg">Selecione o tipo de cadastro:</p>
        </div>

        {/* Cards de Cadastro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card Cadastro Aluno */}
          <Link to="/cadastro-aluno" className="group">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#4E73DF] hover:shadow-lg transition duration-300 h-full flex flex-col">
              
              {/* Ícone */}
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#4E73DF] transition">
                <svg className="w-10 h-10 text-[#4E73DF] group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
                </svg>
              </div>

              {/* Conteúdo */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cadastro de Aluno</h2>
              <p className="text-gray-600 mb-6 grow">
                Se você é aluno, cadastre-se aqui para acessar o sistema de reservas e gerenciar suas solicitações.
              </p>

              {/* Lista de Funcionalidades */}
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#4E73DF]">✓</span> Fazer solicitações de reserva
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4E73DF]">✓</span> Visualizar suas reservas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4E73DF]">✓</span> Gerenciar seu perfil
                </li>
              </ul>

              {/* Botão */}
              <button className="w-full bg-[#4E73DF] hover:bg-[#3b59b6] text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm group-hover:shadow-md">
                Cadastrar como Aluno
              </button>
            </div>
          </Link>

          {/* Card Cadastro Admin */}
          <Link to="/cadastro-admin" className="group">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-500 hover:shadow-lg transition duration-300 h-full flex flex-col relative">
              
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Restrito
              </div>

              {/* Ícone */}
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition">
                <svg className="w-10 h-10 text-orange-500 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              {/* Conteúdo */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cadastro de Administrador</h2>
              <p className="text-gray-600 mb-6 grow">
                Se você é um administrador, cadastre-se aqui para gerenciar salas, usuários e aprovações de reservas.
              </p>

              {/* Lista de Funcionalidades */}
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Gerenciar salas e blocos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Aprovar/rejeitar reservas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Gerenciar usuários do sistema
                </li>
              </ul>

              {/* Aviso */}
              <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded mb-6 font-medium">
                ⚠️ Requer chave de administrador válida
              </p>

              {/* Botão */}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm group-hover:shadow-md">
                Cadastrar como Admin
              </button>
            </div>
          </Link>

        </div>

        {/* Link para Login */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-2">Já tem uma conta?</p>
          <Link to="/" className="text-[#4E73DF] hover:underline font-semibold text-lg">
            Faça login aqui
          </Link>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-800">53+</p>
            <p className="text-gray-600">Salas Disponíveis</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">5</p>
            <p className="text-gray-600">Blocos no Campus</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">100%</p>
            <p className="text-gray-600">Disponibilidade Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
