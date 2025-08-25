import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Clipboard,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";

// ----------------- Mock Data -----------------
const tokens = [
  { id: 1, symbol: "ETH", name: "Ethereum", price: 3050.25, quantity: 2.45 },
  { id: 2, symbol: "BTC", name: "Bitcoin", price: 61000.0, quantity: 0.5 },
  { id: 3, symbol: "USDT", name: "Tether", price: 1.0, quantity: 1500.0 },
  { id: 4, symbol: "DAI", name: "Dai", price: 0.998, quantity: 875.3 },
];

const tokenizedAssets = [
  { id: 1, name: "Luxury Apartment", type: "Real Estate", price: 2500, quantity: 2 },
  { id: 2, name: "Gold Token", type: "Gold", price: 60, quantity: 10 },
];

const transactions = [
  { id: 1, token: "ETH", amount: 1.2, type: "sent", date: "2023-10-05", status: "completed", txId: "0xabc123..." },
  { id: 2, token: "BTC", amount: 0.1, type: "received", date: "2023-10-04", status: "completed", txId: "0xdef456..." },
  { id: 3, token: "USDT", amount: 500, type: "sent", date: "2023-10-03", status: "failed", txId: "0xghi789..." },
  { id: 4, token: "DAI", amount: 200, type: "received", date: "2023-10-02", status: "completed", txId: "0xjkl012..." },
];

const wallets = [
  { id: 1, name: "Main Wallet", address: "0x1a2b...cdef" },
  { id: 2, name: "Savings Wallet", address: "0x3c4d...ef12" },
  { id: 3, name: "Trading Wallet", address: "0x5e6f...34ab" },
];

