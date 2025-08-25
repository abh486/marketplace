import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { LineChart } from "react-native-chart-kit";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Import your Navbar & BottomNav
import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";

const W = Dimensions.get("window").width;

export default function Home() {
  const [selectedRange] = useState("1D"); // Fixed to 1D

  // Simulated owned assets
  const [ownedAssetsCount] = useState(0);
  const [totalTokens] = useState(0);

  const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};


  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#001A13", "#003B28", "#017148ff"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={StyleSheet.absoluteFillObject}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.6)"]}
          style={StyleSheet.absoluteFillObject}
        />
      </LinearGradient>

      <Navbar />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >

       {/* === Notification Banner === */}
  <View style={styles.notificationBanner}>
    <Icon name="bell" size={24} color="#31e59469" />
    <View style={styles.notificationTextContainer}>
      <Text style={styles.greetingText}>{getGreeting()}!</Text>
      <Text style={styles.subText}>Check your notifications</Text>
    </View>
    <Icon name="chevron-right" size={20} color="#aaa" />
  </View>

{/* ----- Portfolio/Balance Section ------ */}
<LinearGradient
  colors={["#04523C", "#001A13"]} // Vertical gradient: top to bottom
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={styles.balanceSectionContainer}
>
  {/* Header Row (Portfolio left, Performance right) */}
  <View style={styles.balanceHeaderRow}>
    <Text style={styles.balanceLabel}>Total Portfolio</Text>

    <View style={styles.performanceContainer}>
      <Text style={styles.performanceLabel}>1D +0.02</Text>
      <View style={styles.percentageBox}>
        <Text style={styles.percentageValue}>+0.02%</Text>
      </View>
    </View>
  </View>

  {/* Portfolio Value + Graph */}
  <View style={styles.balanceContentRow}>
    <View style={styles.balanceLeftColumn}>
      <Text style={styles.balanceValue}>$0</Text>
      <Text style={styles.balanceChange}>+24 USD • +12% today</Text>

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

        {/* Mini Graph using chart-kit */}
        <View style={{ marginLeft: 50, marginRight: 50, marginBottom: 0, marginTop: -30 }}>
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
              color: (opacity = 0) => `rgba(66,231,162)`,
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
          {/* Label Overlay */}
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>$1,156.00</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
</LinearGradient>



        {/* Unified Card: Header + Scrollable Cards */}
        <Text style={styles.FeaturedTitle}>Trending Assets</Text>
        <View style={styles.unifiedCard}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.ownedText}>
              Owned Assets:{" "}
              <Text style={styles.ownedValue}>{ownedAssetsCount}</Text>
            </Text>
            <Text style={styles.ownedText}>
              Tokens: <Text style={styles.ownedValue}>{totalTokens}</Text>
            </Text>
          </View>

          {/* Horizontal Scroll Inside Card */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollableContent}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Luxury Apartments */}
            <View style={styles.featureCard}>
              <Image
                source={require("../../assets/image/apar.jpg")}
                style={styles.featureCardImg}
                resizeMode="cover"
              />
              <View style={styles.featureCardBody}>
                <View style={styles.titlePriceRow}>
                  <Text style={styles.featureCardTitle}>Luxury Apartments</Text>
                  <Text style={styles.featureCardPrice}>$2,500</Text>
                </View>
                <View style={styles.locationRoiRow}>
                  <Text style={styles.featureCardLocation}>New York, USA</Text>
                  <Text style={styles.featureCardROI}>+12% ROI</Text>
                </View>
              </View>
            </View>

            {/* Collectibles */}
            <View style={styles.featureCard}>
              <Image
                source={require("../../assets/image/watch.jpg")}
                style={styles.featureCardImg}
                resizeMode="cover"
              />
              <View style={styles.featureCardBody}>
                <View style={styles.titlePriceRow}>
                  <Text style={styles.featureCardTitle}>Vintage Watches</Text>
                  <Text style={styles.featureCardPrice}>$5,200</Text>
                </View>
                <View style={styles.locationRoiRow}>
                  <Text style={styles.featureCardLocation}>
                    Geneva, Switzerland
                  </Text>
                  <Text style={styles.featureCardROI}>+13% ROI</Text>
                </View>
              </View>
            </View>

            {/* Gold */}
            <View style={styles.featureCard}>
              <Image
                source={require("../../assets/image/gold1.jpg")}
                style={styles.featureCardImg}
                resizeMode="cover"
              />
              <View style={styles.featureCardBody}>
                <View style={styles.titlePriceRow}>
                  <Text style={styles.featureCardTitle}>Physical Gold</Text>
                  <Text style={styles.featureCardPrice}>$2,100</Text>
                </View>
                <View style={styles.locationRoiRow}>
                  <Text style={styles.featureCardLocation}>Global</Text>
                  <Text style={styles.featureCardROI}>+4% YOY</Text>
                </View>
              </View>
            </View>

            {/* Art */}
            <View style={styles.featureCard}>
              <Image
                source={require("../../assets/image/art.jpeg")}
                style={styles.featureCardImg}
                resizeMode="cover"
              />
              <View style={styles.featureCardBody}>
                <View style={styles.titlePriceRow}>
                  <Text style={styles.featureCardTitle}>Contemporary Art</Text>
                  <Text style={styles.featureCardPrice}>$11,000</Text>
                </View>
                <View style={styles.locationRoiRow}>
                  <Text style={styles.featureCardLocation}>Paris, France</Text>
                  <Text style={styles.featureCardROI}>+9% ROI</Text>
                </View>
              </View>
            </View>

            {/* Commodities */}
            <View style={styles.featureCard}>
              <Image
                source={require("../../assets/image/commodities.jpg")}
                style={styles.featureCardImg}
                resizeMode="cover"
              />
              <View style={styles.featureCardBody}>
                <View style={styles.titlePriceRow}>
                  <Text style={styles.featureCardTitle}>Copper</Text>
                  <Text style={styles.featureCardPrice}>$3,450</Text>
                </View>
                <View style={styles.locationRoiRow}>
                  <Text style={styles.featureCardLocation}>Middle East</Text>
                  <Text style={styles.featureCardROI}>+7% ROI</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Unlock Rewards Card */}
        <View style={styles.rewardCard}>
          <View style={styles.rewardCardIcon}>
            <Icon name="shield" size={26} color="#31e594" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rewardCardTitle}>Unlock Rewards</Text>
            <Text style={styles.rewardCardSubtitle}>
              Complete Profile & Invite Friends
            </Text>
          </View>
          <Icon name="chevron-right" size={25} color="#b0fdd3" />
        </View>

        {/* === Recommendations Section === */}
        <Recommendations
          ownedAssetsCount={ownedAssetsCount}
          totalTokens={totalTokens}
        />

        {/* News & Analysis */}
        <NewAndAnalysis />

        {/* Community Join Button */}
        <TouchableOpacity
          style={styles.communityJoinButton}
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert("Join Community", "Redirecting to community page...")
          }
        >
          <View style={styles.communityJoinIcon}>
            <Icon name="users" size={20} color="#fff" />
          </View>
          <Text style={styles.communityJoinText}>Join Our Community</Text>
          <Icon name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

