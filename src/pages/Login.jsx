import { useState } from "react";
import { CornerDownLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

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
    <div
      className="h-[100vh] w-[vw] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('logos/BgMaker4.jpeg')" }}
    >
      {/* Overlay escuro */}
      

      {/* Card */}
      <form
        onSubmit={onSubmitLogin}
        className="
          relative z-10
          w-[90%] max-w-[520px]
          rounded-2xl
         
          backdrop-blur-xl
         border-white/20 border
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          px-10 py-10
          flex flex-col gap-6
          drop-shadow-lg
        "
      >
        <div className="flex justify-between items-center">
          
          <a className=" w-[5%] hover:text-white/60 text-white" href="/"><CornerDownLeft /></a>
          <h1 className="text-center w-[95%]  text-white text-3xl font-semibold mb-2">
            LOGIN
          </h1>
        </div>
        {/* Título */}
        

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Email:</label>
          <input
            type="email"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            placeholder="Dica: Email institucional admin"
            className="
              h-12 px-4
              rounded-full
              bg-transparent
              border border-white
              text-white
              placeholder:text-white/70
              outline-none
              focus:ring-2 focus:ring-white/50
            "
          />
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Senha:</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Insira sua senha"
              className="
                h-12 w-full px-4 pr-12
                rounded-full
                bg-transparent
                border border-white
                text-white
                placeholder:text-white/70
                outline-none
                focus:ring-2 focus:ring-white/50
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Checkbox */}
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
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
              border border-white
              bg-transparent
              cursor-pointer
            "
          />

          {/* CHECK ICON */}
          <svg
            className="
              absolute inset-0
              w-5 h-5
              text-white
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
            rounded-full
            bg-white/30
            border
            text-white
            font-medium
            backdrop-blur-md
            hover:bg-white/40
            transition
          "
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
