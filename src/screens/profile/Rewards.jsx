import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../../Theme/ThemeContext"; // Add your theme hook import

const { width } = Dimensions.get("window");

const Rewards = () => {
  const { theme, isDarkMode } = useTheme(); // Get theme & mode

  const [activeTab, setActiveTab] = useState("available");

  // Mock Data
  const availableRewards = [
    { id: "1", points: "500", label: "Referral Bonus", expiry: "in 14 days" },
    { id: "2", points: "200", label: "First RWA Investment", expiry: "in 30 days" },
    { id: "3", points: "150", label: "KYC Complete", expiry: "in 5 days" },
  ];

  const redeemedRewards = [
    { id: "6", points: "500", label: "10 USDC", date: "Mar 10, 2024" },
    { id: "7", points: "200", label: "0.001 ETH Gas", date: "Feb 25, 2024" },
  ];

  const rewardHistory = [
    { id: "4", points: "300", label: "Early Adopter", date: "Mar 5, 2024" },
    { id: "5", points: "100", label: "Social Share", date: "Feb 20, 2024" },
  ];

  const totalPoints = 850;

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Join me on AssetChain — where real-world assets meet blockchain. Earn token rewards on real estate, gold & more! 🏢🪙",
        url: "https://assetchain.marketplace/ref/abc123",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share link.");
    }
  };

  const renderRewardItem = (item, type) => (
    <View
      key={item.id}
      style={[
        styles.rewardItem,
        { backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : theme.card, borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : theme.border }
      ]}
    >
      <View style={styles.pointsBox}>
        <Text style={[styles.pointsText, { color: theme.text }]}>{item.points}</Text>
        <Text style={[styles.pointsLabel, { color: theme.textSecondary }]}>pts</Text>
      </View>
      <View style={styles.rewardInfo}>
        <Text style={[styles.rewardLabel, { color: theme.text }]} numberOfLines={1}>
          {item.label}
        </Text>
        <Text style={[styles.rewardMeta, { color: theme.textSecondary }]}>
          {type === "available" && `Expires ${item.expiry}`}
          {type === "redeemed" && `Redeemed on ${item.date}`}
          {type === "history" && `Earned on ${item.date}`}
        </Text>
      </View>
      {type === "available" ? (
        <TouchableOpacity
          style={[styles.redeemButton, { backgroundColor: theme.primary }]}
          onPress={() => Alert.alert("Redeemed!", `You've used ${item.points} points.`)}
        >
          <Text style={[styles.redeemText]}>{/* Keep white text here */}Redeem</Text>
        </TouchableOpacity>
      ) : (
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
      )}
    </View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }]}>
      {/* Use a conditional gradient background for dark mode or simple background for light mode */}
      {isDarkMode ? (
        <>
          <LinearGradient
            colors={["#001A13", "#003B28", "#017148"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.7)"]}
            style={StyleSheet.absoluteFill}
          />
        </>
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />
      )}

      <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Rewards</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Earn points on real estate, commodities & tokenised assets
          </Text>
        </View>

        {/* Compact Total Points Card */}
        <View style={[
          styles.totalCard,
          {
            backgroundColor: isDarkMode ? undefined : theme.card, // no background in dark (gradient used) else card bg in light
            borderColor: theme.border,
          }
        ]}>
          {isDarkMode ? (
            <LinearGradient
              colors={["#04523C", "#001A13"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={styles.totalContent}>
            <View style={styles.totalInfo}>
              <Text style={[styles.totalLabel, { color: isDarkMode ? "rgba(255,255,255,0.8)" : theme.textSecondary }]}>Total Points</Text>
              <Text style={[styles.totalPoints, { color: "#4CAF50" }]}>{totalPoints.toLocaleString()}</Text>
            </View>
            <Ionicons name="star" size={32} color="#FFD700" />
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { backgroundColor: "#4CAF50" }]} />
          </View>
          <Text style={[styles.progressLabel, { color: isDarkMode ? "rgba(255,255,255,0.6)" : theme.textSecondary }]}>60% to VIP Tier</Text>
        </View>

        {/* Refer a Friend Card */}
        <View
          style={[
            styles.referralCard,
            {
              backgroundColor: isDarkMode ? undefined : theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {isDarkMode ? (
            <LinearGradient
              colors={["#015B38", "#017148", "#009664"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={styles.referralContent}>
            <Ionicons name="person-add" size={24} color={isDarkMode ? "#A8E6A1" : theme.primary} />
            <View style={styles.referralText}>
              <Text style={[styles.referralTitle, { color: isDarkMode ? "#A8E6A1" : theme.text }]} >Invite Investors</Text>
              <Text style={[styles.referralDesc, { color: isDarkMode ? "rgba(255,255,255,0.8)" : theme.textSecondary }]}>
                Earn 500 pts when they buy tokenised real estate or gold
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.gradientButton} onPress={handleShare}>
            <LinearGradient
              colors={["#A8E6A1", "#8FDB8B", "#7CC67A"]}
              style={styles.gradientButtonInner}
            >
              <Ionicons name="share-social" size={18} color="#017148" />
              <Text style={styles.gradientButtonText}>Share</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : theme.card }]}>
          {["available", "redeemed", "history"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && { backgroundColor: theme.primary, borderRadius: 8 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === tab ? theme.background : theme.textSecondary,
                    fontWeight: activeTab === tab ? "700" : "600",
                  },
                ]}
              >
                {tab === "available" ? "Available" : tab === "redeemed" ? "Redeemed" : "History"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rewards List */}
        <View style={styles.listContainer}>
          {activeTab === "available"
            ? availableRewards.map((item) => renderRewardItem(item, "available"))
            : activeTab === "redeemed"
            ? redeemedRewards.map((item) => renderRewardItem(item, "redeemed"))
            : rewardHistory.map((item) => renderRewardItem(item, "history"))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Rewards;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  totalCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  totalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalPoints: {
    fontSize: 24,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    width: "60%",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
  },
  referralCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
  },
  referralContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  referralText: {
    flex: 1,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  referralDesc: {
    fontSize: 13,
  },
  gradientButton: {
    marginLeft: 10,
  },
  gradientButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  gradientButtonText: {
    color: "#017148",
    fontWeight: "600",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    gap: 12,
  },
  rewardItem: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  pointsBox: {
    alignItems: "center",
    marginRight: 16,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "700",
  },
  pointsLabel: {
    fontSize: 11,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  rewardMeta: {
    fontSize: 12,
  },
  redeemButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  redeemText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
