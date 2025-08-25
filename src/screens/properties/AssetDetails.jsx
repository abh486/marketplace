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

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  accent: "#048b43ff",
  text: {
    primary: "#fff",
    secondary: "#e5e7eb",
    muted: "#9ca3af",
  },
  shadow: "rgba(0,0,0,0.35)",
};

const TYPOGRAPHY = {
  heading: { fontSize: 22, fontWeight: "700", color: COLORS.text.primary },
  subheading: { fontSize: 14, color: COLORS.text.secondary },
  label: { fontSize: 13, color: COLORS.text.muted },
};

// Helper: Risk badge color
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

  // Category Description
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

  // Amenities Icons
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

  // Cost Breakdown Data
  const costBreakdown = [
    { label: "Original Price", value: "AED 1,874,943.00" },
    { label: "Net Rental Yield", value: "5.24%" },
    { label: "Annualised ROI", value: "11.55%" },
    { label: "Gross Rental Yield", value: "7.42%" },
    { label: "Funded Date", value: "7 Aug 2025" },
  ];

  // Reviews
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

  // Similar Assets
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

  return (
    <LinearGradient colors={["#0f2027", "#0f2027", "#0f2027"]} style={{ flex: 1 }}>
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
                    <Icon name="map-pin" size={20} color="#fff" />
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
                    style={[styles.dot, { opacity }, i === currentIndex && styles.activeDot]}
                  />
                );
              })}
            </View>
          </View>

          {/* === 2. Info Section === */}
          <View style={styles.infoSheet}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <View style={styles.locationRow}>
                  <Icon name="map-pin" size={14} color="#fff" />
                  <Text style={styles.locationText}>{asset.location}</Text>
                </View>
              </View>

              {/* ATI Circle */}
              <View style={styles.atiWrapper}>
                <View style={styles.circularBg} />
                <View style={[styles.halfCircle, { transform: [{ rotate: `${firstRotation - 90}deg` }] }]} />
                {ATI_PERCENT > 50 && (
                  <View
                    style={[
                      styles.halfCircleRight,
                      { transform: [{ rotate: `${secondRotation - 90}deg` }] },
                    ]}
                  />
                )}
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.atiText}>{ATI_PERCENT}%</Text>
                  <Text style={styles.atiLabel}>ATI</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <FAIcon name="ticket-alt" size={14} color="#fff" />
                <Text style={styles.statText}>3500 Tokens Sold</Text>
              </View>
              <View style={styles.statItem}>
                <FAIcon name="user-friends" size={14} color="#fff" />
                <Text style={styles.statText}>240 Investors</Text>
              </View>
            </View>

            {/* === Description Section with Heading === */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{getCategoryDescription(asset.category)}</Text>
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("Description")}>
              <Text style={styles.showMoreText}>
                {expandedSections.property ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Overview === */}
          <View ref={sectionRefs.overview} style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
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
                <View key={idx} style={styles.row}>
                  <View style={styles.left}>
                    <Icon name={item.icon} size={16} color="#fff" />
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  {item.isRisk ? (
                    <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.value) }]}>
                      <Text style={styles.riskText}>{item.value}</Text>
                    </View>
                  ) : (
                    <Text style={styles.value}>{item.value}</Text>
                  )}
                </View>
              ))}
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("overview")}>
              <Text style={styles.showMoreText}>
                {expandedSections.overview ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Property Details === */}
          <View ref={sectionRefs.property} style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.specRow}>
              <View style={styles.specItem}>
                <FAIcon name="bed" size={14} color="#fff" />
                <Text style={styles.specText}>{asset.bedrooms || 3}</Text>
              </View>
              <View style={styles.specItem}>
                <FAIcon name="bath" size={14} color="#fff" />
                <Text style={styles.specText}>{asset.bathrooms || 2}</Text>
              </View>
              <View style={styles.specItem}>
                <FAIcon name="ruler-combined" size={14} color="#fff" />
                <Text style={styles.specText}>{asset.sqft || 1450} sqft</Text>
              </View>
              <View style={styles.specItem}>
                <Icon name="calendar" size={14} color="#fff" />
                <Text style={styles.specText}>{asset.builtYear || 2005}</Text>
              </View>
            </View>

            <View style={styles.amenitiesGrid}>
              {amenities
                .slice(0, expandedSections.property ? undefined : 5)
                .map((a, i) => (
                  <TouchableOpacity key={i} style={styles.amenityItem}>
                    <Icon name={a.icon} size={16} color="#fff" />
                    <Text style={styles.amenityText}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("property")}>
              <Text style={styles.showMoreText}>
                {expandedSections.property ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Cost Breakdown === */}
          <View ref={sectionRefs.breakdown} style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>
            <Text style={styles.breakdownText}>
              This asset has a projected annual yield of 8.5%, with capital appreciation expected over 5 years.
            </Text>
            {costBreakdown
              .slice(0, expandedSections.breakdown ? undefined : 5)
              .map((item, idx) => (
                <View key={idx} style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                  <Text style={styles.breakdownValue}>{item.value}</Text>
                </View>
              ))}
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("breakdown")}>
              <Text style={styles.showMoreText}>
                {expandedSections.breakdown ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Documents === */}
          <View ref={sectionRefs.documents} style={styles.section}>
            <Text style={styles.sectionTitle}>Documents</Text>
            {["Property Deed", "Valuation Report", "Audit Certificate", "Whitepaper", "Lease Agreement"]
              .slice(0, expandedSections.documents ? undefined : 5)
              .map((doc) => (
                <TouchableOpacity key={doc} style={styles.docItem}>
                  <View style={styles.left}>
                    <Icon name="file" size={18} color="#fff" />
                    <Text style={styles.label}>{doc}</Text>
                  </View>
                  <Icon name="download" size={16} color="#fff" />
                </TouchableOpacity>
              ))}
            <TouchableOpacity style={styles.showMoreBtn} onPress={() => toggleExpand("documents")}>
              <Text style={styles.showMoreText}>
                {expandedSections.documents ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Investor Reviews === */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investor Reviews</Text>
            {reviews.map((review, i) => (
              <View key={i} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image source={review.avatar} style={styles.avatar} />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewStars}>{review.stars}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>

          {/* === You May Also Like === */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>You May Also Like</Text>
            <FlatList
              horizontal
              data={similarAssets}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.similarCard}>
                  <Image source={item.image} style={styles.similarImage} />
                  <Text style={styles.similarPrice}>{item.price}</Text>
                  <Text style={styles.similarTitle}>{item.title}</Text>
                  <View style={styles.similarSpecs}>
                    <View style={styles.specItem}>
                      <FAIcon name="bed" size={12} color="#fff" />
                      <Text style={styles.specText}>{item.beds}</Text>
                    </View>
                    <View style={styles.specItem}>
                      <FAIcon name="bath" size={12} color="#fff" />
                      <Text style={styles.specText}>{item.baths}</Text>
                    </View>
                    <View style={styles.specItem}>
                      <FAIcon name="ruler-combined" size={12} color="#fff" />
                      <Text style={styles.specText}>{item.sqft}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* === ROI Calculator === */}
          <View style={styles.section}>
            <Text style={styles.calculatorTitle}>Calculate your return of investment expected in 5 years</Text>
            <View style={styles.calculatorContainer}>
              <Text style={styles.calcLabel}>Amount to invest</Text>
              <View style={styles.amountInput}>
                <Text style={styles.amountText}>AED</Text>
                <TextInput
                  style={styles.amountValue}
                  value={amount.toString()}
                  onChangeText={(val) => setAmount(Number(val))}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack} />
                <Animated.View
                  style={[
                    styles.sliderFill,
                    { width: `${(amount / 10000) * 100}%` }
                  ]}
                />
                <View
                  style={[
                    styles.sliderKnob,
                    { left: `${(amount / 10000) * 100}%` }
                  ]}
                />
              </View>
              <View style={styles.costsRow}>
                <Text style={styles.costsLabel}>Total costs</Text>
                <Text style={styles.costsValue}>AED {amount.toLocaleString()}</Text>
              </View>
              <Text style={styles.costsDesc}>Includes purchase and transaction costs.</Text>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>View breakdown</Text>
              </TouchableOpacity>
              <Text style={styles.returnLabel}>You'll receive an approximate total net return of</Text>
              <Text style={styles.returnValue}>AED {(amount * 1.5).toLocaleString()}</Text>
              <Text style={styles.returnDesc}>Includes rental dividends and capital appreciation.</Text>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Learn more</Text>
              </TouchableOpacity>
              <Text style={styles.warning}>
                Risk warning: The information provided does not constitute financial or investment advice. Investing in real estate involves risks, and you may not receive the anticipated returns. Please seek independent advice and review the{" "}
                <Text style={styles.linkText}>Terms and Conditions</Text> before making any investment decision.
              </Text>
            </View>
          </View>
        </Animated.ScrollView>

        {/* === Sticky Buy Bar === */}
        <View style={styles.stickyBar}>
          <Text style={styles.stickyPrice}>₹{asset.tokenPrice?.toFixed(2) || "100.00"} / token</Text>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
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
  dot: { width: 8, height: 8, borderRadius: 4, margin: 3, backgroundColor: "#fff" },
  activeDot: { backgroundColor: COLORS.accent, width: 10, height: 10 },

  infoSheet: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#0f2027",
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  assetName: { ...TYPOGRAPHY.heading },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { ...TYPOGRAPHY.subheading, marginLeft: 4 },

  atiWrapper: { width: 70, height: 70, justifyContent: "center", alignItems: "center" },
  circularBg: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.25)",
  },
  halfCircle: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: COLORS.accent,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  halfCircleRight: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: COLORS.accent,
    borderRightColor: "transparent",
    borderTopColor: "transparent",
  },
  atiText: { fontSize: 14, fontWeight: "700", color: COLORS.accent },
  atiLabel: { fontSize: 12, color: COLORS.text.secondary },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  statItem: { flexDirection: "row", alignItems: "center" },
  statText: { color: "#fff", marginLeft: 6, fontSize: 13, fontWeight: "600" },

  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 1,
  },

  contentContainer: {
    paddingBottom: 80, // ✅ Just enough to show last line + buy bar
  },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text.primary, marginBottom: 8, marginTop: 19 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  left: { flexDirection: "row", alignItems: "center" },
  label: { fontSize: 13, color: COLORS.text.muted, marginLeft: 6 },
  value: { fontSize: 13, color: "#fff", fontWeight: "500", textAlign: "right", flex: 1, marginLeft: 10 },

  specRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  specItem: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  specText: { color: "#fff", marginLeft: 4, fontSize: 13 },

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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  amenityText: { fontSize: 10, color: "#fff", marginTop: 2 },

  showMoreBtn: {
    alignItems: "flex-start",
    padding: 8,
    marginTop: 8,
  },
  showMoreText: { color: COLORS.accent, fontSize: 12, fontWeight: "600" },

  riskBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  riskText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  breakdownText: {
    fontSize: 14,
    color: COLORS.text.muted,
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
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  breakdownLabel: { fontSize: 13, color: COLORS.text.muted },
  breakdownValue: { fontSize: 13, color: "#fff", fontWeight: "500" },

  docItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  reviewItem: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 14, color: COLORS.text.primary, fontWeight: "600" },
  reviewStars: { color: "#fbbf24", fontSize: 14 },
  reviewText: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 18 },

  similarCard: {
    width: 180,
    backgroundColor: "#ffffff10",
    padding: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  similarImage: { width: 160, height: 120, resizeMode: "cover" },
  similarPrice: { fontSize: 16, fontWeight: "700", color: "#fff", marginTop: 8 },
  similarTitle: { fontSize: 12, color: COLORS.text.muted, marginTop: 4 },
  similarSpecs: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  specItem: { flexDirection: "row", alignItems: "center", marginRight: 8 },
  specText: { fontSize: 10, color: "#fff", marginLeft: 4 },

  calculatorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  calculatorContainer: {
    backgroundColor: "#0f2027",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  calcLabel: { fontSize: 14, color: COLORS.text.muted, marginBottom: 8 },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  amountText: { fontSize: 14, color: "#fff", marginRight: 8 },
  amountValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    flex: 1,
  },
  sliderContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
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
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
  },
  sliderFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 5,
  },
  sliderKnob: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "#fff",
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
  costsLabel: { fontSize: 13, color: COLORS.text.muted },
  costsValue: { fontSize: 13, color: "#fff", fontWeight: "500" },
  costsDesc: { fontSize: 10, color: COLORS.text.muted, marginBottom: 8 },
  link: { marginBottom: 16 },
  linkText: { color: "#048b43", fontSize: 12, textDecorationLine: "underline" },
  returnLabel: { fontSize: 14, color: COLORS.text.muted, marginBottom: 8 },
  returnValue: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 8 },
  returnDesc: { fontSize: 10, color: COLORS.text.muted, marginBottom: 16 },
  warning: {
    fontSize: 10,
    color: COLORS.text.muted,
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
    backgroundColor: "#0f2027",
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
    elevation: 10,
  },
  stickyPrice: { fontSize: 14, color: "#fff", fontWeight: "600" },
  buyButton: { backgroundColor: COLORS.accent, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  buyText: { color: "#000", fontWeight: "600" },
});