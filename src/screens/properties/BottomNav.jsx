import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useTheme } from '../../Theme/ThemeContext'; // ✅ ADDED — adjust path as needed

const navItems = [
  { id: 'home', icon: 'home', label: 'Home', screen: 'Home' },
  { id: 'store', icon: 'store', label: 'Market', screen: 'Marketplace' },
  { id: 'wallet', icon: 'account-balance-wallet', label: 'Wallet', screen: 'WalletInterface' },
  { id: 'portfolio', icon: 'insert-chart', label: 'Portfolio', screen: 'PortfolioScreen' },
  { id: 'profile', icon: 'person', label: 'Profile', screen: 'Profile' },
];

const BottomNav = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme(); // ✅ Get current theme mode

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

  // ✅ YOUR EXACT STATIC STYLES — NOW CONDITIONAL ON isDarkMode
  const gradientColors = isDarkMode
    ? ['#012419ff', '#012419ff', '#012419ff']
    : ['#FFFFFF', '#FFFFFF', '#FFFFFF']; // Pure white for light mode

  const navBg = 'transparent';

  const iconActiveBg = isDarkMode
    ? 'rgba(0,255,102,0.18)'
    : 'rgba(0,219,132,0.15)'; // Green glow in light mode too

  const iconInactiveBg = isDarkMode
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(0,0,0,0.05)'; // Subtle in light

  const iconActiveColor = isDarkMode ? '#fff' : '#000'; // Active icon color
  const iconInactiveColor = isDarkMode ? '#aaa' : '#888'; // Inactive icon color

  const textActive = isDarkMode ? '#fff' : '#000';
  const textInactive = isDarkMode ? '#7ad1a5' : '#037145'; // Keep your soft green in dark, use primary in light

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
                        { color: isActive ? textActive : textInactive }, // ✅ Fixed: was always textActive
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
    backgroundColor: 'transparent', // ✅ Let gradient handle bg
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
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
  },
  activeIconContainer: {
    shadowColor: '#02311eff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  navText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  navTextActive: {
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default BottomNav;