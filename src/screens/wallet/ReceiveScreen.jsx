import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  TextInput,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from "../../Theme/ThemeContext"; // ✅ ADDED — Adjust path if needed

const { width } = Dimensions.get("window");

// 🔐 Wallet Address
const MY_WALLET_ADDRESS = "0x8A1cD58a7a1eB9B2dF3bF8dD1fA8b5C2e3b4F1a9";

// 🪙 Supported RWA Tokens
const TOKENS = [
  { symbol: "USDt", name: "Tether USD" },
  { symbol: "RWA", name: "Platform Token" },
  { symbol: "GOLD", name: "Tokenised Gold" },
  { symbol: "RE1", name: "Real Estate Fund" },
];

// 🖼️ Local QR Code Image (no more online)
const qrCodeImage = require('../../assets/image/qr-code.png');

const ReceiveScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // ✅ ADDED
  const [amount, setAmount] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]); // default USDt

  const displayAddress = `${MY_WALLET_ADDRESS.slice(0, 12)}...${MY_WALLET_ADDRESS.slice(-12)}`;

  const handleCopyAddress = () => {
    Clipboard.setString(MY_WALLET_ADDRESS);
    Alert.alert("Copied!", "Wallet address copied to clipboard.");
  };

  const handleShareRequest = () => {
    const message = `Please send ${amount || 'an amount'} ${selectedToken.symbol} to my wallet.\n\nhttps://rwa-marketplace.app/pay?to=${MY_WALLET_ADDRESS}&token=${selectedToken.symbol}`;
    Alert.alert("Share", "Would you like to share this link?");
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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFF" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: isDarkMode ? "#FFF" : "#000" }]}>Receive</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={[styles.subtitle, { color: isDarkMode ? "rgba(255,255,255,0.7)" : "#666" }]}>
          Select token and share your address or QR code to receive funds.
        </Text>

        {/* Token Selector */}
        <View style={styles.tokenSelector}>
          <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Receive in</Text>
          <View style={styles.tokenPills}>
            {TOKENS.map((token) => (
              <TouchableOpacity
                key={token.symbol}
                style={[
                  styles.tokenPill,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "#F0F0F0",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "#E0E0E0",
                  },
                  selectedToken.symbol === token.symbol && {
                    backgroundColor: isDarkMode ? "#017148" : "#02af6a",
                    borderColor: isDarkMode ? "#4CAF50" : "#02af6a",
                  },
                ]}
                onPress={() => setSelectedToken(token)}
              >
                <Text
                  style={[
                    styles.tokenPillText,
                    {
                      color: isDarkMode
                        ? "rgba(255,255,255,0.8)"
                        : "#666",
                    },
                    selectedToken.symbol === token.symbol && {
                      color: isDarkMode ? "#aaa" : "#fff",
                      fontWeight: "600",
                    },
                  ]}
                >
                  {token.symbol}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* QR Code */}
        <View
          style={[
            styles.qrContainer,
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
          <Image
            source={qrCodeImage}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.qrLabel,
              { color: isDarkMode ? "rgba(255,255,255,0.8)" : "#666" },
            ]}
          >
            Scan to receive {selectedToken.symbol}
          </Text>
        </View>

        {/* Wallet Address */}
        <View
          style={[
            styles.addressSection,
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
          <Text style={[styles.addressLabel, { color: isDarkMode ? "#fff" : "#000" }]}>
            Your Wallet Address
          </Text>
          <View style={styles.addressRow}>
            <Text
              style={[
                styles.addressText,
                { color: isDarkMode ? "#FFF" : "#000" },
              ]}
              selectable
            >
              {displayAddress}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyAddress}>
              <MaterialIcons name="content-copy" size={20} color={isDarkMode ? "#aaa" : "#666"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Request Specific Amount */}
        <View style={styles.requestSection}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(1, 113, 72, 0.2)"
                  : "rgba(2, 175, 106, 0.1)",
              },
            ]}
            onPress={() => setShowAmountInput(!showAmountInput)}
          >
            <MaterialIcons
              name={showAmountInput ? "remove-circle" : "add-circle"}
              size={24}
              color={isDarkMode ? "#aaa" : "#02af6a"}
            />
            <Text
              style={[
                styles.toggleText,
                { color: isDarkMode ? "#fff" : "#02af6a" },
              ]}
            >
              {showAmountInput ? "Remove Amount" : "Request Specific Amount"}
            </Text>
          </TouchableOpacity>

          {showAmountInput && (
            <View
              style={[
                styles.amountInputContainer,
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
              <Text style={[styles.amountLabel, { color: isDarkMode ? "#FFF" : "#000" }]}>
                Enter amount to request
              </Text>
              <View
                style={[
                  styles.amountRow,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "#F5F5F5",
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.amountInput,
                    { color: isDarkMode ? "#FFF" : "#000" },
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.5)" : "#999"}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  maxLength={10}
                />
                <Text
                  style={[
                    styles.currencyBadge,
                    { color: isDarkMode ? "#aaa" : "#666" },
                  ]}
                >
                  {selectedToken.symbol}
                </Text>
              </View>
              <Text
                style={[
                  styles.hintText,
                  { color: isDarkMode ? "rgba(255,255,255,0.6)" : "#999" },
                ]}
              >
                The QR code will include this amount.
              </Text>
            </View>
          )}
        </View>

        {/* Share Request Button */}
        <TouchableOpacity
          style={[
            styles.shareRequestButton,
            { backgroundColor: isDarkMode ? "#017148" : "#02af6a" },
          ]}
          onPress={handleShareRequest}
        >
          <MaterialIcons name="share" size={20} color="#fff" />
          <Text style={styles.shareRequestText}>Share Payment Request</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: isDarkMode
                ? "rgba(168, 230, 161, 0.1)"
                : "rgba(2, 175, 106, 0.08)",
            },
          ]}
        >
          <MaterialIcons name="info" size={18} color={isDarkMode ? "#aaa" : "#02af6a"} />
          <Text
            style={[
              styles.infoText,
              { color: isDarkMode ? "rgba(255,255,255,0.8)" : "#666" },
            ]}
          >
            Others can send {selectedToken.name} to this address.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
};

export default ReceiveScreen;

// ---------------- Styles — PRESERVED YOUR DARK THEME, ADDED LIGHT THEME ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
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
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  tokenSelector: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  tokenPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tokenPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tokenPillActive: {},
  tokenPillText: {
    fontSize: 14,
  },
  tokenPillTextActive: {
    fontWeight: "600",
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    marginVertical: 20,
    borderWidth: 1,
  },
  qrImage: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: "transparent",
  },
  qrLabel: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: "500",
  },
  addressSection: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressText: {
    fontSize: 15,
    fontFamily: "Courier New",
    fontWeight: "600",
    flex: 1,
  },
  copyButton: {
    marginLeft: 12,
    padding: 8,
  },
  requestSection: {
    marginBottom: 20,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  amountInputContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
  },
  currencyBadge: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  hintText: {
    fontSize: 12,
    marginTop: 8,
  },
  shareRequestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  shareRequestText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 8,
    lineHeight: 18,
  },
});