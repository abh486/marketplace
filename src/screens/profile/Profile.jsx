import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { UserProfileContext } from "../Context/UserProfileContext";
import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../../Theme/ThemeContext'; // ✅ ADDED

const CURRENCIES = [
  { label: "USD ($)", value: "USD" },
  { label: "INR (₹)", value: "INR" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "JPY (¥)", value: "JPY" },
  { label: "CAD (C$)", value: "CAD" },
  { label: "AUD (A$)", value: "AUD" },
  { label: "SGD (S$)", value: "SGD" },
  { label: "ZAR (R)", value: "ZAR" },
  { label: "AED (د.إ)", value: "AED" },
];

const API_KEY = "740b5229de0741969e46c53db4bb611c";
const BASE_CURRENCY = "INR";
const BASE_AMOUNT = 200000;

const Profile = () => {
  const { profile, updateCurrency } = useContext(UserProfileContext);
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme(); // ✅ GET THEME

  const [profileCompletion] = useState(80);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));
  const [selectedCurrency, setSelectedCurrency] = useState(profile?.currency || "USD");
  const [kycVerified, setKycVerified] = useState(profile?.kycVerified || false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(progressAnim, { toValue: profileCompletion, duration: 1200, useNativeDriver: false }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      setIsRatesLoading(true);
      try {
        const response = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`);
        const data = await response.json();
        setExchangeRates(data.rates || {});
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
      }
      setIsRatesLoading(false);
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (profile?.currency && profile.currency !== selectedCurrency) {
      setSelectedCurrency(profile.currency);
    }
    if (profile?.kycVerified !== undefined) {
      setKycVerified(profile.kycVerified);
    }
  }, [profile?.currency, profile?.kycVerified]);

  const onCurrencyChange = async (newCurrency) => {
    if (newCurrency !== selectedCurrency) {
      setSelectedCurrency(newCurrency);
      await updateCurrency(newCurrency);
      setShowCurrencyModal(false);
      Alert.alert("Currency Updated", `Your currency has been changed to ${newCurrency}`);
    }
  };

  const formatAmountByCurrency = (amount, currencyCode, locale = "en-US") => {
    try {
      let rate = 1;
      if (
        exchangeRates &&
        exchangeRates[currencyCode] &&
        exchangeRates[BASE_CURRENCY]
      ) {
        rate = parseFloat(exchangeRates[currencyCode]) / parseFloat(exchangeRates[BASE_CURRENCY]);
      } else if (currencyCode === BASE_CURRENCY) {
        rate = 1;
      }
      const convertedAmount = amount * rate;
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedAmount);
    } catch (error) {
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  };

  const onContactItemPress = (section, label) => {
    if (section === "My Account" && label === "Personal Information") {
      const details = {
        title: "Account Information",
        fields: [
          { label: "Username", value: profile?.username || "---" },
          { label: "Email", value: profile?.email || "---" },
          { label: "Phone number", value: profile?.phoneNumber || "---" },
          { label: "Legal name", value: profile?.legalName || "---" },
          { label: "Date of birth", value: profile?.dob || "---" },
        ],
      };
      navigation.navigate("PersonalInfo", { details });
    } 
    else if (section === "My Account" && label === "Linked Bank Accounts") {
      navigation.navigate("LinkedBankAccountsScreen");
    } 
    else {
      Alert.alert(`${label}`, "This section is under construction.");
    }
  };

  // ✅ DYNAMIC STYLES — for light mode only
  const lightStyles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 60 },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 16,
      position: "relative",
      backgroundColor: theme.background,
    },
    backButton: {
      position: "absolute",
      left: 16,
      top: 50,
      padding: 10,
      zIndex: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: "600", color: theme.text },
    profileSection: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, marginBottom: 20 },
    profileImageContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 2,
      borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    profilePhotoImage: { width: "100%", height: "100%", borderRadius: 35 },
    profileInfo: { flex: 1, marginLeft: 14 },
    nameContainer: { flexDirection: "row", alignItems: "center" },
    profileName: { fontSize: 18, fontWeight: "600", color: theme.text },
    profileEmail: { color: theme.textSecondary, marginTop: 4 },
    unverifiedContainer: { 
      borderRadius: 16, 
      padding: 16, 
      marginHorizontal: 20, 
      marginBottom: 20,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    unverifiedTextWrapper: { flex: 1 },
    unverifiedTitle: { fontWeight: "700", fontSize: 16, marginBottom: 6, color: theme.danger },
    unverifiedSubtitle: { fontSize: 13, color: theme.textSecondary, marginBottom: 12 },
    unverifiedButton: { 
      backgroundColor: theme.primary, 
      borderRadius: 25, 
      paddingHorizontal: 18, 
      paddingVertical: 8, 
      alignSelf: "flex-start" 
    },
    unverifiedButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    section: { marginHorizontal: 20, marginBottom: 30 },
    sectionTitle: { fontWeight: "700", fontSize: 18, color: theme.text, marginBottom: 16 },
    card: { 
      backgroundColor: theme.card, 
      borderRadius: 16, 
      overflow: "hidden", 
      borderWidth: 1, 
      borderColor: theme.border 
    },
    contactItem: { 
      flexDirection: "row", 
      paddingVertical: 16, 
      paddingHorizontal: 20, 
      borderBottomWidth: 1, 
      borderBottomColor: theme.border, 
      justifyContent: "space-between", 
      alignItems: "center" 
    },
    contactLabel: { fontSize: 16, color: theme.text },
    contactValueContainer: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
    contactValue: { fontSize: 15, color: theme.textSecondary, marginRight: 6 },
    emptyValue: { color: theme.textSecondary, fontStyle: "italic" },
    modalOverlay: { 
      flex: 1, 
      backgroundColor: "rgba(0,0,0,0.6)", 
      justifyContent: "center", 
      alignItems: "center" 
    },
    modalContent: { 
      width: "85%", 
      backgroundColor: theme.card, 
      borderRadius: 16, 
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16, color: theme.text, textAlign: "center" },
    currencyOption: { 
      paddingVertical: 12, 
      paddingHorizontal: 16, 
      borderBottomWidth: 1, 
      borderColor: theme.border 
    },
    currencyOptionSelected: { backgroundColor: `${theme.primary}20` },
    currencyOptionText: { fontSize: 16, color: theme.text },
    currencyOptionTextSelected: { color: theme.primary, fontWeight: "700" },
    closeBtn: { 
      marginTop: 16, 
      paddingVertical: 10, 
      borderRadius: 25, 
      backgroundColor: theme.primary, 
      alignItems: "center" 
    },
    closeBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  }), [theme]);

  const ContactItem = ({ label, value, isEmpty = false, onPress }) => (
    <Pressable
      style={({ pressed }) => [
        isDarkMode ? styles.contactItem : lightStyles.contactItem,
        pressed && { backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : `${theme.primary}10` }
      ]}
      onPress={onPress}
    >
      <Text style={isDarkMode ? styles.contactLabel : lightStyles.contactLabel}>{label}</Text>
      <View style={isDarkMode ? styles.contactValueContainer : lightStyles.contactValueContainer}>
        {value && <Text style={[
          isDarkMode ? styles.contactValue : lightStyles.contactValue,
          isEmpty && (isDarkMode ? styles.emptyValue : lightStyles.emptyValue)
        ]}>{value}</Text>}
        <Icon name="chevron-right" size={18} color={isDarkMode ? "#bbb" : theme.textSecondary} />
      </View>
    </Pressable>
  );

  const AccountUnverifiedBanner = () => (
    isDarkMode ? (
      <LinearGradient
        colors={["#2d564a", "#1b2c28"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.unverifiedContainer}
      >
        <View style={styles.unverifiedTextWrapper}>
          <Text style={styles.unverifiedTitle}>⚠️ Account Unverified</Text>
          <Text style={styles.unverifiedSubtitle}>
            Verify your account to lift limits and enable full transactions.
          </Text>
          <TouchableOpacity style={styles.unverifiedButton} onPress={() => setKycVerified(true)}>
            <Text style={styles.unverifiedButtonText}>Verify Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    ) : (
      <View style={lightStyles.unverifiedContainer}>
        <View style={lightStyles.unverifiedTextWrapper}>
          <Text style={lightStyles.unverifiedTitle}>⚠️ Account Unverified</Text>
          <Text style={lightStyles.unverifiedSubtitle}>
            Verify your account to lift limits and enable full transactions.
          </Text>
          <TouchableOpacity style={lightStyles.unverifiedButton} onPress={() => setKycVerified(true)}>
            <Text style={lightStyles.unverifiedButtonText}>Verify Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );

  const AccountVerifiedBanner = () => (
    isDarkMode ? (
      <LinearGradient
        colors={["#2d564a", "#2b3a37ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.unverifiedContainer}
      >
        <View style={styles.unverifiedTextWrapper}>
          <Text style={[styles.unverifiedTitle, { color: "#00DB84" }]}>✅ Account Verified</Text>
          <Text style={styles.unverifiedSubtitle}>Your account is fully verified and ready to use.</Text>
        </View>
      </LinearGradient>
    ) : (
      <View style={lightStyles.unverifiedContainer}>
        <View style={lightStyles.unverifiedTextWrapper}>
          <Text style={[lightStyles.unverifiedTitle, { color: theme.success }]}>✅ Account Verified</Text>
          <Text style={lightStyles.unverifiedSubtitle}>Your account is fully verified and ready to use.</Text>
        </View>
      </View>
    )
  );

  if (isDarkMode) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <Navbar />

        <LinearGradient
          colors={["#001A13", "#003B28", "#017148ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.6)"]}
            style={StyleSheet.absoluteFillObject}
          />
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} hitSlop={10} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <Animated.View style={[styles.profileSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: profile?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" }}
                style={styles.profilePhotoImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{profile?.name || "User Name"}</Text>
                {kycVerified && <Icon name="check-circle" size={18} color="#00DB84" style={{ marginLeft: 8 }} />}
              </View>
              <Text style={styles.profileEmail}>{profile?.email || "user@email.com"}</Text>
            </View>
          </Animated.View>

          {!kycVerified ? <AccountUnverifiedBanner /> : <AccountVerifiedBanner />}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Account</Text>
            <View style={styles.card}>
              <ContactItem
                label="Personal Information"
                onPress={() => onContactItemPress("My Account", "Personal Information")}
              />
              <ContactItem
                label="Linked Bank Accounts"
                onPress={() => onContactItemPress("My Account", "Linked Bank Accounts")}
              />
              <ContactItem
                label="Transaction Limits"
                value={`${formatAmountByCurrency(BASE_AMOUNT, selectedCurrency)}/mo`}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
              <ContactItem label="Language" value="English" />
              <ContactItem label="Currency" value={selectedCurrency} onPress={() => setShowCurrencyModal(true)} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security & Privacy</Text>
            <View style={styles.card}>
              <ContactItem label="2FA Authentication" value="Enabled" />
              <ContactItem label="Change Password" />
              <ContactItem label="Login Activity" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referrals</Text>
            <View style={styles.card}>
              <ContactItem
                label="Invite Friends"
                onPress={() => Alert.alert("Invite Friends", "Share your referral code!")}
              />
              <ContactItem
                label="Rewards"
                onPress={() => Alert.alert("Rewards", "View your referral rewards!")}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support & Legal</Text>
            <View style={styles.card}>
              <ContactItem label="Help Center" />
              <ContactItem label="FAQs" />
              <ContactItem label="Terms & Conditions" />
              <ContactItem label="Privacy Policy" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App</Text>
            <View style={styles.card}>
              <ContactItem label="App Version" value="v1.0.0" />
              <ContactItem label="Logout" onPress={() => Alert.alert("Logged out")} />
            </View>
          </View>
        </ScrollView>

        <BottomNav />

        <Modal visible={showCurrencyModal} transparent animationType="slide" onRequestClose={() => setShowCurrencyModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <FlatList
                data={CURRENCIES}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={[styles.currencyOption, item.value === selectedCurrency && styles.currencyOptionSelected]}
                    onPress={() => onCurrencyChange(item.value)}
                  >
                    <Text style={[styles.currencyOptionText, item.value === selectedCurrency && styles.currencyOptionTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCurrencyModal(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ✅ LIGHT MODE
  return (
    <SafeAreaView style={lightStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      <Navbar />

      <ScrollView style={lightStyles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={lightStyles.scrollContent}>
        <View style={lightStyles.header}>
          <TouchableOpacity style={lightStyles.backButton} hitSlop={10} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={lightStyles.headerTitle}>Profile</Text>
        </View>

        <Animated.View style={[lightStyles.profileSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={lightStyles.profileImageContainer}>
            <Image
              source={{ uri: profile?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" }}
              style={lightStyles.profilePhotoImage}
              resizeMode="cover"
            />
          </View>
          <View style={lightStyles.profileInfo}>
            <View style={lightStyles.nameContainer}>
              <Text style={lightStyles.profileName}>{profile?.name || "User Name"}</Text>
              {kycVerified && <Icon name="check-circle" size={18} color={theme.success} style={{ marginLeft: 8 }} />}
            </View>
            <Text style={lightStyles.profileEmail}>{profile?.email || "user@email.com"}</Text>
          </View>
        </Animated.View>

        {!kycVerified ? <AccountUnverifiedBanner /> : <AccountVerifiedBanner />}

        <View style={lightStyles.section}>
          <Text style={lightStyles.sectionTitle}>My Account</Text>
          <View style={lightStyles.card}>
            <ContactItem
              label="Personal Information"
              onPress={() => onContactItemPress("My Account", "Personal Information")}
            />
            <ContactItem
              label="Linked Bank Accounts"
              onPress={() => onContactItemPress("My Account", "Linked Bank Accounts")}
            />
            <ContactItem
              label="Transaction Limits"
              value={`${formatAmountByCurrency(BASE_AMOUNT, selectedCurrency)}/mo`}
            />
          </View>
        </View>

        <View style={lightStyles.section}>
          <Text style={lightStyles.sectionTitle}>Preferences</Text>
          <View style={lightStyles.card}>
            <ContactItem label="Language" value="English" />
            <ContactItem label="Currency" value={selectedCurrency} onPress={() => setShowCurrencyModal(true)} />
          </View>
        </View>

        <View style={lightStyles.section}>
          <Text style={lightStyles.sectionTitle}>Security & Privacy</Text>
          <View style={lightStyles.card}>
            <ContactItem label="2FA Authentication" value="Enabled" />
            <ContactItem label="Change Password" />
            <ContactItem label="Login Activity" />
          </View>
        </View>

        <View style={lightStyles.section}>
          <Text style={lightStyles.sectionTitle}>Referrals</Text>
          <View style={lightStyles.card}>
            <ContactItem
              label="Invite Friends"
              onPress={() => Alert.alert("Invite Friends", "Share your referral code!")}
            />
            <ContactItem
              label="Rewards"
              onPress={() => Alert.alert("Rewards", "View your referral rewards!")}
            />
          </View>
        </View>

        <View style={lightStyles.section}>
          <Text style={lightStyles.sectionTitle}>Support & Legal</Text>
          <View style={lightStyles.card}>
            <ContactItem label="Help Center" />
            <ContactItem label="FAQs" />
            <ContactItem label="Terms & Conditions" />
            <ContactItem label="Privacy Policy" />
          </View>
        </View>

        <View style={lightStyles.section}>
          <Text style={lightStyles.sectionTitle}>App</Text>
          <View style={lightStyles.card}>
            <ContactItem label="App Version" value="v1.0.0" />
            <ContactItem label="Logout" onPress={() => Alert.alert("Logged out")} />
          </View>
        </View>
      </ScrollView>

      <BottomNav />

      <Modal visible={showCurrencyModal} transparent animationType="slide" onRequestClose={() => setShowCurrencyModal(false)}>
        <View style={lightStyles.modalOverlay}>
          <View style={lightStyles.modalContent}>
            <Text style={lightStyles.modalTitle}>Select Currency</Text>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[lightStyles.currencyOption, item.value === selectedCurrency && lightStyles.currencyOptionSelected]}
                  onPress={() => onCurrencyChange(item.value)}
                >
                  <Text style={[lightStyles.currencyOptionText, item.value === selectedCurrency && lightStyles.currencyOptionTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
            <TouchableOpacity style={lightStyles.closeBtn} onPress={() => setShowCurrencyModal(false)}>
              <Text style={lightStyles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

// ✅ YOUR ORIGINAL STYLES — 100% UNCHANGED FOR DARK MODE ✅
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 50,
    padding: 10,
    zIndex: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#fff" },
  profileSection: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, marginBottom: 20 },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#00DB84",
    shadowColor: "#00FFAE",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  profilePhotoImage: { width: "100%", height: "100%", borderRadius: 35 },
  profileInfo: { flex: 1, marginLeft: 14 },
  nameContainer: { flexDirection: "row", alignItems: "center" },
  profileName: { fontSize: 18, fontWeight: "600", color: "#fff" },
  profileEmail: { color: "#ccc", marginTop: 4 },
  unverifiedContainer: { borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 20 },
  unverifiedTextWrapper: { flex: 1 },
  unverifiedTitle: { fontWeight: "700", fontSize: 16, marginBottom: 6, color: "#fff" },
  unverifiedSubtitle: { fontSize: 13, color: "#e0e0e0", marginBottom: 12 },
  unverifiedButton: { backgroundColor: "#00DB84", borderRadius: 25, paddingHorizontal: 18, paddingVertical: 8, alignSelf: "flex-start" },
  unverifiedButtonText: { color: "#001A13", fontWeight: "700", fontSize: 14 },
  section: { marginHorizontal: 20, marginBottom: 30 },
  sectionTitle: { fontWeight: "700", fontSize: 18, color: "#fff", marginBottom: 16 },
  card: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  contactItem: { flexDirection: "row", paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)", justifyContent: "space-between", alignItems: "center" },
  contactLabel: { fontSize: 16, color: "#fff" },
  contactValueContainer: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  contactValue: { fontSize: 15, color: "#bbb", marginRight: 6 },
  emptyValue: { color: "#aaa", fontStyle: "italic" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#002822", borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16, color: "#fff", textAlign: "center" },
  currencyOption: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  currencyOptionSelected: { backgroundColor: "rgba(0,219,132,0.1)" },
  currencyOptionText: { fontSize: 16, color: "#fff" },
  currencyOptionTextSelected: { color: "#00DB84", fontWeight: "700" },
  closeBtn: { marginTop: 16, paddingVertical: 10, borderRadius: 25, backgroundColor: "#00DB84", alignItems: "center" },
  closeBtnText: { color: "#001A13", fontSize: 16, fontWeight: "700" },
});