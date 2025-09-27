import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { useWallet } from "../Context/WalletContext";
import { useTheme } from '../../Theme/ThemeContext'; // ✅ ADDED

const { width } = Dimensions.get("window");

const DepositScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme(); // ✅ GET THEME
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showCurrencyList, setShowCurrencyList] = useState(false);

  const { deposit } = useWallet();

  // ✅ Updated currencies with symbols
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "INR", symbol: "₹" },
    { code: "GBP", symbol: "£" },
    { code: "AED", symbol: "د.إ" },
    { code: "SGD", symbol: "S$" },
    { code: "USDT", symbol: "₮" },
  ];

  const methods = [
    { id: "card", label: "Credit/Debit Card", icon: "credit-card", supported: ["USD", "EUR", "INR", "GBP", "AED", "SGD"], fee: "2.9%", time: "Instant" },
    { id: "upi", label: "UPI (India)", icon: "qr-code-scanner", supported: ["INR"], fee: "Free", time: "1–5 mins" },
    { id: "netBanking", label: "Net Banking", icon: "account-balance", supported: ["INR"], fee: "Free", time: "2–24 hrs" },
    { id: "sepa", label: "SEPA Transfer (EU)", icon: "euro", supported: ["EUR"], fee: "€1.50", time: "1–3 business days" },
    { id: "swift", label: "SWIFT Transfer", icon: "swap-calls", supported: ["USD", "EUR", "GBP", "AED", "SGD"], fee: "$25", time: "2–5 business days" },
    { id: "crypto", label: "Buy with USDT", icon: "logo-usd", supported: ["USDT"], fee: "0.5%", time: "3–10 mins" },
  ];

  const selectedCurrencyObj = currencies.find(c => c.code === selectedCurrency);
  const filteredMethods = methods.filter(m => m.supported.includes(selectedCurrency));

  const totalWithFee = () => {
    const amt = parseFloat(amount) || 0;
    if (!amt) return "0.00";
    const method = methods.find(m => m.id === selectedMethod);
    if (!method) return amt.toFixed(2);

    if (method.fee === "Free") return amt.toFixed(2);
    if (method.fee.includes("%")) {
      const feePercent = parseFloat(method.fee.replace('%', '')) / 100;
      return (amt * (1 + feePercent)).toFixed(2);
    }
    const flatFee = parseFloat(method.fee.replace(/[^0-9.]/g, ""));
    return (amt + flatFee).toFixed(2);
  };

  const handleDeposit = () => {
    const amt = parseFloat(amount);

    if (!amt || amt <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    if (!selectedMethod) {
      Alert.alert("Select Method", "Please choose a payment method.");
      return;
    }

    deposit(amt);

    Alert.alert(
      "Deposit Successful",
      `You deposited ${selectedCurrencyObj.symbol}${amt} via ${methods.find(m => m.id === selectedMethod).label}.`
    );

    navigation.goBack();
  };

  const renderMethodIcon = (iconName) => {
    const iconColor = isDarkMode ? "#017148" : theme.primary;
    switch (iconName) {
      case "credit-card": return <Feather name="credit-card" size={20} color={iconColor} />;
      case "qr-code-scanner": return <MaterialIcons name="qr-code-scanner" size={20} color={iconColor} />;
      case "account-balance": return <MaterialIcons name="account-balance" size={20} color={iconColor} />;
      case "euro": return <MaterialIcons name="euro" size={20} color={iconColor} />;
      case "swap-calls": return <MaterialIcons name="swap-calls" size={20} color={iconColor} />;
      case "logo-usd": return <Ionicons name="logo-usd" size={20} color={iconColor} />;
      default: return <Feather name="help-circle" size={20} color={iconColor} />;
    }
  };

  // ✅ DYNAMIC STYLES FOR LIGHT MODE
  const lightStyles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
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
      marginBottom: 16 
    },
    title: { fontSize: 24, fontWeight: "700", color: theme.text },
    introText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 24,
    },
    amountSection: { marginBottom: 20 },
    amountLabel: { fontSize: 14, color: theme.textSecondary, marginBottom: 8 },
    amountRow: { flexDirection: "row", gap: 12, alignItems: "center" },
    amountInputContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 50,
      justifyContent: "center",
    },
    amountInput: { fontSize: 18, fontWeight: "600", color: theme.text, textAlign: "right" },
    currencyDropdown: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 50,
      minWidth: 90,
      justifyContent: "center",
    },
    currencyCode: { fontSize: 16, fontWeight: "600", color: theme.text },
    currencySymbol: { fontSize: 14, color: theme.textSecondary, marginLeft: 8 },
    currencyList: {
      maxHeight: 180,
      marginTop: 8,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: "hidden",
    },
    currencyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    selectedCurrencyItem: {
      backgroundColor: `${theme.primary}20`,
      borderColor: theme.primary,
    },
    quickAmounts: { flexDirection: "row", gap: 8, marginBottom: 20 },
    quickAmount: { 
      paddingHorizontal: 12, 
      paddingVertical: 6, 
      borderRadius: 8, 
      backgroundColor: "rgba(0,0,0,0.05)" 
    },
    quickAmountText: { fontSize: 12, color: theme.text, fontWeight: "500" },
    methodSection: { marginBottom: 20 },
    methodTitle: { fontSize: 14, color: theme.textSecondary, marginBottom: 12 },
    methodCard: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
    },
    selectedMethodCard: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    methodContent: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
    methodIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: `${theme.primary}20`,
      justifyContent: "center",
      alignItems: "center",
    },
    methodName: { fontSize: 14, color: theme.text, fontWeight: "600" },
    methodInfo: { marginRight: 8, alignItems: "flex-end" },
    methodFee: { fontSize: 12, color: theme.textSecondary },
    methodTime: { fontSize: 12, color: theme.textSecondary },
    noMethodText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      padding: 16,
    },
    totalSection: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    totalLabel: { fontSize: 14, color: theme.textSecondary, textAlign: "center" },
    totalValue: { fontSize: 20, fontWeight: "700", color: theme.primary, textAlign: "center", marginTop: 4 },
    totalNote: { fontSize: 12, color: theme.textSecondary, textAlign: "center", marginTop: 6 },
    nextSteps: {
      backgroundColor: "rgba(0,0,0,0.03)",
      borderRadius: 14,
      padding: 16,
      marginBottom: 20,
    },
    nextTitle: { fontSize: 14, color: theme.text, fontWeight: "600", marginBottom: 12 },
    step: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
    stepDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      marginTop: 2,
    },
    stepNumber: { color: "#fff", fontSize: 12, fontWeight: "700" },
    stepText: { fontSize: 13, color: theme.text, flex: 1, lineHeight: 18 },
    depositButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 40,
    },
    depositButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  }), [theme]);

  if (isDarkMode) {
    return (
      <LinearGradient
        colors={["#001A13", "#003B28", "#017148"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Deposit Funds</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.introText}>
            Add funds to invest in tokenised real estate, gold, and other real-world assets.
          </Text>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Enter amount to deposit</Text>
            <View style={styles.amountRow}>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
              <TouchableOpacity
                style={styles.currencyDropdown}
                onPress={() => setShowCurrencyList(!showCurrencyList)}
              >
                <Text style={styles.currencyCode}>{selectedCurrency}</Text>
                <Ionicons
                  name={showCurrencyList ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#AAA"
                />
              </TouchableOpacity>
            </View>

            {showCurrencyList && (
              <ScrollView style={styles.currencyList} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                {currencies.map((curr) => (
                  <TouchableOpacity
                    key={curr.code}
                    style={[styles.currencyItem, selectedCurrency === curr.code && styles.selectedCurrencyItem]}
                    onPress={() => {
                      setSelectedCurrency(curr.code);
                      setShowCurrencyList(false);
                    }}
                  >
                    <Text style={styles.currencyCode}>{curr.code}</Text>
                    <Text style={styles.currencySymbol}>{curr.symbol}</Text>
                    {selectedCurrency === curr.code && (
                      <Ionicons name="checkmark" size={16} color="#017148" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.quickAmounts}>
            {[50, 100, 250, 500].map((val) => (
              <TouchableOpacity key={val} style={styles.quickAmount} onPress={() => setAmount(val.toString())}>
                <Text style={styles.quickAmountText}>
                  {selectedCurrencyObj.symbol}{val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.methodSection}>
            <Text style={styles.methodTitle}>Choose Payment Method</Text>
            {filteredMethods.length > 0 ? (
              filteredMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.methodCard, selectedMethod === method.id && styles.selectedMethodCard]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View style={styles.methodContent}>
                    <View style={styles.methodIcon}>{renderMethodIcon(method.icon)}</View>
                    <Text style={styles.methodName}>{method.label}</Text>
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodFee}>{method.fee}</Text>
                    <Text style={styles.methodTime}>{method.time}</Text>
                  </View>
                  <Ionicons
                    name={selectedMethod === method.id ? "checkmark-circle" : "chevron-forward"}
                    size={20}
                    color={selectedMethod === method.id ? "#017148" : "#AAA"}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noMethodText}>
                No payment method available for {selectedCurrency}
              </Text>
            )}
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalValue}>
              {selectedCurrencyObj.symbol}{totalWithFee()}
            </Text>
            <Text style={styles.totalNote}>
              Includes processing fee. Final amount may vary slightly.
            </Text>
          </View>

          <View style={styles.nextSteps}>
            <Text style={styles.nextTitle}>What happens next?</Text>
            <View style={styles.step}>
              <View style={styles.stepDot}><Text style={styles.stepNumber}>1</Text></View>
              <Text style={styles.stepText}>Funds are added to your wallet</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepDot}><Text style={styles.stepNumber}>2</Text></View>
              <Text style={styles.stepText}>Buy USDT or stablecoins (if needed)</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepDot}><Text style={styles.stepNumber}>3</Text></View>
              <Text style={styles.stepText}>Invest in tokenised real estate, gold, or RWA</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.depositButton} onPress={handleDeposit}>
            <Text style={styles.depositButtonText}>Deposit Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  // ✅ LIGHT MODE
  return (
    <View style={lightStyles.container}>
      <ScrollView
        style={lightStyles.scrollContainer}
        contentContainerStyle={lightStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={lightStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={lightStyles.title}>Deposit Funds</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={lightStyles.introText}>
          Add funds to invest in tokenised real estate, gold, and other real-world assets.
        </Text>

        <View style={lightStyles.amountSection}>
          <Text style={lightStyles.amountLabel}>Enter amount to deposit</Text>
          <View style={lightStyles.amountRow}>
            <View style={lightStyles.amountInputContainer}>
              <TextInput
                style={lightStyles.amountInput}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>
            <TouchableOpacity
              style={lightStyles.currencyDropdown}
              onPress={() => setShowCurrencyList(!showCurrencyList)}
            >
              <Text style={lightStyles.currencyCode}>{selectedCurrency}</Text>
              <Ionicons
                name={showCurrencyList ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {showCurrencyList && (
            <ScrollView style={lightStyles.currencyList} showsVerticalScrollIndicator={false} nestedScrollEnabled>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[lightStyles.currencyItem, selectedCurrency === curr.code && lightStyles.selectedCurrencyItem]}
                  onPress={() => {
                    setSelectedCurrency(curr.code);
                    setShowCurrencyList(false);
                  }}
                >
                  <Text style={lightStyles.currencyCode}>{curr.code}</Text>
                  <Text style={lightStyles.currencySymbol}>{curr.symbol}</Text>
                  {selectedCurrency === curr.code && (
                    <Ionicons name="checkmark" size={16} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={lightStyles.quickAmounts}>
          {[50, 100, 250, 500].map((val) => (
            <TouchableOpacity key={val} style={lightStyles.quickAmount} onPress={() => setAmount(val.toString())}>
              <Text style={lightStyles.quickAmountText}>
                {selectedCurrencyObj.symbol}{val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={lightStyles.methodSection}>
          <Text style={lightStyles.methodTitle}>Choose Payment Method</Text>
          {filteredMethods.length > 0 ? (
            filteredMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[lightStyles.methodCard, selectedMethod === method.id && lightStyles.selectedMethodCard]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={lightStyles.methodContent}>
                  <View style={lightStyles.methodIcon}>{renderMethodIcon(method.icon)}</View>
                  <Text style={lightStyles.methodName}>{method.label}</Text>
                </View>
                <View style={lightStyles.methodInfo}>
                  <Text style={lightStyles.methodFee}>{method.fee}</Text>
                  <Text style={lightStyles.methodTime}>{method.time}</Text>
                </View>
                <Ionicons
                  name={selectedMethod === method.id ? "checkmark-circle" : "chevron-forward"}
                  size={20}
                  color={selectedMethod === method.id ? theme.primary : theme.textSecondary}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={lightStyles.noMethodText}>
              No payment method available for {selectedCurrency}
            </Text>
          )}
        </View>

        <View style={lightStyles.totalSection}>
          <Text style={lightStyles.totalLabel}>Total to Pay</Text>
          <Text style={lightStyles.totalValue}>
            {selectedCurrencyObj.symbol}{totalWithFee()}
          </Text>
          <Text style={lightStyles.totalNote}>
            Includes processing fee. Final amount may vary slightly.
          </Text>
        </View>

        <View style={lightStyles.nextSteps}>
          <Text style={lightStyles.nextTitle}>What happens next?</Text>
          <View style={lightStyles.step}>
            <View style={lightStyles.stepDot}><Text style={lightStyles.stepNumber}>1</Text></View>
            <Text style={lightStyles.stepText}>Funds are added to your wallet</Text>
          </View>
          <View style={lightStyles.step}>
            <View style={lightStyles.stepDot}><Text style={lightStyles.stepNumber}>2</Text></View>
            <Text style={lightStyles.stepText}>Buy USDT or stablecoins (if needed)</Text>
          </View>
          <View style={lightStyles.step}>
            <View style={lightStyles.stepDot}><Text style={lightStyles.stepNumber}>3</Text></View>
            <Text style={lightStyles.stepText}>Invest in tokenised real estate, gold, or RWA</Text>
          </View>
        </View>

        <TouchableOpacity style={lightStyles.depositButton} onPress={handleDeposit}>
          <Text style={lightStyles.depositButtonText}>Deposit Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DepositScreen;

// ✅ YOUR ORIGINAL STYLES — 100% UNCHANGED FOR DARK MODE ✅
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#FFF" },
  introText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  amountSection: { marginBottom: 20 },
  amountLabel: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 8 },
  amountRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  amountInputContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: "center",
  },
  amountInput: { fontSize: 18, fontWeight: "600", color: "#FFF", textAlign: "right" },
  currencyDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    minWidth: 90,
    justifyContent: "center",
  },
  currencyCode: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  currencySymbol: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginLeft: 8 },
  currencyList: {
    maxHeight: 180,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  selectedCurrencyItem: {
    backgroundColor: "rgba(168, 230, 161, 0.2)",
    borderColor: "#017148",
  },
  quickAmounts: { flexDirection: "row", gap: 8, marginBottom: 20 },
  quickAmount: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.08)" },
  quickAmountText: { fontSize: 12, color: "#FFF", fontWeight: "500" },
  methodSection: { marginBottom: 20 },
  methodTitle: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 12 },
  methodCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  selectedMethodCard: {
    borderColor: "#017148",
    backgroundColor: "rgba(168, 230, 161, 0.1)",
  },
  methodContent: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  methodIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(1, 113, 72, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  methodName: { fontSize: 14, color: "#FFF", fontWeight: "600" },
  methodInfo: { marginRight: 8, alignItems: "flex-end" },
  methodFee: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  methodTime: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  noMethodText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    padding: 16,
  },
  totalSection: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  totalLabel: { fontSize: 14, color: "rgba(255,255,255,0.7)", textAlign: "center" },
  totalValue: { fontSize: 20, fontWeight: "700", color: "#017148", textAlign: "center", marginTop: 4 },
  totalNote: { fontSize: 12, color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 6 },
  nextSteps: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  nextTitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: "600", marginBottom: 12 },
  step: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#017148",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  stepNumber: { color: "#fff", fontSize: 12, fontWeight: "700" },
  stepText: { fontSize: 13, color: "rgba(255,255,255,0.8)", flex: 1, lineHeight: 18 },
  depositButton: {
    backgroundColor: "#017148",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  depositButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});