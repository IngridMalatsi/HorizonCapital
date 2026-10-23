import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Badge, Card, colors, Screen, SectionTitle } from '../components/UI';

type ChannelFilter = 'ALL' | 'CASH' | 'DIGITAL';
type TypeFilter = 'ALL' | 'INCOME' | 'EXPENSE';

type Transaction = {
  id: string;
  title: string;
  detail: string;
  date: string;
  channel: Exclude<ChannelFilter, 'ALL'>;
  category: string;
  method: string;
  status: string;
  amount: number;
};

const transactions: Transaction[] = [
  {
    id: 'mbali-deposit',
    title: 'Mbali Events',
    detail: 'WhatsApp order deposit',
    date: '2026-10-23',
    channel: 'DIGITAL',
    category: 'Order Deposit',
    method: 'Instant payment',
    status: 'Settled',
    amount: 750,
  },
  {
    id: 'boxer-ingredients',
    title: 'Boxer Superstores',
    detail: 'Ingredients',
    date: '2026-10-23',
    channel: 'CASH',
    category: 'Cost of Goods',
    method: 'Cash',
    status: 'Recorded',
    amount: -420,
  },
  {
    id: 'softpos-sale',
    title: 'SoftPOS payment',
    detail: 'Customer sale',
    date: '2026-10-22',
    channel: 'DIGITAL',
    category: 'Walk-in Sales',
    method: 'SoftPOS',
    status: 'Settled',
    amount: 380,
  },
];

const startingCashBalance = 1420;
const startingDigitalBalance = 4850;

