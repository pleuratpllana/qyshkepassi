import  { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

 useEffect(() => {
   const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession(); // v2
  setUser(session?.user || null);
  setLoading(false);
   };

   getSession();

   const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
     setUser(session?.user || null);
   setLoading(false);
 });

return () => listener.subscription.unsubscribe();
 }, []);

const login = async ({ email, password }) => {
 const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  setUser(data.user);
 };

 const register = async ({ email, password, name }) => {
 const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
email, 
 password, 
 options: { data: { name } } 
  });
  
  if (signUpError) throw signUpError;

  const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user after sign up:", userError.message);
  }
 
 setUser(currentUser || signUpData.user);
  
 };

  const resendConfirmationEmail = async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
    return true;
  };

 const logout = async () => {
 await supabase.auth.signOut();
setUser(null);
 };

  const isConfirmed = user ? !!user.email_confirmed_at : false;


 return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isConfirmed, resendConfirmationEmail }}>
    {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);