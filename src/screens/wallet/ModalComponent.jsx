import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const ModalComponent = ({
  activeModal,
  closeModal,
  modalAnim,
  height,
  styles,
  amount,
  setAmount,
  walletAddress,
  setWalletAddress,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  handleTransaction,
  isProcessing,
  rotateAnim,
}) => {
  const [scanAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (activeModal === 'receive') {
      // Start scanning animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [activeModal, scanAnim]);

  if (!activeModal) return null;

  const modalConfig = {
    receive: {
      title: 'Receive Funds',
      subtitle: 'Share your wallet address or QR code',
      color: '#FF6B9D',
      gradient: ['#FF6B9D', '#FF8E8E'],
      icon: '↓',
      accentColor: '#FF6B9D',
    },
    withdraw: {
      title: 'Withdraw Funds',
      subtitle: 'Send funds to external wallet',
      color: '#95A5A6',
      gradient: ['#95A5A6', '#BDC3C7'],
      icon: '−',
      accentColor: '#95A5A6',
    },
    deposit: {
      title: 'Deposit Funds',
      subtitle: 'Add funds to your wallet',
      color: '#4FACFE',
      gradient: ['#4FACFE', '#00F2FE'],
      icon: '+',
      accentColor: '#4FACFE',
    },
  };

  const config = modalConfig[activeModal];

  const scanTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleAmountChange = (text) => {
    // Only allow numbers and decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    setAmount(cleaned);
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount);
    // Add haptic feedback here if available
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    // Add haptic feedback here if available
  };

  const handleQRCodeToggle = () => {
    setShowQRCode(!showQRCode);
  };

  const calculateFee = () => {
    if (!amount || parseFloat(amount) <= 0) return 0;
    return activeModal === 'deposit' ? 0 : 0.50;
  };

  const calculateTotal = () => {
    if (!amount || parseFloat(amount) <= 0) return 0;
    return parseFloat(amount) + calculateFee();
  };

  const getStatusColor = () => {
    if (!amount || parseFloat(amount) <= 0) return '#BDC3C7';
    return config.accentColor;
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="none"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Enhanced Modal Header */}
              <View style={styles.modalHeader}>
                <LinearGradient
                  colors={config.gradient}
                  style={styles.modalIconContainer}
                >
                  <Text style={styles.modalIcon}>{config.icon}</Text>
                </LinearGradient>
                <Text style={styles.modalTitle}>{config.title}</Text>
                <Text style={styles.modalSubtitle}>{config.subtitle}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Enhanced Amount Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Amount</Text>
                <View style={[styles.amountInputContainer, { borderColor: getStatusColor() }]}>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={handleAmountChange}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor="#BDC3C7"
                  />
                  <Text style={styles.currencyText}>EUR</Text>
                </View>
                {/* Progress bar for amount validation */}
                <Animated.View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: progressWidth,
                      backgroundColor: getStatusColor()
                    }
                  ]} 
                />
              </View>

              {/* Enhanced Quick Amount Buttons */}
              <View style={styles.quickAmountSection}>
                <Text style={styles.sectionTitle}>Quick Amount</Text>
                <View style={styles.quickAmountButtons}>
                  {['50', '100', '250', '500'].map((quickAmount) => (
                    <TouchableOpacity
                      key={quickAmount}
                      style={[
                        styles.quickAmountButton,
                        amount === quickAmount && { 
                          backgroundColor: config.color,
                          transform: [{ scale: 1.05 }]
                        }
                      ]}
                      onPress={() => handleQuickAmount(quickAmount)}
                    >
                      <Text style={[
                        styles.quickAmountText,
                        amount === quickAmount && { color: 'white' }
                      ]}>
                        {quickAmount}€
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Enhanced Address Input for Receive/Withdraw */}
              {(activeModal === 'receive' || activeModal === 'withdraw') && (
                <View style={styles.inputSection}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.inputLabel}>
                      {activeModal === 'receive' ? 'From Address' : 'To Address'}
                    </Text>
                    {activeModal === 'receive' && (
                      <TouchableOpacity onPress={handleQRCodeToggle} style={styles.qrButton}>
                        <Text style={styles.qrButtonText}>QR</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TextInput
                    style={[styles.addressInput, { borderColor: getStatusColor() }]}
                    value={walletAddress}
                    onChangeText={setWalletAddress}
                    placeholder="0x..."
                    placeholderTextColor="#BDC3C7"
                  />
                  {activeModal === 'receive' && showQRCode && (
                    <View style={styles.qrCodeContainer}>
                      <View style={styles.qrCode}>
                        <Text style={styles.qrCodeText}>QR Code</Text>
                        <Text style={styles.qrCodeAddress}>0x25...0369</Text>
                      </View>
                      <Animated.View 
                        style={[
                          styles.scanLine,
                          { transform: [{ translateY: scanTranslate }] }
                        ]} 
                      />
                    </View>
                  )}
                </View>
              )}

              {/* Enhanced Payment Method for Deposit */}
              {activeModal === 'deposit' && (
                <View style={styles.paymentSection}>
                  <Text style={styles.sectionTitle}>Payment Method</Text>
                  <View style={styles.paymentMethods}>
                    {[
                      { id: 'card', label: 'Credit Card', icon: '💳', fee: '0%' },
                      { id: 'bank', label: 'Bank Transfer', icon: '🏦', fee: '0%' },
                      { id: 'crypto', label: 'Crypto', icon: '₿', fee: '0.5%' },
                    ].map((method) => (
                      <TouchableOpacity
                        key={method.id}
                        style={[
                          styles.paymentMethod,
                          selectedPaymentMethod === method.id && styles.selectedPaymentMethod
                        ]}
                        onPress={() => handlePaymentMethodSelect(method.id)}
                      >
                        <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                        <Text style={styles.paymentMethodLabel}>{method.label}</Text>
                        <Text style={styles.paymentMethodFee}>{method.fee}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Enhanced Transaction Details */}
              <View style={[styles.transactionDetails, { borderColor: getStatusColor() }]}>
                <Text style={styles.sectionTitle}>Transaction Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>{amount || '0.00'} EUR</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fee</Text>
                  <Text style={styles.detailValue}>
                    {activeModal === 'deposit' ? 'Free' : `${calculateFee().toFixed(2)} EUR`}
                  </Text>
                </View>
                <View style={[styles.detailRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={[styles.totalValue, { color: getStatusColor() }]}>
                    {calculateTotal().toFixed(2)} EUR
                  </Text>
                </View>
              </View>

              {/* Enhanced Action Button */}
              <TouchableOpacity
                style={[
                  styles.actionButtonModal, 
                  { 
                    backgroundColor: getStatusColor(),
                    opacity: (!amount || parseFloat(amount) <= 0) ? 0.5 : 1
                  }
                ]}
                onPress={handleTransaction}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              >
                <LinearGradient
                  colors={config.gradient}
                  style={styles.actionButtonGradient}
                >
                  {isProcessing ? (
                    <View style={styles.processingContainer}>
                      <Animated.View
                        style={[
                          styles.processingSpinner,
                          {
                            transform: [
                              {
                                rotate: rotateAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['0deg', '360deg'],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <Text style={styles.processingIcon}>⟳</Text>
                      </Animated.View>
                      <Text style={styles.processingText}>Processing...</Text>
                    </View>
                  ) : (
                    <Text style={styles.actionButtonText}>
                      {config.title}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