function formatZAR(value: number) {
  return `R ${new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function BalanceTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  tone: 'gold' | 'green' | 'cyan' | 'red';
}) {
  const valueColor = tone === 'gold'
    ? colors.gold
    : tone === 'green'
      ? colors.greenLight
      : tone === 'cyan'
        ? colors.greenLight
        : colors.red;

  return (
    <View style={styles.balanceTile}>
      <Text numberOfLines={2} style={styles.balanceLabel}>{label}</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.balanceValue, { color: valueColor }]}>
        {formatZAR(value)}
      </Text>
      <Text numberOfLines={2} style={styles.balanceHint}>{hint}</Text>
    </View>
  );
}

function FilterChip<T extends string>({
  label,
  value,
  selected,
  onPress,
}: {
  label: string;
  value: T;
  selected: boolean;
  onPress: (value: T) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        styles.filterChip,
        selected && styles.filterChipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text numberOfLines={1} style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function MoneyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('ALL');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return transactions.filter((transaction) => {
      if (channelFilter !== 'ALL' && transaction.channel !== channelFilter) return false;
      if (typeFilter === 'INCOME' && transaction.amount <= 0) return false;
      if (typeFilter === 'EXPENSE' && transaction.amount >= 0) return false;
      if (dateFrom && transaction.date < dateFrom) return false;
      if (dateTo && transaction.date > dateTo) return false;

      if (query) {
        const searchable = [
          transaction.title,
          transaction.detail,
          transaction.category,
          transaction.method,
          transaction.status,
          transaction.channel,
          transaction.amount > 0 ? 'income' : 'expense',
        ].join(' ').toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [channelFilter, dateFrom, dateTo, searchQuery, typeFilter]);

  const revenue = filteredTransactions.reduce(
    (sum, transaction) => sum + (transaction.amount > 0 ? transaction.amount : 0),
    0,
  );
  const expenses = filteredTransactions.reduce(
    (sum, transaction) => sum + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0),
    0,
  );
  const netCashFlow = revenue - expenses;

  const resetFilters = () => {
    setSearchQuery('');
    setChannelFilter('ALL');
    setTypeFilter('ALL');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <Screen title="Money" subtitle="Track balances and find recorded transactions.">
      <View style={styles.sectionHeader}>
        <Badge>DEMO BUSINESS BALANCES</Badge>
        <Text style={styles.disclaimer}>Example data · Not connected to a bank</Text>
      </View>

      <View style={styles.balanceGrid}>
        <BalanceTile
          label="Physical cash balance"
          value={startingCashBalance}
          hint="Cash drawer"
          tone="gold"
        />
        <BalanceTile
          label="Digital bank balance"
          value={startingDigitalBalance}
          hint="Business account"
          tone="green"
        />
        <BalanceTile
          label="Revenue in filter"
          value={revenue}
          hint={`${filteredTransactions.length} matching transaction${filteredTransactions.length === 1 ? '' : 's'}`}
          tone="cyan"
        />
        <BalanceTile
          label="Net cash in filter"
          value={netCashFlow}
          hint={`Expenses: ${formatZAR(expenses)}`}
          tone={netCashFlow >= 0 ? 'green' : 'red'}
        />
      </View>

      <Card style={styles.filterCard}>
        <View style={styles.filterHeading}>
          <Ionicons name="search-outline" size={18} color={colors.greenLight} />
          <SectionTitle>Search and filter</SectionTitle>
        </View>

        <TextInput
          accessibilityLabel="Search transactions"
          autoCapitalize="none"
          onChangeText={setSearchQuery}
          placeholder="Search name, category or payment"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.searchInput}
          value={searchQuery}
        />

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Payment channel</Text>
          <View style={styles.chipRow}>
            <FilterChip label="All" value="ALL" selected={channelFilter === 'ALL'} onPress={setChannelFilter} />
            <FilterChip label="Cash" value="CASH" selected={channelFilter === 'CASH'} onPress={setChannelFilter} />
            <FilterChip label="Digital" value="DIGITAL" selected={channelFilter === 'DIGITAL'} onPress={setChannelFilter} />
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Transaction type</Text>
          <View style={styles.chipRow}>
            <FilterChip label="All" value="ALL" selected={typeFilter === 'ALL'} onPress={setTypeFilter} />
            <FilterChip label="Income" value="INCOME" selected={typeFilter === 'INCOME'} onPress={setTypeFilter} />
            <FilterChip label="Expenses" value="EXPENSE" selected={typeFilter === 'EXPENSE'} onPress={setTypeFilter} />
          </View>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={styles.filterLabel}>From date</Text>
            <TextInput
              accessibilityLabel="Start date"
              autoCapitalize="none"
              maxLength={10}
              onChangeText={setDateFrom}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              style={styles.dateInput}
              value={dateFrom}
            />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.filterLabel}>To date</Text>
            <TextInput
              accessibilityLabel="End date"
              autoCapitalize="none"
              maxLength={10}
              onChangeText={setDateTo}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              style={styles.dateInput}
              value={dateTo}
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={resetFilters}
          style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.muted} />
          <Text style={styles.resetText}>Reset filters</Text>
        </Pressable>
      </Card>

      <Card style={styles.ledgerCard}>
        <View style={styles.ledgerHeading}>
          <View style={styles.ledgerTitle}>
            <SectionTitle>Transaction ledger</SectionTitle>
            <Text style={styles.disclaimer}>
              {filteredTransactions.length} matching transaction{filteredTransactions.length === 1 ? '' : 's'}
            </Text>
          </View>
          <Ionicons name="receipt-outline" size={19} color={colors.greenLight} />
        </View>

        {filteredTransactions.length ? filteredTransactions.map((transaction) => {
          const incoming = transaction.amount > 0;
          return (
            <View key={transaction.id} style={styles.transaction}>
              <View style={styles.transactionTop}>
                <View style={styles.transactionIdentity}>
                  <View style={[styles.transactionIcon, incoming ? styles.incomeIcon : styles.expenseIcon]}>
                    <Ionicons
                      name={incoming ? 'arrow-down-outline' : 'arrow-up-outline'}
                      size={17}
                      color={incoming ? colors.greenLight : colors.red}
                    />
                  </View>
                  <View style={styles.transactionCopy}>
                    <Text numberOfLines={2} style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text numberOfLines={1} style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                  </View>
                </View>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.transactionAmount, incoming ? styles.incomeText : styles.expenseText]}>
                  {incoming ? '+' : '−'}{formatZAR(Math.abs(transaction.amount))}
                </Text>
              </View>
              <View style={styles.transactionMeta}>
                <Text numberOfLines={2} style={styles.transactionDetail}>
                  {transaction.channel} · {transaction.category}
                </Text>
                <Text numberOfLines={1} style={styles.transactionStatus}>{transaction.status}</Text>
              </View>
            </View>
          );
        }) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={22} color={colors.muted} />
            <Text style={styles.emptyTitle}>No matching transactions</Text>
            <Text style={styles.emptyCopy}>Try changing the search or filters.</Text>
          </View>
        )}

        <Text style={styles.note}>Demo ledger · Transactions are not connected to a bank or saved to an account.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 14 },
  balanceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  balanceTile: {
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 0,
    minHeight: 104,
    justifyContent: 'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    backgroundColor: colors.surface,
    padding: 12,
  },
  balanceLabel: { color: colors.muted, fontSize: 10, lineHeight: 14, fontWeight: '600' },
  balanceValue: { fontSize: 17, lineHeight: 23, fontWeight: '800', letterSpacing: -0.3 },
  balanceHint: { color: colors.muted, fontSize: 9, lineHeight: 13 },
  filterCard: { padding: 13, gap: 12 },
  filterHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: {
    minHeight: 43,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    backgroundColor: colors.background,
    color: colors.text,
    paddingHorizontal: 11,
    fontSize: 12,
  },
  filterGroup: { gap: 6 },
  filterLabel: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  chipRow: { flexDirection: 'row', gap: 7 },
  filterChip: {
    flex: 1,
    minWidth: 0,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterChipSelected: { borderColor: colors.green, backgroundColor: colors.greenDeep },
  filterChipText: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  filterChipTextSelected: { color: colors.greenLight },
  pressed: { opacity: 0.75 },
  dateRow: { flexDirection: 'row', gap: 9 },
  dateField: { flex: 1, minWidth: 0, gap: 6 },
  dateInput: {
    minHeight: 39,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    backgroundColor: colors.background,
    color: colors.text,
    paddingHorizontal: 8,
    fontSize: 11,
  },
  resetButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
  },
  resetText: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  ledgerCard: { paddingHorizontal: 13, paddingVertical: 12, gap: 0 },
  ledgerHeading: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 10,
  },
  ledgerTitle: { flex: 1, minWidth: 0, gap: 3 },
  transaction: {
    minWidth: 0,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingVertical: 11,
  },
  transactionTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  transactionIdentity: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  transactionIcon: { width: 28, height: 28, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  incomeIcon: { backgroundColor: colors.greenDeep },
  expenseIcon: { backgroundColor: colors.redDeep },
  transactionCopy: { flex: 1, minWidth: 0, gap: 3 },
  transactionTitle: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: '600' },
  transactionDate: { color: colors.muted, fontSize: 10 },
  transactionAmount: { maxWidth: '42%', flexShrink: 1, textAlign: 'right', fontSize: 11, lineHeight: 16, fontWeight: '700' },
  incomeText: { color: colors.greenLight },
  expenseText: { color: colors.red },
  transactionMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, paddingLeft: 36 },
  transactionDetail: { flex: 1, minWidth: 0, color: colors.muted, fontSize: 9, lineHeight: 13 },
  transactionStatus: { maxWidth: '42%', overflow: 'hidden', borderWidth: 1, borderColor: colors.border, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 3, color: colors.muted, fontSize: 9 },
  emptyState: { alignItems: 'center', gap: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingVertical: 22 },
  emptyTitle: { color: colors.text, fontSize: 12, fontWeight: '600' },
  emptyCopy: { color: colors.muted, fontSize: 10 },
  note: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 10, color: colors.muted, fontSize: 9, lineHeight: 14 },
});
