import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { ActionButton, Badge, Card, colors, Metric, Screen, SectionTitle } from '../components/UI';

const exampleMessage = 'Hi Thandi, can you make 150 muffins for our school event this Friday? R1,500 total. We can pay half now and the rest on delivery.';

export default function OrderPasteScreen() {
  const [message, setMessage] = useState(exampleMessage);
  const [parsed, setParsed] = useState(false);

  return (
    <Screen title="WhatsApp order" subtitle="Paste a customer message to review the order details.">
      <Card>
        <SectionTitle>Customer message</SectionTitle>
        <TextInput
          multiline
          value={message}
          onChangeText={(value) => {
            setMessage(value);
            setParsed(false);
          }}
          textAlignVertical="top"
          placeholder="Paste the WhatsApp message here"
          placeholderTextColor={colors.muted}
          style={styles.messageInput}
        />
        <ActionButton label="Review order" onPress={() => setParsed(true)} />
      </Card>

      {parsed ? (
        <Card>
          <Badge>REVIEW BEFORE ACCEPTING</Badge>
          <SectionTitle>Order details</SectionTitle>
          <Metric label="Customer" value="School event" />
          <Metric label="Order" value="150 muffins" />
          <Metric label="Quoted total" value="R 1,500" color={colors.greenLight} />
          <Metric label="Payment terms" value="50% deposit" />
          <Text style={styles.disclaimer}>Order details are a demo extraction. Confirm the message with your customer before relying on it.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  messageInput: { minHeight: 160, color: colors.text, backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, lineHeight: 20 },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15 },
});