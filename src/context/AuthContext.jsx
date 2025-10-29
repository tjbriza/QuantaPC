import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Resolve the base site URL from env (preferred) or browser origin.
  const getSiteUrl = () => {
    // Vite: define VITE_SITE_URL in .env files per environment
    const fromEnv = import.meta?.env?.VITE_SITE_URL;
    return fromEnv && typeof fromEnv === 'string' && fromEnv.length > 0
      ? fromEnv
      : typeof window !== 'undefined'
        ? window.location.origin
        : '';
  };

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

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getSiteUrl()}/profilesetup`,
        },
      });
      if (error) {
        console.error('Google sign-in error:', error);
        return { success: false, error };
      }
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error during Google sign-in:', error.message);
      return {
        success: false,
        message: 'An unexpected error occurred, please try again: ',
        error,
      };
    }
  };

  // send reset password email
  const resetPasswordForEmail = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getSiteUrl()}/resetpassword`,
      });
      if (error) {
        console.error('Reset password email error:', error);
        return { success: false, error };
      }
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error during reset password email:', error);
      return {
        success: false,
        message: 'An unexpected error occurred, please try again: ',
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

  //admin sign in
  const adminSignIn = async (email, password) => {
    const { success, data, error } = await signInUser(email, password);
    if (!success) return { success: false, error };

    // role check
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (
      profileError ||
      (profile?.role !== 'admin' && profile?.role !== 'superadmin')
    ) {
      await signOut();
      return {
        success: false,
        error: { message: 'Invalid credentials for admin access.' },
      };
    }

    return { success: true, data };
  };

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
      value={{
        signUpNewUser,
        signInUser,
        session,
        signOut,
        signInWithGoogle,
        adminSignIn,
        resetPasswordForEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
