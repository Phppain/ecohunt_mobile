import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoTextInput } from '@/components/ui/eco-text-input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AuthService } from '@/services/auth_service';

export default function RegisterScreen() {
  const router = useRouter();
  const authService = new AuthService();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!nickname.trim() || !email.trim() || !password.trim() || loading) return;
    setLoading(true);
    try {
      const res = await authService.register(nickname, email, password);
      if (res?.id) {
        router.replace('/login');
      } else {
        console.log('Ошибка регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <IconSymbol name="leaf.fill" size={28} color="#19C37D" />
            <ThemedText type="title" style={styles.brandText}>
              Create account
            </ThemedText>
          </View>
          <ThemedText style={styles.subtitle}>Join EcoHunt to track impact and points.</ThemedText>
        </View>

        <View style={styles.form}>
          <EcoTextInput label="Nickname" value={nickname} onChangeText={setNickname} placeholder="Azizali" />
          <EcoTextInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
          <EcoTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <EcoButton title={loading ? 'Creating...' : 'Register'} onPress={submit} disabled={loading} />

          <Pressable onPress={() => router.replace('/login')} style={styles.linkRow}>
            <ThemedText style={styles.linkText}>Already have an account? </ThemedText>
            <ThemedText type="link">Login</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 18,
  },
  header: {
    gap: 10,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandText: {
    fontWeight: '800',
    letterSpacing: 0.2,
    fontSize: 26,
    lineHeight: 30,
  },
  subtitle: {
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 14,
  },
  linkRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    opacity: 0.75,
  },
});

