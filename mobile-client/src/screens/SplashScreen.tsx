import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../components/UI';

export default function SplashScreen({ message = 'Growing stronger, together' }: { message?: string }) {
  return (
    <View accessibilityRole="progressbar" style={styles.container}>
      <View style={styles.brandIcon}>
        <Text style={styles.brandMark}>H</Text>
      </View>
      <Text style={styles.brandName}>Horizon<Text style={styles.brandAccent}>Capital</Text></Text>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator color={colors.greenLight} style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 24 },
  brandIcon: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: colors.green },
  brandMark: { color: colors.text, fontSize: 34, fontWeight: '900' },
  brandName: { marginTop: 20, color: colors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  brandAccent: { color: colors.greenLight },
  message: { marginTop: 8, color: colors.muted, fontSize: 13 },
  indicator: { marginTop: 24 },
});
