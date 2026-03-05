import { useEffect } from "react";
import Body from "../assets/styles/Body";
import Header from "../assets/styles/Header";
import MenuLateral from "../assets/styles/MenuLateral";

import { PhoneIcon, InstagramIcon, MailIcon } from "lucide-react";
import { supabase } from "../services/supabase";

export default function Contact() {
  useEffect(() => {
    // Sempre que acessar uma página pública, desloga qualquer sessão
    supabase.auth.signOut();
  }, []);

  function abrirWhatsApp() {
    const telefone = "557532299138"; // número oficial
    window.open(`https://wa.me/${telefone}`, "_blank");
  }

  function abrirInstagram() {
    window.open("https://instagram.com/mobiliza.senaifeira", "_blank");
  }

  function alertaEnvio() {
    alert(
      "✅ Mensagem enviada com sucesso!\n\n⏳ Nosso prazo de resposta é de até 3 dias úteis."
    );
  }

  return (
    <Body>
      <MenuLateral/>

      <Header
            title="Entre em contato conosco!"
            />

      <section className="flex flex-col text-xl items-center py-12 px-4 md:px-48 gap-8">
        {/* FORMULÁRIO */}
        <form
            action="https://formsubmit.co/labmaker.fsa@fieb.org.br"
            method="POST"
            onSubmit={alertaEnvio}
            className="bg-white dark:bg-[#002357]  w-full max-w-6xl p-8 rounded-lg shadow-lg space-y-4"
            >
            <input  type="hidden" name="_subject" value="📩 Contato - LabMaker SENAI Feira" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_replyto" value="email" />
          <div>
            <label className="block text-xl dark:text-white font-semibold text-gray-700">
              Seu e-mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 px-3 py-2 rounded-md  border
                focus:outline-none
                focus:ring-1
                dark:bg-[#001028]/70
                outline-none
                border-none
                dark:focus:border-blue-900/60
                dark:outline-none
                focus:border-blue-50
                resize-none"
              placeholder="seuemail@email.com"
            />
          </div>
            <input
                type="hidden"
                name="_next"
                value="http://localhost:5173/contact"
            />
          <div>
            <label className="block text-xl font-semibold dark:text-white  text-gray-700">
              Assunto
            </label>
            <input
              type="text"
              name="assunto"
              required
              className="w-full mt-1 px-3 py-2 rounded-md  border
                focus:outline-none
                focus:ring-1
                border-none
                dark:bg-[#001028]/70
                dark:focus:border-blue-900/60
                dark:outline-none
                focus:border-blue-50
                resize-none"
              placeholder="Assunto da mensagem"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold dark:text-white text-gray-700">
              Mensagem
            </label>
            <textarea
              name="mensagem"
              required
              rows="5"
              className="w-full mt-1 px-3 py-2 rounded-md  border
                border-none
                dark:focus:border-blue-900/60
                dark:outline-none
              dark:bg-[#001028]/70
                focus:outline-none
                focus:ring-1
                focus:border-blue-50
                resize-none"
              placeholder="Digite sua mensagem..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1976d2] dark:bg-[#00183b] dark:hover:bg-[#001028] text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <MailIcon size={18} />
            Enviar mensagem
          </button>
        </form>

        {/* BOTÕES SOCIAIS */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={abrirWhatsApp}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            <PhoneIcon size={20} />
            WhatsApp
          </button>

          <button
            onClick={abrirInstagram}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-3 rounded-lg hover:opacity-90 transition font-semibold"
          >
            <InstagramIcon size={20} />
            Instagram
          </button>
        </div>
      </section>
    </Body>
  );
}
