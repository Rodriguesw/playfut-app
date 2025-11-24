import React, { useEffect, useRef, useState } from 'react';
import { Platform, BackHandler, PermissionsAndroid, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  //tg-fatec-ml744amcu-matheus-s-projects-0804365d.vercel.app
  const uri = 'https://tg-fatec-9carxhkil-matheus-s-projects-0804365d.vercel.app/';
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Solicitar permissão de localização no Android para o WebView
  useEffect(() => {
    const requestLocation = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Permissão de localização',
              message: 'Precisamos da sua localização para mostrar o mapa corretamente.',
              buttonPositive: 'OK',
              buttonNegative: 'Cancelar',
            }
          );
        } catch (e) {
          // silencioso: se falhar, o site pode solicitar via prompt do navegador
        }
      }
    };
    requestLocation();
  }, []);

  // Tratar botão físico de Voltar no Android
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // intercepta o back e navega dentro do WebView
      }
      return false; // sem histórico interno, deixa o sistema agir (minimizar/sair)
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  // Fallback para web: usa iframe
  if (Platform.OS === 'web') {
    return (
      <iframe
        src={uri}
        style={{ width: '100vw', height: '100vh', border: 'none' }}
        title="PlayFUT"
      />
    );
  }

  // iOS/Android: WebView nativa com suporte a histórico e safe area
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0D1321' }} edges={['top', 'bottom']}>
        <WebView
          ref={webViewRef}
          source={{ uri }}
          style={{ flex: 1 }}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
