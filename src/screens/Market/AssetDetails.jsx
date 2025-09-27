import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../Theme/ThemeContext"; // ✅ Adjust path if needed

const SCREEN_WIDTH = Dimensions.get("window").width;

// ✅ Helper: Risk badge color — UNCHANGED
const getRiskColor = (level) => {
  switch (level) {
    case "Low": return "#10b981";
    case "Medium": return "#f59e0b";
    case "High": return "#ef4444";
    default: return "#9ca3af";
  }
};

export default function AssetDetails({ route, navigation }) {
  const { asset } = route.params;
  const { isDarkMode } = useTheme(); // ✅ Only using isDarkMode to preserve your dark theme

  const [currentIndex, setCurrentIndex] = useState(0);
  const [amount, setAmount] = useState(2000); // AED 2,000
  const [expandedSections, setExpandedSections] = useState({});

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const scrollViewRef = useRef();

  // Refs for section positions
  const sectionRefs = {
    overview: useRef(null),
    property: useRef(null),
    breakdown: useRef(null),
    documents: useRef(null),
  };

  // === ANIMATION: Slide from bottom ===
  const slideAnim = useRef(new Animated.Value(1)).current; // 1 = invisible (off-screen), 0 = visible

  useEffect(() => {
    // Animate from bottom (translateY from 50 to 0)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-scroll image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % asset.images.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex, asset.images.length]);

  // Toggle expand/collapse
  const toggleExpand = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Category Description — UNCHANGED
  const getCategoryDescription = (category) => {
    switch (category) {
      case "Real Estate":
        return "This premium residential property in NewYork is part of a gated community with 24/7 security, landscaped gardens, and modern amenities. It generates consistent rental income from long-term tenants and is managed by a professional property management firm.";
      case "Fine Art":
        return "This limited-edition artwork by a renowned contemporary artist has been authenticated and stored in a climate-controlled vault. It has exhibited in major galleries and is expected to appreciate in value over time.";
      case "Private Credit":
        return "This income-generating loan is backed by a revenue-sharing agreement with a fast-growing SaaS startup. Monthly repayments are automated and secured via smart contracts.";
      case "Renewable Energy":
        return "This solar farm in Rajasthan generates clean energy under a 15-year Power Purchase Agreement (PPA) with a state utility. It benefits from government incentives and predictable cashflows.";
      default:
        return "This tokenized real-world asset offers investors access to high-yield opportunities with transparent governance and blockchain-backed ownership.";
    }
  };

  const ATI_PERCENT = 85;
  const firstRotation = ATI_PERCENT > 50 ? 180 : (ATI_PERCENT / 50) * 180;
  const secondRotation = ATI_PERCENT > 50 ? ((ATI_PERCENT - 50) / 50) * 180 : 0;

  // Amenities Icons — UNCHANGED
  const amenities = [
    { icon: "wifi", label: "Wi-Fi" },
    { icon: "pool", label: "Swimming Pool" },
    { icon: "dumbbell", label: "Gym" },
    { icon: "car", label: "Parking" },
    { icon: "shield", label: "Security" },
    { icon: "elevator", label: "Elevator" },
    { icon: "dog", label: "Pet Friendly" },
    { icon: "apartment", label: "Balcony" },
  ];

  // Cost Breakdown Data — UNCHANGED
  const costBreakdown = [
    { label: "Original Price", value: "AED 1,874,943.00" },
    { label: "Net Rental Yield", value: "5.24%" },
    { label: "Annualised ROI", value: "11.55%" },
    { label: "Gross Rental Yield", value: "7.42%" },
    { label: "Funded Date", value: "7 Aug 2025" },
  ];

  // Reviews — UNCHANGED
  const reviews = [
    {
      name: "Rahul K.",
      avatar: require("../../assets/image/avatar.jpg"),
      stars: "★★★★☆",
      text: "Solid returns, transparent updates. Great team behind this asset.",
    },
    {
      name: "Priya M.",
      avatar: require("../../assets/image/avatar.jpg"),
      stars: "★★★★★",
      text: "Fully trust this platform. Payouts on time every quarter.",
    },
  ];

  // Similar Assets — UNCHANGED
  const similarAssets = [
    {
      image: require("../../assets/image/apar1.jpeg"),
      price: "AED 2,280,000",
      title: "Hartland Waves, Sobha Hartl...",
      type: "Apartment",
      beds: 2,
      baths: 2,
      sqft: "870 sqft",
    },
    {
      image: require("../../assets/image/apar2.jpg"),
      price: "AED 2,000,000",
      title: "Sobha Creek Vistas Tower B...",
      type: "Apartment",
      beds: 2,
      baths: 2,
      sqft: "801 sqft",
    },
  ];

  // ✅ GET STYLES — PRESERVES YOUR DARK THEME, ADDS LIGHT THEME
  const styles = getStyles(isDarkMode);

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#0f2027", "#0f2027", "#0f2027"]
          : ["#FFFFFF", "#FFFFFF", "#FFFFFF"]
      }
      style={{ flex: 1 }}
    >
      {/* === Animated Container: Slides Up from Bottom === */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) }],
          opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
        }}
      >
        {/* === Scrollable Content === */}
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}
        >
          {/* === 1. Image Carousel === */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              horizontal
              data={asset.images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View key={item} style={styles.imageContainer}>
                  <Image source={item} style={styles.assetImage} />
                  <TouchableOpacity
                    style={styles.locationButton}
                    onPress={() =>
                      navigation.navigate("MapScreen", {
                        location: asset.location,
                        coordinates: asset.coordinates,
                      })
                    }
                  >
                    <Icon name="map-pin" size={20} color={isDarkMode ? "#fff" : "#000"} />
                  </TouchableOpacity>
                </View>
              )}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(ev) => {
                const index = Math.floor(ev.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setCurrentIndex(index);
              }}
            />
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {asset.images.map((_, i) => {
                const opacity = scrollX.interpolate({
                  inputRange: [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
                  outputRange: [0.4, 1, 0.4],
                });
                return (
                  <Animated.View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        opacity,
                        backgroundColor: isDarkMode ? "#fff" : "#000",
                      },
                      i === currentIndex && styles.activeDot,
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* === 2. Info Section === */}
          <View
            style={[
              styles.infoSheet,
              { backgroundColor: isDarkMode ? "#0f2027" : "#FAFAFA" },
            ]}
          >
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.assetName, { color: isDarkMode ? "#fff" : "#000" }]}
                >
                  {asset.name}
                </Text>
                <View style={styles.locationRow}>
                  <Icon name="map-pin" size={14} color={isDarkMode ? "#fff" : "#000"} />
                  <Text
                    style={[styles.locationText, { color: isDarkMode ? "#e5e7eb" : "#666" }]}
                  >
                    {asset.location}
                  </Text>
                </View>
              </View>

              {/* ATI Circle */}
              <View style={styles.atiWrapper}>
                <View
                  style={[
                    styles.circularBg,
                    {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.25)" : "#E0E0E0",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.halfCircle,
                    {
                      borderColor: isDarkMode ? "#048b43ff" : "#00DB84",
                      transform: [{ rotate: `${firstRotation - 90}deg` }],
                    },
                  ]}
                />
                {ATI_PERCENT > 50 && (
                  <View
                    style={[
                      styles.halfCircleRight,
                      {
                        borderColor: isDarkMode ? "#048b43ff" : "#00DB84",
                        transform: [{ rotate: `${secondRotation - 90}deg` }],
                      },
                    ]}
                  />
                )}
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={[
                      styles.atiText,
                      { color: isDarkMode ? "#048b43ff" : "#00DB84" },
                    ]}
                  >
                    {ATI_PERCENT}%
                  </Text>
                  <Text
                    style={[
                      styles.atiLabel,
                      { color: isDarkMode ? "#e5e7eb" : "#666" },
                    ]}
                  >
                    ATI
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <FAIcon name="ticket-alt" size={14} color={isDarkMode ? "#fff" : "#000"} />
                <Text
                  style={[styles.statText, { color: isDarkMode ? "#fff" : "#000" }]}
                >
                  200 Tokens Sold
                </Text>
              </View>
              <View style={styles.statItem}>
                <FAIcon name="user-friends" size={14} color={isDarkMode ? "#fff" : "#000"} />
                <Text
                  style={[styles.statText, { color: isDarkMode ? "#fff" : "#000" }]}
                >
                  240 Investors
                </Text>
              </View>
            </View>

            {/* === Description Section with Heading === */}
            <Text
              style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Description
            </Text>
            <Text
              style={[styles.description, { color: isDarkMode ? "#e5e7eb" : "#666" }]}
            >
              {getCategoryDescription(asset.category)}
            </Text>
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("Description")}>
              <Text
                style={[
                  styles.showMoreText,
                  { color: isDarkMode ? "#048b43ff" : "#00DB84" },
                ]}
              >
                {expandedSections.property ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Overview === */}
          <View ref={sectionRefs.overview} style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Overview
            </Text>
            {[
              { icon: "home", label: "Asset Type", value: asset.category },
              { icon: "map-pin", label: "Location", value: asset.location },
              { icon: "bar-chart-2", label: "Market Value", value: `₹${(asset.valuation || 10000000).toLocaleString()}` },
              { icon: "dollar-sign", label: "Token Price", value: `₹${(asset.tokenPrice || 100).toFixed(2)}` },
              { icon: "minimize", label: "Min Investment", value: `${asset.minTokens || 10} tokens` },
              { icon: "chart-line", label: "Projected ROI", value: asset.roi || "8.5% annual" },
              { icon: "alert-circle", label: "Risk Rating", value: asset.riskLevel || "Medium", isRisk: true },
              { icon: "code", label: "Token Standard", value: asset.tokenStandard || "ERC-20 on Polygon" },
              { icon: "package", label: "Total Supply", value: (asset.totalSupply || 100000).toLocaleString() + " tokens" },
              { icon: "chain", label: "Blockchain", value: asset.blockchain || "Polygon" },
              { icon: "lock", label: "Transferable", value: asset.transferable ? "Yes" : "No" },
              { icon: "clock", label: "Lock-in Period", value: asset.lockin || "None" },
            ]
              .slice(0, expandedSections.overview ? undefined : 5)
              .map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.row,
                    {
                      borderBottomColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "#E0E0E0",
                    },
                  ]}
                >
                  <View style={styles.left}>
                    <Icon name={item.icon} size={16} color={isDarkMode ? "#fff" : "#000"} />
                    <Text
                      style={[styles.label, { color: isDarkMode ? "#9ca3af" : "#666" }]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.isRisk ? (
                    <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.value) }]}>
                      <Text style={styles.riskText}>{item.value}</Text>
                    </View>
                  ) : (
                    <Text
                      style={[styles.value, { color: isDarkMode ? "#fff" : "#000" }]}
                    >
                      {item.value}
                    </Text>
                  )}
                </View>
              ))}
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("overview")}>
              <Text
                style={[
                  styles.showMoreText,
                  { color: isDarkMode ? "#048b43ff" : "#00DB84" },
                ]}
              >
                {expandedSections.overview ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Property Details === */}
          <View ref={sectionRefs.property} style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Property Details
            </Text>
            <View style={styles.specRow}>
              {[
                { icon: "bed", value: asset.bedrooms || 3 },
                { icon: "bath", value: asset.bathrooms || 2 },
                { icon: "ruler-combined", value: `${asset.sqft || 1450} sqft` },
                { icon: "calendar", value: asset.builtYear || 2005 },
              ].map((a, i) => (
                <View key={i} style={styles.specItem}>
                  <FAIcon name={a.icon} size={14} color={isDarkMode ? "#fff" : "#000"} />
                  <Text
                    style={[styles.specText, { color: isDarkMode ? "#fff" : "#000" }]}
                  >
                    {a.value}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.amenitiesGrid}>
              {amenities
                .slice(0, expandedSections.property ? undefined : 5)
                .map((a, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.amenityItem,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "#F5F5F5",
                      },
                    ]}
                  >
                    <Icon name={a.icon} size={16} color={isDarkMode ? "#fff" : "#000"} />
                    <Text
                      style={[styles.amenityText, { color: isDarkMode ? "#fff" : "#000" }]}
                    >
                      {a.label}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("property")}>
              <Text
                style={[
                  styles.showMoreText,
                  { color: isDarkMode ? "#048b43ff" : "#00DB84" },
                ]}
              >
                {expandedSections.property ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Cost Breakdown === */}
          <View ref={sectionRefs.breakdown} style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Cost Breakdown
            </Text>
            <Text
              style={[styles.breakdownText, { color: isDarkMode ? "#9ca3af" : "#666" }]}
            >
              This asset has a projected annual yield of 8.5%, with capital appreciation expected over 5 years.
            </Text>
            {costBreakdown
              .slice(0, expandedSections.breakdown ? undefined : 5)
              .map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.breakdownItem,
                    {
                      borderBottomColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "#E0E0E0",
                    },
                  ]}
                >
                  <Text
                    style={[styles.breakdownLabel, { color: isDarkMode ? "#9ca3af" : "#666" }]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.breakdownValue, { color: isDarkMode ? "#fff" : "#000" }]}
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("breakdown")}>
              <Text
                style={[
                  styles.showMoreText,
                  { color: isDarkMode ? "#048b43ff" : "#00DB84" },
                ]}
              >
                {expandedSections.breakdown ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Documents === */}
          <View ref={sectionRefs.documents} style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Documents
            </Text>
            {["Property Deed", "Valuation Report", "Audit Certificate", "Whitepaper", "Lease Agreement"]
              .slice(0, expandedSections.documents ? undefined : 5)
              .map((doc) => (
                <TouchableOpacity
                  key={doc}
                  style={[
                    styles.docItem,
                    {
                      borderBottomColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "#E0E0E0",
                    },
                  ]}
                >
                  <View style={styles.left}>
                    <Icon name="file" size={18} color={isDarkMode ? "#fff" : "#000"} />
                    <Text
                      style={[styles.label, { color: isDarkMode ? "#9ca3af" : "#666" }]}
                    >
                      {doc}
                    </Text>
                  </View>
                  <Icon name="download" size={16} color={isDarkMode ? "#fff" : "#000"} />
                </TouchableOpacity>
              ))}
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("documents")}>
              <Text
                style={[
                  styles.showMoreText,
                  { color: isDarkMode ? "#048b43ff" : "#00DB84" },
                ]}
              >
                {expandedSections.documents ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Investor Reviews === */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Investor Reviews
            </Text>
            {reviews.map((review, i) => (
              <View
                key={i}
                style={[
                  styles.reviewItem,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "#F5F5F5",
                  },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Image source={review.avatar} style={styles.avatar} />
                  <View style={styles.reviewInfo}>
                    <Text
                      style={[styles.reviewName, { color: isDarkMode ? "#fff" : "#000" }]}
                    >
                      {review.name}
                    </Text>
                    <Text
                      style={[styles.reviewStars, { color: "#fbbf24" }]}
                    >
                      {review.stars}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[styles.reviewText, { color: isDarkMode ? "#e5e7eb" : "#666" }]}
                >
                  {review.text}
                </Text>
              </View>
            ))}
          </View>

          {/* === You May Also Like === */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              You May Also Like
            </Text>
            <FlatList
              horizontal
              data={similarAssets}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.similarCard,
                    {
                      backgroundColor: isDarkMode
                        ? "#ffffff10"
                        : "#F5F5F5",
                    },
                  ]}
                >
                  <Image source={item.image} style={styles.similarImage} />
                  <Text
                    style={[styles.similarPrice, { color: isDarkMode ? "#fff" : "#000" }]}
                  >
                    {item.price}
                  </Text>
                  <Text
                    style={[styles.similarTitle, { color: isDarkMode ? "#9ca3af" : "#666" }]}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.similarSpecs}>
                    {[
                      { icon: "bed", value: item.beds },
                      { icon: "bath", value: item.baths },
                      { icon: "ruler-combined", value: item.sqft },
                    ].map((a, i) => (
                      <View key={i} style={styles.specItem}>
                        <FAIcon name={a.icon} size={12} color={isDarkMode ? "#fff" : "#000"} />
                        <Text
                          style={[styles.specText, { color: isDarkMode ? "#fff" : "#000" }]}
                        >
                          {a.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* === ROI Calculator === */}
          <View style={styles.section}>
            <Text
              style={[styles.calculatorTitle, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Calculate your return of investment expected in 5 years
            </Text>
            <View
              style={[
                styles.calculatorContainer,
                { backgroundColor: isDarkMode ? "#0f2027" : "#FAFAFA" },
              ]}
            >
              <Text
                style={[styles.calcLabel, { color: isDarkMode ? "#9ca3af" : "#666" }]}
              >
                Amount to invest
              </Text>
              <View
                style={[
                  styles.amountInput,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "#F5F5F5",
                  },
                ]}
              >
                <Text
                  style={[styles.amountText, { color: isDarkMode ? "#fff" : "#000" }]}
                >
                  AED
                </Text>
                <TextInput
                  style={[styles.amountValue, { color: isDarkMode ? "#fff" : "#000" }]}
                  value={amount.toString()}
                  onChangeText={(val) => setAmount(Number(val))}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.sliderContainer}>
                <View
                  style={[
                    styles.sliderTrack,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.2)"
                        : "#E0E0E0",
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${(amount / 10000) * 100}%`,
                      backgroundColor: isDarkMode ? "#048b43ff" : "#00DB84",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.sliderKnob,
                    {
                      left: `${(amount / 10000) * 100}%`,
                      backgroundColor: isDarkMode ? "#fff" : "#000",
                    },
                  ]}
                />
              </View>
              <View style={styles.costsRow}>
                <Text
                  style={[styles.costsLabel, { color: isDarkMode ? "#9ca3af" : "#666" }]}
                >
                  Total costs
                </Text>
                <Text
                  style={[styles.costsValue, { color: isDarkMode ? "#fff" : "#000" }]}
                >
                  AED {amount.toLocaleString()}
                </Text>
              </View>
              <Text
                style={[styles.costsDesc, { color: isDarkMode ? "#9ca3af" : "#666" }]}
              >
                Includes purchase and transaction costs.
              </Text>
              <TouchableOpacity style={styles.link}>
                <Text
                  style={[styles.linkText, { color: isDarkMode ? "#048b43ff" : "#00DB84" }]}
                >
                  View breakdown
                </Text>
              </TouchableOpacity>
              <Text
                style={[styles.returnLabel, { color: isDarkMode ? "#9ca3af" : "#666" }]}
              >
                You'll receive an approximate total net return of
              </Text>
              <Text
                style={[styles.returnValue, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                AED {(amount * 1.5).toLocaleString()}
              </Text>
              <Text
                style={[styles.returnDesc, { color: isDarkMode ? "#9ca3af" : "#666" }]}
              >
                Includes rental dividends and capital appreciation.
              </Text>
              <TouchableOpacity style={styles.link}>
                <Text
                  style={[styles.linkText, { color: isDarkMode ? "#048b43ff" : "#00DB84" }]}
                >
                  Learn more
                </Text>
              </TouchableOpacity>
              <Text
                style={[styles.warning, { color: isDarkMode ? "#9ca3af" : "#666" }]}
              >
                Risk warning: The information provided does not constitute financial or investment advice. Investing in real estate involves risks, and you may not receive the anticipated returns. Please seek independent advice and review{" "}
                <Text
                  style={[styles.linkText, { color: isDarkMode ? "#048b43ff" : "#00DB84" }]}
                >
                  Terms and Conditions
                </Text>{" "}
                before making any investment decision.
              </Text>
            </View>
          </View>
        </Animated.ScrollView>

        {/* === Sticky Buy Bar === */}
        <View
          style={[
            styles.stickyBar,
            {
              borderTopColor: isDarkMode ? "#048b43ff" : "#00DB84",
              backgroundColor: isDarkMode ? "#0f2027" : "#FAFAFA",
            },
          ]}
        >
          <Text
            style={[styles.stickyPrice, { color: isDarkMode ? "#fff" : "#000" }]}
          >
            ₹{asset.tokenPrice?.toFixed(2) || "100.00"} / token
          </Text>
          <TouchableOpacity
            style={[
              styles.buyButton,
              { backgroundColor: isDarkMode ? "#048b43ff" : "#00DB84" },
            ]}
            onPress={() =>
              navigation.navigate("BuyScreen", {
                asset: {
                  ...asset,
                  tokenPrice: Number(asset?.tokenPrice || 100),
                },
              })
            }
          >
            <Text
              style={[
                styles.buyText,
                { color: isDarkMode ? "#000" : "#fff" },
              ]}
            >
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

// ✅ STYLES — PRESERVES YOUR DARK THEME COLORS, ADDS LIGHT THEME
const getStyles = (isDarkMode) =>
  StyleSheet.create({
    carouselContainer: { overflow: "hidden", height: 240 },
    assetImage: { width: SCREEN_WIDTH, height: 240, resizeMode: "cover" },
    imageContainer: { width: SCREEN_WIDTH, height: 240 },
    locationButton: {
      position: "absolute",
      bottom: 16,
      left: 16,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 30,
      padding: 8,
    },
    pagination: {
      position: "absolute",
      bottom: 12,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
    },
    dot: { width: 8, height: 8, borderRadius: 4, margin: 3 },
    activeDot: {
      backgroundColor: isDarkMode ? "#048b43ff" : "#00DB84",
      width: 10,
      height: 10,
    },

    infoSheet: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      elevation: 8,
      shadowColor: "rgba(0,0,0,0.35)",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    },
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    assetName: { fontSize: 22, fontWeight: "700" },
    locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    locationText: { fontSize: 14, marginLeft: 4 },

    atiWrapper: { width: 70, height: 70, justifyContent: "center", alignItems: "center" },
    circularBg: {
      position: "absolute",
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 6,
    },
    halfCircle: {
      position: "absolute",
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 6,
      borderLeftColor: "transparent",
      borderBottomColor: "transparent",
    },
    halfCircleRight: {
      position: "absolute",
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 6,
      borderRightColor: "transparent",
      borderTopColor: "transparent",
    },
    atiText: { fontSize: 14, fontWeight: "700" },
    atiLabel: { fontSize: 12 },

    statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
    statItem: { flexDirection: "row", alignItems: "center" },
    statText: { marginLeft: 6, fontSize: 13, fontWeight: "600" },

    description: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 1,
    },

    contentContainer: {
      paddingBottom: 80,
    },
    section: { paddingHorizontal: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 19 },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
    },
    left: { flexDirection: "row", alignItems: "center" },
    label: { fontSize: 13, marginLeft: 6 },
    value: { fontSize: 13, fontWeight: "500", textAlign: "right", flex: 1, marginLeft: 10 },

    specRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    specItem: { flexDirection: "row", alignItems: "center", marginRight: 18 },
    specText: { fontSize: 13, marginLeft: 4 },

    amenitiesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 12,
    },
    amenityItem: {
      flexDirection: "column",
      alignItems: "center",
      marginHorizontal: 8,
      marginVertical: 6,
      padding: 8,
      borderRadius: 8,
    },
    amenityText: { fontSize: 10, marginTop: 2 },

    showMoreBtn: {
      alignItems: "flex-start",
      padding: 8,
      marginTop: 8,
    },
    showMoreText: { fontSize: 12, fontWeight: "600" },

    riskBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    riskText: { color: "#fff", fontSize: 12, fontWeight: "600" },

    breakdownText: {
      fontSize: 14,
      marginBottom: 12,
    },
    breakdownList: {
      marginTop: 8,
    },
    breakdownItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
    },
    breakdownLabel: { fontSize: 13 },
    breakdownValue: { fontSize: 13, fontWeight: "500" },

    docItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
    },

    reviewItem: {
      padding: 12,
      borderRadius: 12,
      marginBottom: 8,
    },
    reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
    reviewInfo: { flex: 1 },
    reviewName: { fontSize: 14, fontWeight: "600" },
    reviewStars: { fontSize: 14 },
    reviewText: { fontSize: 13, lineHeight: 18 },

    similarCard: {
      width: 180,
      padding: 8,
      marginHorizontal: 8,
      marginVertical: 4,
    },
    similarImage: { width: 160, height: 120, resizeMode: "cover" },
    similarPrice: { fontSize: 16, fontWeight: "700", marginTop: 8 },
    similarTitle: { fontSize: 12, marginTop: 4 },
    similarSpecs: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    specItem: { flexDirection: "row", alignItems: "center", marginRight: 8 },
    specText: { fontSize: 10, marginLeft: 4 },

    calculatorTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
    },
    calculatorContainer: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    calcLabel: { fontSize: 14, marginBottom: 8 },
    amountInput: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 8,
      padding: 8,
      marginBottom: 16,
    },
    amountText: { fontSize: 14, marginRight: 8 },
    amountValue: {
      fontSize: 14,
      fontWeight: "500",
      flex: 1,
    },
    sliderContainer: {
      width: "100%",
      height: 10,
      borderRadius: 5,
      position: "relative",
      marginBottom: 16,
    },
    sliderTrack: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: 10,
      borderRadius: 5,
    },
    sliderFill: {
      position: "absolute",
      top: 0,
      left: 0,
      height: 10,
      borderRadius: 5,
    },
    sliderKnob: {
      position: "absolute",
      width: 20,
      height: 20,
      borderRadius: 10,
      top: -5,
      transform: [{ translateX: -10 }],
      zIndex: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    costsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    costsLabel: { fontSize: 13 },
    costsValue: { fontSize: 13, fontWeight: "500" },
    costsDesc: { fontSize: 10, marginBottom: 8 },
    link: { marginBottom: 16 },
    linkText: { fontSize: 12, textDecorationLine: "underline" },
    returnLabel: { fontSize: 14, marginBottom: 8 },
    returnValue: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
    returnDesc: { fontSize: 10, marginBottom: 16 },
    warning: {
      fontSize: 10,
      lineHeight: 16,
    },

    stickyBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      elevation: 10,
    },
    stickyPrice: { fontSize: 14, fontWeight: "600" },
    buyButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    buyText: { fontWeight: "600" },
  });