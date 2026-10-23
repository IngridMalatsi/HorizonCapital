import { StyleSheet, Text, View } from 'react-native';
import { Badge, Card, colors, ListRow, Metric, Screen, SectionTitle } from '../components/UI';

const checks = [
  { title: 'Sales and records', score: 85, detail: 'Most WhatsApp and POS sales are recorded.' },
  { title: 'Profit margin', score: 74, detail: 'Review ingredient price changes when quoting.' },
  { title: 'Payment reliability', score: 82, detail: 'Customer payment recovery is improving.' },
  { title: 'Cash buffer', score: 62, detail: 'Week 4 forecast falls below the R500 reserve.' },
];

export default function ReadinessScreen() {
  return (
    <Screen title="Growth readiness" subtitle="A clear view of the strengths and gaps in your business.">
      <Card>
        <Badge>FUNDING PROFILE</Badge>
        <Metric label="Readiness score" value="78 / 100" color={colors.greenLight} />
        <Text style={styles.copy}>Your recorded trading history supports growth. Strengthen your cash buffer before taking on a larger order.</Text>
      </Card>

      <Card>
        <SectionTitle>Your readiness checks</SectionTitle>
        {checks.map((check) => (
          <View key={check.title} style={styles.check}>
            <ListRow title={check.title} detail={check.detail} trailing={<Text style={[styles.score, check.score < 70 && styles.warning]}>{check.score}%</Text>} />
            <View style={styles.track}>
              <View style={[styles.progress, { width: `${check.score}%`, backgroundColor: check.score < 70 ? colors.gold : colors.green }]} />
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.offer}>
        <Badge tone="gold">PRE-APPROVED · DEMO</Badge>
        <SectionTitle>Township Working Capital</SectionTitle>
        <Text style={styles.offerAmount}>R 5,000</Text>
        <Text style={styles.copy}>Illustrative offer only. No credit decision or loan application is connected.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  check: { gap: 1 },
  score: { color: colors.greenLight, fontSize: 12, fontWeight: '700' },
  warning: { color: colors.gold },
  track: { height: 5, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden', marginBottom: 9 },
  progress: { height: '100%', borderRadius: 4 },
  offer: { borderColor: colors.gold },
  offerAmount: { color: colors.gold, fontSize: 30, fontWeight: '700' },
});