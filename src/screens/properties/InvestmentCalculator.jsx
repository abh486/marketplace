import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 100;
const KNOB_SIZE = 40;
const minAmount = 500;
const maxAmount = 10000;
const maxTranslation = SLIDER_WIDTH - KNOB_SIZE;

const getKnobPosition = (amount) => {
  const percentage = (amount - minAmount) / (maxAmount - minAmount);
  return percentage * maxTranslation;
};

const InvestmentCalculator = () => {
  const [investmentAmount, setInvestmentAmount] = useState(2000);
  const [knobPosition, setKnobPosition] = useState(getKnobPosition(2000));
  const translateX = useRef(new Animated.Value(0)).current;

  // Real-time update as knob moves
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        let dragX = event.nativeEvent.translationX + getKnobPosition(investmentAmount);
        let clampedX = Math.max(0, Math.min(maxTranslation, dragX));
        setKnobPosition(clampedX);

        // Calculate percentage and new amount
        const percentage = clampedX / maxTranslation;
        const newAmount = Math.round(minAmount + (percentage * (maxAmount - minAmount)));
        setInvestmentAmount(newAmount);
      }
    }
  );

  // Snap knob and reset translation on end
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      translateX.setValue(0);
      setKnobPosition(getKnobPosition(investmentAmount));
    }
  };

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Calculate your return of{'\n'}investment expected in 5 years
        </Text>

        <View style={styles.amountSection}>
          <Text style={styles.label}>Amount to invest</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currency}>AED</Text>
            <Text style={styles.amount}>{investmentAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Custom Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack} />
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.sliderKnob,
                {
                  left: knobPosition,
                },
              ]}
            />
          </PanGestureHandler>
        </View>

        <View style={styles.costsSection}>
          <View style={styles.costsRow}>
            <Text style={styles.costsLabel}>Total costs</Text>
            <Text style={styles.costsAmount}>AED {investmentAmount.toLocaleString()}</Text>
          </View>
          <Text style={styles.costsDescription}>
            Includes purchase and transaction{'\n'}costs.
          </Text>
          <Text style={styles.viewBreakdown}>View breakdown</Text>
        </View>

        <View style={styles.returnSection}>
          <Text style={styles.returnText}>
            You'll receive an approximate total net return of
          </Text>
          <Text style={styles.returnAmount}>AED {investmentAmount.toLocaleString()}</Text>
          <Text style={styles.returnDescription}>
            Includes rental dividends and capital appreciation.
          </Text>
          <Text style={styles.learnMore}>Learn more</Text>
        </View>

        <View style={styles.warningSection}>
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>Risk warning:</Text> The information provided does not constitute
            financial or investment advice. Investing in real estate
            involves risks, and you may not receive the anticipated
            returns. Please seek independent advice and review the{' '}
            <Text style={styles.link}>Terms and Conditions</Text> before making any investment
            decision.
          </Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    lineHeight: 38,
  },
  amountSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignSelf: 'flex-end',
    minWidth: 120,
    justifyContent: 'center',
  },
  currency: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  sliderContainer: {
    height: KNOB_SIZE,
    marginBottom: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    width: SLIDER_WIDTH,
  },
  sliderKnob: {
    position: 'absolute',
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  costsSection: {
    marginBottom: 40,
  },
  costsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costsLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  costsAmount: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  costsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  viewBreakdown: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  returnSection: {
    marginBottom: 40,
  },
  returnText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  returnAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  returnDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  learnMore: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  warningSection: {
    flex: 1,
  },
  warningText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  warningBold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default InvestmentCalculator;
