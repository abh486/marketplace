import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';ghhghg

const SignIn = () => {
  const [gmail, setGmail] = useState('abhishekhvk123@gmail.com');
  const [phoneOrEmail, setPhoneOrEmail] = useState('Abhishekhvk123@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  const handleSignIn = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', 'Account created successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565c0" />

      {/* Header with blue gradient background */}
      <LinearGradient
        colors={['#1976d2', '#1565c0']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Create your{'\n'}Account</Text>
      </LinearGradient>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Gmail Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gmail</Text>
          <TextInput
            style={styles.input}
            value={gmail}
            onChangeText={setGmail}
            placeholder="Enter your Gmail"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        {/* Phone or Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone or email</Text>
          <TextInput
            style={styles.input}
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            placeholder="Enter phone or email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
         onPress={() => {navigation.navigate('HomePage')}}
        >
          <LinearGradient
            colors={['#1976d2', '#1565c0']}
            style={styles.signInGradient}
          >
            <Text style={styles.signInButtonText}>SIGN IN</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Already have Account */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have Account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LogIn');
            }}
          >
            <Text style={styles.signInLinkText}>sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd', // Light blue background
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  formContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFF',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    marginTop: -24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#222', // Neutral/dark label
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // light gray border
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#222', // Neutral/dark input text
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#222', // Neutral/dark input text
  },
  eyeIcon: {
    padding: 8,
  },
  eyeIconText: {
    fontSize: 18,
    color: '#1565c0', // Blue for the eye icon only
  },
  signInButton: {
    marginTop: 32,
    borderRadius: 25,
    overflow: 'hidden',
  },
  signInGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  signInLinkText: {
    color: '#1565c0', // Blue for the link
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignIn;
