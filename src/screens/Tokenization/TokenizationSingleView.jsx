import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  StatusBar,
  PanResponder,
  Animated,
  TextInput,
  Modal,
  Alert,
  Platform,
  ImageBackground,
  FlatList,
  Vibration,
  InteractionManager,
  LayoutAnimation,
  UIManager,
  Easing,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { LineChart, AreaChart, XAxis, YAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { 
  Circle, 
  G, 
  Line, 
  Rect, 
  Defs, 
  LinearGradient, 
  Stop, 
  Filter, 
  FeGaussianBlur,
  FeDropShadow,
  Path,
  Text as SvgText,
  RadialGradient,
  ClipPath,
  Ellipse,
  Polygon,
  Mask
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TokenizationSingleView = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [currentMetric, setCurrentMetric] = useState('value');
  const [tooltipData, setTooltipData] = useState(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const cardFlipAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  // Advanced tokenization data
  const tokenData = {
    title: "Meridian Real Estate Digital Asset Fund",
    subtitle: "Premium Tokenized Real Estate Investment",
    type: "TOKENIZED FUND",
    category: "Real Estate",
    totalShares: 10000,
    availableShares: 2500,
    sharePrice: 125.75,
    totalCapitalization: 1257500,
    investors: 347,
    fundedPercentage: 75,
    yield: 8.5,
    netYield: 7.2,
    annualizedReturn: 9.1,
    riskScore: 3.2,
    liquidityScore: 4.1,
    location: "Global Portfolio",
    launchDate: "2024-01-15",
    maturityDate: "2029-01-15",
    minimumInvestment: 1000,
    marketCap: 943125,
    volume24h: 45230,
    priceChange24h: 2.3,
    holdersCount: 347,
    images: [
      'https://images.unsplash.com/photo-1518544801346-3df1c2b1b2c7?auto=format&fit=crop&w=800&q=80', // Bitcoin physical coin
      'https://images.unsplash.com/photo-1621414613609-6e84a1b7b6b3?auto=format&fit=crop&w=800&q=80', // Digital Bitcoin art
      'https://images.unsplash.com/photo-1508385082359-f48b1c1b1c8a?auto=format&fit=crop&w=800&q=80', // Tokenization concept
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80', // Blockchain/digital asset
    ],
    performance: {
      daily: 2.3,
      weekly: 5.7,
      monthly: 12.4,
      quarterly: 28.9,
      yearly: 34.2,
    },
    blockchain: {
      network: 'Ethereum',
      contract: '0x1234567890abcdef1234567890abcdef12345678',
      explorer: 'https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678',
      status: 'Active',
      gasPrice: 'Low',
      confirmations: 12,
      tokenStandard: 'ERC-20',
      auditStatus: 'Verified',
    },
    security: {
      audits: ['CertiK', 'Hacken', 'OpenZeppelin'],
      insurance: 'Lloyd\'s of London',
      kyc: 'Jumio Verified',
      compliance: 'SEC Reg D, EU MiFID II',
      rating: 'AAA',
      lastAudit: '2024-06-15',
    },
    growth: [
      { year: 2021, value: 100000, roi: 0, volume: 12000 },
      { year: 2022, value: 128000, roi: 28, volume: 18500 },
      { year: 2023, value: 156000, roi: 56, volume: 28200 },
      { year: 2024, value: 189000, roi: 89, volume: 45230 },
    ],
    dividends: [
      { quarter: 'Q1 2024', amount: 3200, rate: 8.1 },
      { quarter: 'Q2 2024', amount: 3450, rate: 8.5 },
      { quarter: 'Q3 2024', amount: 3180, rate: 7.9 },
      { quarter: 'Q4 2024', amount: 3650, rate: 8.8 },
    ],
    portfolio: [
      { name: 'Manhattan Office Complex', allocation: 35, value: 438750 },
      { name: 'London Residential', allocation: 28, value: 352100 },
      { name: 'Tokyo Commercial', allocation: 22, value: 276575 },
      { name: 'Berlin Mixed-Use', allocation: 15, value: 188250 },
    ],
  legalDocs: [
  {
    name: 'Investment Memorandum',
    type: 'PDF',
    size: '2.4 MB',
    url: 'https://example.com/memorandum.pdf',
    image: 'https://example.com/images/memorandum.png'
  },
  {
    name: 'Tokenomics Whitepaper',
    type: 'PDF',
    size: '1.8 MB',
    url: 'https://example.com/whitepaper.pdf',
    image: 'https://example.com/images/tokenization_new.png' // ✅ Updated image for tokenization
  },
  {
    name: 'Terms of Service',
    type: 'PDF',
    size: '856 KB',
    url: 'https://example.com/terms.pdf',
    image: 'https://example.com/images/terms.png'
  },
  {
    name: 'Risk Disclosure',
    type: 'PDF',
    size: '1.2 MB',
    url: 'https://example.com/risk.pdf',
    image: 'https://example.com/images/risk.png'
  }
],

    team: [
      { name: 'Sarah Chen', role: 'Fund Manager', image: 'https://images.unsplash.com/photo-1494790108755-2616b6a1f754?w=100&h=100&fit=crop&crop=face' },
      { name: 'Michael Rodriguez', role: 'Blockchain Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
      { name: 'Dr. Elena Volkov', role: 'Risk Analyst', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    ],
    metrics: {
      sharpeRatio: 1.85,
      beta: 0.72,
      alpha: 4.2,
      volatility: 12.8,
      maxDrawdown: 8.5,
      informationRatio: 1.32,
    },
    news: [
      { title: 'Fund Exceeds Q4 Performance Targets', date: '2024-07-10', source: 'Bloomberg' },
      { title: 'Strategic Partnership with PropTech Leaders', date: '2024-07-08', source: 'Reuters' },
      { title: 'Successful Asset Acquisition in Singapore', date: '2024-07-05', source: 'Financial Times' },
    ],
  };

  // Animation sequences
  useEffect(() => {
    const startAnimations = () => {
      // Staggered entrance animations
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
        ]),
        Animated.timing(progressAnim, {
          toValue: tokenData.fundedPercentage,
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        }),
      ]).start();

      // Continuous animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Shimmer effect
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ])
      ).start();

      // Sparkle effect
      Animated.loop(
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();
    };

    const timer = setTimeout(startAnimations, 100);
    return () => clearTimeout(timer);
  }, []);

  // Premium Image Slider with parallax effects
  const renderPremiumImageSlider = () => (
    <View style={styles.premiumImageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
          LayoutAnimation.easeInEaseOut();
        }}
        scrollEventThrottle={16}
      >
        {tokenData.images.map((image, index) => (
          <View key={index} style={styles.imageSlide}>
            <ImageBackground
              source={{ uri: image }}
              style={styles.premiumAssetImage}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.gradientOverlay}>
                <View style={styles.imageContent}>
                  <Animated.View
                    style={[
                      styles.imageLabel,
                      {
                        opacity: selectedImageIndex === index ? 1 : 0,
                        transform: [
                          {
                            translateY: selectedImageIndex === index ? 0 : 20,
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.imageLabelText}>
                      {index === 0 && 'Portfolio Overview'}
                      {index === 1 && 'Property Analytics'}
                      {index === 2 && 'Market Insights'}
                      {index === 3 && 'Investment Dashboard'}
                    </Text>
                  </Animated.View>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
      
      {/* Premium Header Overlay */}
      <View style={styles.premiumHeaderOverlay}>
        <Animated.View
          style={[
            styles.premiumHeaderButton,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.headerButtonInner}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.premiumHeaderButton}>
            <View style={styles.headerButtonInner}>
              <Feather name="eye" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.premiumHeaderButton}>
            <View style={styles.headerButtonInner}>
              <Feather name="share-2" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.premiumHeaderButton}>
            <View style={styles.headerButtonInner}>
              <Feather name="bookmark" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Premium Indicators */}
      <View style={styles.premiumIndicators}>
        {tokenData.images.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.premiumIndicator,
              {
                opacity: selectedImageIndex === index ? 1 : 0.3,
                transform: [
                  {
                    scale: selectedImageIndex === index ? 1.5 : 1,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  // Premium Overview Section
  const renderPremiumOverview = () => (
    <Animated.View
      style={[
        styles.premiumCard,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        },
      ]}
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.premiumTitle}>{tokenData.title}</Text>
          <Text style={styles.premiumSubtitle}>{tokenData.subtitle}</Text>
        </View>
        <View style={styles.badgeContainer}>
          <View style={styles.typeBadge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" />
            <Text style={styles.badgeText}>VERIFIED</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{tokenData.category}</Text>
          </View>
        </View>
      </View>

      {/* Key Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={styles.metricIcon}>
            <MaterialCommunityIcons name="trending-up" size={20} color="#4CAF50" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>+{tokenData.performance.daily}%</Text>
            <Text style={styles.metricLabel}>24h Change</Text>
          </View>
        </View>
        
        <View style={styles.metricItem}>
          <View style={styles.metricIcon}>
            <MaterialCommunityIcons name="account-group" size={20} color="#2196F3" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{tokenData.investors}</Text>
            <Text style={styles.metricLabel}>Investors</Text>
          </View>
        </View>
        
        <View style={styles.metricItem}>
          <View style={styles.metricIcon}>
            <MaterialCommunityIcons name="chart-line" size={20} color="#FF9800" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{tokenData.yield}%</Text>
            <Text style={styles.metricLabel}>APY</Text>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Funding Progress</Text>
          <Text style={styles.progressPercentage}>{tokenData.fundedPercentage}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            <View style={styles.progressGlow} />
          </View>
        </View>
        
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {tokenData.totalShares - tokenData.availableShares} / {tokenData.totalShares} shares sold
          </Text>
          <Text style={styles.progressText}>
            ${(tokenData.totalCapitalization * tokenData.fundedPercentage / 100).toLocaleString()} raised
          </Text>
        </View>
      </View>

      {/* Yield Information */}
      <View style={styles.yieldSection}>
        <Text style={styles.sectionTitle}>Investment Returns</Text>
        <View style={styles.yieldGrid}>
          <View style={styles.yieldCard}>
            <View style={styles.yieldIconContainer}>
              <MaterialCommunityIcons name="percent" size={24} color="#4CAF50" />
            </View>
            <View style={styles.yieldInfo}>
              <Text style={styles.yieldValue}>{tokenData.yield}%</Text>
              <Text style={styles.yieldLabel}>Current Yield</Text>
            </View>
          </View>
          
          <View style={styles.yieldCard}>
            <View style={styles.yieldIconContainer}>
              <MaterialCommunityIcons name="chart-line-variant" size={24} color="#2196F3" />
            </View>
            <View style={styles.yieldInfo}>
              <Text style={styles.yieldValue}>{tokenData.netYield}%</Text>
              <Text style={styles.yieldLabel}>Net Yield</Text>
            </View>
          </View>
          
          <View style={styles.yieldCard}>
            <View style={styles.yieldIconContainer}>
              <MaterialCommunityIcons name="finance" size={24} color="#FF9800" />
            </View>
            <View style={styles.yieldInfo}>
              <Text style={styles.yieldValue}>{tokenData.annualizedReturn}%</Text>
              <Text style={styles.yieldLabel}>Annual Return</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  // Premium Blockchain Section
  const renderPremiumBlockchain = () => (
    <Animated.View
      style={[
        styles.premiumCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialCommunityIcons name="ethereum" size={28} color="#627EEA" />
          <View style={styles.sectionTitleText}>
            <Text style={styles.sectionTitle}>Blockchain Details</Text>
            <Text style={styles.sectionSubtitle}>Smart Contract Information</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Live</Text>
        </View>
      </View>

      {/* Blockchain Info Cards */}
      <View style={styles.blockchainGrid}>
        <View style={styles.blockchainCard}>
          <View style={styles.blockchainIcon}>
            <MaterialCommunityIcons name="ethereum" size={24} color="#627EEA" />
          </View>
          <View style={styles.blockchainInfo}>
            <Text style={styles.blockchainLabel}>Network</Text>
            <Text style={styles.blockchainValue}>{tokenData.blockchain.network}</Text>
          </View>
        </View>
        
        <View style={styles.blockchainCard}>
          <View style={styles.blockchainIcon}>
            <MaterialCommunityIcons name="file-document" size={24} color="#4CAF50" />
          </View>
          <View style={styles.blockchainInfo}>
            <Text style={styles.blockchainLabel}>Standard</Text>
            <Text style={styles.blockchainValue}>{tokenData.blockchain.tokenStandard}</Text>
          </View>
        </View>
        
        <View style={styles.blockchainCard}>
          <View style={styles.blockchainIcon}>
            <MaterialCommunityIcons name="gas-station" size={24} color="#FF9800" />
          </View>
          <View style={styles.blockchainInfo}>
            <Text style={styles.blockchainLabel}>Gas Price</Text>
            <Text style={styles.blockchainValue}>{tokenData.blockchain.gasPrice}</Text>
          </View>
        </View>
        
        <View style={styles.blockchainCard}>
          <View style={styles.blockchainIcon}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#2196F3" />
          </View>
          <View style={styles.blockchainInfo}>
            <Text style={styles.blockchainLabel}>Confirmations</Text>
            <Text style={styles.blockchainValue}>{tokenData.blockchain.confirmations}</Text>
          </View>
        </View>
      </View>

      {/* Contract Address */}
      <View style={styles.contractSection}>
        <Text style={styles.contractLabel}>Contract Address</Text>
        <View style={styles.contractContainer}>
          <Text style={styles.contractAddress}>{tokenData.blockchain.contract}</Text>
          <TouchableOpacity style={styles.copyButton}>
            <MaterialCommunityIcons name="content-copy" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setIsInvestmentModalOpen(true)}
        >
          <Animated.View
            style={[
              styles.buttonContent,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <MaterialCommunityIcons name="wallet" size={20} color="#fff" />
            <Text style={styles.buttonText}>Invest Now</Text>
          </Animated.View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <MaterialCommunityIcons name="open-in-new" size={20} color="#2196F3" />
          <Text style={styles.secondaryButtonText}>View on Explorer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // Advanced Performance Chart
  const renderAdvancedChart = () => {
    const data = tokenData.growth.map(g => g.value);
    const years = tokenData.growth.map(g => g.year);
    const contentInset = { top: 40, bottom: 40 };
    const chartHeight = 280;
    const chartWidth = width - 80;

    const Decorator = ({ x, y, data }) => (
      <G>
        <Defs>
          <RadialGradient id="pointGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
            <Stop offset="100%" stopColor="#2196F3" stopOpacity="0.8" />
          </RadialGradient>
          <Filter id="glow">
            <FeGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <FeDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#4CAF50" floodOpacity="0.6"/>
          </Filter>
        </Defs>
        {data.map((value, index) => (
          <G key={index}>
            <Circle
              cx={x(index)}
              cy={y(value)}
              r={highlightedIndex === index ? 12 : 8}
              fill="url(#pointGradient)"
              filter="url(#glow)"
              opacity={highlightedIndex === index ? 1 : 0.9}
            />
            {highlightedIndex === index && (
              <Circle
                cx={x(index)}
                cy={y(value)}
                r={20}
                fill="transparent"
                stroke="#4CAF50"
                strokeWidth={2}
                strokeOpacity={0.5}
              />
            )}
          </G>
        ))}
      </G>
    );

    return (
      <Animated.View
        style={[
          styles.premiumCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <MaterialCommunityIcons name="chart-line" size={28} color="#4CAF50" />
            <View style={styles.chartTitleText}>
              <Text style={styles.sectionTitle}>Performance Analytics</Text>
              <Text style={styles.sectionSubtitle}>Asset value growth over time</Text>
            </View>
          </View>
          <View style={styles.metricSelector}>
            <TouchableOpacity
              style={[
                styles.metricButton,
                currentMetric === 'value' && styles.activeMetricButton,
              ]}
              onPress={() => setCurrentMetric('value')}
            >
              <Text style={[
                styles.metricButtonText,
                currentMetric === 'value' && styles.activeMetricButtonText,
              ]}>Value</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.metricButton,
                currentMetric === 'roi' && styles.activeMetricButton,
              ]}
              onPress={() => setCurrentMetric('roi')}
            >
              <Text style={[
                styles.metricButtonText,
                currentMetric === 'roi' && styles.activeMetricButtonText,
              ]}>ROI</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartWrapper}>
            <YAxis
              data={data}
              contentInset={contentInset}
              svg={{ 
                fontSize: 12, 
                fill: '#8E8E93',
                fontWeight: '600' 
              }}
              numberOfTicks={5}
              formatLabel={value => `$${(value / 1000).toFixed(0)}K`}
              style={{ width: 60 }}
            />
            <View style={styles.chartContent}>
              <Defs>
                <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
                  <Stop offset="50%" stopColor="#2196F3" stopOpacity="0.9" />
                  <Stop offset="100%" stopColor="#9C27B0" stopOpacity="0.8" />
                </LinearGradient>
                <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
                  <Stop offset="100%" stopColor="#2196F3" stopOpacity="0.1" />
                </LinearGradient>
              </Defs>
              <AreaChart
                style={{ flex: 1, height: chartHeight }}
                data={data}
                contentInset={contentInset}
                curve={shape.curveMonotoneX}
                svg={{
                  fill: 'url(#areaGradient)',
                }}
              >
                <Grid direction={Grid.Direction.HORIZONTAL} svg={{ stroke: '#E0E0E0', strokeDasharray: [4, 4] }} />
              </AreaChart>
              <LineChart
                style={StyleSheet.absoluteFill}
                data={data}
                contentInset={contentInset}
                curve={shape.curveMonotoneX}
                svg={{
                  stroke: 'url(#chartGradient)',
                  strokeWidth: 4,
                  strokeLinejoin: 'round',
                  strokeLinecap: 'round',
                  filter: 'url(#glow)'
                }}
              >
                <Decorator x={d => d} y={d => d} data={data} />
              </LineChart>
            </View>
            <XAxis
              style={{ marginHorizontal: -10, height: 30 }}
              data={data}
              formatLabel={(value, index) => years[index]}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fontSize: 12, fill: '#8E8E93', fontWeight: '600' }}
            />
          </View>
        </View>
      </Animated.View>
    );
  }

  // Team Section
  const renderTeamSection = () => (
    <Animated.View style={[styles.premiumCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="account-group" size={28} color="#2196F3" />
        <Text style={styles.sectionTitle}>Team</Text>
      </View>
      <View style={styles.teamList}>
        {tokenData.team.map((member, idx) => (
          <View key={idx} style={styles.teamMember}>
            <Image source={{ uri: member.image }} style={styles.teamAvatar} />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{member.role}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  // Legal Docs Section
  const renderLegalDocsSection = () => (
    <Animated.View style={[styles.premiumCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="file-document" size={28} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Legal Documents</Text>
      </View>
      <View style={styles.legalDocsList}>
        {tokenData.legalDocs.map((doc, idx) => (
          <TouchableOpacity key={idx} style={styles.legalDocItem}>
            <MaterialCommunityIcons name="file-pdf-box" size={28} color="#E53935" />
            <View style={styles.legalDocInfo}>
              <Text style={styles.legalDocName}>{doc.name}</Text>
              <Text style={styles.legalDocMeta}>{doc.type} • {doc.size}</Text>
            </View>
            <Feather name="download" size={22} color="#2196F3" />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // FAQ Section
  const [faqOpen, setFaqOpen] = useState(null);
  const faqs = [
    { q: 'What is tokenization?', a: 'Tokenization is the process of converting ownership of a real-world asset into digital tokens on a blockchain.' },
    { q: 'How do I invest?', a: 'Connect your wallet and use the Invest Now button to purchase tokens.' },
    { q: 'Is my investment secure?', a: 'All smart contracts are audited and insured. See the Security section for details.' },
    { q: 'Can I sell my tokens?', a: 'Yes, tokens can be traded on supported exchanges or within the app.' },
  ];
  const renderFAQSection = () => (
    <Animated.View style={[styles.premiumCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
      <View style={styles.sectionHeader}>
        <Feather name="help-circle" size={28} color="#9C27B0" />
        <Text style={styles.sectionTitle}>FAQ</Text>
      </View>
      <View style={styles.faqList}>
        {faqs.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.faqItem} onPress={() => setFaqOpen(faqOpen === idx ? null : idx)}>
            <View style={styles.faqQRow}>
              <Text style={styles.faqQ}>{item.q}</Text>
              <Feather name={faqOpen === idx ? 'chevron-up' : 'chevron-down'} size={20} color="#2196F3" />
            </View>
            {faqOpen === idx && <Text style={styles.faqA}>{item.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // Recent Activity Section
  const renderRecentActivitySection = () => (
    <Animated.View style={[styles.premiumCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="history" size={28} color="#FF9800" />
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>
      <View style={styles.activityList}>
        {tokenData.news.map((item, idx) => (
          <View key={idx} style={styles.activityItem}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityMeta}>{item.date} • {item.source}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  // Main Render
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8FB" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {renderPremiumImageSlider()}
        {renderPremiumOverview()}
        {renderPremiumBlockchain()}
        {renderAdvancedChart()}
        {renderTeamSection()}
        {renderLegalDocsSection()}
        {renderFAQSection()}
        {renderRecentActivitySection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  premiumCard: {
    flex:3,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 18,
    marginVertical: 12,
    padding: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  premiumImageContainer: {
    height: 260,
    marginBottom: 8,
    position: 'relative',
  },
  premiumAssetImage: {
    width: width,
    height: 260,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 0,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,40,80,0.18)',
    borderRadius: 0,
    justifyContent: 'flex-end',
  },
  imageContent: {
    padding: 24,
  },
  imageLabel: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  imageLabelText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  premiumHeaderOverlay: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    zIndex: 10,
  },
  premiumHeaderButton: {
    backgroundColor: 'rgba(44,62,80,0.32)',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  headerButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIndicators: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  premiumIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
    marginHorizontal: 4,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  badgeText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    color: '#2196F3',
    fontWeight: '700',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricIcon: {
    backgroundColor: '#F6F8FB',
    borderRadius: 16,
    padding: 8,
    marginBottom: 4,
  },
  metricContent: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 10,
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressTitle: {
    fontSize: 15,
    color: '#222',
    fontWeight: '700',
  },
  progressPercentage: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '700',
  },
  progressBarContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#E3EAF2',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 6,
  },
  progressGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(74,144,226,0.08)',
    borderRadius: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  yieldSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    marginLeft: 6,
  },
  yieldGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  yieldCard: {
    flex: 1,
    backgroundColor: '#F6F8FB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  yieldIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginBottom: 4,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  yieldInfo: {
    alignItems: 'center',
  },
  yieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  yieldLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  // Blockchain, Team, Legal, FAQ, Activity, Chart, etc. styles go here
  blockchainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  blockchainCard: {
    width: '48%',
    backgroundColor: '#F6F8FB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockchainIcon: {
    marginRight: 10,
  },
  blockchainInfo: {
    flex: 1,
  },
  blockchainLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  blockchainValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
  },
  contractSection: {
    marginTop: 10,
    marginBottom: 8,
  },
  contractLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    marginBottom: 2,
  },
  contractContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    borderRadius: 10,
    padding: 8,
  },
  contractAddress: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '700',
    flex: 1,
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartTitleText: {
    marginLeft: 8,
  },
  metricSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  metricButton: {
    backgroundColor: '#F6F8FB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  activeMetricButton: {
    backgroundColor: '#4A90E2',
  },
  metricButtonText: {
    color: '#4A90E2',
    fontWeight: '700',
    fontSize: 13,
  },
  activeMetricButtonText: {
    color: '#fff',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
  },
  chartContent: {
    flex: 1,
    marginLeft: 8,
  },
  teamList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  teamMember: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  teamInfo: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  teamRole: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  legalDocsList: {
    marginTop: 8,
  },
  legalDocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  legalDocInfo: {
    flex: 1,
    marginLeft: 10,
  },
  legalDocName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  legalDocMeta: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  faqList: {
    marginTop: 8,
  },
  faqItem: {
    backgroundColor: '#F6F8FB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  faqQRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    flex: 1,
  },
  faqA: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
    marginTop: 6,
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    backgroundColor: '#F6F8FB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  activityMeta: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  },
});

export default TokenizationSingleView;
