import { supabase } from './supabase';

// Admin Login
export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Admin Logout
export async function adminLogout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// Get current user
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}
