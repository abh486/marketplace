import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useWallet } from "../Context/WalletContext";
import { useTheme } from '../../Theme/ThemeContext'; // ✅ ADDED

export default function BuyScreen({ route, navigation }) {
  const { asset } = route.params || {};
  const { theme, isDarkMode } = useTheme(); // ✅ GET THEME
  const [quantity, setQuantity] = useState("");

  const { buyAsset } = useWallet();

  const tokenPrice = Number(asset?.tokenPrice ?? asset?.price ?? 100);
  const qtyNumber = Number(quantity) || 0;
  const total = qtyNumber * tokenPrice;
  const availableTokens = Number(asset?.availableTokens ?? 1000);

  const handleBuy = () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a valid number of tokens.");
      return;
    }
    if (qty > availableTokens) {
      Alert.alert("Insufficient Supply", `Only ${availableTokens} tokens available.`);
      return;
    }

    const ok = buyAsset({ ...asset, tokenPrice }, qty);
    if (!ok) {
      Alert.alert("Insufficient Balance", "You don’t have enough funds in your wallet.");
      return;
    }

    Alert.alert(
      "Purchase Successful 🎉",
      `You bought ${qty} ${asset?.name ?? "token(s)"} for ₹${(qty * tokenPrice).toFixed(2)}.`,
      [
        {
          text: "OK",
          onPress: () => navigation.replace("WalletInterface"),
        },
      ]
    );

    setQuantity("");
  };

  const quickSelect = (qty) => setQuantity(String(qty));

  // ✅ Category → Icon mapping
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Real Estate":
        return "apartment";
      case "Commodities":
        return "inventory";
      case "Collectibles":
        return "stars";
      case "Art":
        return "brush";
      case "Finance":
        return "account-balance";
      default:
        return "account-balance";
    }
  };

  // ✅ DYNAMIC STYLES
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { paddingBottom: 100 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 16,
    },
    headerText: { fontSize: 20, fontWeight: "700", color: theme.text },
    assetCard: {
      backgroundColor: theme.card,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    assetIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDarkMode ? "rgba(1, 113, 72, 0.2)" : "rgba(0,219,132,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    assetName: { fontSize: 20, fontWeight: "700", color: theme.text },
    assetType: { fontSize: 14, color: theme.textSecondary, marginBottom: 12 },
    priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    priceLabel: { fontSize: 14, color: theme.textSecondary },
    priceValue: { fontSize: 16, fontWeight: "600", color: theme.primary },
    divider: { height: 1, backgroundColor: theme.border, marginVertical: 12 },
    statsRow: { flexDirection: "row", justifyContent: "space-between" },
    stat: { flex: 1, alignItems: "center" },
    statLabel: { fontSize: 12, color: theme.textSecondary },
    statValue: { fontSize: 14, fontWeight: "600", color: theme.text, marginTop: 4 },
    statDivider: {
      width: 1,
      height: "80%",
      backgroundColor: theme.border,
      alignSelf: "center",
    },
    inputContainer: { marginHorizontal: 20, marginTop: 20 },
    label: { fontSize: 14, color: theme.textSecondary, marginBottom: 8 },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 50,
    },
    input: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginLeft: 8,
    },
    quickSelectRow: { flexDirection: "row", gap: 8, marginTop: 12 },
    quickBtn: {
      flex: 1,
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: "center",
    },
    quickBtnText: { color: theme.text, fontSize: 14, fontWeight: "500" },
    summaryCard: {
      backgroundColor: theme.card,
      marginHorizontal: 20,
      borderRadius: 14,
      padding: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    summaryTitle: { fontSize: 16, fontWeight: "600", color: theme.text, marginBottom: 12 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
    summaryLabel: { fontSize: 14, color: theme.textSecondary },
    summaryValue: { fontSize: 14, color: theme.text, fontWeight: "600" },
    summaryDivider: { height: 1, backgroundColor: theme.border, marginVertical: 6 },
    totalText: { fontWeight: "700", color: theme.text },
    feeBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginHorizontal: 20,
      marginTop: 16,
      padding: 12,
      backgroundColor: isDarkMode ? "rgba(168, 230, 161, 0.1)" : "rgba(0,219,132,0.1)",
      borderRadius: 12,
    },
    feeText: { fontSize: 12, color: theme.textSecondary, marginLeft: 8, lineHeight: 18 },
    bottomContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: isDarkMode ? "rgba(0,26,19,0.9)" : "rgba(255,255,255,0.95)",
    },
    buyButton: { borderRadius: 14, overflow: "hidden" },
    buyButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 14,
      backgroundColor: theme.primary, // ✅ Solid primary — no gradient needed
    },
    buyButtonText: {
      color: isDarkMode ? "#000" : "#fff", // Dark text on light green, white on dark green
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
  }), [theme, isDarkMode]);

  return (
    <>
      {/* ✅ Background Gradient for Dark Mode Only */}
      {isDarkMode && (
        <>
          <LinearGradient
            colors={["#001A13", "#003B28", "#017148ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.6)"]}
            style={StyleSheet.absoluteFillObject}
          />
        </>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Buy {asset?.name}</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Asset Card */}
          <View style={styles.assetCard}>
            <View style={styles.assetIcon}>
              <MaterialIcons
                name={getCategoryIcon(asset?.category)}
                size={30}
                color={theme.primary}
              />
            </View>
            <Text style={styles.assetName}>{asset?.name}</Text>
            <Text style={styles.assetType}>
              {asset?.type || asset?.category || "Tokenised Asset"}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price per token</Text>
              <Text style={styles.priceValue}>
                ₹{tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Available</Text>
                <Text style={styles.statValue}>{availableTokens.toLocaleString()}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Min Buy</Text>
                <Text style={styles.statValue}>1 token</Text>
              </View>
            </View>
          </View>

          {/* Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Quantity</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="cube" size={20} color={theme.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="decimal-pad"
                placeholderTextColor={theme.textSecondary}
                value={quantity}
                onChangeText={setQuantity}
                textAlign="right"
              />
            </View>

            <View style={styles.quickSelectRow}>
              {[1, 5, 10, 25].map((q) => (
                <TouchableOpacity key={q} style={styles.quickBtn} onPress={() => quickSelect(q)}>
                  <Text style={styles.quickBtnText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tokens</Text>
              <Text style={styles.summaryValue}>{quantity || "0"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price per Token</Text>
              <Text style={styles.summaryValue}>₹{tokenPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.totalText]}>Total Amount</Text>
              <Text style={[styles.summaryValue, styles.totalText]}>₹{total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.feeBox}>
            <Ionicons name="information-circle" size={16} color={theme.primary} />
            <Text style={styles.feeText}>
              Includes network & processing fees. Settlement in 1–3 hours.
            </Text>
          </View>
        </ScrollView>

        {/* Sticky Buy Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuy}
            disabled={!quantity || parseFloat(quantity) <= 0}
          >
            {/* ✅ Removed unnecessary LinearGradient — use solid theme.primary */}
            <View style={styles.buyButtonGradient}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
              <Ionicons name="arrow-forward" size={20} color={isDarkMode ? "#000" : "#fff"} />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}