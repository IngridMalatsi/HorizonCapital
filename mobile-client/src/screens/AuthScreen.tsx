import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { SupabaseClient } from '@supabase/supabase-js';
import { colors } from '../components/UI';

type AuthMode = 'sign-in' | 'sign-up';

export default function AuthScreen({
  client,
  initialError = '',
  configError = '',
}: {
  client: SupabaseClient | null;
  initialError?: string;
  configError?: string;
}) {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [message, setMessage] = useState('');

  const isRegistering = mode === 'sign-up';

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!client) return;
    setBusy(true);
    setError('');
    setMessage('');

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { business_name: businessName.trim() || null } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage('If registration succeeds, check your email for a confirmation link, then return here to sign in.');
        }
      } else {
        const { error: signInError } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.brandMark}><Text style={styles.brandLetter}>H</Text></View>
          <Text style={styles.brandName}>Horizon<Text style={styles.brandAccent}>Capital</Text></Text>
          <Text style={styles.title}>{isRegistering ? 'Create your account' : 'Welcome back'}</Text>
          <Text style={styles.subtitle}>
            {isRegistering ? 'Set up a secure account for your business.' : 'Sign in to continue to your business workspace.'}
          </Text>

          {configError ? (
            <View accessibilityRole="alert" style={styles.configNotice}>
              <Text style={styles.errorTitle}>Supabase configuration is invalid</Text>
              <Text style={styles.noticeText}>{configError}</Text>
              <Text style={styles.noticeText}>Correct the value in mobile-client/.env, then restart Expo. Do not share your key.</Text>
            </View>
          ) : !client ? (
            <View accessibilityRole="alert" style={styles.configNotice}>
              <Text style={styles.noticeTitle}>Supabase is not configured</Text>
              <Text style={styles.noticeText}>
                Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to mobile-client/.env, apply the SQL migration, then restart Expo.
              </Text>
              <Text style={styles.noticeText}>
                Use a publishable key only. Never put a Supabase secret or service-role key in a client app.
              </Text>
            </View>
          ) : (
            <View style={styles.form}>
              {isRegistering && (
                <View style={styles.field}>
                  <Text style={styles.label}>Business name <Text style={styles.optional}>(optional)</Text></Text>
                  <TextInput
                    autoCapitalize="words"
                    autoComplete="organization"
                    maxLength={120}
                    onChangeText={setBusinessName}
                    placeholder="e.g. Thandi's Bakery"
                    placeholderTextColor={colors.muted}
                    style={styles.input}
                    value={businessName}
                  />
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  value={email}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  onChangeText={setPassword}
                  placeholder={isRegistering ? 'At least 8 characters' : 'Your password'}
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  style={styles.input}
                  value={password}
                />
              </View>

              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={busy || !email.trim() || password.length < (isRegistering ? 8 : 1)}
                onPress={handleSubmit}
                style={({ pressed }) => [styles.submit, (busy || !email.trim() || password.length < (isRegistering ? 8 : 1)) && styles.disabled, pressed && styles.pressed]}
              >
                {busy ? <ActivityIndicator color={colors.text} /> : (
                  <Text style={styles.submitText}>{isRegistering ? 'Create account' : 'Sign in'}</Text>
                )}
              </Pressable>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>{isRegistering ? 'Already have an account?' : 'New to HorizonCapital?'}</Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={() => changeMode(isRegistering ? 'sign-in' : 'sign-up')}
                >
                  <Text style={styles.switchAction}>{isRegistering ? 'Sign in' : 'Create an account'}</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Text style={styles.disclaimer}>
            Passwords are managed by Supabase Auth. Business information and financial activity in the dashboard remain demo data.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  container: { width: '100%', maxWidth: 440, alignSelf: 'center', alignItems: 'stretch' },
  brandMark: { width: 54, height: 54, borderRadius: 17, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  brandLetter: { color: colors.text, fontSize: 29, fontWeight: '900' },
  brandName: { color: colors.text, fontSize: 21, fontWeight: '800', textAlign: 'center', marginTop: 13 },
  brandAccent: { color: colors.greenLight },
  title: { color: colors.text, fontSize: 23, fontWeight: '700', textAlign: 'center', marginTop: 28 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 8, marginBottom: 22 },
  form: { gap: 15, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 17, backgroundColor: colors.surface },
  field: { gap: 7 },
  label: { color: colors.text, fontSize: 12, fontWeight: '600' },
  optional: { color: colors.muted, fontWeight: '400' },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.border, borderRadius: 11, backgroundColor: colors.background, color: colors.text, paddingHorizontal: 12, fontSize: 14 },
  submit: { minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green, marginTop: 3 },
  submitText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.8 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 5 },
  switchText: { color: colors.muted, fontSize: 12 },
  switchAction: { color: colors.greenLight, fontSize: 12, fontWeight: '700' },
  error: { color: colors.red, fontSize: 12, lineHeight: 18 },
  message: { color: colors.greenLight, fontSize: 12, lineHeight: 18 },
  configNotice: { borderRadius: 14, borderWidth: 1, borderColor: colors.gold, backgroundColor: colors.surface, padding: 15, gap: 9 },
  noticeTitle: { color: colors.gold, fontSize: 14, fontWeight: '700' },
  errorTitle: { color: colors.red, fontSize: 14, fontWeight: '700' },
  noticeText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 18 },
});
