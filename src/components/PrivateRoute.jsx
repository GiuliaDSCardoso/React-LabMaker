import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    }

    checkUser();

    // Realtime listener para mudanças de sessão (logout em outra aba)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Carregando...</div>;

  if (!authenticated) {
    return <Navigate to="/login" replace />; // redireciona de forma segura
  }

  return children;
}