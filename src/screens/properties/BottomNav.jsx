import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const navItems = [
  { id: 'home', icon: 'home', label: 'Home', screen: 'Home' },
  { id: 'store', icon: 'store', label: 'Market', screen: 'Marketplace' },
  { id: 'wallet', icon: 'account-balance-wallet', label: 'Wallet', screen: 'WalletInterface' },
  { id: 'portfolio', icon: 'insert-chart', label: 'Portfolio', screen: 'PortfolioScreen' },
  { id: 'profile', icon: 'person', label: 'Profile', screen: 'Profile' },
];

const BottomNav = () => {
  const navigation = useNavigation();

 const currentRouteName = useNavigationState(state => {
  if (
    state &&
    Array.isArray(state.routes) &&
    typeof state.index === 'number' &&
    state.routes[state.index]
  ) {
    return state.routes[state.index].name || 'Marketplace';
  }
  return 'Marketplace';
});

  const activeTab = navItems.find(item => item.screen === currentRouteName)?.id || 'store';

  const scaleAnims = React.useRef(
    navItems.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  const handleTabPress = (tabId, screenName) => {
    if (activeTab === tabId) return;

    Animated.sequence([
      Animated.timing(scaleAnims[tabId], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[tabId], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    navigation.navigate(screenName);
  };

  // Static dark theme styles and colors (no toggle)
  const gradientColors = ['#012419ff', '#012419ff', '#012419ff']; // dark background gradient
  const navBg = 'transparent';
  const iconActiveBg = 'rgba(0,255,102,0.18)'; // neon green glass behind active icon
  const iconInactiveBg = 'rgba(255,255,255,0.07)'; // subtle glass behind inactive icons
  const iconActiveColor = '#fff'; // neon green for active icon
  const iconInactiveColor = '#aaa'; // muted gray inactive icon color
  const textActive = '#fff'; // bright text active
  const textInactive = '#7ad1a5'; // soft green text inactive

  return (
    <View style={styles.bottomNavContainer}>
      <LinearGradient
        colors={gradientColors}
        style={styles.bottomNavGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.bottomNav, { backgroundColor: navBg }]}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.navItemWrapper,
                  { transform: [{ scale: scaleAnims[item.id] }] },
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
                  <View style={styles.navContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: isActive ? iconActiveBg : iconInactiveBg,
                        },
                        isActive && styles.activeIconContainer,
                      ]}
                    >
                      <Icon
                        name={item.icon}
                        size={18}
                        color={isActive ? iconActiveColor : iconInactiveColor}
                      />
                    </View>
                    <Text
                      style={[
                        styles.navText,
                        { color: isActive ? textActive : textActive },
                        isActive && styles.navTextActive,
                      ]}
                    >
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
    backgroundColor: 'transparent',
    zIndex: 9999,
  },
  bottomNavGradient: {
    borderRadius: 0,
    padding: 0,
    width: '100%',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 0,
    width: '100%',
    backgroundColor: '#001A13', // Dark background
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)', // Very subtle top border
  },
  navItemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  navContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0,255,153,0.15)', // Soft neon green glass
    shadowColor: '#00FF9D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  navText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#fff', // Soft green for inactive text
  },
  navTextActive: {
    color: '#fff', // White for active text
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default BottomNav;
