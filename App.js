import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const uri = 'https://tg-fatec-gilt.vercel.app/';

  // Fallback para web: usa iframe, já que react-native-webview é nativo
  if (Platform.OS === 'web') {
    return (
      <iframe
        src={uri}
        style={{ width: '100vw', height: '100vh', border: 'none' }}
        title="PlayFUT"
      />
    );
  }

  // iOS/Android: usa WebView nativa
  return <WebView source={{ uri }} style={{ flex: 1 }} />;
}
