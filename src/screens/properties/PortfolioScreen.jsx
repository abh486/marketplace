import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LineChart } from "react-native-chart-kit";

import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";

const W = Dimensions.get("window").width;

export default function PortfolioScreen() {
  const [selectedRange, setSelectedRange] = useState("1M");
  const [filter, setFilter] = useState("All");

  // Mock Portfolio Data
  const portfolioValue = 84230;
  const gainPercent = 12.7;

  const assets = [
    {
      id: 1,
      name: "Dubai Tower Residence",
      type: "Real Estate",
      shares: 10,
      currentValue: 65000,
      roi: 9.5,
      icon: require("../../assets/image/apar.jpg"), // Replace with real image
    },
    {
      id: 2,
      name: "Gold Bullion Token",
      type: "Commodities",
      shares: "2g",
      currentValue: 12000,
      roi: 5.2,
      roiColor: "#FFD700",
      icon: require("../../assets/image/apar.jpg"),
    },
    {
      id: 3,
      name: "Modern Art Collection",
      type: "Fine Art",
      shares: 15,
      currentValue: 7230,
      roi: 18.3,
      icon: require("../../assets/image/apar.jpg"),
    },
  ];

  const recentActivity = [
    { id: 1, action: "Bought", asset: "Gold Bullion Token", amount: "1g", time: "2h ago" },
    { id: 2, action: "Dividend Received", asset: "Dubai Tower Residence", amount: "$240", time: "1d ago" },
    { id: 3, action: "Sold", asset: "Tech Startup Token", amount: "-$1,200", time: "3d ago" },
  ];

  // Chart Data (7 days to 1 year based on range)
  const getChartData = () => {
    switch (selectedRange) {
      case "D":
        return [2, 2.1, 2.05, 2.2, 2.15, 2.3, 2.4];
      case "1W":
        return [2, 2.1, 2.05, 2.2, 2.15, 2.3, 2.4];
      case "1M":
        return [2, 2.1, 2.3, 2.2, 2.4, 2.6, 2.8, 3.0, 3.1, 3.3, 3.2, 3.5, 3.7, 3.8, 3.9, 4.1, 4.3, 4.2, 4.5, 4.7, 4.8, 5.0, 5.1, 5.3, 5.5, 5.7, 5.8, 6.0, 6.1, 6.3, 6.5];
      case "YTD":
        return Array(12).fill(0).map((_, i) => 2 + Math.sin(i * 0.5) * 0.3 + i * 0.3);
      case "1Y":
        return Array(12).fill(0).map((_, i) => 2 + Math.sin(i * 0.7) * 0.5 + i * 0.4);
      default:
        return [2, 3.2, 3.25, 5.8, 5.65, 6.0, 4.95, 5.5, 6.3, 6.28, 6.6, 6.55, 6.8, 7];
    }
  };

  const data = getChartData();

  const filteredAssets = filter === "All" ? assets : assets.filter((a) => a.type === filter);

  return (
    <View style={{ flex: 1 }}>
      {/* Background */}
      <LinearGradient
        colors={["#0f2027", "#203a43", "#2c5364"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90, flexGrow: 1 }}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Your Portfolio</Text>
          <Text style={styles.subText}>All your investments in one place</Text>
        </View>

        {/* Total Portfolio Value */}
        <View style={styles.card}>
          <Text style={styles.label}>Total Portfolio Value</Text>
          <Text style={styles.value}>${portfolioValue.toLocaleString()}</Text>
          <Text style={[styles.gain, { color: gainPercent > 0 ? "#00e676" : "#ff5252" }]}>
            {gainPercent > 0 ? "↑" : "↓"} {Math.abs(gainPercent)}% this month
          </Text>
        </View>

        {/* Chart */}
        <View style={styles.chartWrapper}>
          <LineChart
            data={{
              labels: data.map((_, i) => `Day ${i + 1}`),
              datasets: [
                {
                  data: data,
                  color: () => "#00FF66",
                  strokeWidth: 2,
                },
              ],
            }}
            width={W}
            height={180}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            segments={4}
            transparent={true}
            bezier
            fromZero
            chartConfig={{
              backgroundColor: "#0f2027",
              backgroundGradientFrom: "#0f2027",
              backgroundGradientTo: "#0f2027",
              fillShadowGradientFrom: "#00FF66",
              fillShadowGradientFromOpacity: 0.12,
              fillShadowGradientTo: "#0f2027",
              fillShadowGradientToOpacity: 0,
              color: () => "#00FF66",
              strokeWidth: 2,
              propsForBackgroundLines: { stroke: "rgba(255,255,255,0.05)" },
              propsForLabels: { fontSize: 0 },
            }}
            style={{ marginLeft: 0, paddingRight: 0 }}
          />
        </View>

        {/* Time Range Tabs */}
        <View style={styles.rangeTabs}>
          {["D", "1W", "1M", "YTD", "1Y"].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                selectedRange === range && styles.activeRangeButton,
              ]}
              onPress={() => setSelectedRange(range)}
            >
              <Text
                style={[
                  styles.rangeText,
                  selectedRange === range && styles.activeRangeText,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {["All", "Real Estate", "Commodities", "Fine Art"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterButton,
                filter === cat && styles.activeFilter,
              ]}
              onPress={() => setFilter(cat)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === cat ? styles.activeFilterText : { color: "#aaa" },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Asset List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owned Assets</Text>
          {filteredAssets.map((asset) => (
            <TouchableOpacity
              key={asset.id}
              style={styles.assetItem}
              onPress={() => console.log(`View details for ${asset.name}`)}
            >
              <View style={styles.assetLeft}>
                <Image source={asset.icon} style={styles.assetIcon} />
                <View>
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <Text style={styles.assetType}>{asset.shares} • {asset.type}</Text>
                </View>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetValue}>${asset.currentValue.toLocaleString()}</Text>
                <Text
                  style={[
                    styles.assetRoi,
                    { color: asset.roiColor || (asset.roi > 0 ? "#00e676" : "#ff5252") },
                  ]}
                >
                  {asset.roi > 0 ? "↑" : "↓"} {Math.abs(asset.roi)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <MaterialIcons
                  name={
                    item.action.includes("Dividend")
                      ? "payments"
                      : item.action === "Bought"
                      ? "add-circle-outline"
                      : "remove-circle-outline"
                  }
                  size={20}
                  color="#00e676"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>
                  {item.action} {item.asset}
                </Text>
                <Text style={styles.activityAmount}>{item.amount}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 4,
  },
  gain: {
    fontSize: 12,
    fontWeight: "600",
  },
  chartWrapper: {
    marginTop: 0,
    alignItems: "center",
  },
  rangeTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -30,
    marginBottom: 10,
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
  },
  activeRangeButton: {
    backgroundColor: "#00e676",
  },
  rangeText: {
    color: "#aaa",
    fontSize: 12,
  },
  activeRangeText: {
    color: "#000",
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  activeFilter: {
    backgroundColor: "#00e676",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#000",
  },
  section: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  assetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  assetName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  assetType: {
    fontSize: 12,
    color: "#9ca3af",
  },
  assetRight: {
    alignItems: "flex-end",
  },
  assetValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  assetRoi: {
    fontSize: 12,
    fontWeight: "600",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,230,118,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityText: {
    fontSize: 14,
    color: "#fff",
  },
  activityAmount: {
    fontSize: 12,
    color: "#9ca3af",
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 8,
  },
});