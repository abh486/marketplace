# React Native Reanimated Implementation in OnboardingScreen

## Overview
The OnboardingScreen has been enhanced with React Native Reanimated to provide smooth, performant animations that run on the UI thread.

## Key Features Implemented

### 1. Slide Transitions
- **Fade and Slide Effects**: Smooth transitions between onboarding slides
- **Timing**: 250ms duration for optimal user experience
- **Direction**: Supports both forward and backward transitions

### 2. Progress Dots Animation
- **Spring Animation**: Active dot scales with spring physics
- **Pulse Effect**: Continuous subtle pulse animation on active dot
- **Visual Feedback**: Clear indication of current slide position

### 3. Button Interactions
- **Press Animation**: Scale down on press with spring physics
- **Release Animation**: Smooth return to original size
- **Responsive**: Immediate visual feedback for user interactions

### 4. Text Animations
- **Fade Transition**: Smooth opacity changes during slide transitions
- **Vertical Movement**: Subtle Y-axis movement for enhanced effect
- **Timing**: Coordinated with slide transitions

### 5. Background Elements
- **Moving Icons**: Continuous horizontal movement across screen
- **Different Icons**: Each slide has unique moving elements
- **Performance**: Optimized with Reanimated's native driver

### 6. Entrance Animations
- **Skip Button**: Fade-in animation with delay
- **Hologram Effect**: Pulsing opacity for ambient effect
- **Staggered Timing**: Coordinated entrance animations

## Technical Implementation

### Shared Values
```javascript
const slideOpacity = useSharedValue(1);
const slideTranslateX = useSharedValue(0);
const progressDotScale = useSharedValue(1);
const buttonScale = useSharedValue(1);
const movingElements = useSharedValue(0);
const textOpacity = useSharedValue(1);
const textTranslateY = useSharedValue(0);
const skipButtonOpacity = useSharedValue(0);
const hologramOpacity = useSharedValue(0.3);
```

### Animation Functions
- `animateSlideTransition()`: Handles slide transitions
- `animateProgressDot()`: Animates progress dot selection
- `animateButton()`: Handles button press animations
- `animateText()`: Manages text transitions

### Performance Benefits
- **UI Thread**: All animations run on the UI thread
- **60fps**: Smooth animations at 60 frames per second
- **Memory Efficient**: Shared values prevent unnecessary re-renders
- **Native Performance**: Leverages native animation capabilities

## Usage

The animations are automatically triggered by:
1. **Slide Changes**: When user navigates between slides
2. **Button Presses**: When primary or secondary buttons are pressed
3. **Component Mount**: Entrance animations on initial load
4. **Progress Updates**: When progress dots are updated

## Customization

### Timing Adjustments
```javascript
// Faster transitions
slideOpacity.value = withTiming(0, { duration: 200 });

// Slower, more dramatic transitions
slideOpacity.value = withTiming(0, { duration: 400 });
```

### Spring Physics
```javascript
// Bouncier animation
buttonScale.value = withSpring(0.95, {
  damping: 10,
  stiffness: 200,
});

// Stiffer animation
buttonScale.value = withSpring(0.95, {
  damping: 20,
  stiffness: 400,
});
```

### Adding New Animations
1. Create a new shared value: `const newAnimation = useSharedValue(initialValue);`
2. Create animated style: `const newAnimatedStyle = useAnimatedStyle(() => ({ ... }));`
3. Apply to component: `<Animated.View style={newAnimatedStyle}>`
4. Trigger animation in event handlers or useEffect

## Dependencies
- `react-native-reanimated`: ^3.18.0
- `react-native-gesture-handler`: ^2.26.0 (for GestureHandlerRootView)

## Best Practices
1. **Use Shared Values**: Avoid creating new animated values in render
2. **Optimize Timing**: Keep animations under 300ms for responsiveness
3. **Spring Physics**: Use for interactive elements, timing for transitions
4. **Cleanup**: Clear intervals and timeouts in useEffect cleanup
5. **Performance**: Monitor frame rate and optimize heavy animations 