export type Dish = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  photo_uri: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};
