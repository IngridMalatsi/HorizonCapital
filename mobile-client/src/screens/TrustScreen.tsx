import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Card, colors, Screen, SectionTitle } from '../components/UI';

const shareableUrl = 'https://example.invalid/trust/demo-business';

export default function TrustScreen() {
  return (
    <Screen title="Market Linker demo" subtitle="A sample business profile preview. No registration or verification service is connected.">
      <Card>
        <View style={styles.titleRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>TB</Text></View>
          <View style={styles.business}>
            <SectionTitle>Thandi's Bakery</SectionTitle>
            <Text style={styles.muted}>Sample supplier profile</Text>
          </View>
          <Ionicons name="information-circle-outline" size={22} color={colors.gold} />
        </View>
        <Badge tone="gold">DEMO · NOT VERIFIED</Badge>
        <Text style={styles.detail}>Registration, tax, and banking details have not been checked.</Text>
      </Card>

      <Card style={styles.qrCard}>
        <SectionTitle>Sample profile QR</SectionTitle>
        <View style={styles.qr}>
          <QRCode value={shareableUrl} size={184} backgroundColor="#ffffff" color="#0b1220" />
        </View>
        <Text style={styles.link}>{shareableUrl}</Text>
        <Text style={styles.muted}>This reserved demo link does not open a real profile. Never use a demo badge as proof of identity or payment.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.greenDeep, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.greenLight, fontWeight: '800', fontSize: 15 },
  business: { flex: 1 },
  muted: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  detail: { color: colors.text, fontSize: 12 },
  qrCard: { alignItems: 'center' },
  qr: { backgroundColor: '#ffffff', padding: 14, borderRadius: 16 },
  link: { color: colors.greenLight, fontSize: 11, textAlign: 'center' },
});
