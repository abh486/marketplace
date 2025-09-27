import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { LineChart } from "react-native-chart-kit";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { UserProfileContext } from "../Context/UserProfileContext";
import { useWallet } from "../Context/WalletContext";
import { useTheme } from "../../Theme/ThemeContext"; // ✅ ADDED

import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";

const W = Dimensions.get("window").width;

const API_KEY = "740b5229de0741969e46c53db4bb611c";
const BASE_CURRENCY = "INR";

const chartLabelsByRange = {
  Weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  Monthly: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  Yearly: ["2021", "2022", "2023", "2024", "2025"],
};

const chartDataByRange = {
  Weekly: [0.0,0.15,0.4,0.65,0.85,1.0,0.75,1.0,1.25,1.45,1.2,1.3,1.55,1.75,1.4,1.2,1.3,1.55,1.75,1.4,1.2,1.35,
    1.5,1.8,1.7,1.9,2.1,2.2,2.5,2.4,2.6,2.8,2.5,2.65,2.8,2.8,2.5,2.65,2.8,2.95,3.2,3.3,3.1,3.4,3.6,3.4,3.5,3.8,
    3.7,3.6,3.4,3.1,2.65,2.5,2.6,2.4,2.5,2.2,2.1,1.9,1.7,2.1,2.2,2.5,2.4,2.6,2.8,2.5,2.65,2.8],
  Monthly: [0.8, 0, 0.5, 0.2, 0.6, -0.5, 1.5, -0.10, 0.8],
  Yearly: [20, 22, 21, 23, -10],
};

