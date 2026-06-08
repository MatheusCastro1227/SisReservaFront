import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import CadastroAluno from './pages/Cadastro';
import Usuarios from './pages/Usuario';
import Salas from './pages/Salas';
import Reservas from './pages/Reservas';

function App() {
  const [estaLogado, setEstaLogado] = useState(false);
  // Novo estado para controlar o menu hambúrguer no celular
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800">
        
        {/* Navbar Responsiva */}
        <nav className="bg-[#4E73DF] text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Lado Esquerdo: Logo e Ícone */}
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className="font-bold text-xl tracking-wider">SisReserva</span>
              </div>

              {/* Lado Direito (Desktop): Menus + Perfil */}
              <div className="hidden md:flex items-center gap-6">
                {estaLogado && (
                  <div className="flex items-center gap-2">
                    <Link to="/salas" className="hover:bg-[#3b59b6] px-3 py-2 rounded-lg text-sm font-semibold transition">Salas</Link>
                    <Link to="/reservas" className="hover:bg-[#3b59b6] px-3 py-2 rounded-lg text-sm font-semibold transition">Reservas</Link>
                    <Link to="/usuarios" className="hover:bg-[#3b59b6] px-3 py-2 rounded-lg text-sm font-semibold transition">Usuários</Link>
                  </div>
                )}

                {estaLogado ? (
                  <div className="flex items-center gap-4 ml-4 border-l border-[#3b59b6] pl-4">
                    <div className="text-right">
                      <p className="text-sm font-bold leading-none text-white">Matheus Castro</p>
                      <p className="text-[11px] text-white/80 mt-1 font-medium">Painel Acadêmico</p>
                    </div>
                    <button 
                      onClick={() => setEstaLogado(false)} 
                      className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition shadow-sm"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link to="/" className="bg-white text-[#4E73DF] font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition shadow-sm">
                    Entrar
                  </Link>
                )}
              </div>

              {/* Botão do Menu Hambúrguer (Apenas Mobile) */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {/* Muda o ícone de "Hambúrguer" para "X" quando aberto */}
                    {menuMobileAberto ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu Dropdown (Apenas Mobile) */}
          {menuMobileAberto && (
            <div className="md:hidden bg-[#3b59b6] border-t border-[#4E73DF]">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {estaLogado && (
                  <>
                    {/* Adicionei um onClick para fechar o menu ao clicar em um link */}
                    <Link to="/salas" onClick={() => setMenuMobileAberto(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2a4392] transition">Salas</Link>
                    <Link to="/reservas" onClick={() => setMenuMobileAberto(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2a4392] transition">Reservas</Link>
                    <Link to="/usuarios" onClick={() => setMenuMobileAberto(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2a4392] transition">Usuários</Link>
                  </>
                )}
              </div>
              
              {/* Perfil Mobile */}
              <div className="pt-4 pb-3 border-t border-[#4E73DF]">
                {estaLogado ? (
                  <div className="flex items-center justify-between px-5">
                    <div>
                      <div className="text-base font-medium text-white">Matheus Castro</div>
                      <div className="text-sm font-medium text-white/80">Painel Acadêmico</div>
                    </div>
                    <button 
                      onClick={() => { setEstaLogado(false); setMenuMobileAberto(false); }} 
                      className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="px-5">
                    <Link to="/" onClick={() => setMenuMobileAberto(false)} className="block text-center w-full bg-white text-[#4E73DF] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                      Entrar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Conteúdo Principal */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[calc(100vh-11rem)]">
            <Routes>
              <Route path="/" element={<Login setEstaLogado={setEstaLogado} />} />
              <Route path="/cadastro-aluno" element={<CadastroAluno />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/salas" element={<Salas />} />
              <Route path="/reservas" element={<Reservas />} />
            </Routes>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
          &copy; 2026 SisReserva - Todos os direitos reservados.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;