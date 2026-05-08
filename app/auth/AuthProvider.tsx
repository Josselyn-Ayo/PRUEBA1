import { supabase } from '@/app/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const storage = Platform.OS === 'web'
  ? { getItem: async (k: string) => localStorage.getItem(k), setItem: async (k: string, v: string) => { localStorage.setItem(k, v); }, removeItem: async (k: string) => { localStorage.removeItem(k); } }
  : AsyncStorage;

type User = {
  id: string;
  email?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // restore session from AsyncStorage if present
    const restore = async () => {
      try {
        const s = await storage.getItem('@gastro:session');
        if (s) {
          const parsed = JSON.parse(s);
          setUser(parsed.user ?? null);
        }
      } catch (e) {
        console.warn('Failed to restore session', e);
      } finally {
        setLoading(false);
      }
    };

    restore();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = { id: session.user.id, email: session.user.email };
        setUser(u);
        storage.setItem('@gastro:session', JSON.stringify({ user: u }));
        router.replace('/');
      } else {
        setUser(null);
        storage.removeItem('@gastro:session');
        router.replace('/login');
      }
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.error) throw res.error;
    return res;
  };

  const signUp = async (email: string, password: string) => {
    const res = await supabase.auth.signUp({ email, password });
    if (res.error) throw res.error;
    return res;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    await storage.removeItem('@gastro:session');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
