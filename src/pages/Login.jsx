import { useState } from "react";
import { CornerDownLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

import BodyLogin from "../assets/styles/BodyLogin";

import InputLogin from "../assets/styles/InputLogin";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [perfil, setPerfil] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function onSubmitLogin(e) {
    e.preventDefault();
    setError("");

    if (!perfil || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: perfil,
      password,
    });

    if (error) {
      setError("Email ou senha incorretos.");
      return;
    }

    if (!remember) {
      window.addEventListener("beforeunload", () => {
        supabase.auth.signOut();
      });
    }

    navigate("/admin", { replace: true });
  }

  return (
    <BodyLogin>
    
      {/* Overlay escuro */}
      
      <div className="flex md:mt-60 mt-40 items-center justify-center">

      
      {/* Card */}
      <form
        onSubmit={onSubmitLogin}
        className="
          relative z-10
          w-[90%] max-w-[520px]
          rounded-2xl
          px-10 py-10
          flex flex-col gap-6
          backdrop-blur-xl
          border
          /* 🌞 MODO CLARO */
          bg-transparent
          border-white
          shadow-[0_8px_32px_rgba(31,38,135,0.15)]

          /* 🌙 MODO DARK */
          dark:bg-[#001028]/10
          dark:border-none
          dark:shadow-[-8px_-7px_80px_rgba(0,150,255,0.25),30px_25px_60px_rgba(0,0,20,0.95)]

          transition-all duration-300
        "
      >
        <div className="flex justify-between items-center">
          <a
            className="w-[5%] text-gray-700 hover:text-gray-500 dark:text-white dark:hover:text-white/60 transition"
            href="/"
          >
            <CornerDownLeft />
          </a>

          <h1 className="text-center w-[95%] text-3xl font-semibold mb-2 text-gray-800 dark:text-white">
            LOGIN
          </h1>
        </div>
        {/* Título */}
        

        {/* Email */}
        <div className="flex flex-col gap-1">
         
          <InputLogin
          title="Email"
            type="email"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            placeholder="Dica: Email institucional admin"
      
        />
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1">
         
          <InputLogin
            title="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Insira sua senha"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-800 dark:text-white/70 dark:hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          
          </div>
        

        {/* Erro */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Checkbox */}
        <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-white">
          <div className="relative">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="
                peer
                appearance-none
                w-5 h-5
                rounded-lg
                border
                border-gray-400
                dark:border-white
                bg-transparent
                cursor-pointer
              "
            />

            <svg
              className="
                absolute inset-0
                w-5 h-5
                text-blue-600
                dark:text-white
                scale-0
                peer-checked:scale-100
                transition-transform
                pointer-events-none
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          Desejo lembrar do login neste dispositivo
        </label>

        {/* Botão */}
        <button
          type="submit"
          className="
            mt-4
            h-11
            rounded-lg
            font-medium
            transition

            /* 🌞 CLARO */
            bg-blue-600
            text-white
            hover:bg-blue-700
            shadow-lg

            /* 🌙 DARK */
            dark:bg-[#134591]
            dark:text-white
            dark:hover:bg-[#001028]
            dark:shadow-[20px_20px_60px_rgba(0,0,0,0.35)]
          "
        >
          Entrar
        </button>
      </form>
      </div>
    </BodyLogin>
  );
}
