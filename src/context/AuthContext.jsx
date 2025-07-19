import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  //sign up
  const signUpNewUser = async (email, password) => {
    try {
      //send signup data to supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      //error handling (supabase)
      if (error) {
        console.error('Sign-up error: ', error);
        return { success: false, error };
      }
      //signup success
      return { success: true, data };
    } catch (error) {
      //error handling (unexpected errors)
      return {
        success: false,
        message: 'An unexpected error occured, please try again: ',
        error,
      };
    }
  };

  //sign in
  const signInUser = async (email, password) => {
    try {
      //send login data to supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });
      //error handling (supabase)
      if (error) {
        console.error('Sign-in error: ', error);
        return { success: false, error };
      }
      //signup success
      console.log('Sign-in success:', data);
      return { success: true, data };
    } catch (error) {
      //error handling (unexpected errors)
      console.error('unexpected error during sign-in: ', error.message);
      return {
        success: false,
        message: 'An unexpected error occured, please try again: ',
        error,
      };
    }
  };

  //sign out
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      //error handling (supabase)
      if (error) {
        console.log('Sign-out error: ', error);
        return { success: false, error };
      }
    } catch (error) {
      //error handling (unexpected errors)
      console.error('unexpected error during sign-out: ', error.message);
      return {
        success: false,
        message: 'An unexpected error occured, please try again: ',
        error,
      };
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ signUpNewUser, signInUser, session, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
