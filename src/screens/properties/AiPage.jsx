import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Image,
  Animated,
  Easing,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from "../../Theme/ThemeContext"; // ✅ ADDED

const AiIcon = require('../../assets/image/Ai.png');
const micIcon = require('../../assets/image/microphone.png');
const sentIcon = require('../../assets/image/sent.png');

const BAR_COUNT = 12;

export default function ZeroPage() {
  const { isDarkMode } = useTheme(); // ✅ ADDED
  const [barAnims] = useState(() =>
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0))
  );
  const [listening, setListening] = useState(true);
  const [inputText, setInputText] = useState('');
  const [showListeningBars, setShowListeningBars] = useState(false);

  // Animated values for Ai icon scale pulse and rotation
  const aiPulseAnim = useRef(new Animated.Value(1)).current;
  const aiRotateAnim = useRef(new Animated.Value(0)).current;

  // Animate AI icon pulsing (scale up and down smoothly)
  const animateAiPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(aiPulseAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(aiPulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    ).start();
  };

  // Animate AI icon rotation indefinitely
  const animateAiRotate = () => {
    aiRotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(aiRotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const stopAiAnimations = () => {
    aiPulseAnim.stopAnimation();
    aiRotateAnim.stopAnimation();
    aiPulseAnim.setValue(1);
    aiRotateAnim.setValue(0);
  };

  const animateBars = () => {
    barAnims.forEach(anim => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random(),
            duration: 180 + Math.random() * 120,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: Math.random(),
            duration: 180 + Math.random() * 120,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]).start(() => {
          if (showListeningBars) animate();
        });
      };
      animate();
    });
  };

  const stopBars = () => {
    barAnims.forEach(anim => anim.stopAnimation());
    barAnims.forEach(anim => anim.setValue(0));
  };

  // Effect to run or stop AI pulse and rotation animation on listening state changes
  useEffect(() => {
    if (listening) {
      animateAiPulse();
      animateAiRotate();
    } else {
      stopAiAnimations();
    }
  }, [listening]);

  // Effect to run or stop listening bars animation
  useEffect(() => {
    if (showListeningBars) animateBars();
    else stopBars();
  }, [showListeningBars]);

  const onPressMic = () => {
    if (showListeningBars) {
      setShowListeningBars(false);
      setListening(false);
    } else {
      setShowListeningBars(true);
      setListening(true);
    }
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      console.log('Sending message:', inputText.trim());
      setInputText('');
    }
  };

  // Interpolate rotation value from 0 to 1 to degrees
  const rotateInterpolate = aiRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#000" : "#FFFFFF" }]}>
      {/* Background Gradients — ONLY in Dark Mode */}
      {isDarkMode && (
        <>
          <LinearGradient
            colors={['#001A13', '#003B28', '#017148ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.02)', 'rgba(0,0,0,0.6)']}
            style={StyleSheet.absoluteFillObject}
          />
        </>
      )}

      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#000" : "#FFFFFF"} translucent />

      <View style={styles.headingContainer}>
        <Text style={[styles.heading, { color: isDarkMode ? "grey" : "#666" }]}>Ai insight</Text>
        <Text style={[styles.userGreeting, { color: isDarkMode ? "#fff" : "#000" }]}>Hey! I’m Cora AI </Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: isDarkMode ? "#ccc" : "#666" }]}>What would you like to know today?</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setListening(!listening);
          setShowListeningBars(false);
        }}
        style={styles.circleContainer}
        accessibilityLabel="Activate AI Assistant"
        accessibilityHint="Toggles AI assistant listening mode"
      >
        <Animated.Image
          source={AiIcon}
          style={[
            styles.aiImage,
            {
              transform: [
                { scale: aiPulseAnim },
                { rotate: rotateInterpolate },
              ],
              // Glow around image via shadow props — preserved for dark mode
              ...(isDarkMode && {
                shadowColor: '#00ff00',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 12,
                elevation: 12,
              }),
            },
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.inputMicContainer}>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        >
          <TextInput
            style={[styles.textInput, { color: isDarkMode ? "#fff" : "#000" }]}
            placeholder="Ask Me"
            placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.6)" : "#999"}
            value={inputText}
            onChangeText={setInputText}
            editable={!showListeningBars}
            accessibilityLabel="Text input"
            accessibilityHint="Ask Me"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressMic}
            style={styles.micButton}
            accessibilityLabel="Microphone button"
            accessibilityHint="Press to start or stop listening"
          >
            <Image
              source={micIcon}
              style={[
                styles.micIcon,
                {
                  tintColor: showListeningBars
                    ? (isDarkMode ? "#00ff00" : "#02af6a")
                    : (isDarkMode ? "#fff" : "#000"),
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={sendMessage}
            style={[
              styles.sendButton,
              { opacity: inputText.trim() ? 1 : 0.5 },
            ]}
            disabled={!inputText.trim()}
            accessibilityLabel="Send button"
            accessibilityHint="Send your typed message"
          >
            <Image
              source={sentIcon}
              style={[
                styles.sendIcon,
                { tintColor: isDarkMode ? "#00ff00" : "#02af6a" },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {showListeningBars && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setShowListeningBars(false);
              setListening(false);
            }}
            style={styles.listeningBarsContainer}
            accessibilityLabel="Listening overlay"
            accessibilityHint="Tap to stop listening"
          >
            <View style={styles.barsContainer}>
              {barAnims.map((anim, idx) => (
                <View key={idx} style={{ justifyContent: 'flex-end' }}>
                  <Animated.View
                    style={[
                      styles.verticalBar,
                      {
                        height: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [8, 22],
                        }),
                        marginHorizontal: 2,
                        width: 3,
                        backgroundColor: isDarkMode ? "#00ff00" : "#02af6a",
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <Text style={[styles.listeningText, { color: isDarkMode ? "#00ff00" : "#02af6a" }]}>
              Listening...
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ✅ Styles — PRESERVED YOUR DARK THEME, ADDED LIGHT THEME
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  headingContainer: {
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
  },
  userGreeting: {
    fontSize: 23,
    marginTop: 70,
    fontWeight: '600',
    marginBottom: 0,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
  circleContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiImage: {
    width: 400,
    height: 400,
  },
  inputMicContainer: {
    width: '90%',
    marginTop: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 30,
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
  },
  micButton: {
    marginLeft: 10,
    padding: 10,
  },
  micIcon: {
    width: 28,
    height: 28,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  listeningBarsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 30,
    width: 150,
    marginBottom: 8,
  },
  verticalBar: {
    borderRadius: 2,
  },
  listeningText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});