// --- Recommendation Section (List View) ---
function Recommendations({ ownedAssetsCount, totalTokens }) {
  const recommendations = [
    {
      id: "1",
      icon: "pie-chart",
      title: "Fractional Luxury Assets",
      subtitle: "Start owning art, watches & real estate from $50.",
      bg: ["#07392dff", "#07392dff"],
    },
    {
      id: "2",
      icon: "target",
      title: "Build Long-Term Wealth",
      subtitle: "High ROI assets tailored for your journey.",
      bg: ["#07392dff", "#07392dff"],
    },
    {
      id: "3",
      icon: "trending-up",
      title: "Diversify with Gold",
      subtitle: "Add stability to your portfolio with precious metals.",
      bg: ["#07392dff", "#07392dff"],
    },
  ];

  return (
    <View style={recStyles.container}>
      <Text style={recStyles.title}>Recommended For You</Text>
      <View style={{ gap: 14 }}>
        {recommendations.map((item) => (
          <LinearGradient key={item.id} colors={item.bg} style={recStyles.listCard}>
            <View style={recStyles.leftRow}>
              <View style={recStyles.iconWrap}>
                <Icon name={item.icon} size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={recStyles.cardTitle}>{item.title}</Text>
                <Text style={recStyles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
}

// --- Auto-Scrolling News & Analysis with Dots ---
function NewAndAnalysis() {
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
      <Text style={styles.naTitle}>News & Analysis</Text>

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
            <View key={item.id} style={styles.analysisCard}>
              {/* Image with Gradient Overlay */}
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.analysisImage} />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.gradientOverlay}
                />

                {/* Play Button (Only for Videos) */}
                {item.isVideo && (
                  <TouchableOpacity style={styles.playButton}>
                    <Icon name="play" size={24} color="#fff" />
                  </TouchableOpacity>
                )}

                {/* Duration (Only for Videos) */}
                {item.isVideo && (
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.analysisContent}>
                <Text style={styles.analysisTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                {/* Type Label */}
                <Text style={styles.contentType}>{item.type}</Text>

                <Text style={styles.analysisSubtitle}>{item.subtitle}</Text>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAction(item.id, "Saved")}
                  >
                    <Icon name="bookmark" size={16} color="#aaa" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAction(item.id, "Shared")}
                  >
                    <Icon name="share-2" size={16} color="#aaa" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAction(item.id, "Downloaded")}
                  >
                    <Icon name="download" size={16} color="#aaa" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const recStyles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  title: {
    color: "#fff",
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
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  iconWrap: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 30,
    padding: 8,
    marginRight: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#eee",
    fontSize: 13,
    opacity: 0.85,
  },
});

const styles = StyleSheet.create({

  notificationBanner: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
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
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
subText: {
  color: '#aaa',
  fontSize: 14,
  marginTop: 2,
},

  // -- Balance Section --
balanceSectionContainer: {
  borderRadius: 20,
  padding: 10,
  margin: 15,
  shadowColor: "#000000ff",     // Soft neon green glow
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  elevation: 16,
  borderWidth: 1,
  borderColor: "rgba(3, 153, 81, 0.25)", // Soft green glow border
  overflow: 'hidden',
  
},
balanceCardPop: {
  backgroundColor: "#000000ff",
  shadowColor: "rgba(0, 0, 0, 0)",
  shadowOpacity: 0.25,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
  borderWidth: 0.5,
  borderColor: "rgba(0, 0, 0, 0.28)",
},
balanceValue: {  shadowColor: "#000000ff",     // Neon green glow
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 15,
  borderWidth: 1,
  borderColor: "rgba(0, 255, 153, 0.3)", // Soft glow border
  overflow: 'hidden',
  fontSize: 28,
  fontWeight: "bold",
  color: "#E0FFE8",
  textShadowColor: "rgba(0,255,153,0.4)",
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 6,
},

balanceHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between", // 👈 puts Portfolio left & 1D right
  alignItems: "center",
  marginTop: -15, // adds space above the header
},
balanceLabel: {
  fontSize: 16,
  color: "#fff",
  fontWeight: "600",
},
performanceContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // puts max space between two children
  gap: 10, // adds space between performance label and percentage box
  marginTop: 25, // adds space above the performance section
},

performanceLabel: {
  color: "#fff",
  // Add this line (increased spacing)
  fontSize: 12,
},

percentageBox: {
  backgroundColor: "rgba(66,231,162,0.2)",
  borderRadius: 2,

},
percentageValue: {
  color: "#42e7a2",
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
  color: "#fff",
  marginTop: -15,
},
balanceChange: {
  fontSize: 12,
  color: "#fff",
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
  marginRight: 3, // You can adjust or replace with marginLeft for overlap
  backgroundColor: "#18594f", // slightly visible background in case image doesn't cover fully
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row", // for specialCircle icons
},
specialCircle: {
  width: 50,
  height: 32,
  borderRadius: 16,
  paddingHorizontal: 4,
  backgroundColor: "#0f5942",
  borderWidth: 1,
  borderColor: "#42e7a2",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginLeft: -10,
},
iconSmallCircle: {
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: "#42e7a2",
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 1,
},

tokenImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},
tokenCircleOverlap: {
  marginLeft: -10,
},

  // --- Fixed Performance Display ---
  performanceFixed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  performanceLabel: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
  },
  percentageBox: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 1,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1a402c",
  },
  percentageValue: {
    color: "#3be89e",
    fontSize: 13,
    fontWeight: "bold",
  },
