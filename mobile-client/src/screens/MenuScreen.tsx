import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, colors, ListRow, Screen, SectionTitle } from '../components/UI';

export type MenuDestination = 'working-capital' | 'trust' | 'assessment' | 'readiness' | 'security' | 'qr';

export default function MenuScreen({ onNavigate }: { onNavigate: (destination: MenuDestination) => void }) {
  return (
    <Screen title="Menu" subtitle="Business tools and account options.">
      <Card>
        <SectionTitle>Business</SectionTitle>
        <ListRow
          title="Township Working Capital"
          detail="Readiness checks and funding information"
          onPress={() => onNavigate('working-capital')}
          trailing={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
        />
        <ListRow
          title="Market Linker & Trust Badge"
          detail="Share your verified business profile"
          onPress={() => onNavigate('trust')}
          trailing={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
        />
        <ListRow
          title="Business QR code"
          detail="Show your shareable trust profile"
          onPress={() => onNavigate('qr')}
          trailing={<Ionicons name="qr-code-outline" size={19} color={colors.greenLight} />}
        />
      </Card>

      <Card>
        <SectionTitle>Planning</SectionTitle>
        <ListRow
          title="Business check-in"
          detail="Update your business assessment"
          onPress={() => onNavigate('assessment')}
          trailing={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
        />
        <ListRow
          title="Growth readiness"
          detail="Review scores, strengths, and gaps"
          onPress={() => onNavigate('readiness')}
          trailing={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
        />
      </Card>

      <Card>
        <SectionTitle>Safety</SectionTitle>
        <ListRow
          title="Security & fraud protection"
          detail="Payment safety, privacy, and post-quantum cryptography"
          onPress={() => onNavigate('security')}
          trailing={<Ionicons name="shield-checkmark-outline" size={19} color={colors.greenLight} />}
        />
      </Card>

      <Card style={styles.notice}>
        <View style={styles.noticeHeader}>
          <Ionicons name="information-circle-outline" size={18} color={colors.gold} />
          <SectionTitle>Demo app</SectionTitle>
        </View>
        <View>
          <ListRow title="Account settings" detail="No account or authentication service is connected." />
          <ListRow title="Application settings" detail="Sample business data only; do not enter real financial or customer details." />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { backgroundColor: '#151e2c' },
  noticeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
