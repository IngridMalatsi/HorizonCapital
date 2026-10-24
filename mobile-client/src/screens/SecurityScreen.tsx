import { StyleSheet, Text, View } from 'react-native';
import { Badge, Card, colors, Screen, SectionTitle } from '../components/UI';

const safetyChecks = [
  'Confirm incoming payments in your bank or payment-provider app. SMS messages and screenshots are not proof of payment.',
  'Never share a PIN, password, or one-time code, and never pay an upfront fee to release a grant or loan.',
  'Confirm the price, quantity, delivery date, and payment terms with the buyer before fulfilling an order.',
  'Share only business information intended for the public. Do not put identity documents, customer data, or account details in a public profile or QR code.',
];

export default function SecurityScreen() {
  return (
    <Screen title="Security & fraud protection" subtitle="Practical checks for safer trading and sharing.">
      <Card>
        <Badge tone="gold">DEMO · NO ACCOUNT SECURITY SERVICE</Badge>
        <SectionTitle>Before you trade or get paid</SectionTitle>
        {safetyChecks.map((check, index) => (
          <View key={check} style={styles.check}>
            <Text style={styles.number}>{index + 1}</Text>
            <Text style={styles.copy}>{check}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle>What this demo does and does not protect</SectionTitle>
        <Text style={styles.copy}>
          The shared web app uses Supabase email sign-in and the profile table is protected by row-level security. This does not provide application-level encryption for the browser session or protect the prototype's demo data. There is no bank connection or real payment processing. Example balances, readiness scores, and supplier details are not verified and are not credit decisions. Do not enter real financial, identity, or customer information.
        </Text>
      </Card>

      <Card>
        <Badge>FUTURE SECURITY · NOT ENABLED</Badge>
        <SectionTitle>Post-quantum cryptography</SectionTitle>
        <Text style={styles.copy}>
          Quantum computing is not a security feature. Post-quantum cryptography (PQC) uses cryptographic algorithms designed to resist attacks from future quantum computers. This demo has no connected service or PQC implementation, so it makes no quantum-resistant security claim.
        </Text>
        <Text style={styles.copy}>
          Before handling real business or payment data, production services would need an independently reviewed, standards-based PQC or hybrid transport design, supported by the server, mobile platform, and key-management process. Ordinary HTTPS and secure key handling are still essential.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  number: { color: colors.greenLight, fontSize: 12, fontWeight: '700', width: 18 },
  copy: { color: colors.muted, fontSize: 12, lineHeight: 18, flex: 1 },
});
