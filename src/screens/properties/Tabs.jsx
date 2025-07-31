import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;

// Map tab ids to icon names
const tabIcons = {
  All: 'apps',
  Upcoming: 'calendar-clock',
  'Real Estate': 'home-city',
  Gold: 'gold',
  Tokenization: 'key-chain',
  Green: 'leaf',
};

const Tabs = ({ tabData, activeTab, setActiveTab }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const getTabLineStyle = (tabId) => {
    switch (tabId) {
      case 'All':
        return { borderBottomWidth: 4, borderBottomColor: '#FFD600' };
      case 'Upcoming':
        return { borderBottomWidth: 3, borderBottomColor: '#00C853' };
      case 'Real Estate':
        return { borderBottomWidth: 5, borderBottomColor: '#2979FF' };
      case 'Gold':
        return { borderBottomWidth: 4, borderBottomColor: '#FFD700' };
      case 'Tokenization':
        return { borderBottomWidth: 3, borderBottomColor: '#9C27B0' };
      case 'Green':
        return { borderBottomWidth: 4, borderBottomColor: '#4CAF50' };
      default:
        return { borderBottomWidth: 3, borderBottomColor: '#FFD600' };
    }
  };

  return (
    <View style={[styles.tabContainer, { backgroundColor: '#fff' }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
      >
        {tabData.map((tab) => {
          const isActive = activeTab === tab.id;
          const lineStyle = isActive ? getTabLineStyle(tab.id) : {};

          return (
            <Animated.View
              key={tab.id}
              style={[
                styles.tabWrapper,
                { transform: [{ scale: isActive ? scaleAnim : 1 }] }
              ]}
            >
              <TouchableOpacity
                style={[styles.tab, lineStyle]}
                onPress={() => handleTabPress(tab.id)}
                activeOpacity={0.85}
              >
                <View style={styles.tabContent}>
                  {isActive && (
                    <MaterialCommunityIcons
                      name={tabIcons[tab.id] || 'circle'}
                      size={18}
                      color={lineStyle.borderBottomColor}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                  ]}>
                    {tab.title}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    marginTop: 80,
    marginBottom: 10,
    overflow: 'hidden',
  },
  tabScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    minWidth: screenWidth * 1.2,
  },
  tabWrapper: {
    marginHorizontal: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
    color: '#222',
  },
  activeTabText: {
    fontWeight: '800',
  },
});

export default Tabs;
