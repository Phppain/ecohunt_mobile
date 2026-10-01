import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoTextInput } from '@/components/ui/eco-text-input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AuthService } from '@/services/auth_service';

export default function LoginScreen() {
  const router = useRouter();
  const authService = new AuthService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password.trim() || loading) return;
    setLoading(true);
    try {
      const res = await authService.login(email, password);

      console.log("RES:", res);
      
      if (res?.access_token) {
        router.replace('/(tabs)');
      } else {
        // Flutter version prints an error only.
        console.log('Ошибка входа:', res);
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
            <IconSymbol name="leaf.fill" size={28} color={stylesIconColor.container} />
            <ThemedText type="title" style={styles.brandText}>
              EcoHunt
            </ThemedText>
          </View>
          <ThemedText style={styles.subtitle}>Report and protect the eco-zone map.</ThemedText>
        </View>

        <View style={styles.form}>
          <EcoTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            style={styles.input}
          />
          <EcoTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <EcoButton title={loading ? 'Logging in...' : 'Login'} onPress={submit} disabled={loading} />

          <Pressable onPress={() => router.push('/register')} style={styles.linkRow}>
            <ThemedText style={styles.linkText}>New here? </ThemedText>
            <ThemedText type="link">Create account</ThemedText>
          </Pressable>

          <ThemedText style={styles.hint}>Tip: backend expects a valid access_token response.</ThemedText>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const stylesIconColor = {
  container: '#19C37D',
};

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
  },
  subtitle: {
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 14,
  },
  input: {},
  hint: {
    opacity: 0.6,
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },
  linkRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    opacity: 0.75,
  },
});

