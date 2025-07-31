import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Path } from 'react-native-svg';
import ModalComponent from './ModalComponent';
import SuccessModal from './SuccessModal';
import BottomNav from '../properties/BottomNav';



const { height, width } = Dimensions.get('window');

const WalletInterface = () => {
  const [selectedTab, setSelectedTab] = useState('M');
  const [walletBalance, setWalletBalance] = useState(1000);
  const [displayBalance, setDisplayBalance] = useState(1000);
  const [totalYield] = useState(0);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isAmountVisible, setIsAmountVisible] = useState(true);

  const [selectedView, setSelectedView] = useState('overview'); // overview only

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Success Modal state
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const actionAnim1 = useRef(new Animated.Value(0)).current;
  const actionAnim2 = useRef(new Animated.Value(0)).current;
  const actionAnim3 = useRef(new Animated.Value(0)).current;

  // Mock transaction history
  const [transactions] = useState([
    {
      id: '1',
      type: 'deposit',
      amount: 500,
      date: '2024-01-15',
      status: 'completed',
      description: 'Bank Transfer',
      icon: '🏦'
    },
    {
      id: '2',
      type: 'withdraw',
      amount: 200,
      date: '2024-01-14',
      status: 'completed',
      description: 'To External Wallet',
      icon: '📤'
    },
    {
      id: '3',
      type: 'receive',
      amount: 150,
      date: '2024-01-13',
      status: 'completed',
      description: 'From User123',
      icon: '📥'
    },
    {
      id: '4',
      type: 'deposit',
      amount: 300,
      date: '2024-01-12',
      status: 'pending',
      description: 'Credit Card',
      icon: '💳'
    }
  ]);



  useEffect(() => {
    // Much faster countdown animation from 1000 to 0
    const countdown = setInterval(() => {
      setDisplayBalance(prev => {
        if (prev <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 20; // Increased from 10 to 50 for 5x speed
      });
    }, 10); // Decreased from 50ms to 10ms for 5x speed

    startAnimations();

    return () => clearInterval(countdown);
  }, [startAnimations]);

  const startAnimations = useCallback(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Slide animation for view transitions
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Action button animations with staggered timing
    Animated.stagger(200, [
      Animated.timing(actionAnim1, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(actionAnim2, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(actionAnim3, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();


  }, [pulseAnim, rotateAnim, slideAnim, actionAnim1, actionAnim2, actionAnim3]);

  const handleTabPress = (tab) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedTab(tab);
  };

  const toggleAmountVisibility = () => {
    setIsAmountVisible(!isAmountVisible);
  };



  const openModal = (modalType) => {
    setActiveModal(modalType);
    setAmount('');
    setWalletAddress('');
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveModal(null);
      setIsProcessing(false);
    });
  };

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (activeModal === 'withdraw' && parseFloat(amount) > walletBalance) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough balance');
      return;
    }

    if ((activeModal === 'withdraw' || activeModal === 'receive') && !walletAddress) {
      Alert.alert('Invalid Address', 'Please enter a valid wallet address');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const amountValue = parseFloat(amount);

      if (activeModal === 'deposit') {
        setWalletBalance(prev => prev + amountValue);
        setDisplayBalance(prev => prev + amountValue);
        setSuccessMessage(`Successfully deposited ${amountValue} EUR`);
        setSuccessModalVisible(true);
      } else if (activeModal === 'withdraw') {
        setWalletBalance(prev => prev - amountValue);
        setDisplayBalance(prev => prev - amountValue);
        setSuccessMessage(`Successfully withdrew ${amountValue} EUR`);
        setSuccessModalVisible(true);
      } else if (activeModal === 'receive') {
        setSuccessMessage(`Receive request sent for ${amountValue} EUR`);
        setSuccessModalVisible(true);
      }

      closeModal();
    }, 2000);
  };

  const CircularProgress = () => (
    <Svg width={280} height={280} style={styles.progressSvg}>
      <Defs>
        <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FF6B9D" />
          <Stop offset="50%" stopColor="#4FACFE" />
          <Stop offset="100%" stopColor="#9B59B6" />
        </SvgLinearGradient>
      </Defs>
      <Circle
        cx={140}
        cy={140}
        r={130}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={8}
        fill="none"
      />
      <Circle
        cx={140}
        cy={140}
        r={130}
        stroke="url(#gradient)"
        strokeWidth={8}
        fill="none"
        strokeDasharray="817"
        strokeDashoffset="204"
        strokeLinecap="round"
        transform="rotate(-225 140 140)"
      />
    </Svg>
  );

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const slideTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  // Action button animations
  const action1Translate = actionAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const action2Translate = actionAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const action3Translate = actionAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });



  const renderTransactionItem = ({ item }) => (
    <Animated.View style={[styles.transactionItem, { transform: [{ translateX: slideTranslate }] }]}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionIconText}>{item.icon}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.transactionAmountText,
          { color: item.type === 'withdraw' ? '#E74C3C' : '#27AE60' }
        ]}>
          {item.type === 'withdraw' ? '-' : '+'}{item.amount} EUR
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'completed' ? '#27AE60' : '#F39C12' }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </Animated.View>
  );





  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#FFE5E5', '#E5F3FF', '#F0E5FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => {
              setIsBalanceVisible(!isBalanceVisible);
              setIsAmountVisible(!isAmountVisible);
            }}
          >
                        <View style={styles.eyeIcon}>
              <Text style={styles.eyeText}>
                {isBalanceVisible ? '👁' : '👁‍🗨'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>



        {/* Main Content */}
        <ScrollView
          style={styles.main}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Wallet Container */}
          <View style={styles.walletContainer}>
            {/* SVG Circle */}
            <View style={styles.circleWrapper}>
              <CircularProgress />
              {/* Overlayed wallet info text, centered absolutely */}
              <View style={styles.walletInfoOverlay}>
                <Text style={styles.walletTitle}>My Wallet</Text>
                <Text style={styles.walletAmount}>
                  {isBalanceVisible ? `${displayBalance} €` : '••• €'}
                </Text>
                <View style={styles.yieldRow}>
                  <Text style={styles.yieldIcon}>💎</Text>
                  <Text style={styles.yieldLabel}>Total Yield</Text>
                </View>
                <Text style={styles.yieldAmount}>
                  {isBalanceVisible ? `${totalYield} €` : '••• €'}
                </Text>
                {/* W, M, Y Tabs at the bottom of the circle */}
                <Animated.View
                  style={[styles.tabs, { transform: [{ scale: scaleAnim }] }]}
                >
                  {['W', 'M', 'Y'].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tab, selectedTab === tab && styles.activeTab]}
                      onPress={() => handleTabPress(tab)}
                    >
                      <Text style={[
                        styles.tabText,
                        selectedTab === tab && styles.activeTabText
                      ]}>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>
            </View>
          </View>



          {/* Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              {/* Premium Background Design */}
              <View style={styles.cardBgDesign}>
                <View style={styles.premiumCircle1} />
                <View style={styles.premiumCircle2} />
                <View style={styles.premiumCircle3} />
                <View style={styles.premiumDiamond} />
                <View style={styles.premiumLine1} />
                <View style={styles.premiumLine2} />
                <View style={styles.premiumDot1} />
                <View style={styles.premiumDot2} />
                <View style={styles.premiumDot3} />
              </View>
              
              {/* Premium Bitcoin Icon */}
              <View style={styles.premiumBitcoinBg}>
                <Text style={styles.premiumBitcoinIcon}>₿</Text>
              </View>
              
              {/* Premium Content */}
              <View style={styles.premiumContent}>
                <View style={styles.premiumHeader}>
                  <Text style={styles.premiumTitle}>Euros Wallet</Text>
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                  </View>
                </View>
                <Text style={styles.premiumAmount}>
                  {isAmountVisible ? '0 EUR' : '•••'}
                </Text>
                <Text style={styles.premiumSubtext}>+ 0 EUR already purchased</Text>
                <View style={styles.premiumAddress}>
                  <Text style={styles.premiumAddressText}>0x25...0369</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Animated.View style={[styles.actionButton, { 
              transform: [
                { translateY: action1Translate }
              ] 
            }]}> 
              <TouchableOpacity onPress={() => openModal('receive')}>
                <View style={[styles.actionIcon, { backgroundColor: '#FF6B9D' }]}> 
                  <Text style={styles.actionIconText}>↓</Text> 
                </View> 
                <Text style={styles.actionLabel}>Receive</Text> 
              </TouchableOpacity> 
            </Animated.View> 

            <Animated.View style={[styles.actionButton, { 
              transform: [
                { translateY: action2Translate }
              ] 
            }]}> 
              <TouchableOpacity onPress={() => openModal('withdraw')}>
                <View style={[styles.actionIcon, { backgroundColor: '#95A5A6' }]}> 
                  <Text style={styles.actionIconText}>-</Text> 
                </View> 
                <Text style={styles.actionLabel}>Withdraw</Text> 
              </TouchableOpacity> 
            </Animated.View> 

            <Animated.View style={[styles.actionButton, { 
              transform: [
                { translateY: action3Translate }
              ] 
            }]}> 
              <TouchableOpacity onPress={() => openModal('deposit')}>
                <View style={[styles.actionIcon, { backgroundColor: '#4FACFE' }]}> 
                  <Text style={styles.actionIconText}>+</Text> 
                </View> 
                <Text style={styles.actionLabel}>Deposit</Text> 
              </TouchableOpacity> 
            </Animated.View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsContainer}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={transactions.slice(0, 3)}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Render Modal */}
      <ModalComponent
        activeModal={activeModal}
        closeModal={closeModal}
        modalAnim={modalAnim}
        height={height}
        styles={styles}
        amount={amount}
        setAmount={setAmount}
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        handleTransaction={handleTransaction}
        isProcessing={isProcessing}
        rotateAnim={rotateAnim}
      />

      {/* Render Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        message={successMessage}
        onClose={() => setSuccessModalVisible(false)}
      />
      {/* Place BottomNav at the end, outside main content */}
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eyeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eyeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 20,
  },

  main: {
    flex: 1,
  },
  walletContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  progressSvg: {
    position: 'absolute',
  },
  walletInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletTitle: {
    fontSize: 18,
    color: '#8E8E93',
    margintop: 50,
    fontWeight: '500',
  },
  walletAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  yieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  yieldIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  yieldLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  yieldAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
    marginTop: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
    minWidth: 36,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#4FACFE',
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#fff',
  },
  indicator: {
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: -15,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(142,142,147,0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4FACFE',
    width: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    paddingHorizontal: 20,
  },





  transactionsContainer: {
    marginTop: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  viewAllText: {
    color: '#4FACFE',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
    borderRadius: 15,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4FACFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardContainer: {
    marginHorizontal: 15,
    marginBottom: 30,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    minHeight: 220,
    backgroundColor: '#255f99',
    shadowColor: '#255f99',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  bitcoinBackground: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bitcoinIcon: {
    fontSize: 50,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 'bold',
  },
  cardBgDesign: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  bgCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  bgCircle3: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bgLine1: {
    position: 'absolute',
    top: 30,
    right: 40,
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ rotate: '45deg' }],
  },
  bgLine2: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '-30deg' }],
  },
  // Premium Design Elements
  premiumCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(21,163,110,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(21,163,110,0.3)',
  },
  premiumCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  premiumCircle3: {
    position: 'absolute',
    top: 60,
    left: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(21,163,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(21,163,110,0.25)',
  },
  premiumDiamond: {
    position: 'absolute',
    top: 20,
    right: 80,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(21,163,110,0.2)',
    transform: [{ rotate: '45deg' }],
  },
  premiumLine1: {
    position: 'absolute',
    top: 40,
    right: 30,
    width: 80,
    height: 3,
    backgroundColor: 'rgba(21,163,110,0.3)',
    transform: [{ rotate: '45deg' }],
  },
  premiumLine2: {
    position: 'absolute',
    bottom: 60,
    right: 40,
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '-30deg' }],
  },
  premiumDot1: {
    position: 'absolute',
    top: 100,
    right: 120,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(21,163,110,0.6)',
  },
  premiumDot2: {
    position: 'absolute',
    top: 140,
    right: 100,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  premiumDot3: {
    position: 'absolute',
    top: 160,
    right: 140,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(21,163,110,0.5)',
  },
  premiumBitcoinBg: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(21,163,110,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(21,163,110,0.4)',
    zIndex: 1,
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  premiumBitcoinIcon: {
    fontSize: 40,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
  },
  premiumContent: {
    position: 'relative',
    zIndex: 2,
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  premiumBadge: {
    backgroundColor: 'rgba(21,163,110,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(21,163,110,0.5)',
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  premiumAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  premiumSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  premiumAddress: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  premiumAddressText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 14, // was 18
    fontWeight: '600',
    color: 'white',
    marginBottom: 10, // was 15
  },
  cardAmount: {
    fontSize: 20, // was 32
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3, // was 5
  },
  cardSubtext: {
    fontSize: 10, // was 14
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8, // was 15
  },
  address: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addressText: {
    color: 'white',
    fontSize: 8, // was 12
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 10,
    marginTop: -20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  actionIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.9,
    minHeight: height * 0.6,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  modalIcon: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#8E8E93',
  },
  inputSection: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  currencyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
    marginTop: 5,
  },
  addressInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  qrButton: {
    backgroundColor: '#4FACFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  qrCodeContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  qrCode: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  qrCodeAddress: {
    fontSize: 12,
    color: '#8E8E93',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#4FACFE',
    top: 0,
  },
  quickAmountSection: {
    marginBottom: 25,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  paymentSection: {
    marginBottom: 25,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  selectedPaymentMethod: {
    backgroundColor: '#E3F2FD',
    borderColor: '#4FACFE',
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  paymentMethodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  paymentMethodFee: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
  transactionDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4FACFE',
  },
  actionButtonModal: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
  },
  actionButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingSpinner: {
    marginRight: 10,
  },
  processingIcon: {
    fontSize: 22,
    color: 'white',
  },
  processingText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  circleWrapper: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  walletInfoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  yieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
    justifyContent: 'center',
  },
  yieldIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  yieldLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  yieldAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    padding: 3,
    marginTop: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: 140,
    justifyContent: 'center',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    minWidth: 28,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#4FACFE',
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#fff',
  },
});

export default WalletInterface;