import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);

const SuccessModal = ({
  visible,
  message = "Operation completed successfully!",
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer;
    if (visible) {
      scaleAnim.setValue(0);
      confettiAnim.setValue(0);
      fadeAnim.setValue(0);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 100,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after 5 seconds
      timer = setTimeout(() => {
        onClose && onClose();
      }, 7000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, confettiAnim, fadeAnim, onClose, scaleAnim]);

  const renderConfetti = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const randomX = Math.random() * width;
      const randomColor = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#F9CA24',
        '#F0932B',
        '#6C5CE7',
      ][Math.floor(Math.random() * 6)];

      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.confettiParticle,
            {
              backgroundColor: randomColor,
              left: randomX,
              transform: [
                {
                  translateY: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, height + 50],
                  }),
                },
                {
                  rotate: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: confettiAnim.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        />
      );
    }
    return particles;
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <AnimatedView
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.contentContainer}>
            {/* Lottie animation */}
            <View style={styles.lottieFixedContainer}>
              <LottieView
                source={require('../../assets/lottie/HJLQhmid9d.json')}
                autoPlay={visible}
                loop={true}
                style={{ width: 120, height: 120 }}
                speed={0.3}
              />
            </View>

            {/* Success text */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Success!</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
            {/* No Continue button */}
          </View>
          {/* Confetti particles */}
          <View style={styles.confettiContainer}>{renderConfetti()}</View>
        </AnimatedView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 350,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 25,
  },
  contentContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  lottieFixedContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.06)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
    paddingHorizontal: 16,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: -50,
  },
});

export default SuccessModal;


// import React, { useEffect, useRef } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   Easing,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Svg, { Circle, Path, G } from 'react-native-svg';

// const { width, height } = Dimensions.get('window');

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const AnimatedPath = Animated.createAnimatedComponent(Path);
// const AnimatedView = Animated.createAnimatedComponent(View);

// const SuccessModal = ({ visible, message = "Operation completed successfully!", onClose }) => {
//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const circleAnim = useRef(new Animated.Value(0)).current;
//   const checkAnim = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const confettiAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       // Reset all animations
//       scaleAnim.setValue(0);
//       circleAnim.setValue(0);
//       checkAnim.setValue(0);
//       pulseAnim.setValue(1);
//       confettiAnim.setValue(0);
//       fadeAnim.setValue(0);

//       // Start animation sequence
//       Animated.sequence([
//         // Fade in modal
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         // Scale up circle
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           useNativeDriver: true,
//           friction: 6,
//           tension: 100,
//         }),
//         // Draw circle
//         Animated.timing(circleAnim, {
//           toValue: 1,
//           duration: 800,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//         // Draw checkmark
//         Animated.timing(checkAnim, {
//           toValue: 1,
//           duration: 600,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//         // Confetti effect
//         Animated.timing(confettiAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ]).start();

//       // Continuous pulse animation
//       const pulse = Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulseAnim, {
//             toValue: 1.1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//         ])
//       );
//       pulse.start();

//       return () => pulse.stop();
//     }
//   }, [visible]);

//   const circleCircumference = 2 * Math.PI * 25;
//   const checkPathLength = 24;

//   // Generate confetti particles
//   const renderConfetti = () => {
//     const particles = [];
//     for (let i = 0; i < 20; i++) {
//       const randomX = Math.random() * width;
//       const randomDelay = Math.random() * 1000;
//       const randomColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#F0932B', '#6C5CE7'][Math.floor(Math.random() * 6)];
      
//       particles.push(
//         <Animated.View
//           key={i}
//           style={[
//             styles.confettiParticle,
//             {
//               backgroundColor: randomColor,
//               left: randomX,
//               transform: [
//                 {
//                   translateY: confettiAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [-50, height + 50],
//                   }),
//                 },
//                 {
//                   rotate: confettiAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: ['0deg', '360deg'],
//                   }),
//                 },
//               ],
//               opacity: confettiAnim.interpolate({
//                 inputRange: [0, 0.1, 0.9, 1],
//                 outputRange: [0, 1, 1, 0],
//               }),
//             },
//           ]}
//         />
//       );
//     }
//     return particles;
//   };

//   return (
//     <Modal visible={visible} transparent animationType="none">
//       <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
//         <LinearGradient
//           colors={['#667eea', '#764ba2']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.modalContainer}
//         >


//           {/* Main content */}
//           <View style={styles.contentContainer}>
//             {/* Animated checkmark */}
//             <AnimatedView
//               style={[
//                 styles.checkmarkContainer,
//                 {
//                   transform: [{ scale: scaleAnim }],
//                 },
//               ]}
//             >
//               <View style={styles.checkmarkCircle}>
//                 <Svg width={80} height={80} viewBox="0 0 52 52">
//                   <AnimatedCircle
//                     cx="26"
//                     cy="26"
//                     r="25"
//                     fill="none"
//                     stroke="#ffffff"
//                     strokeWidth="2"
//                     strokeDasharray={circleCircumference}
//                     strokeDashoffset={circleAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [circleCircumference, 0],
//                     })}
//                     strokeLinecap="round"
//                   />
//                   <AnimatedPath
//                     d="M14.1 27.2l7.1 7.2 16.7-16.8"
//                     fill="none"
//                     stroke="#ffffff"
//                     strokeWidth="3"
//                     strokeDasharray={checkPathLength}
//                     strokeDashoffset={checkAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [checkPathLength, 0],
//                     })}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </Svg>
//               </View>
//             </AnimatedView>

//             {/* Success text */}
//             <Animated.View
//               style={[
//                 styles.textContainer,
//                 {
//                   opacity: checkAnim,
//                   transform: [
//                     {
//                       translateY: checkAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [20, 0],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             >
//               <Text style={styles.title}>Success!</Text>
//               <Text style={styles.message}>{message}</Text>
//             </Animated.View>

//             {/* Continue button */}
//             <Animated.View
//               style={[
//                 styles.buttonContainer,
//                 {
//                   opacity: checkAnim,
//                   transform: [
//                     {
//                       translateY: checkAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [20, 0],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             >
//               <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
//                 <LinearGradient
//                   colors={['#ffffff', '#f8f9fa']}
//                   style={styles.buttonGradient}
//                 >
//                   <Text style={styles.buttonText}>Continue</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </Animated.View>
//           </View>

//           {/* Confetti particles */}
//           <View style={styles.confettiContainer}>
//             {renderConfetti()}
//           </View>


//         </LinearGradient>
//       </Animated.View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: width * 0.85,
//     maxWidth: 350,
//     borderRadius: 24,
//     padding: 32,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 20,
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 25,
//     elevation: 25,
//   },

//   contentContainer: {
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   checkmarkContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//     shadowColor: '#fff',
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.5,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   checkmarkCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 12,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   message: {
//     fontSize: 16,
//     color: '#ffffff',
//     textAlign: 'center',
//     lineHeight: 24,
//     opacity: 0.9,
//     paddingHorizontal: 16,
//   },
//   buttonContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   button: {
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 12,
//   },
//   buttonGradient: {
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#667eea',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   confettiContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     pointerEvents: 'none',
//   },
//   confettiParticle: {
//     position: 'absolute',
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     top: -50,
//   },

// });

// export default SuccessModal;