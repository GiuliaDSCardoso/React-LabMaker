import { useState } from "react";
import { Eye, EyeOff, MoveLeftIcon } from "lucide-react";
import Button from "../assets/styles/Button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [perfil, setPerfil] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [error, setError] = useState("");
  const navigate = useNavigate();
    function onBackClick() {
      navigate(-1); 
  }
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
    // remove persistência
    window.addEventListener("beforeunload", () => {
      supabase.auth.signOut();
    });
  }

  navigate("/admin", { replace: true });
}



  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#1976d2] to-blue-800 flex flex-col md:flex-row">
      
      {/* LADO ESQUERDO */}
      <div className="flex  w-[100%] gap-4 px-4 md:w-1/2 h-[20%] md:h-[100%] mb-20 items-center justify-center bg-blue-800">
       <div>
        <button onClick={onBackClick} className="text-white px-1 pb-1 pt-1 rounded-[100%] bg-[#0b2c85] hover:bg-[#07227c]">
            <MoveLeftIcon size={20} />
            </button>
       </div>
        <div>
         <h2 className="text-white md:w-full w-[100%] md:text-4xl text-2xl font-bold text-center">
           Seja bem-vindo(a)
         </h2>    
        </div>

       
      </div>

      {/* LADO DIREITO */}
      <div className="flex w-full md:w-full   items-center justify-center bg-gradient-to-r from-[#1976d2] to-blue-800">
        <form
          onSubmit={onSubmitLogin}
          className="w-full max-w-md px-6 flex flex-col items-center gap-6"
        >
        <div className="flex flex-col items-center gap-1 mb-6"> 
               <h2 className="text-3xl font-bold text-white">
                LOGIN
              </h2>
              <h1 className="text-xl font-bold text-white/80">
                Acesso restrito ao Admin
              </h1>
        </div>
          

          {/* PERFIL */}
          <div className="flex flex-col w-full">
            <label className="text-[#ffffff] text-xl md:text-2xl">Email</label>
            <input
              type="text"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              placeholder="Insira seu email"
              className="
                w-full h-[50px] px-3
                rounded-md
                md:placeholder:text-lg placeholder:text-[13px]
                bg-[#a9c7ffc9]
                text-[#2756ac]
                placeholder:text-[#10377e]/50
                outline-none
                focus:ring-2 focus:ring-[#4c82e6]
              "
            />
          </div>

          {/* SENHA */}
          <div className="flex flex-col w-full">
            <label className="text-[#ffffff] text-xl md:text-2xl">Senha</label>

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira sua senha"
                className="
                  w-full h-[50px] px-3
                  rounded-md
                  md:placeholder:text-lg placeholder:text-[13px]
                  bg-[#a9c7ffc9]
                  text-[#2756ac]
                  placeholder:text-[#10377e]/50
                  outline-none
                  focus:ring-2 focus:ring-[#4c82e6]
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[100%] px-1 pt-1 pb-1 bg-blue-800 text-[#c1d6fd] hover:text-[#4c82e6]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-blue-600"
            />
            Lembrar deste computador
          </label>

          <Button  type="submit" text="Entrar" />
        </form>
      </div>
    </div>
  );
}
