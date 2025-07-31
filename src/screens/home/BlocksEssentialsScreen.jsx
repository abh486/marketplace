import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const { width } = Dimensions.get('window');

const BlocksEssentialsScreen = () => {
  const [selectedLearningPath, setSelectedLearningPath] = useState('beginner');
  const [investmentAmount, setInvestmentAmount] = useState(24000);
  const [selectedProperty, setSelectedProperty] = useState('dubai');

  const videoThumbnails = [
    { id: 1, source: { uri: 'https://images.unsplash.com/photo-1494790108755-2616b9669ac5?w=150&h=150&fit=crop&crop=face' } },
    { id: 2, source: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' } },
    { id: 3, source: { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' } },
    { id: 4, source: { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' } },
    { id: 5, source: { uri: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face' } },
    { id: 6, source: { uri: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face' } },
  ];

  const learningPaths = [
    { id: 'beginner', title: 'Beginner', icon: '🌱', color: '#4CAF50', lessons: 12, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop' },
    { id: 'intermediate', title: 'Intermediate', icon: '🚀', color: '#2196F3', lessons: 18, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop' },
    { id: 'advanced', title: 'Advanced', icon: '🏆', color: '#FF9800', lessons: 24, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop' },
  ];

  const aiInsights = [
    { 
      id: 1, 
      title: 'Market Trend Analysis', 
      description: 'AI predicts 15% growth in Dubai properties', 
      confidence: 92, 
      icon: '🤖',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
    },
    { 
      id: 2, 
      title: 'Investment Recommendation', 
      description: 'Best time to invest in Abu Dhabi', 
      confidence: 88, 
      icon: '📊',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
    },
    { 
      id: 3, 
      title: 'Risk Assessment', 
      description: 'Low risk profile for current market', 
      confidence: 95, 
      icon: '🛡️',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop'
    },
  ];

  const properties = [
    { id: 'dubai', name: 'Dubai Marina', roi: '12.5%', price: '2.5M AED', icon: '🏢' },
    { id: 'abudhabi', name: 'Abu Dhabi Corniche', roi: '10.8%', price: '1.8M AED', icon: '🌆' },
    { id: 'sharjah', name: 'Sharjah Downtown', roi: '15.2%', price: '1.2M AED', icon: '🏘️' },
  ];

  const [scale] = React.useState(new Animated.Value(1));
  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  const calculateROI = () => {
    const baseROI = selectedProperty === 'dubai' ? 12.5 : selectedProperty === 'abudhabi' ? 10.8 : 15.2;
    const investmentMultiplier = investmentAmount / 24000;
    return (baseROI * investmentMultiplier).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.header}>Blocks essentials</Text>

        {/* AI Insights Section */}
        <View style={styles.aiInsightsSection}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
                      <View style={styles.aiInsightsContainer}>
              {aiInsights.map((insight) => (
                <View key={insight.id} style={styles.aiInsightCard}>
                  <ImageBackground
                    source={{ uri: insight.image }}
                    style={styles.aiInsightImage}
                    imageStyle={styles.aiInsightImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                      style={styles.aiInsightGradient}
                    >
                      <View style={styles.aiInsightHeader}>
                        <Text style={styles.aiInsightIcon}>{insight.icon}</Text>
                        <View style={styles.confidenceBadge}>
                          <Text style={styles.confidenceText}>{insight.confidence}%</Text>
                        </View>
                      </View>
                      <Text style={styles.aiInsightTitle}>{insight.title}</Text>
                      <Text style={styles.aiInsightDescription}>{insight.description}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              ))}
            </View>
        </View>

        {/* Learning Paths */}
        <View style={styles.learningSection}>
          <Text style={styles.sectionTitle}>Learning Paths</Text>
                      <View style={styles.learningPathsContainer}>
              {learningPaths.map((path) => (
                <TouchableOpacity
                  key={path.id}
                  style={[
                    styles.learningPathCard,
                    selectedLearningPath === path.id && styles.selectedLearningPath
                  ]}
                  onPress={() => setSelectedLearningPath(path.id)}
                >
                  <ImageBackground
                    source={{ uri: path.image }}
                    style={styles.learningPathImage}
                    imageStyle={styles.learningPathImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                      style={styles.learningPathGradient}
                    >
                      <Text style={styles.learningPathIcon}>{path.icon}</Text>
                      <Text style={styles.learningPathTitle}>{path.title}</Text>
                      <Text style={styles.learningPathLessons}>{path.lessons} lessons</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
        </View>

        {/* Top Row Cards */}
        <View style={styles.topRowContainer}>
          {/* Explore Videos Card */}
          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.videoCardContent}>
              <Text style={styles.videoCardTitle}>Explore our{'\n'}videos</Text>
              <View style={styles.videoGrid}>
                {videoThumbnails.map((item, index) => (
                  <View key={item.id} style={styles.videoThumbnail}>
                    <Image source={item.source} style={styles.thumbnailImage} />
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>

          {/* Knowledge Hub Card */}
          <TouchableOpacity style={styles.knowledgeCard}>
            <Text style={styles.knowledgeCardTitle}>Knowledge{'\n'}Hub</Text>
            <View style={styles.knowledgeIcon}>
              <View style={styles.globeIcon}>
                <View style={styles.globeInner}></View>
                <View style={styles.globeRing}></View>
                <View style={styles.globeRing2}></View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Advanced Investment Calculator Card */}
        <TouchableOpacity style={styles.calculatorCard}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop' }}
            style={styles.calculatorImage}
            imageStyle={styles.calculatorImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
              style={styles.calculatorGradient}
            >
              <View style={styles.calculatorHeader}>
                <View style={styles.calculatorHeaderLeft}>
                  <Text style={styles.calculatorTitle}>Advanced Investment Calculator</Text>
                  <Text style={styles.calculatorSubtitle}>AI-powered analysis with real-time data</Text>
                </View>
                <View style={styles.calculatorHeaderRight}>
                  <View style={styles.roiDisplay}>
                    <Text style={styles.roiLabel}>Estimated ROI</Text>
                    <Text style={styles.roiValue}>{calculateROI()}%</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.calculatorBody}>
                {/* Property Selection */}
                <View style={styles.propertySection}>
                  <Text style={styles.sectionLabel}>Select Property Type</Text>
                  <View style={styles.propertyGrid}>
                    {properties.map((property) => (
                      <TouchableOpacity
                        key={property.id}
                        style={[
                          styles.propertyCard,
                          selectedProperty === property.id && styles.selectedPropertyCard
                        ]}
                        onPress={() => setSelectedProperty(property.id)}
                      >
                        <Text style={styles.propertyCardIcon}>{property.icon}</Text>
                        <Text style={styles.propertyCardName}>{property.name}</Text>
                        <Text style={styles.propertyCardROI}>{property.roi} ROI</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Investment Amount */}
                <View style={styles.amountSection}>
                  <Text style={styles.sectionLabel}>Investment Amount</Text>
                  <View style={styles.amountDisplay}>
                    <Text style={styles.amountLabel}>AED</Text>
                    <Text style={styles.amountValue}>{investmentAmount.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* Market Trends */}
                  <View style={styles.marketTrendsSection}>
            <Text style={styles.sectionTitle}>Market Trends</Text>
            <View style={styles.trendsContainer}>
              <View style={styles.trendCard}>
                <ImageBackground
                  source={{ uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop' }}
                  style={styles.trendImage}
                  imageStyle={styles.trendImageStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                    style={styles.trendGradient}
                  >
                    <Text style={styles.trendIcon}>📈</Text>
                    <Text style={styles.trendTitle}>Dubai Growth</Text>
                    <Text style={styles.trendValue}>+15.2%</Text>
                    <Text style={styles.trendPeriod}>This Year</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
              <View style={styles.trendCard}>
                <ImageBackground
                  source={{ uri: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop' }}
                  style={styles.trendImage}
                  imageStyle={styles.trendImageStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                    style={styles.trendGradient}
                  >
                    <Text style={styles.trendIcon}>🏢</Text>
                    <Text style={styles.trendTitle}>New Projects</Text>
                    <Text style={styles.trendValue}>+23</Text>
                    <Text style={styles.trendPeriod}>This Month</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
              <View style={styles.trendCard}>
                <ImageBackground
                  source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop' }}
                  style={styles.trendImage}
                  imageStyle={styles.trendImageStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                    style={styles.trendGradient}
                  >
                    <Text style={styles.trendIcon}>💰</Text>
                    <Text style={styles.trendTitle}>Average ROI</Text>
                    <Text style={styles.trendValue}>12.8%</Text>
                    <Text style={styles.trendPeriod}>Annual</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '300',
    color: '#1a1a1a',
    marginBottom: 20,
    fontFamily: 'sans-serif-light',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  aiInsightsSection: {
    marginBottom: 25,
  },
  aiInsightsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiInsightCard: {
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  aiInsightImage: {
    width: '100%',
    height: '100%',
  },
  aiInsightImageStyle: {
    borderRadius: 12,
  },
  aiInsightGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiInsightIcon: {
    fontSize: 24,
  },
  confidenceBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  aiInsightDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  learningSection: {
    marginBottom: 25,
  },
  learningPathsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  learningPathCard: {
    flex: 1,
    marginHorizontal: 4,
    height: 120,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  learningPathImage: {
    width: '100%',
    height: '100%',
  },
  learningPathImageStyle: {
    borderRadius: 16,
  },
  learningPathGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  selectedLearningPath: {
    elevation: 8,
    shadowOpacity: 0.2,
  },
  learningPathIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  learningPathTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  learningPathLessons: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  videoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoCardContent: {
    flex: 1,
  },
  videoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  knowledgeCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginLeft: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  knowledgeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  knowledgeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  globeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  globeInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  globeRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  globeRing2: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#eee',
  },
  calculatorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  calculatorImage: {
    width: '100%',
    height: '100%',
  },
  calculatorImageStyle: {
    borderRadius: 16,
  },
  calculatorGradient: {
    flex: 1,
    padding: 20,
  },
  calculatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  calculatorHeaderLeft: {
    flex: 1,
  },
  calculatorHeaderRight: {
    alignItems: 'flex-end',
  },
  calculatorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  calculatorSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  roiDisplay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  roiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calculatorBody: {
    flex: 1,
  },
  propertySection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  propertyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedPropertyCard: {
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderColor: '#4CAF50',
  },
  propertyCardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  propertyCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  propertyCardROI: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  amountSection: {
    marginBottom: 10,
  },
  amountDisplay: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginRight: 8,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  marketTrendsSection: {
    marginBottom: 25,
  },
  trendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendCard: {
    flex: 1,
    height: 120,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  trendImage: {
    width: '100%',
    height: '100%',
  },
  trendImageStyle: {
    borderRadius: 12,
  },
  trendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  trendIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  trendPeriod: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
});

export default BlocksEssentialsScreen;