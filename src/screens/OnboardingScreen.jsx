import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  // Ultra-advanced Reanimated shared values for text animations
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const titleScale = useSharedValue(0.8);
  const titleRotation = useSharedValue(-10);
  const titleWave = useSharedValue(0);
  const titleMorph = useSharedValue(0);
  
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateX = useSharedValue(-100);
  const subtitleScale = useSharedValue(0.9);
  const subtitleWave = useSharedValue(0);
  const subtitleGlitch = useSharedValue(0);
  
  const descriptionOpacity = useSharedValue(0);
  const descriptionTranslateY = useSharedValue(30);
  const descriptionScale = useSharedValue(0.95);
  const descriptionWave = useSharedValue(0);
  const descriptionTypewriter = useSharedValue(0);
  
  const buttonScale = useSharedValue(1);
  const buttonRotation = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonPulse = useSharedValue(0);
  
  const progressDotScale = useSharedValue(1);
  const progressDotOpacity = useSharedValue(0);
  const progressDotWave = useSharedValue(0);
  
  const skipButtonOpacity = useSharedValue(0);
  const skipButtonTranslateX = useSharedValue(100);
  const skipButtonBounce = useSharedValue(0);
  
  const slideTransition = useSharedValue(0);

  const slides = [
    {
      id: 1,
      title: "Your dreams are no longer out of reach...",
      subtitle: "Welcome to MarketPlace",
      description: "You see a luxury building on the street. You can't afford it.",
    },
    {
      id: 2,
      title: "Can't afford a luxury building?",
      subtitle: "Now you can own a part of one.",
      description: "What if you could OWN a piece of it?",
    },
    {
      id: 3,
      title: "Not just ownership. Emotional value.",
      subtitle: "Show off your part-ownership. Like a badge of pride.",
      description: "You just bought 0.1% of a Premium Real Estate Property.",
    },
    {
      id: 4,
      title: "Track, sell, profit.",
      subtitle: "Watch your asset grow and sell it when you're ready.",
      description: "You track it. You sell it. You profit.",
    },
    {
      id: 5,
      title: "Start your investment journey.",
      subtitle: "Join the future of real estate investment.",
      description: "Ready to begin? Let's get started.",
    },
  ];

  const currentSlideData = slides[currentSlide];

  // Derived values for ultra-advanced animations
  const titleWaveOffset = useDerivedValue(() => {
    return interpolate(titleWave.value, [0, 1], [0, 20], Extrapolate.CLAMP);
  });

  const subtitleGlitchOffset = useDerivedValue(() => {
    return interpolate(subtitleGlitch.value, [0, 1], [0, 5], Extrapolate.CLAMP);
  });

  const descriptionTypewriterProgress = useDerivedValue(() => {
    return interpolate(descriptionTypewriter.value, [0, 1], [0, 1], Extrapolate.CLAMP);
  });

  const buttonPulseScale = useDerivedValue(() => {
    return interpolate(buttonPulse.value, [0, 1], [1, 1.1], Extrapolate.CLAMP);
  });

  // Ultra-advanced animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [
        { translateY: titleTranslateY.value + titleWaveOffset.value },
        { scale: titleScale.value },
        { rotate: `${titleRotation.value}deg` },
        { skewX: `${titleMorph.value}deg` },
      ],
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [
        { translateX: subtitleTranslateX.value + subtitleGlitchOffset.value },
        { scale: subtitleScale.value },
        { rotate: `${subtitleWave.value}deg` },
      ],
    };
  });

  const descriptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: descriptionOpacity.value,
      transform: [
        { translateY: descriptionTranslateY.value + Math.sin(descriptionWave.value * Math.PI) * 10 },
        { scale: descriptionScale.value },
        { rotate: `${descriptionWave.value * 5}deg` },
      ],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [
        { scale: buttonScale.value * buttonPulseScale.value },
        { rotate: `${buttonRotation.value}deg` },
      ],
    };
  });

  const progressDotAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progressDotOpacity.value,
      transform: [
        { scale: progressDotScale.value },
        { translateY: Math.sin(progressDotWave.value * Math.PI) * 5 },
      ],
    };
  });

  const skipButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: skipButtonOpacity.value,
      transform: [
        { translateX: skipButtonTranslateX.value },
        { translateY: Math.sin(skipButtonBounce.value * Math.PI) * 3 },
      ],
    };
  });

  // Ultra-advanced animation functions
  const animateTextEntrance = () => {
    // Complex staggered entrance with wave effects
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    titleScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    titleRotation.value = withSpring(0, { damping: 15, stiffness: 100 });
    titleWave.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    titleMorph.value = withRepeat(withSequence(
      withTiming(2, { duration: 1000 }),
      withTiming(-2, { duration: 1000 })
    ), -1, true);

    subtitleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    subtitleTranslateX.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));
    subtitleScale.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 100 }));
    subtitleWave.value = withDelay(300, withRepeat(withTiming(1, { duration: 3000 }), -1, true));
    subtitleGlitch.value = withDelay(300, withRepeat(withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 100 })
    ), -1, true));

    descriptionOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    descriptionTranslateY.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 100 }));
    descriptionScale.value = withDelay(600, withSpring(1, { damping: 15, stiffness: 100 }));
    descriptionWave.value = withDelay(600, withRepeat(withTiming(1, { duration: 2500 }), -1, true));
    descriptionTypewriter.value = withDelay(600, withTiming(1, { duration: 2000 }));

    buttonOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
    buttonPulse.value = withDelay(900, withRepeat(withTiming(1, { duration: 1500 }), -1, true));
  };

  const animateTextExit = () => {
    // Complex exit animations with morphing effects
    titleOpacity.value = withTiming(0, { duration: 300 });
    titleTranslateY.value = withTiming(-50, { duration: 300 });
    titleScale.value = withTiming(0.8, { duration: 300 });
    titleRotation.value = withTiming(-10, { duration: 300 });
    titleMorph.value = withTiming(5, { duration: 300 });

    subtitleOpacity.value = withTiming(0, { duration: 250 });
    subtitleTranslateX.value = withTiming(100, { duration: 250 });
    subtitleScale.value = withTiming(0.9, { duration: 250 });
    subtitleGlitch.value = withTiming(0, { duration: 250 });

    descriptionOpacity.value = withTiming(0, { duration: 200 });
    descriptionTranslateY.value = withTiming(30, { duration: 200 });
    descriptionScale.value = withTiming(0.95, { duration: 200 });
    descriptionTypewriter.value = withTiming(0, { duration: 200 });

    buttonOpacity.value = withTiming(0, { duration: 150 });
    buttonPulse.value = withTiming(0, { duration: 150 });
  };

  const animateButtonPress = () => {
    buttonScale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    buttonRotation.value = withSequence(
      withSpring(-5, { damping: 15, stiffness: 300 }),
      withSpring(5, { damping: 15, stiffness: 300 }),
      withSpring(0, { damping: 15, stiffness: 300 })
    );
    buttonPulse.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );
  };

  const animateProgressDot = (index) => {
    if (index === currentSlide) {
      progressDotScale.value = withSequence(
        withSpring(1.5, { damping: 15, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      progressDotOpacity.value = withTiming(1, { duration: 200 });
      progressDotWave.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }
  };

  // Initialize ultra-advanced animations
  useEffect(() => {
    animateTextEntrance();
    
    skipButtonOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    skipButtonTranslateX.value = withDelay(1000, withSpring(0, { damping: 15, stiffness: 100 }));
    skipButtonBounce.value = withDelay(1000, withRepeat(withTiming(1, { duration: 2000 }), -1, true));
  }, []);

  // Animate when slide changes
  useEffect(() => {
    animateTextExit();
    
    setTimeout(() => {
      animateTextEntrance();
      animateProgressDot(currentSlide);
    }, 300);
  }, [currentSlide]);

  const nextSlide = () => {
    console.log('Next button clicked, currentSlide:', currentSlide, 'total slides:', slides.length);
    
    animateButtonPress();
    
    if (currentSlide < slides.length - 1) {
      console.log('Moving to next slide');
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
      }, 300);
    } else {
      console.log('Navigating to OpenPage');
      setTimeout(() => {
        navigation.replace('OpenPage');
      }, 300);
    }
  };

  const skipOnboarding = () => {
    navigation.navigate('OpenPage');
  };

  const renderHexagonalElements = () => {
    const hexagons = [];
    
    for (let i = 0; i < 8; i++) {
      const size = 20 + Math.random() * 30;
      const x = Math.random() * width;
      const y = Math.random() * (height * 0.6);
      
      hexagons.push(
        <View
          key={i}
          style={[
            styles.hexagon,
            {
              left: x,
              top: y,
              width: size,
              height: size,
            },
          ]}
        >
          <Icon 
            name={i % 3 === 0 ? "business" : i % 3 === 1 ? "trending-up" : "diamond"} 
            size={size * 0.4} 
            color="#FFFFFF" 
          />
        </View>
      );
    }
    
    return hexagons;
  };

  const renderMovingBackground = () => {
    const movingElements = [];
    
    switch(currentSlide) {
      case 0:
        for (let i = 0; i < 5; i++) {
          movingElements.push(
            <View
              key={i}
              style={[
                styles.movingElement,
                {
                  left: 50 + (i * 60),
                  top: 100 + (i * 40),
                },
              ]}
            >
              <Icon name="business" size={20} color="#FFFFFF" />
            </View>
          );
        }
        break;
      case 1:
        break;
      case 2:
        for (let i = 0; i < 6; i++) {
          movingElements.push(
            <View
              key={i}
              style={[
                styles.movingElement,
                {
                  left: 40 + (i * 50),
                  top: 120 + (i * 35),
                },
              ]}
            >
              <Icon name="trending-up" size={18} color="#FFFFFF" />
            </View>
          );
        }
        break;
      case 3:
        for (let i = 0; i < 4; i++) {
          movingElements.push(
            <View
              key={i}
              style={[
                styles.movingElement,
                {
                  left: 60 + (i * 70),
                  top: 90 + (i * 50),
                },
              ]}
            >
              <Icon name="rocket" size={22} color="#FFFFFF" />
            </View>
          );
        }
        break;
      case 4:
        for (let i = 0; i < 3; i++) {
          movingElements.push(
            <View
              key={i}
              style={[
                styles.movingElement,
                {
                  left: 80 + (i * 80),
                  top: 120 + (i * 60),
                },
              ]}
            >
              <Icon name="checkmark-circle" size={24} color="#FFFFFF" />
            </View>
          );
        }
        break;
    }
    
    return movingElements;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Video Background */}
      <Video
        source={require('../assets/video/mb.mp4')}
        style={styles.fullScreenVideo}
        resizeMode="cover"
        repeat={true}
        muted={true}
        paused={false}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        rate={1.0}
        poster=""
        posterResizeMode="cover"
        onError={(error) => {
          console.log('Video error:', error);
          setVideoError(true);
          setVideoLoading(false);
        }}
        onLoad={(data) => {
          console.log('Video loaded successfully:', data);
          setVideoLoading(false);
          setVideoError(false);
        }}
        onLoadStart={() => {
          console.log('Video load started');
          setVideoLoading(true);
          setVideoError(false);
        }}
        onReadyForDisplay={() => {
          console.log('Video ready for display');
          setVideoLoading(false);
        }}
        onBuffer={(data) => {
          console.log('Video buffering:', data.isBuffering);
        }}
        controls={false}
        disableFocus={true}
        hideShutterView={true}
        shutterColor="transparent"
      />
      

      
      {/* Fallback gradient background - Only show on error */}
      {videoError && (
        <View style={styles.backgroundGradient}>
          <View style={styles.accentLines}>
            <View style={[styles.accentLine, { top: '20%', left: '10%' }]} />
            <View style={[styles.accentLine, { top: '60%', right: '15%' }]} />
            <View style={[styles.accentLine, { top: '40%', left: '80%' }]} />
          </View>
          
          <View style={styles.hexagonContainer}>
            {renderHexagonalElements()}
          </View>
          
          <View style={styles.starsContainer}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  {
                    left: Math.random() * width,
                    top: Math.random() * height,
                    opacity: 0.3 + Math.random() * 0.4,
                  },
                ]}
              />
            ))}
          </View>
          
          {/* Error message */}
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Video failed to load</Text>
            <Text style={styles.errorSubText}>Using fallback background</Text>
          </View>
        </View>
      )}
      
      {/* Semi-transparent overlay */}
      <View style={styles.overlay} />
      
      {/* Moving Background Elements */}
      <View style={styles.movingBackgroundContainer}>
        {renderMovingBackground()}
      </View>

      {/* Hologram Effect */}
      <View style={styles.hologramContainer}>
        <View style={styles.hologramGrid} />
      </View>
      
      {/* Skip Button */}
      <Animated.View style={skipButtonAnimatedStyle}>
        <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {/* Title with ultra-advanced animations */}
          <Animated.Text style={[currentSlide === 0 ? styles.customTitle : styles.title, titleAnimatedStyle]}>
            {currentSlideData.title}
          </Animated.Text>
          
          {/* Subtitle with ultra-advanced animations */}
          <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
            {currentSlideData.subtitle}
          </Animated.Text>
          
          {/* Description with ultra-advanced animations */}
          <Animated.Text style={[styles.description, descriptionAnimatedStyle]}>
            {currentSlideData.description}
          </Animated.Text>
        </View>
        
        <View style={styles.progressContainer}>
          {slides.map((_, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.progressDot, 
                index === currentSlide && styles.activeProgressDot,
                index === currentSlide && progressDotAnimatedStyle
              ]} 
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={skipOnboarding}>
            <Text style={styles.secondaryButtonText}>Skip</Text>
          </TouchableOpacity>
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity 
              style={[styles.primaryButton, {backgroundColor: 'rgba(255,255,255,0.2)', zIndex: 999}]} 
              onPress={nextSlide}
              activeOpacity={0.7}
            >
              <LinearGradient 
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} 
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>
                  {currentSlide === slides.length - 1 ? 'Start Your Journey' : 'Next'}
                </Text>
                <Icon 
                  name={currentSlide === slides.length - 1 ? "rocket" : "arrow-forward"} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: -2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: -1,
  },

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  errorContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Karla-ExtraLight',
  },
  errorSubText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Karla-ExtraLight',
  },
  accentLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  accentLine: {
    position: 'absolute',
    width: 2,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  hexagonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  hexagon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  hologramContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  hologramGrid: {
    width: '100%',
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Karla-ExtraLight',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 100,
    zIndex: 5,
  },
  movingBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  movingElement: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Karla-ExtraLight',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  customTitle: {
    fontSize: 42,
    fontWeight: '900',
    fontFamily: 'Karla-ExtraLight',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
    fontFamily: 'Karla-ExtraLight',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Karla-ExtraLight',
    letterSpacing: 0.3,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeProgressDot: {
    transform: [{ scale: 1.2 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  secondaryButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Karla-ExtraLight',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Karla-ExtraLight',
    marginRight: 8,
  },
});

export default OnboardingScreen; 