import { supabase } from './supabase';
import { Dish } from './types';

export async function getDishesByUser(userId: string): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data as any[]) || []).map(d => ({ ...d, description: d.description ?? null })) as Dish[];
}

export async function createDish(dish: Omit<Dish, 'id' | 'created_at' | 'description'>): Promise<Dish> {
  const { data, error } = await supabase.from('dishes').insert([dish]).select().single();
  if (error) throw error;
  return data as Dish;
}

export async function updateDish(id: string, updates: Partial<Omit<Dish, 'id' | 'user_id' | 'created_at' | 'description'>>): Promise<Dish> {
  const { data, error } = await supabase.from('dishes').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Dish;
}

export async function deleteDish(id: string, userId?: string): Promise<void> {
  let query = supabase.from('dishes').delete().eq('id', id);
  if (userId) query = query.eq('user_id', userId);
  const { error } = await query;
  if (error) throw error;
}

export async function uploadImage(userId: string, uri: string, bucket = 'dishes') {
  try {
    const extMatch = uri.split('.').pop()?.split('?')[0];
    const ext = extMatch ? extMatch : 'jpg';
    const filename = `${userId}/${Date.now()}.${ext}`;

    // fetch blob from local uri
    const resp = await fetch(uri);
    const blob = await resp.blob();

    const { data, error } = await supabase.storage.from(bucket).upload(filename, blob, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path ?? filename);
    return urlData?.publicUrl ?? null;
  } catch (e) {
    throw e;
  }
}

export default { getDishesByUser, createDish, updateDish, deleteDish, uploadImage };
