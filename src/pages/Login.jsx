
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../assets/styles/Button";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [perfil, setPerfil] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    

    function onSubmitLogin(e){
        e.preventDefault();
        setError("");

        const USER_LOGIN ={
            perfil: "adminmaker",
            password: "labmaker123"
        };

        if(!perfil || !password){
            setError("Preencha todos os campos.");
            return;
        }

        if (
            perfil === USER_LOGIN.perfil &&
            password === USER_LOGIN.password
        ){
            localStorage.setItem("auth", "true");

            window.location.href = "/admin";

        }else{
            setError("Perfil ou senha incorretos.");
        }
        // Lógica de submissão do formulário de login

    }

    
    return (
        <div className="flex justify-center items-center w-screen bg-gradient-to-r from-[#1976d2] to-blue-800 h-screen">
            <div className="container flex w-[60%] shadow-lg bg-blue-100 h-[55vh]">
                <div className="flex items-center justify-center container-left bg-blue-800 h-full w-[50%]">
                    <h2 className="text-white text-center text-3xl font-bold "> Seja bem-vindo(a) </h2>
                </div>
                <form onSubmit={onSubmitLogin} className="container-right p-20 h-full w-[50%] flex flex-col justify-center items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-roboto font-bold text-[#1976d2]">
                        LOGIN
                        </h2>
                    </div>
                    <div className="flex flex-col ">
                        <label htmlFor="perfil" className="text-[#2756ac]">Perfil:</label>
                        <input type="text" value={perfil} onChange={(e) => setPerfil(e.target.value)} placeholder="Insira seu perfil" 
                        className="w-[500px] h-[48px] px-3 text-[#2756ac]  placeholder:text-[#10377e]/50 bg-[#a9c7ff67] outline-none focus:text-[#4c82e6]
                         focus:outline-none focus:ring-1 focus:ring-none"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="text-[#2756ac]">Senha:</label>
                                        
                        <div className="relative w-[500px]">
                            <input
                            id="password"
                            placeholder="Insira sua senha"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full h-[48px] px-3 pr-10
                                placeholder:text-[#10377e]/50
                                text-[#2756ac]
                                bg-[#a9c7ff67]
                                border-0
                                outline-none
                                rounded-md
                                focus:text-[#4c82e6]
                                focus:ring-2 focus:ring-[#4c82e6]
                            "
                            />

                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2756ac] hover:text-[#4c82e6]"
                            >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                 {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                  )}
                <Button type="submit" method={onSubmitLogin} text={"Entrar"}/>
                </form>
             </div>
         </div>
                            
    );
}
