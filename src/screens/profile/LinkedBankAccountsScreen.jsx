import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from '../../Theme/ThemeContext'; // ✅ ADDED

const { width } = Dimensions.get("window");

const LinkedBankAccountsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme(); // ✅ GET THEME

  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, bankName: "HDFC Bank", accountNumber: "**** 2345", isDefault: true },
    { id: 2, bankName: "ICICI Bank", accountNumber: "**** 9876", isDefault: false },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newBankName, setNewBankName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");

  const handleAddBank = () => {
    if (!newBankName || !newAccountNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newBank = {
      id: bankAccounts.length + 1,
      bankName: newBankName,
      accountNumber: `**** ${newAccountNumber.slice(-4)}`,
      isDefault: false,
    };

    setBankAccounts([...bankAccounts, newBank]);
    setModalVisible(false);
    setNewBankName("");
    setNewAccountNumber("");
  };

  // ✅ DYNAMIC STYLES
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },
    bankCard: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    bankInfo: {
      flex: 1,
    },
    bankName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    accountNumber: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
    defaultBadge: {
      backgroundColor: isDarkMode ? "rgba(168, 230, 161, 0.2)" : "rgba(0,219,132,0.1)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: "flex-start",
      marginTop: 6,
    },
    defaultText: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: "600",
    },
    addButton: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    addIconContainer: {
      marginRight: 12,
    },
    addButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "500",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.8)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 20,
      textAlign: "center",
    },
    modalInput: {
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 50,
      color: theme.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 20,
    },
    cancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    cancelText: {
      color: theme.textSecondary,
      fontSize: 16,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    saveText: {
      color: isDarkMode ? "#000" : "#fff", // Dark text on light green, white on dark green
      fontSize: 16,
      fontWeight: "600",
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

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Linked Bank Accounts</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Accounts List */}
          {bankAccounts.map((bank) => (
            <View key={bank.id} style={styles.bankCard}>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{bank.bankName}</Text>
                <Text style={styles.accountNumber}>{bank.accountNumber}</Text>
                {bank.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <MaterialIcons name="more-vert" size={24} color={theme.textSecondary} />
            </View>
          ))}

          {/* Add Bank Button */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <View style={styles.addIconContainer}>
              <Ionicons name="add-circle" size={24} color={theme.primary} />
            </View>
            <Text style={styles.addButtonText}>Add New Bank Account</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Add Bank Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Bank Account</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Bank Name"
                placeholderTextColor={theme.textSecondary}
                value={newBankName}
                onChangeText={setNewBankName}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Account Number"
                placeholderTextColor={theme.textSecondary}
                value={newAccountNumber}
                onChangeText={setNewAccountNumber}
                keyboardType="numeric"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddBank}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default LinkedBankAccountsScreen;