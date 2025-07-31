import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useNavigationState } from '@react-navigation/native';



const navItems = [
  { id: 'home', icon: 'home', label: 'Home', screen: 'Home' },
  { id: 'store', icon: 'store', label: 'Marketplace', screen: 'Marketplace' },
  { id: 'wallet', icon: 'account-balance-wallet', label: 'Wallet', screen: 'WalletInterface' },
  { id: 'profile', icon: 'person', label: 'Profile', screen: 'Profile' },
];

const BottomNav = () => {
  const navigation = useNavigation();
  
  // Get current route name from navigation state
  const currentRouteName = useNavigationState(state => {
    if (state && state.routes && state.index !== undefined) {
      return state.routes[state.index].name;
    }
    return 'Marketplace'; // Default fallback
  });
  
  // Determine active tab based on current route
  const activeTab = navItems.find(item => item.screen === currentRouteName)?.id || 'store';

  // Animation state for each tab
  const scaleAnims = React.useRef(
    navItems.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  const handleTabPress = (tabId, screenName) => {
    if (activeTab === tabId) return; // Already active, do nothing

    // Animate the pressed tab
    Animated.sequence([
      Animated.timing(scaleAnims[tabId], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[tabId], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Navigate to the corresponding screen
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.bottomNavContainer}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
        style={styles.bottomNavGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.bottomNav}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.navItemWrapper,
                  { transform: [{ scale: scaleAnims[item.id] }] }
                ]}
              >
                <TouchableOpacity
                  style={styles.navItem}
                  onPress={() => handleTabPress(item.id, item.screen)}
                  activeOpacity={0.8}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={item.label}
                >
                  {isActive && <View style={styles.activeYellowLine} />}
                  <View style={styles.navContent}>
                    <View style={[
                      styles.iconContainer,
                      isActive && styles.activeIconContainer
                    ]}>
                      <Icon
                        name={item.icon}
                        size={18}
                        color={isActive ? "#fff" : "#999"}
                      />
                    </View>
                    <Text style={[
                      styles.navText,
                      isActive && styles.navTextActive
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    backgroundColor: 'transparent',
    zIndex: 9999, // Ensure always on top
  },
  bottomNavGradient: {
    borderRadius: 0,
    padding: 0,
    width: '100%',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
  },
  navItemWrapper: {
    width: 80,
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    width: 80,
  },
  activeYellowLine: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#15a36e',
    zIndex: 2,
  },
  navContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(37, 95, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(37, 95, 153, 0.4)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navText: {
    color: '#999',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  navTextActive: {
    color: '#000',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default BottomNav;