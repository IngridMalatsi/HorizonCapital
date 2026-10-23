import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Card, colors, ListRow, Metric, Screen, SectionTitle } from '../components/UI';

const transactions = [
  { title: 'Mbali Events', detail: 'WhatsApp order deposit · Today, 10:42', amount: '+ R750', incoming: true },
  { title: 'Boxer Superstores', detail: 'Ingredients · Today, 09:15', amount: '− R420', incoming: false },
  { title: 'SoftPOS payment', detail: 'Customer sale · Yesterday', amount: '+ R380', incoming: true },
];

export default function MoneyScreen() {
  return (
    <Screen title="Money" subtitle="Keep cash and bank balances clear and separate.">
      <Card>
        <Badge>BUSINESS BALANCE</Badge>
        <Text style={styles.total}>R 6,270.00</Text>
        <Text style={styles.caption}>Combined available balance</Text>
        <View style={styles.metrics}>
          <Metric label="Cash in drawer" value="R 1,420" color={colors.gold} />
          <Metric label="Digital in FNB" value="R 4,850" color={colors.greenLight} />
        </View>
      </Card>

      <Card>
        <View style={styles.heading}>
          <SectionTitle>Recent activity</SectionTitle>
          <Ionicons name="time-outline" size={18} color={colors.muted} />
        </View>
        {transactions.map((transaction) => (
          <ListRow
            key={transaction.title}
            title={transaction.title}
            detail={transaction.detail}
            trailing={
              <Text style={[styles.amount, { color: transaction.incoming ? colors.greenLight : colors.text }]}>
                {transaction.amount}
              </Text>
            }
          />
        ))}
        <Text style={styles.note}>Demo ledger · Transactions are not connected to a bank.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  total: { color: colors.text, fontSize: 32, fontWeight: '700', marginTop: -5 },
  caption: { color: colors.muted, fontSize: 11, marginTop: -10 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14, marginTop: 3 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  amount: { fontSize: 13, fontWeight: '700' },
  note: { color: colors.muted, fontSize: 10, paddingTop: 8 },
});