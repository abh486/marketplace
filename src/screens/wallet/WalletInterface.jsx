import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useWallet } from "../Context/WalletContext";
import { useTheme } from "../../Theme/ThemeContext";

import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";
import vaultApi from "../../api/vaultApi"; // ✅ Fireblocks API client

export default function WalletInterface({ navigation }) {
  const { isDarkMode } = useTheme();
  const { balance, assets, history, user } = useWallet();
  const [activeTab, setActiveTab] = useState("tokens");
  const [totalBalance, setTotalBalance] = useState(balance || 0);

  // Fireblocks vault state
  const [vaultInfo, setVaultInfo] = useState(null);
  const [loadingVault, setLoadingVault] = useState(true);
  const [vaultError, setVaultError] = useState(null);

  // Update total balance from context
  useEffect(() => {
    setTotalBalance(balance || 0);
  }, [balance]);

  // Fetch Fireblocks vault info on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await vaultApi.getVaultInfo();
        setVaultInfo(res.data);
      } catch (err) {
        setVaultError(err.message);
      } finally {
        setLoadingVault(false);
      }
    })();
  }, []);

  // Only real Fireblocks wallets—no fallback
  const dynamicWallets =
    vaultInfo?.wallets?.map((w, i) => ({
      id: i + 1,
      name: w.assetId || "Fireblocks Wallet",
      address: w.address,
    })) || [];

  const [selectedWallet, setSelectedWallet] = useState(
    dynamicWallets[0] || null
  );

  const copyToClipboard = (text) => {
    try {
      if (Platform.OS === "web") navigator.clipboard.writeText(text || "");
      else Clipboard.setString(text || "");
      Alert.alert("Copied", "Address copied to clipboard!");
    } catch {
      Alert.alert("Copied", text || "");
    }
  };

  // -------- Render Sections --------
  const renderTokens = () => (
    <View
      style={[
        styles.section,
        { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}>
        Assets
      </Text>
      {(assets || []).map((asset, idx) => {
        const totalValue = (
          (asset.tokenPrice || 0) * (asset.quantity || 0)
        ).toFixed(2);
        return (
          <View
            key={idx}
            style={[
              styles.tokenRow,
              {
                borderBottomColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "#E0E0E0",
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.tokenIcon,
                  { backgroundColor: isDarkMode ? "#04523C" : "#02af6a" },
                ]}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  {asset.symbol ? asset.symbol[0] : asset.name?.[0] || "T"}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.tokenName,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  {asset.name}
                </Text>
                <Text
                  style={[
                    styles.tokenSymbol,
                    { color: isDarkMode ? "#9ca3af" : "#666" },
                  ]}
                >
                  {asset.symbol || "Token"}
                </Text>
              </View>
            </View>
            <View style={styles.tokenValues}>
              <Text
                style={[styles.tokenPrice, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                ₹{(asset.tokenPrice || 0).toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.tokenAmount,
                  { color: isDarkMode ? "#9ca3af" : "#666" },
                ]}
              >
                {asset.quantity || 0} {asset.symbol || "units"}
              </Text>
              <Text
                style={[
                  styles.tokenTotal,
                  { color: isDarkMode ? "#10b981" : "#02af6a" },
                ]}
              >
                ₹{totalValue}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderHistory = () => (
    <View
      style={[
        styles.section,
        { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}>
        Transaction History
      </Text>
      {!history?.length ? (
        <Text style={{ color: isDarkMode ? "#aaa" : "#666", marginTop: 10 }}>
          No transactions yet
        </Text>
      ) : (
        history.map((tx, i) => {
          const type = tx.type || "Tx";
          const amount = tx.amount ?? tx.totalCost ?? 0;
          const statusColor =
            tx.status === "completed"
              ? isDarkMode
                ? "#10b981"
                : "#02af6a"
              : "#f97316";
          return (
            <View
              key={i}
              style={[
                styles.historyItem,
                {
                  borderBottomColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "#E0E0E0",
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.historyIcon,
                    {
                      backgroundColor:
                        type.toLowerCase() === "sent"
                          ? isDarkMode
                            ? "#fef2f2"
                            : "#ffebeb"
                          : isDarkMode
                          ? "#f0fdf4"
                          : "#e6fff5",
                    },
                  ]}
                >
                  <Icon
                    name={
                      type.toLowerCase() === "sent"
                        ? "arrow-up-right"
                        : "arrow-down-left"
                    }
                    size={16}
                    color={
                      type.toLowerCase() === "sent" ? "#dc2626" : "#02af6a"
                    }
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.historyToken,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {type} {amount} {tx.token || ""}
                  </Text>
                  <Text
                    style={[
                      styles.historyDate,
                      { color: isDarkMode ? "#9ca3af" : "#666" },
                    ]}
                  >
                    {tx.date || ""}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.historyStatus, { color: statusColor }]}>
                  {tx.status || type}
                </Text>
                <Text
                  style={[
                    styles.txId,
                    { color: isDarkMode ? "#60a5fa" : "#02af6a" },
                  ]}
                  onPress={() => copyToClipboard(tx.txId || "")}
                >
                  {tx.txId || ""}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );

  const renderAccounts = () => (
    <View
      style={[
        styles.section,
        { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}>
        Wallets & Accounts
      </Text>

      {vaultError && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          Vault error: {vaultError}
        </Text>
      )}

      {dynamicWallets.map((w) => (
        <TouchableOpacity
          key={w.id}
          style={[
            styles.walletItem,
            selectedWallet?.id === w.id && styles.selectedWallet,
            {
              borderBottomColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "#E0E0E0",
            },
          ]}
          onPress={() => setSelectedWallet(w)}
        >
          <View>
            <Text style={[styles.walletName, { color: isDarkMode ? "#fff" : "#000" }]}>
              {w.name}
            </Text>
            <Text
              style={[styles.walletAddress, { color: isDarkMode ? "#9ca3af" : "#666" }]}
              numberOfLines={1}
            >
              {w.address}
            </Text>
          </View>
          <Text style={[styles.walletBalance, { color: isDarkMode ? "#fff" : "#000" }]}>
            {w.id === 1 ? `₹${(balance || 0).toLocaleString()}` : "—"}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Create Fireblocks Vault button */}
      {!vaultInfo && !loadingVault && (
        <TouchableOpacity
          onPress={async () => {
            try {
              const res = await vaultApi.createVault();
              setVaultInfo(res.data);
              Alert.alert("Vault created", "Your Fireblocks vault is ready!");
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          }}
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor: "#02af6a",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            Create Fireblocks Vault
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
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

      <Navbar title="Wallet" rightIcon="bell" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: isDarkMode ? "#04523C" : "#02af6a" },
              ]}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {user?.name ? user.name.charAt(0) : "U"}
              </Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.welcomeText, { color: isDarkMode ? "#fff" : "#000" }]}>
                Welcome back!
              </Text>
              <Text style={[styles.userName, { color: isDarkMode ? "#aaa" : "#666" }]}>
                {user?.name || "User"}
              </Text>
            </View>
          </View>
        </View>

        {/* Balance Circle */}
        <View style={styles.centerWrapper}>
          <View style={styles.arcContainer}>
            <LinearGradient
              colors={
                isDarkMode
                  ? ["#99c59d", "#309a5d", "#04523C"]
                  : ["#e6fff5", "#a8e6cf", "#02af6a"]
              }
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.gradientFullCircle}
            />
            <View
              style={[
                styles.arcMask,
                { backgroundColor: isDarkMode ? "#001A13" : "#FFFFFF" },
              ]}
            />
            <View
              style={[
                styles.innerCircle,
                { backgroundColor: isDarkMode ? "#001A13" : "#FFFFFF" },
              ]}
            >
              <View style={styles.innerCircleContent}>
                <Text
                  style={[styles.balanceLabel, { color: isDarkMode ? "#9ca3af" : "#666" }]}
                >
                  Total Balance
                </Text>
                <Text
                  style={[styles.balanceValue, { color: isDarkMode ? "#fff" : "#000" }]}
                >
                  ₹{totalBalance.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {[
            { icon: "arrow-up-right", label: "Send", onPress: () => navigation.navigate("SendScreen") },
            { icon: "arrow-down-left", label: "Receive", onPress: () => navigation.navigate("ReceiveScreen") },
            { icon: "arrow-down-circle", label: "Deposit", onPress: () => navigation.navigate("DepositScreen") },
            { icon: "trending-down", label: "Withdraw", onPress: () => navigation.navigate("WithdrawScreen"), isMaterial: true },
          ].map((action, idx) => (
            <TouchableOpacity key={idx} style={styles.actionButton} onPress={action.onPress}>
              <View
                style={[
                  styles.actionIconCircle,
                  { backgroundColor: isDarkMode ? "#054536" : "#e6fff5" },
                ]}
              >
                {action.isMaterial ? (
                  <MaterialIcons
                    name={action.icon}
                    size={20}
                    color={isDarkMode ? "#fff" : "#02af6a"}
                  />
                ) : (
                  <Icon
                    name={action.icon}
                    size={20}
                    color={isDarkMode ? "#fff" : "#02af6a"}
                  />
                )}
              </View>
              <Text
                style={[styles.actionButtonText, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tabs */}
        <View
          style={[
            styles.tabBar,
            { borderBottomColor: isDarkMode ? "rgba(255,255,255,0.2)" : "#E0E0E0" },
          ]}
        >
          {["tokens", "history", "accounts"].map((tab) => (
            <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  { color: isDarkMode ? "#9ca3af" : "#666" },
                  activeTab === tab && { color: isDarkMode ? "#fff" : "#000", fontWeight: "bold" },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {activeTab === tab && (
                <View style={[styles.tabUnderline, { backgroundColor: isDarkMode ? "#04523C" : "#02af6a" }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "tokens" && renderTokens()}
        {activeTab === "history" && renderHistory()}
        {activeTab === "accounts" && renderAccounts()}
      </ScrollView>

      <BottomNav active="wallet" />
    </View>
  );
}
// ---------------- Styles — PRESERVED YOUR DARK THEME, ADDED LIGHT THEME ----------------
const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? 20 : 40,
    paddingBottom: 10,
  },
  welcomeText: { fontSize: 16, fontWeight: "600", marginTop: 80 },
  userName: { fontSize: 15, fontWeight: "bold" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop:80,
  },
  centerWrapper: { alignItems: "center", marginVertical: 20 },
  arcContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    transform: [{ rotate: "80deg" }],
  },
  gradientFullCircle: { width: 200, height: 200, borderRadius: 100 },
  arcMask: {
    position: "absolute",
    width: 100,
    height: 100,
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 100,
  },
  innerCircle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-80deg" }],
  },
  innerCircleContent: { justifyContent: "center", alignItems: "center" },
  balanceLabel: { fontSize: 12, marginBottom: 4 },
  balanceValue: { fontSize: 18, fontWeight: "bold" },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  actionButton: { alignItems: "center", margin: 8 },
  actionIconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  actionButtonText: { fontSize: 12, fontWeight: "600" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 1,
  },
  tabButton: { alignItems: "center", paddingVertical: 10, flex: 1 },
  tabText: { fontSize: 14, fontWeight: "600" },
  tabUnderline: { height: 3, width: "50%", borderRadius: 2 },
  section: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  tokenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tokenIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  tokenName: { fontWeight: "600" },
  tokenSymbol: { fontSize: 12 },
  tokenValues: { alignItems: "flex-end" },
  tokenPrice: { fontSize: 14 },
  tokenAmount: { fontSize: 12 },
  tokenTotal: { fontWeight: "bold" },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  historyToken: { fontWeight: "600" },
  historyDate: { fontSize: 12 },
  historyStatus: { fontSize: 12, fontWeight: "600" },
  txId: { fontSize: 11 },
  walletItem: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletName: { fontWeight: "600" },
  walletAddress: { fontSize: 12, maxWidth: 180 },
  walletBalance: { fontWeight: "bold" },
});