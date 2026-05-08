import { useAuth } from '@/app/auth/AuthProvider';
import { tw } from '@/app/lib/uniwind';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router'; // Importamos el router
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter(); // Inicializamos el router para la navegación
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password.trim());
    } catch (error) {
      Alert.alert('Error de autenticación', 'Credenciales incorrectas o problema de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={tw('flex-1 bg-white') as any}>
      <View style={{ height: 20, backgroundColor: '#E21837' }} />

      <View style={tw('flex-1 px-8 justify-center') as any}>
        <ThemedText type="title" style={tw('text-4xl font-bold mb-2 text-gray-800') as any}>
          Bienvenido
        </ThemedText>
        <Text style={tw('text-gray-500 mb-10 text-lg') as any}>
          Inicia sesión para gestionar tus platos
        </Text>

        {/* Inputs... */}
        <View style={tw('mb-4') as any}>
          <Text style={tw('text-gray-600 mb-2 font-semibold') as any}>Correo Electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={tw('w-full py-4 px-4 border border-gray-200 rounded-xl bg-gray-50') as any}
          />
        </View>

        <View style={tw('mb-8') as any}>
          <Text style={tw('text-gray-600 mb-2 font-semibold') as any}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
            style={tw('w-full py-4 px-4 border border-gray-200 rounded-xl bg-gray-50') as any}
          />
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            tw('w-full py-4 rounded-xl items-center shadow-md'),
            { 
              backgroundColor: pressed ? '#b3132b' : '#E21837',
              opacity: loading ? 0.7 : 1 
            }
          ] as any}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw('text-white font-bold text-lg uppercase') as any}>Ingresar</Text>
          )}
        </Pressable>

        {/* AQUÍ ESTÁ EL CAMBIO PARA REDIRIGIR A REGISTRO */}
        <Pressable 
          onPress={() => router.push('/register')} 
          style={tw('mt-6 items-center') as any}
        >
          <Text style={tw('text-gray-400') as any}>
            ¿No tienes cuenta? <Text style={tw('text-[#006391] font-bold') as any}>Regístrate</Text>
          </Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}