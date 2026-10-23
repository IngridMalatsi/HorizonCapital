import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionButton, Card, colors, Screen, SectionTitle } from '../components/UI';

const questions = [
  { id: 'records', title: 'Do you record most sales and expenses?', options: ['Every day', 'Some of them', 'Not yet'] },
  { id: 'separation', title: 'Do you keep business money separate?', options: ['Yes', 'Sometimes', 'Not yet'] },
  { id: 'orders', title: 'How do customers usually place orders?', options: ['WhatsApp / digital', 'In person', 'Both'] },
];

export default function AssessmentScreen({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [monthlySales, setMonthlySales] = useState('');
  const [monthlyCosts, setMonthlyCosts] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Screen title="Business check-in" subtitle="A quick review helps you understand your growth readiness.">
      <Card>
        <SectionTitle>Monthly business numbers</SectionTitle>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Average monthly sales (R)</Text>
          <TextInput
            value={monthlySales}
            onChangeText={setMonthlySales}
            keyboardType="decimal-pad"
            placeholder="e.g. 16800"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Average monthly costs (R)</Text>
          <TextInput
            value={monthlyCosts}
            onChangeText={setMonthlyCosts}
            keyboardType="decimal-pad"
            placeholder="e.g. 9200"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>
      </Card>

      {questions.map((question) => (
        <Card key={question.id}>
          <SectionTitle>{question.title}</SectionTitle>
          <View style={styles.options}>
            {question.options.map((option) => {
              const selected = answers[question.id] === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                  style={[styles.option, selected && styles.selectedOption]}
                >
                  <Text style={[styles.optionText, selected && styles.selectedText]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ))}

      <ActionButton
        label={submitted ? 'Review complete' : 'Save check-in'}
        onPress={() => {
          setSubmitted(true);
          onComplete();
        }}
      />
      {submitted ? <Text style={styles.notice}>Your answers are saved for this demo session only.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputGroup: { gap: 6 },
  label: { color: colors.muted, fontSize: 11 },
  input: { color: colors.text, backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14 },
  options: { gap: 8 },
  option: { borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11 },
  selectedOption: { borderColor: colors.green, backgroundColor: colors.greenDeep },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: '500' },
  selectedText: { color: colors.greenLight },
  notice: { color: colors.greenLight, fontSize: 11, textAlign: 'center' },
});