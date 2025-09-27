// src/screens/WithdrawScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { useWallet } from "../Context/WalletContext";
import { useTheme } from "../../Theme/ThemeContext"; // ✅ ADDED

const WithdrawScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // ✅ ADDED
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [showCurrencyList, setShowCurrencyList] = useState(false);
  const [kycVerified] = useState(true); // Simulate KYC status

  const { withdraw } = useWallet();

  // Supported currencies (global)
  const currencies = [
    { code: "INR", symbol: "₹" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "USDT", symbol: "₮" },
  ];

  // Withdrawal methods (international)
  const methods = [
    {
      id: "upi",
      label: "UPI (India)",
      icon: "qr-code-scanner",
      supported: ["INR"],
      fee: "Free",
      time: "1–5 mins",
    },
    {
      id: "netBanking",
      label: "Net Banking",
      icon: "account-balance",
      supported: ["INR"],
      fee: "Free",
      time: "2–24 hrs",
    },
    {
      id: "swift",
      label: "SWIFT Transfer",
      icon: "swap-calls",
      supported: ["USD", "EUR"],
      fee: "$25",
      time: "2–5 business days",
    },
    {
      id: "sepa",
      label: "SEPA Transfer",
      icon: "euro",
      supported: ["EUR"],
      fee: "€1.50",
      time: "1–3 business days",
    },
    {
      id: "crypto",
      label: "Withdraw USDT",
      icon: "logo-usd",
      supported: ["USDT"],
      fee: "0.5%",
      time: "3–10 mins",
    },
  ];

  const selectedCurrencyObj = currencies.find(c => c.code === selectedCurrency);
  const filteredMethods = methods.filter(m => m.supported.includes(selectedCurrency));

  // Withdrawal limits
  const limits = {
    INR: { min: 100, max: 50000 },
    USD: { min: 10, max: 10000 },
    EUR: { min: 10, max: 8000 },
    USDT: { min: 10, max: 10000 },
  };

  const currentLimit = limits[selectedCurrency] || limits.INR;

  const totalWithFee = () => {
    const amt = parseFloat(amount) || 0;
    if (!amt) return "0.00";
    const method = methods.find(m => m.id === selectedMethod);
    if (!method) return amt.toFixed(2);

    if (method.fee === "Free") return amt.toFixed(2);
    if (method.fee.includes("%")) {
      const feePercent = parseFloat(method.fee) / 100;
      return (amt * (1 + feePercent)).toFixed(2);
    }
    const flatFee = parseFloat(method.fee.replace(/[^0-9.]/g, ""));
    return (amt + flatFee).toFixed(2);
  };

  const handleWithdraw = () => {
    if (!kycVerified) {
      Alert.alert("KYC Required", "Complete KYC to withdraw funds.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || isNaN(numAmount)) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (numAmount < currentLimit.min) {
      Alert.alert("Minimum Required", `Minimum withdrawal is ${selectedCurrency} ${currentLimit.min}`);
      return;
    }

    if (numAmount > currentLimit.max) {
      Alert.alert("Limit Exceeded", `Maximum withdrawal is ${selectedCurrency} ${currentLimit.max.toLocaleString()}`);
      return;
    }

    if (!selectedMethod) {
      Alert.alert("Select Method", "Please choose a withdrawal method.");
      return;
    }

    // ✅ Connect to Wallet Context
    const success = withdraw(numAmount);
    if (!success) {
      Alert.alert("Insufficient Balance", "You don’t have enough funds.");
      return;
    }

    Alert.alert(
      "Withdrawal Initiated",
      `You're withdrawing ${selectedCurrencyObj.symbol}${numAmount} via ${methods.find(m => m.id === selectedMethod).label}.`
    );
    navigation.goBack();
  };

  const renderMethodIcon = (iconName) => {
    const iconColor = isDarkMode ? "#017148" : "#02af6a";
    switch (iconName) {
      case "qr-code-scanner": return <MaterialIcons name="qr-code-scanner" size={20} color={iconColor} />;
      case "account-balance": return <MaterialIcons name="account-balance" size={20} color={iconColor} />;
      case "swap-calls": return <MaterialIcons name="swap-calls" size={20} color={iconColor} />;
      case "euro": return <MaterialIcons name="euro" size={20} color={iconColor} />;
      case "logo-usd": return <Ionicons name="logo-usd" size={20} color={iconColor} />;
      default: return <Feather name="help-circle" size={20} color={iconColor} />;
    }
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#001A13", "#003B28", "#017148"]
          : ["#FFFFFF", "#F5F5F5", "#FFFFFF"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Overlay — ONLY in Dark Mode */}
      {isDarkMode && (
        <LinearGradient
          colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFill}
        />
      )}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFF" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: isDarkMode ? "#FFF" : "#000" }]}>Withdraw Funds</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Intro */}
        <Text style={[styles.introText, { color: isDarkMode ? "rgba(255,255,255,0.8)" : "#666" }]}>
          Transfer funds from your wallet to your bank or crypto account securely.
        </Text>

        {/* Amount + Currency Selector */}
        <View style={styles.amountSection}>
          <Text style={[styles.amountLabel, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>Enter amount to withdraw</Text>
          <View style={styles.amountRow}>
            {/* Amount Input */}
            <View
              style={[
                styles.amountInputContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F5F5F5",
                },
              ]}
            >
              <TextInput
                style={[styles.amountInput, { color: isDarkMode ? "#FFF" : "#000" }]}
                placeholder="0.00"
                placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.5)" : "#999"}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Currency Dropdown */}
            <TouchableOpacity
              style={[
                styles.currencyDropdown,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F5F5F5",
                },
              ]}
              onPress={() => setShowCurrencyList(!showCurrencyList)}
            >
              <Text style={[styles.currencyCode, { color: isDarkMode ? "#FFF" : "#000" }]}>{selectedCurrency}</Text>
              <Ionicons
                name={showCurrencyList ? "chevron-up" : "chevron-down"}
                size={20}
                color={isDarkMode ? "#AAA" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {/* Currency List */}
          {showCurrencyList && (
            <ScrollView
              style={[
                styles.currencyList,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#FAFAFA",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "#E0E0E0",
                },
              ]}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyItem,
                    {
                      borderBottomColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "#E0E0E0",
                    },
                    selectedCurrency === curr.code && {
                      backgroundColor: isDarkMode
                        ? "rgba(168, 230, 161, 0.2)"
                        : "rgba(2, 175, 106, 0.1)",
                    },
                  ]}
                  onPress={() => {
                    setSelectedCurrency(curr.code);
                    setShowCurrencyList(false);
                  }}
                >
                  <Text style={[styles.currencyCode, { color: isDarkMode ? "#FFF" : "#000" }]}>{curr.code}</Text>
                  <Text style={[styles.currencySymbol, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>{curr.symbol}</Text>
                  {selectedCurrency === curr.code && (
                    <Ionicons name="checkmark" size={16} color={isDarkMode ? "#017148" : "#02af6a"} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          {[500, 1000, 5000, 10000].map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.quickAmount,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F0F0F0",
                },
              ]}
              onPress={() => setAmount(val.toString())}
            >
              <Text style={[styles.quickAmountText, { color: isDarkMode ? "#FFF" : "#000" }]}>
                {selectedCurrencyObj.symbol}{val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Withdrawal Methods */}
        <View style={styles.methodSection}>
          <Text style={[styles.methodTitle, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>Choose Withdrawal Method</Text>
          {filteredMethods.length > 0 ? (
            filteredMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "#FAFAFA",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "#E0E0E0",
                  },
                  selectedMethod === method.id && {
                    borderColor: isDarkMode ? "#017148" : "#02af6a",
                    backgroundColor: isDarkMode
                      ? "rgba(168, 230, 161, 0.1)"
                      : "rgba(2, 175, 106, 0.08)",
                  },
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodContent}>
                  <View
                    style={[
                      styles.methodIcon,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(1, 113, 72, 0.2)"
                          : "rgba(2, 175, 106, 0.1)",
                      },
                    ]}
                  >
                    {renderMethodIcon(method.icon)}
                  </View>
                  <Text style={[styles.methodName, { color: isDarkMode ? "#FFF" : "#000" }]}>{method.label}</Text>
                </View>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodFee, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>{method.fee}</Text>
                  <Text style={[styles.methodTime, { color: isDarkMode ? "rgba(255,255,255,0.6)" : "#999" }]}>{method.time}</Text>
                </View>
                <Ionicons
                  name={selectedMethod === method.id ? "checkmark-circle" : "chevron-forward"}
                  size={20}
                  color={selectedMethod === method.id ? (isDarkMode ? "#017148" : "#02af6a") : (isDarkMode ? "#AAA" : "#999")}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.noMethodText, { color: isDarkMode ? "rgba(255,255,255,0.6)" : "#999" }]}>
              No method available for {selectedCurrency}
            </Text>
          )}
        </View>

        {/* Withdrawal Limits */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "#FAFAFA",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "#E0E0E0",
            },
          ]}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>Min Withdrawal</Text>
            <Text style={[styles.infoValue, { color: isDarkMode ? "#FFF" : "#000" }]}>{selectedCurrencyObj.symbol}{currentLimit.min}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E0E0E0" }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>Max Withdrawal</Text>
            <Text style={[styles.infoValue, { color: isDarkMode ? "#FFF" : "#000" }]}>{selectedCurrencyObj.symbol}{currentLimit.max.toLocaleString()}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E0E0E0" }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>Processing Time</Text>
            <Text style={[styles.infoValue, { color: isDarkMode ? "#FFF" : "#000" }]}>
              {filteredMethods.length > 0 ? methods.find(m => m.id === selectedMethod)?.time : "N/A"}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E0E0E0" }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>Fee</Text>
            <Text style={[styles.infoValue, { color: isDarkMode ? "#FFF" : "#000" }]}>
              {filteredMethods.length > 0 ? methods.find(m => m.id === selectedMethod)?.fee : "N/A"}
            </Text>
          </View>
        </View>

        {/* Total Amount */}
        <View
          style={[
            styles.totalSection,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "#FAFAFA",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "#E0E0E0",
            },
          ]}
        >
          <Text style={[styles.totalLabel, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>Total to Receive</Text>
          <Text style={[styles.totalValue, { color: isDarkMode ? "#017148" : "#02af6a" }]}>
            {selectedCurrencyObj.symbol}{totalWithFee()}
          </Text>
          <Text style={[styles.totalNote, { color: isDarkMode ? "rgba(255,255,255,0.6)" : "#999" }]}>
            After fees. May vary slightly based on network.
          </Text>
        </View>

        {/* Security Notice */}
        <View
          style={[
            styles.securityBox,
            {
              backgroundColor: isDarkMode
                ? "rgba(168, 230, 161, 0.1)"
                : "rgba(2, 175, 106, 0.08)",
            },
          ]}
        >
          <MaterialIcons name="lock" size={18} color={isDarkMode ? "#017148" : "#02af6a"} />
          <Text style={[styles.securityText, { color: isDarkMode ? "rgba(255,255,255,0.8)" : "#666" }]}>
            Your funds are secure. Withdrawals are irreversible. Double-check details.
          </Text>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            { backgroundColor: isDarkMode ? "#017148" : "#02af6a" },
          ]}
          onPress={handleWithdraw}
        >
          <Text style={styles.withdrawButtonText}>Withdraw Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default WithdrawScreen;

// ✅ styles untouched (same as your code) — but now used with isDarkMode conditionals
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  introText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  amountSection: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  amountInputContainer: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: "center",
  },
  amountInput: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
  },
  currencyDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    minWidth: 90,
    justifyContent: "center",
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "600",
  },
  currencySymbol: {
    fontSize: 14,
    marginLeft: 8,
  },
  currencyList: {
    maxHeight: 180,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  quickAmounts: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  quickAmount: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickAmountText: {
    fontSize: 12,
    fontWeight: "500",
  },
  methodSection: {
    marginBottom: 20,
  },
  methodTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  methodCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  methodContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  methodIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  methodName: {
    fontSize: 14,
    fontWeight: "600",
  },
  methodInfo: {
    marginRight: 8,
    alignItems: "flex-end",
  },
  methodFee: {
    fontSize: 12,
  },
  methodTime: {
    fontSize: 12,
  },
  noMethodText: {
    fontSize: 14,
    textAlign: "center",
    padding: 16,
  },
  infoCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  totalSection: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  totalLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  totalNote: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  securityBox: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  securityText: {
    fontSize: 13,
    marginLeft: 8,
    lineHeight: 18,
  },
  withdrawButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});