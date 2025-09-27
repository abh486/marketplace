import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from '../../Theme/ThemeContext'; // ✅ ADDED

const AccountInformation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { details } = route.params;
  const { theme, isDarkMode } = useTheme(); // ✅ GET THEME

  // Helper to display field value or "---" except for Email which shows value always or "---" too
  const displayValue = (field) => {
    if (field.label === "Email") {
      return field.value && field.value.trim() !== "" ? field.value : "---";
    } else {
      if (field.value === null || field.value === undefined || field.value.trim() === "" || field.value === "---") {
        return "---";
      }
      return field.value;
    }
  };

  // ✅ RENDER DARK MODE — YOUR ORIGINAL CODE — 100% UNCHANGED
  if (isDarkMode) {
    return (
      <LinearGradient
        colors={["#001A13", "#003B28", "#017148ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.6)"]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#fff" /> {/* ✅ Fixed: was #000 — should be #fff in dark */}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{details?.title || "Details"}</Text>
          </View>

          <FlatList
            data={details.fields}
            keyExtractor={(item) => item.label}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{displayValue(item)}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => alert("Delete Account clicked")}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ✅ RENDER LIGHT MODE — THEMED WITH YOUR LIGHT_THEME
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{details?.title || "Details"}</Text>
      </View>

      <FlatList
        data={details.fields}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
            <Text style={[styles.value, { color: theme.textSecondary }]}>{displayValue(item)}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.border }]} />}
      />

      <TouchableOpacity
        style={[
          styles.deleteButton,
          { borderColor: theme.danger, backgroundColor: 'transparent' }
        ]}
        onPress={() => alert("Delete Account clicked")}
      >
        <Text style={[styles.deleteText, { color: theme.danger }]}>Delete Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountInformation;

// ✅ YOUR ORIGINAL STYLES — 100% UNCHANGED FOR DARK MODE ✅
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: { flex: 1, backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    backgroundColor: "transparent",
  },
  backButton: { marginRight: 10, marginTop:30},
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 30,
    color: "#fff",
    marginTop:30,
  },
  listContent: { paddingHorizontal: 20, paddingTop: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
  },
  label: { fontSize: 16, color: "#fff" },
  value: { fontSize: 16, color: "#ccc", maxWidth: "70%" },
  separator: { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  deleteButton: {
    margin: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "red",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: { color: "red", fontSize: 16, fontWeight: "600" },
});