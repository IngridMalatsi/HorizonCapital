import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const colors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  border: '#DDE1E5',
  text: '#1A1A1A',
  muted: '#6C757D',
  green: '#FF6B00',
  greenLight: '#B84D00',
  greenDeep: '#FFF1E8',
  gold: '#B84D00',
  goldDeep: '#FFF1E8',
  red: '#8B1E24',
  redDeep: '#FCEBEC',
};

export function Screen({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function ActionButton({
  label,
  onPress,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        secondary && styles.secondaryButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.actionText, secondary && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

export function Metric({
  label,
  value,
  hint,
  color = colors.text,
}: {
  label: string;
  value: string;
  hint?: string;
  color?: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {hint ? <Text style={styles.metricHint}>{hint}</Text> : null}
    </View>
  );
}

export function Badge({ children, tone = 'green' }: PropsWithChildren<{ tone?: 'green' | 'gold' | 'red' }>) {
  const toneStyle = tone === 'gold' ? styles.goldBadge : tone === 'red' ? styles.redBadge : styles.greenBadge;
  const textStyle = tone === 'gold' ? styles.goldText : tone === 'red' ? styles.redText : styles.greenText;
  return (
    <View style={[styles.badge, toneStyle]}>
      <Text style={[styles.badgeText, textStyle]}>{children}</Text>
    </View>
  );
}

export function ListRow({
  title,
  detail,
  trailing,
  onPress,
}: {
  title: string;
  detail?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}) {
  const content = (
    <>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      </View>
      {trailing}
    </>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }
  return <View style={styles.listRow}>{content}</View>;
}

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32, gap: 16 },
  header: { gap: 5, marginBottom: 2 },
  title: { color: colors.text, fontSize: 25, lineHeight: 31, fontWeight: '700' },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  actionButton: { minHeight: 46, backgroundColor: colors.green, borderRadius: 13, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  secondaryButton: { backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderWidth: 1 },
  secondaryText: { color: colors.text },
  pressed: { opacity: 0.78 },
  metric: { flex: 1, minWidth: 120, gap: 4 },
  metricLabel: { color: colors.muted, fontSize: 11, fontWeight: '500' },
  metricValue: { fontSize: 20, fontWeight: '700' },
  metricHint: { color: colors.muted, fontSize: 10 },
  badge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  greenBadge: { backgroundColor: colors.greenDeep },
  greenText: { color: colors.greenLight },
  goldBadge: { backgroundColor: colors.goldDeep },
  goldText: { color: colors.gold },
  redBadge: { backgroundColor: colors.redDeep },
  redText: { color: colors.red },
  listRow: { minHeight: 56, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rowText: { flex: 1, gap: 3 },
  rowTitle: { color: colors.text, fontSize: 13, fontWeight: '600' },
  rowDetail: { color: colors.muted, fontSize: 11, lineHeight: 16 },
});
