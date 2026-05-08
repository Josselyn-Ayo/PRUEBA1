import { useAuth } from '@/app/auth/AuthProvider';
import { createDish, deleteDish, getDishesByUser } from '@/app/lib/db';
import { setUserData } from '@/app/lib/storage';
import { Dish } from '@/app/lib/types';
import { tw } from '@/app/lib/uniwind';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import Animated, {
  FadeInDown,
  FadeOutLeft,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [query, setQuery] = useState('');
  const [detailDish, setDetailDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setDishes([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const rows = await getDishesByUser(user.id);
        setDishes(rows || []);
      } catch (e) {
        console.warn('Failed to load dishes', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const pickImage = async (mode: 'camera' | 'library') => {
    try {
      const { status } = mode === 'camera' 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere permiso');
        return null;
      }

      const res = mode === 'camera' 
        ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true });

      return res.canceled ? null : (res.assets?.[0]?.uri ?? null);
    } catch (e) { return null; }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch { return null; }
  };

  const addDish = async () => {
    if (!user) return;
    if (!name.trim() || !description.trim() || !photoUri) {
      Alert.alert('Error', 'Completa todos los campos y la foto');
      return;
    }

    setLoading(true);
    const loc = await getCurrentLocation();
    let city: string | null = null;
    let country: string | null = null;

    if (loc) {
      try {
        const rev = await Location.reverseGeocodeAsync({ latitude: loc.latitude, longitude: loc.longitude });
        if (rev && rev.length > 0) {
          city = rev[0].city ?? rev[0].region ?? null;
          country = rev[0].country ?? null;
        }
      } catch { }
    }

    try {
      const created = await createDish({
        user_id: user.id,
        name: name.trim(),
        photo_uri: photoUri,
        city,
        country,
        latitude: loc?.latitude ?? null,
        longitude: loc?.longitude ?? null,
      });

      const withDesc = { ...created, description: description.trim() };
      const newList = [withDesc, ...dishes];
      setDishes(newList);
      await setUserData(user.id, 'dishes', newList);
      
      setName('');
      setDescription('');
      setPhotoUri(null);
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E21837', dark: '#E21837' }}
      headerImage={
        /* Barra roja ajustada a 30px */
        <View style={{ height: 30, backgroundColor: '#E21837' }} />
      }>
      
      {/* Cabecera Principal subida (mt-0 o margen negativo si es necesario) */}
      <ThemedView style={tw('flex-row items-center justify-between mb-4 mt-0') as any}>
        <ThemedText type="title" style={tw('text-3xl font-bold') as any}>Tus platos</ThemedText>
        <TouchableOpacity onPress={() => signOut()} style={tw('py-1 px-3 border-l-2 border-red-500') as any}>
          <Text style={tw('text-gray-500 font-semibold') as any}>Salir</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={tw('mb-2') as any}>
        <Pressable 
          onPress={() => setModalVisible(true)} 
          style={tw('w-full py-4 bg-blue-500 rounded-xl items-center shadow-md mb-4') as any}
        >
          <Text style={tw('text-white font-bold text-lg') as any}>+ Añadir plato nuevo</Text>
        </Pressable>

        {loading && dishes.length === 0 ? (
          <ActivityIndicator size="large" color="#E21837" />
        ) : dishes.length === 0 ? (
          <Text style={tw('text-gray-400 text-center mt-4') as any}>No hay platos guardados.</Text>
        ) : (
          <>
            <TextInput 
              value={query} 
              onChangeText={setQuery} 
              placeholder="Buscar plato..." 
              style={tw('w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 mb-4') as any} 
            />
            {dishes
              .filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
              .map(item => (
                <DishCard 
                  key={item.id} 
                  item={item} 
                  onDelete={async (id: string) => {
                    try {
                      await deleteDish(id, user?.id);
                      const newList = dishes.filter((d) => d.id !== id);
                      setDishes(newList);
                      if (user) await setUserData(user.id, 'dishes', newList);
                    } catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
                  }} 
                  onPress={() => setDetailDish(item)} 
                />
            ))}
          </>
        )}
      </ThemedView>

      {/* MODALES */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={tw('flex-1 bg-white p-6 justify-center') as any}>
          <Text style={tw('text-3xl font-bold mb-6 text-gray-800') as any}>Nuevo plato</Text>
          <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={tw('w-full py-4 px-4 border border-gray-200 rounded-xl bg-gray-50 mb-4') as any} />
          <TextInput placeholder="Descripción" value={description} onChangeText={setDescription} style={tw('w-full py-4 px-4 border border-gray-200 rounded-xl bg-gray-50 mb-4') as any} />
          <View style={tw('mb-6') as any}>
            {photoUri ? (
              <Image source={photoUri} style={{ width: '100%', height: 200, borderRadius: 16, marginBottom: 12 }} />
            ) : (
              <View style={tw('w-full h-40 bg-gray-100 rounded-xl items-center justify-center mb-4') as any}>
                <Text style={tw('text-gray-400') as any}>Sin foto</Text>
              </View>
            )}
            <View style={tw('flex-row justify-between') as any}>
              <Pressable onPress={async () => { const uri = await pickImage('camera'); if (uri) setPhotoUri(uri); }} style={tw('bg-gray-800 px-6 py-3 rounded-xl') as any}><Text style={tw('text-white') as any}>Cámara</Text></Pressable>
              <Pressable onPress={async () => { const uri = await pickImage('library'); if (uri) setPhotoUri(uri); }} style={tw('bg-gray-200 px-6 py-3 rounded-xl') as any}><Text style={tw('text-gray-800') as any}>Galería</Text></Pressable>
            </View>
          </View>
          <Pressable onPress={addDish} style={tw('bg-green-500 py-4 rounded-xl items-center mb-4') as any}>
            <Text style={tw('text-white font-bold text-lg') as any}>Guardar</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(false)} style={tw('items-center') as any}><Text style={tw('text-gray-400 font-bold') as any}>Cerrar</Text></Pressable>
        </View>
      </Modal>

      <Modal visible={!!detailDish} animationType="fade" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 }}>
          <View style={tw('bg-white rounded-3xl p-6') as any}>
            {detailDish && (
              <>
                <Text style={tw('text-2xl font-bold mb-2') as any}>{detailDish.name}</Text>
                <Text style={tw('text-gray-600 mb-4') as any}>{detailDish.description}</Text>
                {detailDish.photo_uri && <Image source={detailDish.photo_uri} style={{ width: '100%', height: 250, borderRadius: 16 }} />}
                <Pressable onPress={() => setDetailDish(null)} style={tw('mt-6 bg-red-500 py-3 rounded-xl items-center') as any}><Text style={tw('text-white font-bold') as any}>Cerrar</Text></Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

function DishCard({ item, onDelete, onPress }: { item: Dish; onDelete: (id: string) => void; onPress?: () => void }) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const gesture = Gesture.Pan().onUpdate((e) => { translateX.value = e.translationX; }).onEnd((e) => {
    if (e.translationX < -120) {
      translateX.value = withTiming(-500);
      opacity.value = withTiming(0, { duration: 200 }, () => { runOnJS(onDelete)(item.id); });
    } else { translateX.value = withSpring(0); }
  });
  const rStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }], opacity: opacity.value }));

  return (
    <Animated.View entering={FadeInDown} exiting={FadeOutLeft} style={tw('w-full mb-4') as any}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[rStyle, tw('bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden') as any]}>
          <Pressable onPress={onPress}>
            <View style={tw('p-4') as any}>
              <Text style={tw('text-xl font-bold text-gray-800 mb-2') as any}>{item.name}</Text>
              {item.photo_uri && <Image source={item.photo_uri} style={{ width: '100%', height: 180, borderRadius: 12 }} />}
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}