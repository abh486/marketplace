import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from "../../Theme/ThemeContext"; // ✅ ADDED

const { width } = Dimensions.get("window");

// Mock Data
const USER_BALANCE = {
  USDt: 2450.3,
  RWA: 850.0,
  EURt: 1200.5,
};

const CURRENCIES = ["USDt", "RWA", "EURt"];

const SendScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // ✅ ADDED
  const [step, setStep] = useState(1); // 1: form, 2: confirm
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDt");
  const [note, setNote] = useState("");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [transactionFee] = useState(1.5);

  const availableBalance = USER_BALANCE[currency];
  const totalDeductible = parseFloat(amount) + transactionFee;

  const isValidAmount = () => {
    const amt = parseFloat(amount);
    return !isNaN(amt) && amt > 0 && amt <= availableBalance;
  };

  const handleNext = () => {
    if (!recipient.trim()) {
      Alert.alert("Error", "Please enter a recipient.");
      return;
    }
    if (!isValidAmount()) {
      Alert.alert("Invalid Amount", `Enter an amount up to ${availableBalance} ${currency}.`);
      return;
    }
    setStep(2); // Go to confirmation
  };

  const handleSend = () => {
    const txId = `TX${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;
    setStep(3); // Success
    setTimeout(() => {
      navigation.goBack();
    }, 2500);
  };

  const resetFlow = () => {
    setStep(1);
    setRecipient("");
    setAmount("");
    setNote("");
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#001A13", "#003B28", "#017148"]
          : ["#FFFFFF", "#F5F5F5", "#FFFFFF"]
      }
      style={styles.container}
    >
      {/* Dark overlay — ONLY in Dark Mode */}
      {isDarkMode && (
        <LinearGradient
          colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFill}
        />
      )}

      {step === 1 && (
        <ScrollView style={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFF" : "#000"} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: isDarkMode ? "#FFF" : "#000" }]}>Send</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Recipient */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDarkMode ? "#ccc" : "#666" }]}>To</Text>
            <View
              style={[
                styles.inputGroup,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F5F5F5",
                },
              ]}
            >
              <Ionicons name="person-outline" size={20} color={isDarkMode ? "#aaa" : "#999"} />
              <TextInput
                style={[styles.textInput, { color: isDarkMode ? "#FFF" : "#000" }]}
                placeholder="Username, phone, or wallet"
                placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.5)" : "#999"}
                value={recipient}
                onChangeText={setRecipient}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Amount + Currency Dropdown */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDarkMode ? "#ccc" : "#666" }]}>Amount</Text>
            <View
              style={[
                styles.amountContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F5F5F5",
                },
              ]}
            >
              <TextInput
                style={[styles.amountInput, { color: isDarkMode ? "#FFF" : "#000" }]}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={isDarkMode ? "#6B6B6B" : "#999"}
                value={amount}
                onChangeText={setAmount}
              />
              <TouchableOpacity
                style={styles.currencyButton}
                onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
              >
                <Text
                  style={[
                    styles.currencyText,
                    { color: isDarkMode ? "#FFF" : "#000" },
                  ]}
                >
                  {currency}
                </Text>
                <MaterialIcons
                  name={showCurrencyPicker ? "arrow-drop-up" : "arrow-drop-down"}
                  size={24}
                  color={isDarkMode ? "#FFF" : "#000"}
                />
              </TouchableOpacity>
            </View>

            {/* Inline Currency Picker */}
            {showCurrencyPicker && (
              <View
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(0,0,0,0.2)"
                      : "#FAFAFA",
                  },
                ]}
              >
                {CURRENCIES.map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    style={[
                      styles.dropdownItem,
                      {
                        borderBottomColor: isDarkMode
                          ? "rgba(255,255,255,0.1)"
                          : "#E0E0E0",
                      },
                    ]}
                    onPress={() => {
                      setCurrency(curr);
                      setShowCurrencyPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        { color: isDarkMode ? "#FFF" : "#000" },
                        curr === currency && {
                          fontWeight: "600",
                          color: isDarkMode ? "#FFF" : "#02af6a",
                        },
                      ]}
                    >
                      {curr}
                    </Text>
                    {curr === currency && (
                      <Ionicons name="checkmark" size={18} color={isDarkMode ? "#aaa" : "#02af6a"} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text
              style={[
                styles.balance,
                { color: isDarkMode ? "rgba(255,255,255,0.6)" : "#999" },
              ]}
            >
              Balance: {availableBalance} {currency}
            </Text>

            {parseFloat(amount) > 0 && !isValidAmount() && (
              <Text style={[styles.errorText, { color: "#FF5252" }]}>Insufficient balance</Text>
            )}
          </View>

          {/* Note */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: isDarkMode ? "#ccc" : "#666" }]}>Note (Optional)</Text>
            <View
              style={[
                styles.inputGroup,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F5F5F5",
                },
              ]}
            >
              <Ionicons name="document-outline" size={20} color={isDarkMode ? "#aaa" : "#999"} />
              <TextInput
                style={[
                  styles.textInput,
                  styles.noteInput,
                  { color: isDarkMode ? "#FFF" : "#000" },
                ]}
                placeholder="Add a note..."
                placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.5)" : "#999"}
                value={note}
                onChangeText={setNote}
                multiline
                textAlignVertical="center"
              />
            </View>
          </View>

          {/* Fee Info */}
          <View
            style={[
              styles.feeBox,
              {
                backgroundColor: isDarkMode
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(2, 175, 106, 0.05)",
              },
            ]}
          >
            <View style={styles.feeRow}>
              <Text
                style={[
                  styles.feeLabel,
                  { color: isDarkMode ? "rgba(255,255,255,0.8)" : "#666" },
                ]}
              >
                Network Fee
              </Text>
              <Text
                style={[
                  styles.feeValue,
                  { color: isDarkMode ? "#FFF" : "#000" },
                ]}
              >
                {transactionFee} {currency}
              </Text>
            </View>
            <Text
              style={[
                styles.feeHint,
                { color: isDarkMode ? "rgba(255,255,255,0.5)" : "#999" },
              ]}
            >
              Included in total
            </Text>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: isDarkMode ? "#017148" : "#02af6a" },
              !isValidAmount() && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!isValidAmount()}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Step 2: Confirmation Bottom Sheet */}
      {step === 2 && (
        <View style={styles.confirmContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={22} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.confirmTitle, { color: isDarkMode ? "#FFF" : "#000" }]}>Confirm Transaction</Text>

          <View
            style={[
              styles.confirmCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#FAFAFA",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "#E0E0E0",
              },
            ]}
          >
            <View style={styles.confirmRow}>
              <Text
                style={[
                  styles.confirmLabel,
                  { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" },
                ]}
              >
                You Send
              </Text>
              <Text
                style={[
                  styles.confirmValue,
                  { color: isDarkMode ? "#FFF" : "#000" },
                ]}
              >
                {amount} {currency}
              </Text>
            </View>
            <View style={styles.confirmRow}>
              <Text
                style={[
                  styles.confirmLabel,
                  { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" },
                ]}
              >
                Fee
              </Text>
              <Text
                style={[
                  styles.confirmValue,
                  { color: isDarkMode ? "#FFF" : "#000" },
                ]}
              >
                {transactionFee} {currency}
              </Text>
            </View>
            <View
              style={[
                styles.confirmRow,
                {
                  marginVertical: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "#E0E0E0",
                },
              ]}
            >
              <Text
                style={[
                  styles.confirmLabel,
                  { fontWeight: "700", color: isDarkMode ? "rgba(255,255,255,0.7)" : "#000" },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.confirmValue,
                  { fontWeight: "700", color: isDarkMode ? "#FFF" : "#000" },
                ]}
              >
                {totalDeductible.toFixed(2)} {currency}
              </Text>
            </View>
            <View style={styles.detail}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" },
                ]}
              >
                To
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: isDarkMode ? "#FFF" : "#000" },
                ]}
                numberOfLines={1}
              >
                {recipient}
              </Text>
            </View>
            {note ? (
              <View style={styles.detail}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" },
                  ]}
                >
                  Note
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: isDarkMode ? "#FFF" : "#000" },
                  ]}
                >
                  {note}
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: isDarkMode ? "#017148" : "#02af6a" },
            ]}
            onPress={handleSend}
          >
            <Text style={styles.primaryButtonText}>Send Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color={isDarkMode ? "#4CAF50" : "#02af6a"} />
          <Text style={[styles.successTitle, { color: isDarkMode ? "#FFF" : "#000" }]}>Sent Successfully!</Text>
          <Text style={[styles.successAmount, { color: isDarkMode ? "#A8E6A1" : "#02af6a" }]}>
            {amount} {currency}
          </Text>
          <Text
            style={[
              styles.successNote,
              { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" },
            ]}
          >
            To: {recipient.length > 18 ? `${recipient.slice(0, 10)}...` : recipient}
          </Text>

          <View
            style={[
              styles.txIdBox,
              {
                backgroundColor: isDarkMode
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(2, 175, 106, 0.05)",
              },
            ]}
          >
            <Text
              style={[
                styles.txIdLabel,
                { color: isDarkMode ? "rgba(255,255,255,0.6)" : "#666" },
              ]}
            >
              Transaction ID
            </Text>
            <Text
              style={[
                styles.txIdValue,
                { color: isDarkMode ? "#FFF" : "#000" },
              ]}
              numberOfLines={1}
            >
              TX98273451
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.doneButton,
              { backgroundColor: isDarkMode ? "#017148" : "#02af6a" },
            ]}
            onPress={resetFlow}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

export default SendScreen;

// ---------------- Styles — PRESERVED YOUR DARK THEME, ADDED LIGHT THEME ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  noteInput: {
    height: 80,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  currencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.2)",
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
  },
  balance: {
    fontSize: 13,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
  },
  feeBox: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feeLabel: {
    fontSize: 15,
  },
  feeValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  feeHint: {
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  confirmContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  confirmCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  confirmLabel: {
    fontSize: 15,
  },
  confirmValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  detail: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    marginTop: 4,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 16,
    textAlign: "center",
  },
  successAmount: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
  },
  successNote: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  txIdBox: {
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 30,
  },
  txIdLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  txIdValue: {
    fontSize: 13,
    fontFamily: "Courier New",
  },
  doneButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  doneText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});