export default function PortfolioScreen() {
  const { isDarkMode } = useTheme(); // ✅ ADDED
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [filter, setFilter] = useState("All");
  const { profile } = useContext(UserProfileContext);
  const currency = profile?.currency || "USD";

  // ✅ Get wallet data
  const { assets, balance, history } = useWallet();

  // State to store fetched exchange rates
  const [exchangeRates, setExchangeRates] = useState({});
  const [isRatesLoading, setIsRatesLoading] = useState(true);

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

  // Convert amount from base currency (INR) to user currency with Intl formatting
  const formatAmountByCurrency = (amount, currencyCode, locale = "en-US") => {
    try {
      let rate = 1;
      if (exchangeRates && exchangeRates[currencyCode] && exchangeRates[BASE_CURRENCY]) {
        rate = parseFloat(exchangeRates[currencyCode]) / parseFloat(exchangeRates[BASE_CURRENCY]);
      } else if (currencyCode === BASE_CURRENCY) {
        rate = 1;
      }
      const convertedAmount = amount * rate;
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedAmount);
    } catch {
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  };

  const labels = chartLabelsByRange[selectedRange] || chartLabelsByRange.Weekly;
  const dataPoints = chartDataByRange[selectedRange] || chartDataByRange.Weekly;

  // ✅ Portfolio value is balance + assets total
  const assetsValueINR = assets.reduce(
    (sum, a) => sum + (a.tokenPrice || 0) * (a.quantity || 0),
    0
  );
  const portfolioValueINR = balance + assetsValueINR;
  const gainPercent = 12.7; // keep static for now

  // ✅ Apply filter to assets
  const filteredAssets =
    filter === "All" ? assets : assets.filter((a) => a.type === filter);

  const upcomingPayouts = [
    { id: 1, asset: "Dubai Tower Residence", amountUSD: 240, date: "Sep 30" },
    { id: 2, asset: "Gold Bullion Token", amountUSD: 50, date: "Oct 10" },
  ];

  if (isRatesLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? "#001A13" : "#FFFFFF" }]}>
        <ActivityIndicator size="large" color={isDarkMode ? "#00DB84" : "#02af6a"} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient — ONLY in Dark Mode */}
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

      <Navbar />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90, flexGrow: 1 }}>
        <View style={styles.balanceHeaderRow}>
          <Text style={[styles.balanceLabel, { color: isDarkMode ? "#aaa" : "#666" }]}>Your Portfolio</Text>
          <View style={styles.performanceContainer}>
            <Text style={[styles.performanceLabel, { color: isDarkMode ? "#fff" : "#000" }]}>1D +0.02</Text>
            <View style={[styles.percentageBox, { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" }]}>
              <Text style={[styles.percentageValue, { color: isDarkMode ? "#42e7a2" : "#02af6a" }]}>+0.02%</Text>
            </View>
          </View>
        </View>

        <View style={styles.balanceContentRow}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
            <Text style={[styles.balanceValue, { color: isDarkMode ? "#fff" : "#000" }]}>
              {formatAmountByCurrency(portfolioValueINR, currency)}
            </Text>
            <Text style={[styles.balanceChange, { marginLeft: 8, color: isDarkMode ? "#42e7a2" : "#02af6a" }]}>
              ↑ {gainPercent}%
            </Text>
          </View>
        </View>

        {/* Time Range Tabs */}
        <View style={styles.rangeTabs}>
          {["Weekly", "Monthly", "Yearly"].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" },
                selectedRange === range && { backgroundColor: isDarkMode ? "#60b58c93" : "#e6fff5" },
              ]}
              onPress={() => setSelectedRange(range)}
            >
              <Text style={[
                styles.rangeText,
                { color: isDarkMode ? "#aaa" : "#666" },
                selectedRange === range && { color: isDarkMode ? "#000" : "#02af6a", fontWeight: "bold" },
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Section */}
        <View style={{ position: "relative", marginHorizontal: 5, marginBottom: 16 }}>
          <LineChart
            data={{
              labels,
              datasets: [{ data: dataPoints, color: () => isDarkMode ? "#00bf73ff" : "#02af6a", strokeWidth: 1.5 }],
            }}
            width={W + 50}
            height={200}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            bezier
            chartConfig={{
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              fillShadowGradient: "transparent",
              fillShadowGradientOpacity: 0,
              decimalPlaces: 2,
              color: () => isDarkMode ? "#00bf73ff" : "#02af6a",
              strokeWidth: 1.5,
              propsForBackgroundLines: { stroke: "transparent" },
              propsForLabels: { fontSize: 12, fill: isDarkMode ? "#00bf73ff" : "#02af6a" },
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
            }}
            style={{
              borderRadius: 8,
              backgroundColor: "transparent",
              marginLeft: -60,
              marginBottom: -30,
            }}
            segments={4}
          />
          <View style={styles.dayLabelsContainer}>
            {labels.map((label, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayLabelButton,
                  { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" },
                  index === labels.length - 1 && { backgroundColor: isDarkMode ? "#60b58c93" : "#e6fff5" },
                ]}
              >
                <Text style={[styles.dayLabelText, { color: isDarkMode ? "#000" : "#02af6a" }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {["All", "Real Estate", "Commodities", "Fine Art", "credit"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.filterButton}
              onPress={() => setFilter(cat)}
            >
              <Text style={[
                styles.filterText,
                { color: filter === cat ? (isDarkMode ? "#60b58c93" : "#02af6a") : (isDarkMode ? "#ccc" : "#999") },
                filter === cat && { fontWeight: "bold", textDecorationLine: "underline" },
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Owned Assets */}
        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}>Owned Assets</Text>
          {filteredAssets.length === 0 ? (
            <Text style={{ color: isDarkMode ? "#ccc" : "#999", marginTop: 10 }}>No assets owned yet</Text>
          ) : (
            filteredAssets.map((asset) => (
              <TouchableOpacity
                key={asset.id}
                style={[
                  styles.assetItemUnderline,
                  { borderBottomColor: isDarkMode ? "rgba(255,255,255,0.2)" : "#E0E0E0" },
                ]}
              >
                <View style={styles.assetLeft}>
                  {/* Placeholder image since WalletContext assets may not have icons */}
                  <Image
                    source={require("../../assets/image/art.jpeg")}
                    style={styles.assetIcon}
                  />
                  <View>
                    <Text style={[styles.assetName, { color: isDarkMode ? "#ccc" : "#666" }]}>{asset.name}</Text>
                    <Text style={[styles.assetType, { color: isDarkMode ? "#9ca3af" : "#999" }]}>
                      {asset.quantity} • {asset.type || "Token"}
                    </Text>
                  </View>
                </View>
                <View style={styles.assetRight}>
                  <Text style={[styles.assetValue, { color: isDarkMode ? "#fff" : "#000" }]}>
                    {formatAmountByCurrency(
                      (asset.tokenPrice || 0) * (asset.quantity || 0),
                      currency
                    )}
                  </Text>
                  <Text style={[styles.assetRoi, { color: isDarkMode ? "#42e7a2" : "#02af6a" }]}>
                    ↑ 0%
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}>Recent Activity</Text>
          {history.length === 0 ? (
            <Text style={{ color: isDarkMode ? "#ccc" : "#999", marginTop: 10 }}>No recent activity</Text>
          ) : (
            history.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.activityItem,
                  { borderBottomColor: isDarkMode ? "rgba(255,255,255,0.2)" : "#E0E0E0" },
                ]}
              >
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" },
                ]}>
                  <MaterialIcons
                    name={
                      item.type === "Deposit"
                        ? "payments"
                        : item.type === "Withdraw"
                        ? "account-balance-wallet"
                        : item.type === "Buy"
                        ? "add-circle-outline"
                        : item.type === "Sell"
                        ? "remove-circle-outline"
                        : item.type === "Send"
                        ? "send"
                        : "call-received"
                    }
                    size={20}
                    color={isDarkMode ? "#00e676" : "#02af6a"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.activityText, { color: isDarkMode ? "#ccc" : "#666" }]}>
                    {item.type} {item.assetName || item.assetId || ""}
                  </Text>
                  <Text style={[styles.activityAmount, { color: isDarkMode ? "#9ca3af" : "#999" }]}>
                    {item.amount} units
                  </Text>
                </View>
                <Text style={[styles.activityTime, { color: isDarkMode ? "#9ca3af" : "#999" }]}>{item.date}</Text>
              </View>
            ))
          )}
        </View>

        {/* Upcoming Payouts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}>Upcoming Payouts</Text>
          {upcomingPayouts.map((p) => (
            <View
              key={p.id}
              style={[
                styles.rowBetween,
                { borderBottomColor: isDarkMode ? "rgba(255,255,255,0.2)" : "#E0E0E0" },
              ]}
            >
              <Text style={[styles.assetName, { color: isDarkMode ? "#ccc" : "#666" }]}>{p.asset}</Text>
              <Text style={{ color: isDarkMode ? "#9ca3af" : "#999" }}>
                {formatAmountByCurrency(p.amountUSD, currency)} • {p.date}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 90,
    paddingHorizontal: 10,
  },
  balanceLabel: { fontSize: 16, fontWeight: "600" },
  performanceContainer: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  performanceLabel: { fontSize: 12, fontWeight: "500" },
  percentageBox: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  percentageValue: { fontSize: 12, fontWeight: "500" },
  balanceContentRow: { flexDirection: "row", alignItems: "flex-start" },
  balanceValue: { fontSize: 25, fontWeight: "bold" },
  balanceChange: { fontSize: 13, marginTop: 4 },
  rangeTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 16,
    marginBottom: 10,
    marginRight: 150,
  },
  rangeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  rangeText: { fontSize: 14, fontWeight: "600" },
  filterRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16, gap: 20 },
  filterText: { fontSize: 15, fontWeight: "600" },
  section: { marginHorizontal: 5, padding: 16, marginBottom: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  assetItemUnderline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  assetLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  assetIcon: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  assetName: { fontSize: 14, fontWeight: "600" },
  assetType: { fontSize: 12 },
  assetRight: { alignItems: "flex-end" },
  assetValue: { fontSize: 14, fontWeight: "600" },
  assetRoi: { fontSize: 12, fontWeight: "600" },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingLeft: 1,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityText: { fontSize: 14 },
  activityAmount: { fontSize: 12 },
  activityTime: { fontSize: 12, marginLeft: 8 },
  dayLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  dayLabelButton: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 5,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabelText: { fontSize: 12, fontWeight: "600" },
});