import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CountryPicker from "react-native-country-picker-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfileContext } from "../screens/Context/UserProfileContext";
import { useTheme } from "../Theme/ThemeContext"; // ✅
import auth0 from "../auth/Auth0";               // ✅ use shared Auth0

const getDefaultsForCountry = (cca2) => {
  switch ((cca2 || "").toUpperCase()) {
    case "IN":
      return { currency: "INR", balance: 10000 };
    case "US":
      return { currency: "USD", balance: 100 };
    case "GB":
      return { currency: "GBP", balance: 90 };
    case "AE":
      return { currency: "AED", balance: 367 };
    case "AU":
      return { currency: "AUD", balance: 140 };
    case "CA":
      return { currency: "CAD", balance: 130 };
    case "DE":
      return { currency: "EUR", balance: 90 };
    default:
      return { currency: "USD", balance: 50 };
  }
};

export default function SignUp({ navigation }) {
  const { isDarkMode } = useTheme();
  const { updateProfile } = useContext(UserProfileContext);

  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [flagEmoji, setFlagEmoji] = useState("🇮🇳");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 4) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    const fullPhone = `+${callingCode}${phoneNumber.trim()}`;
    const defaults = getDefaultsForCountry(countryCode);

    const userData = {
      phone: fullPhone,
      country: {
        code: countryCode,
        dialCode: `+${callingCode}`,
        flag: flagEmoji,
        currency: defaults.currency,
      },
      balance: defaults.balance,
    };

    await updateProfile(userData);

    try {
      await AsyncStorage.setItem("tempPhone", fullPhone);
    } catch (e) {
      console.log("tempPhone save error", e);
    }

    try {
      setSending(true);
      await auth0.auth.passwordlessWithSMS({
        phoneNumber: fullPhone,
        send: "code",
      });
      navigation.navigate("LogIn", { fullPhone });
    } catch (err) {
      console.log("send otp err", err);
      Alert.alert("Error", "Failed to send OTP: " + (err?.message || err));
    } finally {
      setSending(false);
    }
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#001A13", "#003B28", "#017148ff"]
          : ["#FFFFFF", "#F5F5F5", "#FFFFFF"]
      }
      style={StyleSheet.absoluteFillObject}
    >
      {isDarkMode && (
        <LinearGradient
          colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.6)"]}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <Image source={require("../assets/image/logo.png")} style={styles.logo} />
      <Text style={[styles.welcome, { color: isDarkMode ? "#cfe9df" : "#666" }]}>
        Hi! Welcome to{" "}
        <Text style={[styles.appName, { color: isDarkMode ? "#01A97B" : "#02af6a" }]}>
          CopyM
        </Text>
      </Text>
      <Text style={[styles.create, { color: isDarkMode ? "#cfe9df" : "#666" }]}>
        Create your account
      </Text>
      <Text style={[styles.infor, { color: isDarkMode ? "#aaa" : "#999" }]}>
        Enter Your Mobile Number
      </Text>

      <View
        style={[
          styles.phoneRow,
          {
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "#F5F5F5",
            borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#E0E0E0",
          },
        ]}
      >
        <CountryPicker
          countryCode={countryCode}
          withFlag
          withCallingCode
          withFilter
          withEmoji
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode?.[0] ?? callingCode);
            setFlagEmoji(country.emoji ?? "");
          }}
          containerButtonStyle={{ marginRight: 8 }}
        />
        <Text style={[styles.dialCode, { color: isDarkMode ? "#fff" : "#000" }]}>
          +{callingCode}
        </Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="9876543210"
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          keyboardType="phone-pad"
          style={[styles.input, { color: isDarkMode ? "#fff" : "#000" }]}
        />
      </View>

      <Text style={[styles.info, { color: isDarkMode ? "#cfe9df" : "#666" }]}>
        We will send you a confirmation code
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDarkMode ? "#01A97B" : "#02af6a" },
          sending ? { opacity: 0.7 } : null,
        ]}
        onPress={handleContinue}
        disabled={sending}
      >
        <Text style={styles.buttonText}>
          {sending ? "Sending..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logo: { width: 130, height: 130, marginTop: 30, marginBottom: -30 },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 10,
  },
  appName: { fontWeight: "700" },
  create: { fontSize: 14, marginBottom: 58, marginLeft: 10 },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
    marginLeft: 10,
  },
  dialCode: { marginRight: 8, fontSize: 16 },
  infor: { marginTop: 10, marginBottom: 10, marginLeft: 14 },
  input: { flex: 1, fontSize: 16 },
  info: { marginTop: 10, marginBottom: 10, marginLeft: 14 },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    width: "95%",
    alignItems: "center",
    marginTop: 340,
    marginLeft: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
