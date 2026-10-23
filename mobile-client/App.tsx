import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NativeWebView, { type WebViewNavigation } from 'react-native-webview';

const colors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#DDE1E5',
  text: '#1A1A1A',
  muted: '#6C757D',
  orange: '#FF6B00',
};

function getWebClientUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_WEB_CLIENT_URL?.trim();
  if (configuredUrl) return configuredUrl;
  if (!__DEV__) return '';

  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
  const host = expoHost || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
  return `http://${host}:5173`;
}

export default function App() {
  const webView = useRef<NativeWebView<{}>>(null);
  const appUrl = useMemo(getWebClientUrl, []);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webView.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, [canGoBack]);

  const handleNavigationChange = (navigation: WebViewNavigation) => {
    setCanGoBack(navigation.canGoBack);
  };

  const handleNavigationRequest = (request: { url: string }) => {
    if (request.url === 'about:blank') return true;

    try {
      const requestedOrigin = new URL(request.url).origin;
      if (requestedOrigin === new URL(appUrl).origin) return true;
    } catch {
      return false;
    }

    void Linking.openURL(request.url).catch(() => {
      setLoadError('This link could not be opened on your device.');
    });
    return false;
  };

  if (!appUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.messageCard}>
          <Text style={styles.title}>Web app URL is not configured</Text>
          <Text style={styles.message}>
            Set EXPO_PUBLIC_WEB_CLIENT_URL to the deployed web app URL, then restart Expo.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {loadError ? (
        <View style={styles.messageCard}>
          <Text style={styles.title}>Unable to load HorizonCapital</Text>
          <Text style={styles.message}>{loadError}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setLoadError('');
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <NativeWebView<{}> key={reloadKey}
          ref={webView}
          source={{ uri: appUrl }}
          style={styles.webView}
          originWhitelist={['http://*', 'https://*']}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          setSupportMultipleWindows={false}
          startInLoadingState
          onLoadStart={() => {
            setLoading(true);
            setLoadError('');
          }}
          onLoadEnd={() => setLoading(false)}
          onError={(event) => {
            setLoading(false);
            setLoadError(event.nativeEvent.description || `Check that the web client is reachable at ${appUrl}.`);
          }}
          onHttpError={(event) => {
            if (event.nativeEvent.statusCode < 400) return;
            setLoading(false);
            setLoadError(`The web client returned HTTP ${event.nativeEvent.statusCode}.`);
          }}
          onNavigationStateChange={handleNavigationChange}
          onShouldStartLoadWithRequest={handleNavigationRequest}
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.orange} size="large" />
              <Text style={styles.message}>Loading HorizonCapital…</Text>
            </View>
          )}
        />
      )}
      {loading && !loadError ? (
        <View pointerEvents="none" style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.orange} size="large" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  webView: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background },
  loadingOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  messageCard: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background, padding: 24 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  retryButton: { minHeight: 46, justifyContent: 'center', borderRadius: 12, backgroundColor: colors.orange, paddingHorizontal: 20 },
  retryText: { color: colors.text, fontSize: 14, fontWeight: '700' },
});