export default function WalletInterface() {
  const [activeTab, setActiveTab] = useState("tokens");
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);
  const [totalBalance, setTotalBalance] = useState(0);

  const username = "Sam Kruss";

  // Calculate total balance from tokens + tokenized assets
  useEffect(() => {
    let total = 0;
    tokens.forEach((t) => (total += t.price * t.quantity));
    tokenizedAssets.forEach((a) => (total += a.price * a.quantity));
    setTotalBalance(total);
  }, []);

  // Handlers
  const handleSend = () => {
    Alert.alert("Transaction", "Send initiated!");
    setSendModalVisible(false);
  };
  const handleSwap = () => {
    Alert.alert("Swap", "Swap initiated!");
    setSwapModalVisible(false);
  };
  const handleDeposit = () => {
    Alert.alert("Deposit", "Deposit flow started...");
    setDepositModalVisible(false);
  };
  const handleWithdraw = () => {
    Alert.alert("Withdraw", "Withdraw flow started...");
    setWithdrawModalVisible(false);
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied", "Address copied to clipboard!");
  };

  const renderTokens = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Assets</Text>
      {tokens.map((token) => {
        const totalValue = (token.price * token.quantity).toFixed(2);
        return (
          <View key={token.id} style={styles.tokenRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.tokenIcon}>
                <Text style={{ color: "#fff", fontSize: 12 }}>{token.symbol[0]}</Text>
              </View>
              <View>
                <Text style={styles.tokenName}>{token.name}</Text>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
              </View>
            </View>
            <View style={styles.tokenValues}>
              <Text style={styles.tokenPrice}>${token.price.toFixed(2)}</Text>
              <Text style={styles.tokenAmount}>{token.quantity} {token.symbol}</Text>
              <Text style={styles.tokenTotal}>${totalValue}</Text>
            </View>
          </View>
        );
      })}
      {tokenizedAssets.map((asset) => {
        const totalValue = (asset.price * asset.quantity).toFixed(2);
        return (
          <View key={asset.id} style={styles.tokenRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.tokenIcon}>
                <Icon name="home" size={14} color="#fff" />
              </View>
              <View>
                <Text style={styles.tokenName}>{asset.name}</Text>
                <Text style={styles.tokenSymbol}>{asset.type}</Text>
              </View>
            </View>
            <View style={styles.tokenValues}>
              <Text style={styles.tokenPrice}>${asset.price.toFixed(2)}</Text>
              <Text style={styles.tokenAmount}>{asset.quantity} units</Text>
              <Text style={styles.tokenTotal}>${totalValue}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Transaction History</Text>
      {transactions.map((tx) => (
        <View key={tx.id} style={styles.historyItem}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.historyIcon,
                { backgroundColor: tx.type === "sent" ? "#fef2f2" : "#f0fdf4" },
              ]}
            >
              <Icon
                name={tx.type === "sent" ? "arrow-up-right" : "arrow-down-left"}
                size={16}
                color={tx.type === "sent" ? "#dc2626" : "#059669"}
              />
            </View>
            <View>
              <Text style={styles.historyToken}>
                {tx.type === "sent" ? "Sent" : "Received"} {tx.amount} {tx.token}
              </Text>
              <Text style={styles.historyDate}>{tx.date}</Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={[
                styles.historyStatus,
                tx.status === "completed" ? { color: "#10b981" } : { color: "#f97316" },
              ]}
            >
              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </Text>
            <Text style={styles.txId} onPress={() => copyToClipboard(tx.txId)}>
              {tx.txId}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAccounts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Wallets & Accounts</Text>
      {wallets.map((wallet) => (
        <TouchableOpacity
          key={wallet.id}
          style={[
            styles.walletItem,
            selectedWallet?.id === wallet.id && styles.selectedWallet,
          ]}
          onPress={() => setSelectedWallet(wallet)}
        >
          <View>
            <Text style={styles.walletName}>{wallet.name}</Text>
            <Text style={styles.walletAddress} numberOfLines={1}>
              {wallet.address}
            </Text>
          </View>
          <Text style={styles.walletBalance}>
            {wallet.id === 1 ? "$28,450" : wallet.id === 2 ? "$12,300" : "$4,480"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#001A13", "#003B28", "#017148ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Navbar */}
      <Navbar title="Wallet" rightIcon="bell" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90, flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.avatar}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>{username.charAt(0)}</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.userName}>{username}</Text>
            </View>
          </View>
        </View>

        {/* Balance Circle */}
        <View style={styles.centerWrapper}>
          <View style={styles.arcContainer}>
            <LinearGradient
              colors={["#99c59d", "#309a5d", "#04523C"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.gradientFullCircle}
            />
            <View style={styles.arcMask} />
            <View style={styles.innerCircle}>
              <View style={styles.innerCircleContent}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceValue}>${totalBalance.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setSendModalVisible(true)}>
            <View style={styles.actionIconCircle}>
              <Icon name="arrow-up-right" size={20} color="#fff" />
            </View>
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setReceiveModalVisible(true)}>
            <View style={styles.actionIconCircle}>
              <Icon name="arrow-down-left" size={20} color="#fff" />
            </View>
            <Text style={styles.actionButtonText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setSwapModalVisible(true)}>
            <View style={styles.actionIconCircle}>
              <Icon name="shuffle" size={20} color="#fff" />
            </View>
            <Text style={styles.actionButtonText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setDepositModalVisible(true)}>
            <View style={styles.actionIconCircle}>
              <Icon name="arrow-down-circle" size={20} color="#fff" />
            </View>
            <Text style={styles.actionButtonText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setWithdrawModalVisible(true)}>
            <View style={styles.actionIconCircle}>
              <Icon name="arrow-up-circle" size={20} color="#fff" />
            </View>
            <Text style={styles.actionButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {["tokens", "history", "accounts"].map((tab) => (
            <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "tokens" && renderTokens()}
        {activeTab === "history" && renderHistory()}
        {activeTab === "accounts" && renderAccounts()}
      </ScrollView>

      {/* Send Modal */}
      <Modal visible={sendModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "98%" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
              <TouchableOpacity onPress={() => setSendModalVisible(false)}>
                <Icon name="arrow-left" size={24} color="#04523C" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { flex: 1, textAlign: "center", marginLeft: -24 }]}>Send Token</Text>
            </View>
            <TextInput placeholder="Recipient Address" style={styles.input} multiline numberOfLines={2} />
            <TextInput placeholder="Amount" style={styles.input} keyboardType="decimal-pad" />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Receive Modal */}
      <Modal visible={receiveModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "98%" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
              <TouchableOpacity onPress={() => setReceiveModalVisible(false)}>
                <Icon name="arrow-left" size={24} color="#04523C" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { flex: 1, textAlign: "center", marginLeft: -24 }]}>Receive Token</Text>
            </View>
            <View style={styles.qrPlaceholder}>
              <MaterialIcons name="qr-code" size={80} color="#04523C" />
            </View>
            <Text style={styles.addressText} onPress={() => copyToClipboard(selectedWallet?.address)}>
              {selectedWallet?.address}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(selectedWallet?.address)}>
              <Text style={styles.copyButtonText}>Copy Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Swap Modal */}
      <Modal visible={swapModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "98%" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
              <TouchableOpacity onPress={() => setSwapModalVisible(false)}>
                <Icon name="arrow-left" size={24} color="#04523C" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { flex: 1, textAlign: "center", marginLeft: -24 }]}>Swap Tokens</Text>
            </View>
            <TextInput placeholder="From (Select Token)" style={styles.input} />
            <TextInput placeholder="To (Select Token)" style={styles.input} />
            <TextInput placeholder="Amount" style={styles.input} keyboardType="decimal-pad" />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.sendButton} onPress={handleSwap}>
                <Text style={styles.buttonText}>Swap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deposit Modal */}
      <Modal visible={depositModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "98%" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
              <TouchableOpacity onPress={() => setDepositModalVisible(false)}>
                <Icon name="arrow-left" size={24} color="#04523C" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { flex: 1, textAlign: "center", marginLeft: -24 }]}>Deposit</Text>
            </View>
            <Text style={{ color: "#333", marginBottom: 10, textAlign: "center" }}>
              Deposit crypto or fiat funds to your selected wallet.
            </Text>
            <TextInput placeholder="Deposit Amount" style={styles.input} keyboardType="decimal-pad" />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.sendButton} onPress={handleDeposit}>
                <Text style={styles.buttonText}>Deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "98%" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
              <TouchableOpacity onPress={() => setWithdrawModalVisible(false)}>
                <Icon name="arrow-left" size={24} color="#04523C" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { flex: 1, textAlign: "center", marginLeft: -24 }]}>Withdraw</Text>
            </View>
            <Text style={{ color: "#333", marginBottom: 10, textAlign: "center" }}>
              Withdraw your crypto or fiat funds from your wallet.
            </Text>
            <TextInput placeholder="Recipient Address" style={styles.input} />
            <TextInput placeholder="Amount" style={styles.input} keyboardType="decimal-pad" />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.sendButton} onPress={handleWithdraw}>
                <Text style={styles.buttonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav active="wallet" />
    </View>
  );
}

