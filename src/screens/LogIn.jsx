import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfileContext } from "../screens/Context/UserProfileContext";
import { useTheme } from "../Theme/ThemeContext"; // ✅
import auth0 from "../auth/Auth0";               // ✅ use shared Auth0

// You can replace this with your real API_KEY from currencyfreaks
const API_KEY = "da674198acff49e19108c70d4249ec26";

export default function LogIn({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const { profile, updateProfile } = useContext(UserProfileContext);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [fullPhone, setFullPhone] = useState(
    route.params?.fullPhone || profile?.phone || ""
  );
  const [verifying, setVerifying] = useState(false);

  const [exchangeRates, setExchangeRates] = useState({});
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!fullPhone) {
        try {
          const temp = await AsyncStorage.getItem("tempPhone");
          if (temp) {
            setFullPhone(temp);
          } else if (profile?.phone) {
            setFullPhone(profile.phone);
          }
        } catch (e) {
          console.log("OtpScreen: error reading tempPhone", e);
        }
      }
      setTimeout(() => inputsRef.current[0]?.focus?.(), 300);

      const fetchRates = async () => {
        setIsRatesLoading(true);
        try {
          const response = await fetch(
            `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`
          );
          const data = await response.json();
          setExchangeRates(data.rates || {});
        } catch (error) {
          console.error("Failed to fetch exchange rates", error);
        }
        setIsRatesLoading(false);
      };
      fetchRates();
    })();
  }, [profile, fullPhone]);

  const handleChange = (val, idx) => {
    if (/^\d$/.test(val)) {
      const copy = [...otp];
      copy[idx] = val;
      setOtp(copy);
      if (idx < 5) inputsRef.current[idx + 1]?.focus();
    } else if (val === "") {
      const copy = [...otp];
      copy[idx] = "";
      setOtp(copy);
    }
  };

  const formatAmountByCurrency = (amount, currencyCode, locale = "en-US") => {
    if (currencyCode === "INR") locale = "en-IN";
    else if (currencyCode === "GBP") locale = "en-GB";
    else if (currencyCode === "EUR") locale = "de-DE";
    else if (currencyCode === "AED") locale = "ar-AE";
    else if (currencyCode === "AUD") locale = "en-AU";
    else if (currencyCode === "CAD") locale = "en-CA";

    try {
      let rate = 1;
      if (exchangeRates && exchangeRates[currencyCode] && exchangeRates["USD"]) {
        rate =
          parseFloat(exchangeRates[currencyCode]) /
          parseFloat(exchangeRates["USD"]);
      } else if (currencyCode === "USD") {
        rate = 1;
      }
      const convertedAmount = amount * rate;
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedAmount);
    } catch (error) {
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP.");
      return;
    }
    if (!fullPhone) {
      Alert.alert("Error", "Phone number is missing.");
      return;
    }

    try {
      setVerifying(true);
      const credentials = await auth0.auth.loginWithSMS({
        phoneNumber: fullPhone,
        code,
      });

      if (credentials?.accessToken) {
        await AsyncStorage.setItem("accessToken", credentials.accessToken);
      }

      const userCurrency = profile?.country?.currency || "USD";
      const baseBalance = profile?.balance || 100;

      const formattedBalance = formatAmountByCurrency(
        baseBalance,
        userCurrency
      );

      const mergedProfile = {
        ...(profile || {}),
        phone: fullPhone,
        balance: formattedBalance,
        currency: userCurrency,
      };

      const res = updateProfile && updateProfile(mergedProfile);
      if (res && res.then) await res;

      navigation.replace("Home");
    } catch (err) {
      console.log("OTP verify error", err);
      Alert.alert(
        "Verification Failed",
        "OTP verification failed. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!fullPhone) {
      Alert.alert("Error", "Phone number is missing.");
      return;
    }
    try {
      await auth0.auth.passwordlessWithSMS({
        phoneNumber: fullPhone,
        send: "code",
      });
      Alert.alert("OTP Sent", `A new code was sent to ${fullPhone}`);
    } catch (err) {
      console.log("resend err", err);
      Alert.alert("Error", "Failed to resend OTP: " + (err?.message || err));
    }
  };

  if (isRatesLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkMode ? "#001A13" : "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color={isDarkMode ? "#00DB84" : "#02af6a"} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#001A13", "#003B28", "#017148ff"]
          : ["#FFFFFF", "#F5F5F5", "#FFFFFF"]
      }
      style={styles.container}
    >
      {isDarkMode && (
        <LinearGradient
          colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.6)"]}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <KeyboardAvoidingView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Verify Phone
        </Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? "#cfe9df" : "#666" }]}>
          Enter the 6-digit code sent to{"\n"}
          <Text style={{ fontWeight: "700", color: isDarkMode ? "#fff" : "#000" }}>
            {fullPhone || "your number"}
          </Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => (inputsRef.current[i] = r)}
              style={[
                styles.otpBox,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F5F5F5",
                  borderColor: isDarkMode ? "#01A97B" : "#02af6a",
                  color: isDarkMode ? "#fff" : "#000",
                },
              ]}
              value={digit}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(val) => handleChange(val, i)}
              selectionColor={isDarkMode ? "#01A97B" : "#02af6a"}
              returnKeyType="next"
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && !otp[i] && i > 0) {
                  inputsRef.current[i - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleResend}>
          <Text
            style={[
              styles.resendText,
              { color: isDarkMode ? "#cfe9df" : "#02af6a" },
            ]}
          >
            Didn't get code? Resend
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkMode ? "#01A97B" : "#02af6a" },
            verifying && { opacity: 0.7 },
          ]}
          onPress={handleVerify}
          disabled={verifying}
        >
          <Text style={styles.buttonText}>
            {verifying ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 18,
    alignSelf: "center",
    gap: 7,
    marginRight: 20,
  },
  otpBox: {
    width: 50,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
  },
  resendText: {
    marginBottom: 18,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignSelf: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
