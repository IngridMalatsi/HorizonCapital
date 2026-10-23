import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { colors } from './src/components/UI';
import AssessmentScreen from './src/screens/AssessmentScreen';
import HomeScreen from './src/screens/HomeScreen';
import MenuScreen from './src/screens/MenuScreen';
import MoneyScreen from './src/screens/MoneyScreen';
import OrderPasteScreen from './src/screens/OrderPasteScreen';
import ReadinessScreen from './src/screens/ReadinessScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import TrustScreen from './src/screens/TrustScreen';

type Tab = 'home' | 'money' | 'order' | 'menu';
type Route = Tab | 'assessment' | 'readiness' | 'security' | 'trust';

const tabs: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'money', label: 'Ledger', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'order', label: 'WhatsApp', icon: 'chatbubble-ellipses-outline', activeIcon: 'chatbubble-ellipses' },
  { id: 'menu', label: 'Menu', icon: 'menu-outline', activeIcon: 'menu' },
];

function AppContent() {
  const [route, setRoute] = useState<Route>('home');
  const [qrOpen, setQrOpen] = useState(false);

  const navigateFromHome = (destination: 'money' | 'order' | 'assessment' | 'readiness' | 'qr') => {
    if (destination === 'qr') setQrOpen(true);
    else setRoute(destination);
  };

  const screen = (() => {
    switch (route) {
      case 'home':
        return <HomeScreen onNavigate={navigateFromHome} />;
      case 'money':
        return <MoneyScreen />;
      case 'order':
        return <OrderPasteScreen />;
      case 'assessment':
        return <AssessmentScreen onComplete={() => setRoute('readiness')} />;
      case 'readiness':
        return <ReadinessScreen />;
      case 'trust':
        return <TrustScreen />;
      case 'security':
        return <SecurityScreen />;
      case 'menu':
        return (
          <MenuScreen
            onNavigate={(destination) => {
              if (destination === 'qr') setQrOpen(true);
              else if (destination === 'working-capital' || destination === 'readiness') setRoute('readiness');
              else if (destination === 'assessment') setRoute('assessment');
              else if (destination === 'security') setRoute('security');
              else setRoute('trust');
            }}
          />
        );
    }
  })();

  const activeTab: Tab =
    route === 'assessment' || route === 'readiness' || route === 'security' || route === 'trust' ? 'menu' : route;

  return (
    <SafeAreaView style={styles.app} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <View style={styles.brandIcon}>
          <Ionicons name="trending-up" size={17} color="#071810" />
        </View>
        <View style={styles.brandText}>
          <Text style={styles.brandName}>Horizon<Text style={styles.brandAccent}>Capital</Text></Text>
          <Text style={styles.brandCaption}>BUSINESS FINANCE</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => setRoute('home')} style={styles.profileButton}>
          <Text style={styles.avatar}>🥖</Text>
          <Text style={styles.profileName}>Demo business</Text>
          <Ionicons name="chevron-down" size={13} color={colors.muted} />
        </Pressable>
      </View>

      <View style={styles.screen}>{screen}</View>

      <SafeAreaView edges={['bottom']} style={styles.navSafeArea}>
        <View style={styles.bottomNav}>
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setRoute(tab.id)}
                style={({ pressed }) => [styles.tab, selected && styles.selectedTab, pressed && styles.pressed]}
              >
                <Ionicons name={selected ? tab.activeIcon : tab.icon} size={20} color={selected ? colors.greenLight : colors.muted} />
                <Text style={[styles.tabText, selected && styles.selectedText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>

      <Modal visible={qrOpen} transparent animationType="fade" onRequestClose={() => setQrOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setQrOpen(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <View style={styles.modalHeading}>
              <View>
                <Text style={styles.modalTitle}>Business QR code</Text>
                <Text style={styles.modalHint}>Scan to view the business trust profile.</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Close QR code" onPress={() => setQrOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>
            <View style={styles.qr}>
              <QRCode value="https://example.invalid/trust/demo-business" size={190} backgroundColor="#ffffff" color="#0b1220" />
            </View>
            <Text style={styles.qrCaption}>DEMO PROFILE · NOT VERIFIED</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  topBar: { minHeight: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  brandIcon: { width: 28, height: 28, borderRadius: 9, backgroundColor: colors.greenLight, alignItems: 'center', justifyContent: 'center' },
  brandText: { flex: 1, gap: 1 },
  brandName: { color: colors.text, fontSize: 14, fontWeight: '800', letterSpacing: -0.3 },
  brandAccent: { color: colors.greenLight },
  brandCaption: { color: colors.muted, fontSize: 7, fontWeight: '600', letterSpacing: 1.1 },
  profileButton: { maxWidth: 142, minHeight: 34, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.background },
  avatar: { fontSize: 13 },
  profileName: { color: colors.text, fontSize: 9, fontWeight: '600', flexShrink: 1 },
  screen: { flex: 1 },
  navSafeArea: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  bottomNav: { height: 58, flexDirection: 'row', paddingHorizontal: 5, paddingTop: 4 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 11 },
  selectedTab: { backgroundColor: colors.greenDeep },
  tabText: { color: colors.muted, fontSize: 9, fontWeight: '500' },
  selectedText: { color: colors.greenLight, fontWeight: '700' },
  pressed: { opacity: 0.75 },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000b8', padding: 20 },
  modalCard: { width: '100%', maxWidth: 350, alignItems: 'center', gap: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 20 },
  modalHeading: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  modalHint: { color: colors.muted, fontSize: 11, marginTop: 3 },
  qr: { backgroundColor: '#ffffff', padding: 14, borderRadius: 15 },
  qrCaption: { color: colors.greenLight, fontSize: 9, fontWeight: '700', letterSpacing: 0.7, textAlign: 'center' },
});