// ...styles unchanged (keep your existing styles block)...


// ---------------- Styles ----------------
const styles = StyleSheet.create({
  headerContainer: { paddingHorizontal: 10, paddingTop: Platform.OS === "android" ? 20 : 40, paddingBottom: 10 },
  welcomeText: { fontSize: 16, fontWeight: "600", color: "#fff", marginTop: 80 },
  userName: { fontSize: 15, fontWeight: "bold", color: "#aaa" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#04523C", justifyContent: "center", alignItems: "center", marginTop: 80 },
  centerWrapper: { alignItems: "center", marginVertical: 20 },
  arcContainer: { width: 200, height: 200, borderRadius: 100, justifyContent: "center", alignItems: "center", position: "relative", transform: [{ rotate: "80deg" }] },
  gradientFullCircle: { width: 200, height: 200, borderRadius: 100 },
  arcMask: { position: "absolute", width: 100, height: 100, bottom: 0, left: 0, backgroundColor: "#001A13", borderBottomLeftRadius: 100 },
  innerCircle: { position: "absolute", width: 140, height: 140, backgroundColor: "#001A13", borderRadius: 70, justifyContent: "center", alignItems: "center", transform: [{ rotate: "-80deg" }] },
  innerCircleContent: { justifyContent: "center", alignItems: "center" },
  balanceLabel: { fontSize: 12, color: "#9ca3af", marginBottom: 4 },
  balanceValue: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  actionRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginVertical: 15, paddingHorizontal: 10 },
  actionButton: { alignItems: "center", margin: 8 },


  actionIconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#054536",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  tabButton: {
    alignItems: "center",
    paddingVertical: 10,
    flex: 1,
  },
  tabText: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabUnderline: {
    height: 3,
    backgroundColor: "#04523C",
    width: "50%",
  },
  section: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#04523C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    color: "#fff",
    fontSize: 12,
    overflow: "hidden",
  },
  addTokenForm: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  tokenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  tokenIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#04523C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  tokenName: {
    color: "#fff",
    fontWeight: "600",
  },
  tokenSymbol: {
    color: "#9ca3af",
    fontSize: 12,
  },
  tokenValues: {
    alignItems: "flex-end",
  },
  tokenPrice: {
    color: "#fff",
    fontSize: 14,
  },
  tokenAmount: {
    color: "#9ca3af",
    fontSize: 12,
  },
  tokenTotal: {
    color: "#10b981",
    fontWeight: "bold",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  historyToken: {
    color: "#fff",
    fontWeight: "600",
  },
  historyDate: {
    color: "#9ca3af",
    fontSize: 12,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  txId: {
    color: "#60a5fa",
    fontSize: 11,
  },
  walletItem: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedWallet: {
    borderColor: "#04523C",
    borderWidth: 1,
  },
  walletName: {
    color: "#fff",
    fontWeight: "600",
  },
  walletAddress: {
    color: "#9ca3af",
    fontSize: 12,
    maxWidth: 180,
  },
  walletBalance: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: "#04523C",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  actionBtnText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  settingLabel: {
    color: "#fff",
    fontWeight: "600",
  },
  settingDesc: {
    color: "#9ca3af",
    fontSize: 12,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
  },
  toggleTrack: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6b7280",
    backgroundColor: "#374151",
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: "#04523C",
    borderColor: "#04523C",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    margin: 2,
  },
  backupButton: {
    marginTop: 15,
    flexDirection: "row",
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  backupText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  sendButton: {
    flex: 1,
    backgroundColor: "#04523C",
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  addressText: {
    marginVertical: 10,
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    maxWidth: "100%",
  },
  copyButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
  },
  copyButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeText: {
    color: "#6b7280",
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
});