labelContainer: {
  position: 'absolute',
  top: 13, // Adjust based on chart height
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
  // -- Unlock Rewards card --
  rewardCard: {
    backgroundColor: "#024F36",
    borderRadius: 14,
    marginHorizontal: 18,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 17,
  },
  rewardCardIcon: {
    backgroundColor: "#15725933",
    borderRadius: 50,
    padding: 9,
    marginRight: 15,
  },
  rewardCardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  rewardCardSubtitle: {
    color: "#c8fde0ff",
    fontSize: 14,
    letterSpacing: 0.2,
  },

  // -- Unified Card (Header + Scrollable Cards) --
  unifiedCard: {
    backgroundColor: "#07392dff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  ownedText: {
    color: "#aaa",
    fontSize: 15,
    fontWeight: "600",
  },
  ownedValue: {
    color: "#fff",
    fontWeight: "bold",
  },

  // -- Scrollable Content --
  scrollableContent: {
    marginHorizontal: 12,
  },
  scrollContent: {
    gap: 16,
  },

  // -- Feature cards --


  FeaturedTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 20,
  },
  featureCard: {
    width: 300,
    backgroundColor:"#07392dff",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  featureCardPrice: {
    color: "#fff",
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
    color: "#aaa",
    fontSize: 13,
  },
  featureCardROI: {
    color: "#3be89e",
    fontWeight: "700",
    fontSize: 13,
  },


  // --- New & Analysis ---
  naContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  naTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  naScrollView: {
    gap: 16,
  },
  analysisCard: {
    width: 360,
    backgroundColor: "#07392dff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 1,
  },
  contentType: {
    color: "#54c2926b",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 1,
    textTransform: "uppercase",
  },
  analysisSubtitle: {
    color: "#aaa",
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

  // --- Dots Indicator ---
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
    backgroundColor: "#aaa",
    width: 8,
    height: 8,
  },
  dotInactive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // -- Community Join Button --
  communityJoinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#07392dff",
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
    backgroundColor: "#193541ff",
    borderRadius: 50,
    padding: 8,
    marginRight: 10,
  },
  communityJoinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});