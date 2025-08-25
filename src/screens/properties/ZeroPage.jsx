import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ZeroPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [error, setError] = useState('');

  const passwordInputRef = useRef(null);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignIn = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // TODO: Insert real authentication logic here
    Alert.alert('Success', `Signed in as ${email}`);
    // navigation.replace('Home'); // After successful sign-in
  };

  // Privacy & Terms URLs - replace these with your actual URLs
  const privacyUrl = 'https://www.yourapp.com/privacy-policy';
  const termsUrl = 'https://www.yourapp.com/terms-of-service';

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to your portfolio or start investing securely.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputBox}>
            <Icon name="mail" color="#aaa" size={20} style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              style={styles.input}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputBox}>
            <Icon name="lock" color="#aaa" size={20} style={styles.icon} />
            <TextInput
              ref={passwordInputRef}
              placeholder="Password"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeButton}>
              <Icon name={secure ? 'eye-off' : 'eye'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.or}>or sign in with</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialIcon, styles.googleBtn]}
              onPress={() => Alert.alert('Google Sign In', 'Feature coming soon!')}
            >
              <FontAwesome5 name="google" size={26} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialIcon, styles.appleBtn]}
              onPress={() => Alert.alert('Apple Sign In', 'Feature coming soon!')}
            >
              <MaterialCommunityIcons name="apple" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupBtn}> Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linksRow}>
            <Text style={styles.linksText}>
              By signing in you agree to our{' '}
              <Text style={styles.link} onPress={() => Linking.openURL(termsUrl)}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={() => Linking.openURL(privacyUrl)}>
                Privacy Policy
              </Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
  scrollContent: {
    padding: 28,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 100,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
  },
  error: {
    color: '#ff5757',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d3226',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  icon: {
    marginRight: 14,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  eyeButton: {
    padding: 6,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    padding: 4,
  },
  forgotText: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#158c45ff',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003300',
  },
  or: {
    color: '#aaa',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  socialIcon: {
    width: 52,
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f2027',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    marginHorizontal: 12,
    elevation: 5,
  },
  googleBtn: {},
  appleBtn: {},
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },
  signupText: {
    color: '#bbb',
    fontSize: 15,
  },
  signupBtn: {
    color: '#3db46dff',
    fontWeight: '600',
    fontSize: 15,
  },
  linksRow: {
    paddingHorizontal: 16,
  },
  linksText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#3db46dff',
    textDecorationLine: 'underline',
  },
});
