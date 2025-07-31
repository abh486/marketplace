import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OpenPage = () => {

    const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.background}>
        <View style={styles.content}>
          <View style={styles.card}>

            {/* Token Icon - Using Emoji instead */}
            <View style={styles.iconContainer}>
              <View style={styles.iconGradient}>
                <Text style={styles.iconText}>🛡️</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>MARKET PLACE</Text>

            {/* Welcome Text */}
            <Text style={styles.welcome}>Welcome Back</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {/* Sign In Button */}
              <TouchableOpacity
                      onPress={() => {navigation.navigate('LogIn')}}
                style={styles.signInButton}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>SIGN IN</Text>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity
              onPress={() => {navigation.navigate('SignIn')}}
                style={styles.signUpButton}
                activeOpacity={0.8}
              >
                <Text style={styles.signUpButtonText}>SIGN UP</Text>
              </TouchableOpacity>
            </View>

            {/* Social Authentication */}
            <View style={styles.socialContainer}>
              <Text style={styles.socialText}>Sign in with</Text>
              <View style={styles.socialButtons}>
                {/* Google Button */}
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                >
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>

                {/* Facebook Button */}
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                >
                  <Icon name="facebook" size={24} color="#1877F2" />
                </TouchableOpacity>

                {/* Twitter Button */}
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                >
                  <Icon name="twitter" size={24} color="#1DA1F2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.securityText}>End-to-End Encrypted</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(16, 42, 67, 0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 42, 67, 0.08)',
    padding: 32,
    alignItems: 'center',
    width: '100%',
    // No shadow
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 16,
    // No shadow
  },
  iconText: {
    fontSize: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    
    letterSpacing: 5,
    marginBottom: 74,
    textTransform: 'uppercase',
    fontFamily: 'serif', // Swap for your custom font if desired
    textShadowColor: 'rgba(59, 130, 246, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    borderBottomWidth: 3,
     borderBottomColor: '#000', // <-- Changed to black
    paddingBottom: 6,
    alignSelf: 'center',
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 80,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 64,
  },
  signInButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  signInButtonText: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  signUpButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    // No shadow
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(16, 42, 67, 0.07)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 42, 67, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    // No shadow
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 42, 67, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 42, 67, 0.08)',
    marginTop: 32,
  },
  lockIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    color: '#64748b',
    fontSize: 12,
  },
});

export default OpenPage;
