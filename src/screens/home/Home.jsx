import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { UserProfileContext } from "../Context/UserProfileContext";
import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";
import { useTheme } from "../../Theme/ThemeContext"; // ✅ ADDED

const API_KEY = "740b5229de0741969e46c53db4bb611c";
const BASE_CURRENCY = "INR";
const W = Dimensions.get("window").width;
const USER_NAME = "Sam Kruss";

export default function Home() {
  const [selectedRange] = useState("1D");
  const [ownedAssetsCount] = useState(0);
  const [totalTokens] = useState(0);
  const { profile } = useContext(UserProfileContext);
  const currency = profile?.currency || "USD";

  const [exchangeRates, setExchangeRates] = useState({});
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme(); // ✅ Get current theme

  useEffect(() => {
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
  }, []);

  const formatAmountByCurrency = (amount, currencyCode, locale = "en-US") => {
    try {
      let rate = 1;
      if (
        exchangeRates &&
        exchangeRates[currencyCode] &&
        exchangeRates[BASE_CURRENCY]
      ) {
        rate =
          parseFloat(exchangeRates[currencyCode]) /
          parseFloat(exchangeRates[BASE_CURRENCY]);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${USER_NAME}`;
    if (hour < 17) return `Good afternoon, ${USER_NAME}`;
    return `Good evening, ${USER_NAME}`;
  };

  const [notifications, setNotifications] = useState([
    { id: "1", title: "Portfolio update", message: "A new asset was added to your portfolio." },
    { id: "2", title: "Market Insight", message: "Copper prices up 6% in Middle East." },
    { id: "3", title: "Security alert", message: "New login from Dubai." }
  ]);

  const notificationCount = notifications.length;

  const basePortfolioValue = 20000;
  const fixedDailyChangeUSD = 24;
  const fixedDailyChangePercent = "+12%";

  const FEATURED_ASSETS = [
    { id: "1", title: "Luxury Apartments", location: "New York, USA", roi: "+12% ROI", priceUSD: 2500, image: require("../../assets/image/apar.jpg") },
    { id: "2", title: "Vintage Watches", location: "Geneva, Switzerland", roi: "+13% ROI", priceUSD: 5200, image: require("../../assets/image/watch.jpg") },
    { id: "3", title: "Physical Gold", location: "Global", roi: "+4% YOY", priceUSD: 2100, image: require("../../assets/image/gold1.jpg") },
    { id: "4", title: "Contemporary Art", location: "Paris, France", roi: "+9% ROI", priceUSD: 11000, image: require("../../assets/image/art.jpeg") },
    { id: "5", title: "Copper", location: "Middle East", roi: "+7% ROI", priceUSD: 3450, image: require("../../assets/image/commodities.jpg") },
  ];

  if (isRatesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDarkMode ? "#001A13" : "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#00DB84" />
      </View>
    );
  }

  const formattedPortfolioValue = formatAmountByCurrency(basePortfolioValue, currency);
  const formattedDailyChange = `${formatAmountByCurrency(fixedDailyChangeUSD, currency)} • ${fixedDailyChangePercent} today`;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}> {/* ✅ DYNAMIC BACKGROUND */}
      {/* Background for Dark Theme Only */}
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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Banner */}
        <TouchableOpacity
          style={{ marginBottom: 10 }}
          onPress={() =>
            navigation.navigate("NotificationScreen", { notifications, setNotifications })
          }
          activeOpacity={0.8}
        >
          <View style={styles.notificationBanner}>
            <Icon name="bell" size={24} color={isDarkMode ? "#31e59469" : "#00DB84"} />
            <View style={styles.notificationTextContainer}>
              <Text style={[styles.greetingText, { color: isDarkMode ? "#fff" : "#000" }]}>{getGreeting()}!</Text>
              <Text style={[styles.subText, { color: isDarkMode ? "#aaa" : "#666" }]}>Check your notifications</Text>
            </View>
            {notificationCount > 0 && (
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Portfolio/Balance Section */}
        <TouchableOpacity
          onPress={() => navigation.navigate("PortfolioScreen")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isDarkMode ? ["#04523C", "#001A13"] : ["#1ab074ff", "#9ceeadff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.balanceSectionContainer}
          >
            <View style={styles.balanceHeaderRow}>
              <Text style={[styles.balanceLabel, { color: isDarkMode ? "#fff" : "#000" }]}>
                {isDarkMode ? "Total Portfolio" : "Total Balance"}
              </Text>
              <View style={styles.performanceContainer}>
                <Text style={[styles.performanceLabel, { color: isDarkMode ? "#fff" : "#000" }]}>1D +0.02</Text>
                <View style={styles.percentageBox}>
                  <Text style={styles.percentageValue}>+0.02%</Text>
                </View>
              </View>
            </View>
            <View style={styles.balanceContentRow}>
              <View style={styles.balanceLeftColumn}>
                <Text style={[styles.balanceValue, { color: isDarkMode ? "#fff" : "#000" }]}>{formattedPortfolioValue}</Text>
                <Text style={[styles.balanceChange, { color: isDarkMode ? "#fff" : "#000" }]}>{formattedDailyChange}</Text>

                <View style={styles.tokenRow}>
                  <View style={styles.tokenCircle}>
                    <Image source={require("../../assets/image/token1.jpg")} style={styles.tokenImage} />
                  </View>
                  <View style={[styles.tokenCircle, styles.tokenCircleOverlap]}>
                    <Image source={require("../../assets/image/token2.png")} style={styles.tokenImage} />
                  </View>
                  <View style={[styles.tokenCircle, styles.tokenCircleOverlap]}>
                    <Image source={require("../../assets/image/solena.png")} style={styles.tokenImage} />
                  </View>
                </View>

                {/* Mini Graph */}
                <View style={{ marginLeft: 99, marginRight: 50, marginBottom: 0, marginTop: -50 }}>
                  <LineChart
                    data={{
                      labels: ["", "", "", "", ""],
                      datasets: [{ data: [0.2, 0.8, 0.3, 0.7, 0.3, 0.55] }],
                    }}
                    width={200}
                    height={60}
                    withDots={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLabels={false}
                    withHorizontalLabels={false}
                    fromZero={true}
                    segments={0}
                    chartConfig={{
                      backgroundColor: "transparent",
                      backgroundGradientFrom: "transparent",
                      backgroundGradientTo: "transparent",
                      fillShadowGradientFrom: "transparent",
                      fillShadowGradientTo: "transparent",
                      fillShadowGradientOpacity: 0,
                      color: (opacity = 0) => isDarkMode ? `rgba(66,231,162)` : `rgba(0,219,132)`,
                      strokeWidth: 1,
                      propsForBackgroundLines: { stroke: "none" },
                      propsForLabels: { opacity: 0 },
                      style: {
                        overflow: "hidden",
                      },
                    }}
                    bezier
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 10,
                      overflow: "visible",
                    }}
                    transparent
                  />
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{formatAmountByCurrency(1156, currency)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Featured Assets Section */}
        <Text style={[styles.FeaturedTitle, { color: isDarkMode ? "#fff" : "#000", marginLeft: 20 }]}>Trending Assets</Text>
        <View style={[styles.unifiedCard, { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" }]}>
          <View style={[styles.headerRow, { borderBottomColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#FAFAFA" }]}>
            <Text style={[styles.ownedText, { color: isDarkMode ? "#aaa" : "#666" }]}>
              Owned Assets: <Text style={[styles.ownedValue, { color: isDarkMode ? "#fff" : "#000" }]}>{ownedAssetsCount}</Text>
            </Text>
            <Text style={[styles.ownedText, { color: isDarkMode ? "#aaa" : "#666" }]}>
              Tokens: <Text style={[styles.ownedValue, { color: isDarkMode ? "#fff" : "#000" }]}>{totalTokens}</Text>
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollableContent}
            contentContainerStyle={styles.scrollContent}
          >
            {FEATURED_ASSETS.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.navigate("MarketScreen")}
                activeOpacity={0.8}
              >
                <View style={[styles.featureCard, { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" }]}>
                  <Image
                    source={item.image}
                    style={styles.featureCardImg}
                    resizeMode="cover"
                  />
                  <View style={styles.featureCardBody}>
                    <View style={styles.titlePriceRow}>
                      <Text style={[styles.featureCardTitle, { color: isDarkMode ? "#fff" : "#000" }]}>{item.title}</Text>
                      <Text style={[styles.featureCardPrice, { color: isDarkMode ? "#fff" : "#000" }]}>
                        {formatAmountByCurrency(item.priceUSD, currency)}
                      </Text>
                    </View>
                    <View style={styles.locationRoiRow}>
                      <Text style={[styles.featureCardLocation, { color: isDarkMode ? "#aaa" : "#666" }]}>{item.location}</Text>
                      <Text style={[styles.featureCardROI, { color: isDarkMode ? "#3be89e" : "#00DB84" }]}>{item.roi}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Unlock Rewards Card */}
        <TouchableOpacity onPress={() => navigation.navigate("Rewards")}>
          <Text style={[styles.viewRewardsLabel, { color: isDarkMode ? "#ccc" : "#02af6a", marginLeft: 280 }]}>View Rewards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.8}
        >
          <View style={[styles.rewardCard, { backgroundColor: isDarkMode ? "#024F36" : "#02af6a" }]}>
            <View style={styles.rewardCardIcon}>
              <Icon name="shield" size={isDarkMode ? 26 : 24} color={isDarkMode ? "#31e594" : "#00DB84"} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rewardCardTitle, { color: isDarkMode ? "#fff" : "#fff" }]}>Unlock Rewards</Text>
              <Text style={[styles.rewardCardSubtitle, { color: isDarkMode ? "#c8fde0ff" : "#fff" }]}>
                Complete Profile & Invite Friends
              </Text>
            </View>
            <Icon name="chevron-right" size={25} color={isDarkMode ? "#b0fdd3" : "#00DB84"} />
          </View>
        </TouchableOpacity>

        {/* Recommendations */}
        <Recommendations ownedAssetsCount={ownedAssetsCount} totalTokens={totalTokens} isDarkMode={isDarkMode} />

        {/* News & Analysis */}
        <NewAndAnalysis isDarkMode={isDarkMode} />

        {/* Community Join Button */}
        <TouchableOpacity
          style={[styles.communityJoinButton, { backgroundColor: isDarkMode ? "#07392dff" : "#02af6a" }]}
          activeOpacity={0.8}
          onPress={() => Alert.alert("Join Community", "Redirecting to community page...")}
        >
          <View style={styles.communityJoinIcon}>
            <Icon name="users" size={20} color={isDarkMode ? "#fff" : "#fff"} />
          </View>
          <Text style={[styles.communityJoinText, { color: isDarkMode ? "#fff" : "#fff" }]}>Join Our Community</Text>
          <Icon name="chevron-right" size={20} color={isDarkMode ? "#fff" : "#00DB84"} />
        </TouchableOpacity>
      </ScrollView>

      {/* Cora AI Button */}
      <TouchableOpacity
        style={[styles.coraButtonContainer, { backgroundColor: isDarkMode ? "#07392dff" : "#F5F5F5", marginLeft: 340 }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AiPage")}
      >
        <Image
          source={require("../../assets/image/coraring.png")}
          style={styles.coraButtonImage}
        />
      </TouchableOpacity>

      <BottomNav />
    </View>
  );
}

// --- Recommendation Section (List View) ---
function Recommendations({ ownedAssetsCount, totalTokens, isDarkMode }) {
  const recommendations = [
    {
      id: "1",
      icon: "pie-chart",
      title: "Fractional Luxury Assets",
      subtitle: "Start owning art, watches & real estate from $50.",
      bg: isDarkMode ? ["#07392dff", "#07392dff"] : ["#FAFAFA", "#FAFAFA"],
    },
    {
      id: "2",
      icon: "target",
      title: "Build Long-Term Wealth",
      subtitle: "High ROI assets tailored for your journey.",
      bg: isDarkMode ? ["#07392dff", "#07392dff"] : ["#FAFAFA", "#FAFAFA"],
    },
    {
      id: "3",
      icon: "trending-up",
      title: "Diversify with Gold",
      subtitle: "Add stability to your portfolio with precious metals.",
      bg: isDarkMode ? ["#07392dff", "#07392dff"] : ["#FAFAFA", "#FAFAFA"],
    },
  ];
  return (
    <View style={recStyles.container}>
      <Text style={[recStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Recommended For You</Text>
      <View style={{ gap: 14 }}>
        {recommendations.map((item) => (
          <LinearGradient key={item.id} colors={item.bg} style={recStyles.listCard}>
            <View style={recStyles.leftRow}>
              <View style={recStyles.iconWrap}>
                <Icon name={item.icon} size={22} color={isDarkMode ? "#fff" : "#00DB84"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[recStyles.cardTitle, { color: isDarkMode ? "#fff" : "#000" }]}>{item.title}</Text>
                <Text style={[recStyles.cardSubtitle, { color: isDarkMode ? "#eee" : "#666" }]}>{item.subtitle}</Text>
              </View>
            </View>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
}

// --- Auto-Scrolling News & Analysis with Dots ---
function NewAndAnalysis({ isDarkMode }) {
  const items = [
    {
      id: "1",
      type: "Video",
      title: "Gold Hits Record High on Global Uncertainty",
      subtitle: "Market Update • 5 min ago",
      image: require("../../assets/image/gnews.jpg"),
      duration: "3:42",
      isVideo: true,
    },
    {
      id: "2",
      type: "Analysis",
      title: "Why Vintage Watches Outperform Stocks",
      subtitle: "Luxury Assets • 1 hour ago",
      image: require("../../assets/image/watch1.jpg"),
      isVideo: false,
    },
    {
      id: "3",
      type: "Report",
      title: "Real Estate Yield Comparison: NYC vs Dubai",
      subtitle: "Global Markets • 3 hours ago",
      image: require("../../assets/image/nyc.jpg"),
      isVideo: false,
    },
  ];
  const scrollViewRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % items.length;
      setActiveIndex(nextIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * (360 + 16),
          animated: true,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, items.length]);
  const handleAction = (id, action) => {
    Alert.alert(`${action} Item`, `You ${action.toLowerCase()}ed ${id}`);
  };
  return (
    <View style={styles.naContainer}>
      <Text style={[styles.naTitle, { color: isDarkMode ? "#fff" : "#000" }]}>News & Analysis</Text>
      <View style={{ position: "relative" }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.naScrollView}
          pagingEnabled
          scrollEnabled={false}
        >
          {items.map((item) => (
            <View key={item.id} style={[styles.analysisCard, { backgroundColor: isDarkMode ? "#07392dff" : "#F5F5F5" }]}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.analysisImage} />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.gradientOverlay}
                />
                {item.isVideo && (
                  <TouchableOpacity style={styles.playButton}>
                    <Icon name="play" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
                {item.isVideo && (
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                )}
              </View>
              <View style={styles.analysisContent}>
                <Text style={[styles.analysisTitle, { color: isDarkMode ? "#fff" : "#000" }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.contentType, { color: isDarkMode ? "#54c2926b" : "#00DB84" }]}>{item.type}</Text>
                <Text style={[styles.analysisSubtitle, { color: isDarkMode ? "#aaa" : "#666" }]}>{item.subtitle}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAction(item.id, "Saved")}
                  >
                    <Icon name="bookmark" size={16} color={isDarkMode ? "#aaa" : "#aaa"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAction(item.id, "Shared")}
                  >
                    <Icon name="share-2" size={16} color={isDarkMode ? "#aaa" : "#aaa"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAction(item.id, "Downloaded")}
                  >
                    <Icon name="download" size={16} color={isDarkMode ? "#aaa" : "#aaa"} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotsContainer}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
                {
                  backgroundColor: i === activeIndex
                    ? (isDarkMode ? "#aaa" : "#00DB84")
                    : (isDarkMode ? "rgba(255,255,255,0.2)" : "#ccc"),
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ✅ YOUR ORIGINAL STYLES — UNTOUCHED
const recStyles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  listCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  iconWrap: {
    borderRadius: 30,
    padding: 8,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    opacity: 0.85,
  },
});

const styles = StyleSheet.create({
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginTop: 80,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    marginTop: 2,
  },
  smallBadge: {
    position: "absolute",
    top: 10,
    left: 28,
    backgroundColor: "#db0000ff",
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  smallBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  balanceSectionContainer: {
    borderRadius: 20,
    padding: 10,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,219,132,0.3)",
    overflow: 'hidden',
  },
  balanceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -15,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  performanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 25,
  },
  performanceLabel: {
    fontSize: 12,
  },
  percentageBox: {
    backgroundColor: "rgba(0,219,132,0.1)",
    borderRadius: 2,
  },
  percentageValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  balanceContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLeftColumn: {
    flex: 1,
  },
  balanceValue: {
    fontSize: 27,
    fontWeight: "bold",
    marginTop: -15,
  },
  balanceChange: {
    fontSize: 12,
    marginVertical: 4,
    marginTop: 0,
  },
  tokenRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  tokenCircle: {
    width: 30,
    height: 30,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    marginRight: 3,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tokenCircleOverlap: {
    marginLeft: -10,
  },
  labelContainer: {
    position: 'absolute',
    top: 13,
    right: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderRadius: 4,
  },
  labelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  rewardCard: {
    borderRadius: 14,
    marginHorizontal: 18,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 17,
  },
  rewardCardIcon: {
    borderRadius: 50,
    padding: 9,
    marginRight: 15,
  },
  rewardCardTitle: {
    fontWeight: "bold",
    fontSize: 17,
  },
  rewardCardSubtitle: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  viewRewardsLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  unifiedCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  ownedText: {
    fontSize: 15,
    fontWeight: "600",
  },
  ownedValue: {
    fontWeight: "bold",
  },
  scrollableContent: {
    marginHorizontal: 12,
  },
  scrollContent: {
    gap: 16,
  },
  FeaturedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  featureCard: {
    width: 300,
    borderRadius: 16,
    overflow: "hidden",
    
  },
  featureCardImg: {
    width: "100%",
    height: 150,
  },
  featureCardBody: {
    padding: 5,
    flex: 1,
  },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  featureCardPrice: {
    fontWeight: "bold",
    fontSize: 19,
    marginLeft: 12,
  },
  locationRoiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  featureCardLocation: {
    fontSize: 13,
  },
  featureCardROI: {
    fontWeight: "700",
    fontSize: 13,
  },
  naContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  naTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  naScrollView: {
    gap: 16,
  },
  analysisCard: {
    width: 360,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    height: 170,
    overflow: "hidden",
  },
  analysisImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
    padding: 10,
  },
  durationBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
  },
  analysisContent: {
    padding: 10,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 1,
  },
  contentType: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 1,
    textTransform: "uppercase",
  },
  analysisSubtitle: {
    fontSize: 12,
    marginBottom: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    padding: 6,
    paddingBottom: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 8,
    height: 8,
  },
  dotInactive: {},
  communityJoinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  communityJoinIcon: {
    borderRadius: 50,
    padding: 8,
    marginRight: 10,
  },
  communityJoinText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  coraButtonContainer: {
    position: "absolute",
    bottom: 70,
    zIndex: 20,
    borderRadius: 50,
  },
  coraButtonImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});