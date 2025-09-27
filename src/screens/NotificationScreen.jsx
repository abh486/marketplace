import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../Theme/ThemeContext"; // ✅ ADDED

const initialNotifications = [
  { key: "1", title: "Portfolio updated", message: "A new asset was added to your portfolio." },
  { key: "2", title: "Market Insight", message: "Copper prices up 6% in Middle East." },
  { key: "3", title: "Security alert", message: "We detected a new login from Dubai. Please verify your activity for security." },
  { key: "4", title: "We are live!", message: "New collectibles now available in the marketplace." }
];

export default function NotificationScreen({ navigation, setHomeBadgeCount }) {
  const { isDarkMode } = useTheme(); // ✅ ADDED
  const [isEnabled, setIsEnabled] = useState(true);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Update badge count in home
  useEffect(() => {
    if(setHomeBadgeCount) setHomeBadgeCount(notifications.length);
  }, [notifications, setHomeBadgeCount]);

  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  // Swipe to right handler to remove item without delete button
  const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;
    if (value > 75) {
      // Remove the item when swipe passes threshold (swipe right)
      const newData = notifications.filter(item => item.key !== key);
      setNotifications(newData);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#001A13" : "#FFFFFF" }]}>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: isDarkMode ? "#aaa" : "#666" }]}>Enable Notifications</Text>
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          trackColor={{ true: isDarkMode ? "#42e7a2" : "#02af6a", false: "#ccc" }}
          thumbColor={isEnabled ? (isDarkMode ? "#0F7A58" : "#02af6a") : "#fff"}
          ios_backgroundColor={isDarkMode ? "#444" : "#ccc"}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} // Smaller round switch
        />
      </View>
      <View style={styles.headerBadgeRow}>
        <Text style={[styles.header, { color: isDarkMode ? "#fff" : "#000" }]}>Unread</Text>
      </View>
      
      <SwipeListView
        data={notifications}
        renderItem={({ item }) => (
          <View style={[styles.notificationItem, { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" }]}>
            <Icon name="bell" size={18} color={isDarkMode ? "#42e7a2" : "#02af6a"} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>{item.title}</Text>
              <Text style={[styles.message, { color: isDarkMode ? "#eee" : "#666" }]}>{item.message}</Text>
            </View>
          </View>
        )}
        renderHiddenItem={() => <View />} // No delete button shown
        rightOpenValue={0} // Disable right swipe revealing any button
        leftOpenValue={100} // Swipe right distance threshold
        onSwipeValueChange={onSwipeValueChange}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ✅ Styles — PRESERVED YOUR DARK THEME, ADDED LIGHT THEME
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
    marginTop:30,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: "bold",
  },
  headerBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  header: {
    fontSize:15,
    fontWeight: "bold",
    marginRight: 6,
  },
  notificationItem: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    marginBottom: 11,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
  },
  message: {
    fontSize: 13,
    marginTop: 1,
  },
});