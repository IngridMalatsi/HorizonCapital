import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton, Badge, Card, colors, Metric, Screen, SectionTitle } from '../components/UI';

type HomeDestination = 'money' | 'order' | 'assessment' | 'readiness' | 'qr';

const weeklyBalances = [6270, 6870, 6370, 320, 2420, 4020, 5620, 6920, 8620, 10020, 11420, 8820, 10620];

export default function HomeScreen({ onNavigate }: { onNavigate: (destination: HomeDestination) => void }) {
  return (
    <Screen title="Good morning, Thandi" subtitle="Orlando West, Soweto  ·  Bakery & Catering">
      <View style={styles.topLine}>
        <Badge tone="gold">DEMO BUSINESS</Badge>
        <Pressable accessibilityRole="button" accessibilityLabel="Show business QR code" onPress={() => onNavigate('qr')} style={styles.qrButton}>
          <Ionicons name="qr-code-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <Card>
        <View style={styles.cardHeading}>
          <SectionTitle>Your money at a glance</SectionTitle>
          <Ionicons name="wallet-outline" size={18} color={colors.greenLight} />
        </View>
        <View style={styles.metrics}>
          <Metric label="Available balance" value="R 6,270" hint="Cash + bank" color={colors.greenLight} />
          <Metric label="Readiness" value="78 / 100" hint="Funding ready" />
        </View>
        <View style={styles.metrics}>
          <Metric label="Cash drawer" value="R 1,420" />
          <Metric label="Digital balance" value="R 4,850" />
        </View>
      </Card>

      <Card>
        <View style={styles.cardHeading}>
          <View style={styles.forecastHeading}>
            <SectionTitle>13-week cash outlook</SectionTitle>
            <Text style={styles.cardHint}>Tap a week to review your forecast</Text>
          </View>
          <Badge tone="gold">R500 MIN</Badge>
        </View>
        <View style={styles.chart}>
          {weeklyBalances.map((balance, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(5, (balance / 12000) * 100)}%`,
                      backgroundColor: balance < 500 ? colors.red : balance < 2000 ? colors.gold : colors.green,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.weekLabel, balance < 500 && styles.dangerLabel]}>W{index + 1}</Text>
            </View>
          ))}
        </View>
        <View style={styles.warning}>
          <Ionicons name="alert-circle-outline" size={17} color={colors.gold} />
          <Text style={styles.warningText}>Week 4 drops to R320, below your R500 safety buffer.</Text>
        </View>
      </Card>

      <Card>
        <SectionTitle>Quick actions</SectionTitle>
        <View style={styles.actionRow}>
          <View style={styles.action}>
            <ActionButton label="Check an order" onPress={() => onNavigate('order')} />
          </View>
          <View style={styles.action}>
            <ActionButton label="Assess readiness" secondary onPress={() => onNavigate('assessment')} />
          </View>
        </View>
        <Pressable onPress={() => onNavigate('readiness')} style={styles.textLink}>
          <Text style={styles.linkText}>View growth readiness</Text>
          <Ionicons name="arrow-forward" size={15} color={colors.greenLight} />
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -6 },
  qrButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.greenLight },
  cardHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  forecastHeading: { gap: 3 },
  cardHint: { color: colors.muted, fontSize: 10 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, height: 118 },
  barColumn: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
  barTrack: { flex: 1, width: '100%', maxWidth: 14, justifyContent: 'flex-end', overflow: 'hidden', backgroundColor: colors.surfaceRaised, borderRadius: 5 },
  bar: { width: '100%', minHeight: 3, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  weekLabel: { color: colors.muted, fontSize: 8 },
  dangerLabel: { color: colors.red, fontWeight: '700' },
  warning: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.goldDeep, borderRadius: 10, padding: 10 },
  warningText: { color: colors.gold, fontSize: 11, flex: 1, lineHeight: 16 },
  actionRow: { flexDirection: 'row', gap: 8 },
  action: { flex: 1 },
  textLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  linkText: { color: colors.greenLight, fontSize: 12, fontWeight: '600' },
});