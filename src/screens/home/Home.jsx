import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BlocksEssentialsScreen from './BlocksEssentialsScreen';
import Navbar from '../properties/Navbar'
import BottomNav from '../properties/BottomNav';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 150;
const BOTTOM_NAV_HEIGHT = 74;

export default function Home() {
  const [userPoints, setUserPoints] = useState(1250);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [recentActivities] = useState([
    { id: 1, type: 'reward', title: 'Daily Login', points: 50, icon: '🎁', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop' },
    { id: 2, type: 'investment', title: 'Property Investment', points: 200, icon: '🏠', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop' },
    { id: 3, type: 'referral', title: 'Friend Referral', points: 100, icon: '👥', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop' },
  ]);

  const [quickActions] = useState([
    { 
      id: 1, 
      title: 'Invest Now', 
      icon: '💰', 
      color: '#4CAF50',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop'
    },
    { 
      id: 2, 
      title: 'Market Analysis', 
      icon: '📊', 
      color: '#2196F3',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
    },
    { 
      id: 3, 
      title: 'Portfolio', 
      icon: '📈', 
      color: '#FF9800',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
    },
    { 
      id: 4, 
      title: 'Rewards', 
      icon: '🏆', 
      color: '#9C27B0',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop'
    },
  ]);

  const [marketInsights] = useState([
    { 
      id: 1, 
      title: 'Dubai Real Estate', 
      change: '+12.5%', 
      trend: 'up', 
      icon: '🏢',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop'
    },
    { 
      id: 2, 
      title: 'Abu Dhabi Market', 
      change: '+8.3%', 
      trend: 'up', 
      icon: '🌆',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=200&fit=crop'
    },
    { 
      id: 3, 
      title: 'Sharjah Properties', 
      change: '+15.2%', 
      trend: 'up', 
      icon: '🏘️',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop'
    },
  ]);

  const handleViewProperty = () => {
    console.log('View property pressed');
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action.title);
  };

  const handleRewardClaim = () => {
    setUserPoints(prev => prev + 50);
    console.log('Reward claimed!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        {/* Fixed Animated Header */}
        <View style={{ position: 'absolute', top: 20, left: 0, right: 0, height: HEADER_HEIGHT, zIndex: 10 }}>
          <Navbar/>
        </View>
        
        {/* Main Content */}
        <ScrollView
          style={{ 
            flex: 1, 
            marginTop: HEADER_HEIGHT, 
            marginBottom: BOTTOM_NAV_HEIGHT,
            backgroundColor: '#fff' 
          }}
          contentContainerStyle={{ 
            paddingBottom: 20,
            paddingTop: 0,
            flexGrow: 1 
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.headerTitle, { marginTop: 0 }]}>Properties</Text>
          <View style={[styles.cardContainer, { marginBottom: 20 }]}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
              }}
              style={styles.backgroundImage}
              imageStyle={styles.imageStyle}
            >
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
              >
                <View style={styles.contentContainer}>
                  {/* Main Content */}
                  <View style={styles.textContainer}>
                    <Text style={styles.mainTitle}>{'New hot\nproperty is live!'}</Text>
                    <Text style={styles.subtitle}>
                      Selling fast! Secure your blocks now in Binghatti Rose!
                    </Text>
                  </View>
                  {/* CTA Button */}
                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={handleViewProperty}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.ctaText}>View property</Text>
                    <Text style={styles.arrow}>→</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction(action)}
                >
                  <ImageBackground
                    source={{ uri: action.image }}
                    style={styles.quickActionImage}
                    imageStyle={styles.quickActionImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                      style={styles.quickActionGradient}
                    >
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                      <Text style={styles.quickActionTitle}>{action.title}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Market Insights */}
          <View style={styles.marketInsightsSection}>
            <Text style={styles.sectionTitle}>Market Insights</Text>
            <View style={styles.insightsContainer}>
              {marketInsights.map((insight) => (
                <View key={insight.id} style={styles.insightCard}>
                  <ImageBackground
                    source={{ uri: insight.image }}
                    style={styles.insightImage}
                    imageStyle={styles.insightImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                      style={styles.insightGradient}
                    >
                      <View style={styles.insightLeft}>
                        <Text style={styles.insightIcon}>{insight.icon}</Text>
                        <View>
                          <Text style={styles.insightTitle}>{insight.title}</Text>
                          <Text style={styles.insightChange}>{insight.change}</Text>
                        </View>
                      </View>
                      <View style={styles.insightRight}>
                        <Text style={styles.trendIcon}>📈</Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Activities */}
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityCard}>
                  <ImageBackground
                    source={{ uri: activity.image }}
                    style={styles.activityImage}
                    imageStyle={styles.activityImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                      style={styles.activityGradient}
                    >
                      <View style={styles.activityLeft}>
                        <Text style={styles.activityIcon}>{activity.icon}</Text>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                      </View>
                      <Text style={styles.activityPoints}>+{activity.points}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              ))}
            </View>
          </View>
          <View style={{ backgroundColor: '#f5f5f5' }}>
            <BlocksEssentialsScreen />
          </View>
        </ScrollView>
        
        {/* Fixed Bottom Navigation */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: BOTTOM_NAV_HEIGHT, zIndex: 20 }}>
          <BottomNav />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight || 44,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 20,
    marginBottom: 12,
    fontFamily: 'sans-serif-light',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rewardCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rewardGradient: {
    padding: 20,
  },
  rewardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardLeft: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  rewardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  rewardRight: {
    alignItems: 'center',
  },
  claimButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  claimText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    height: 120,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  quickActionImage: {
    width: '100%',
    height: '100%',
  },
  quickActionImageStyle: {
    borderRadius: 16,
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
    color: '#fff',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  marketInsightsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 8,
  },
  insightCard: {
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  insightImage: {
    width: '100%',
    height: '100%',
  },
  insightImageStyle: {
    borderRadius: 12,
  },
  insightGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  insightChange: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  insightRight: {
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 20,
  },
  activitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activitiesContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 8,
  },
  activityCard: {
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: '100%',
  },
  activityImageStyle: {
    borderRadius: 12,
  },
  activityGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 16,
    color: '#fff',
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardContainer: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.35,
  },
  imageStyle: {
    borderRadius: 24,
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 56,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});