import { useAuth } from '@/app/auth/AuthProvider';
import { tw } from '@/app/lib/uniwind';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const onSubmit = async () => {
    if (!email.trim() || !password.trim() || !confirm.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      Alert.alert('Registro exitoso', 'Revisa tu correo para confirmar tu cuenta.');
    } catch (e: any) {
      Alert.alert('Error en el registro', e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw('flex-1 bg-white') as any}>
      {/* Franja roja superior de identidad visual */}
      <View style={{ height: 20, backgroundColor: '#E21837' }} />

      <Animated.View 
        entering={FadeIn.duration(300)} 
        style={tw('flex-1 px-8 justify-center') as any}
      >
        <Text style={tw('text-4xl font-bold mb-2 text-gray-800') as any}>Crear cuenta</Text>
        <Text style={tw('text-gray-500 mb-10 text-lg') as any}>
          Regístrate para gestionar tus platos
        </Text>

        {/* Input Email */}
        <View style={tw('mb-4') as any}>
          <Text style={tw('text-gray-600 mb-2 font-semibold') as any}>Correo Electrónico</Text>
          <TextInput
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={tw('w-full py-4 px-4 border border-gray-200 rounded-xl bg-gray-50') as any}
          />
        </View>

        {/* Input Contraseña */}
        <View style={tw('mb-4') as any}>
          <Text style={tw('text-gray-600 mb-2 font-semibold') as any}>Contraseña</Text>
          <TextInput
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={tw('w-full py-4 px-4 border border-gray-200 rounded-xl bg-gray-50') as any}
          />
        </View>

        {/* Input Confirmar Contraseña */}
        <View style={tw('mb-8') as any}>
          <Text style={tw('text-gray-600 mb-2 font-semibold') as any}>Confirmar Contraseña</Text>
          <TextInput
            placeholder="Repite tu contraseña"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            style={tw('w-full py-4 px-4 border border-gray-200 rounded-xl bg-gray-50') as any}
          />
        </View>

        {/* Botón de Registro */}
        <Pressable 
          style={({ pressed }) => [
            tw('w-full py-4 rounded-xl items-center shadow-md'),
            { 
              backgroundColor: pressed ? '#08916a' : '#10B981', 
              opacity: loading ? 0.7 : 1 
            }
          ] as any} 
          onPress={onSubmit} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw('text-white font-bold text-lg uppercase') as any}>Registrarme</Text>
          )}
        </Pressable>

        {/* Enlace para volver al Login - Tamaño de letra corregido */}
        <View style={tw('mt-8 flex-row justify-center items-center') as any}>
          <Text style={tw('text-gray-500 text-base') as any}>¿Ya tienes cuenta? </Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={tw('text-[#006391] font-bold text-base') as any}>Inicia sesión</Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}