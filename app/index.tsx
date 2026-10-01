import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStorage } from '@/services/auth_storage';

export default function Index() {
  const router = useRouter();

  console.log("INDEX.TSX");
  

  const [token, setToken] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  (async () => {
    const t = await AuthStorage.get();
    setToken(t);
    setLoading(false);
  })();
}, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');

      console.log("TOKEN:", token);
      
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    };

    checkAuth();
  }, []);

  return null;
}