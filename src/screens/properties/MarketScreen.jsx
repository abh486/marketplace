import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Share,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from "../../Theme/ThemeContext"; // ✅ ADDED

import Navbar from "../properties/Navbar";
import BottomNav from "../properties/BottomNav";

const SCREEN_WIDTH = Dimensions.get('window').width;

const categories = [
  { label: 'All', icon: 'grid', key: 'All' },
  { label: 'Credit', icon: 'credit-card', key: 'Credit' },
  { label: 'Collectibles', icon: 'gift', key: 'Collectibles' },
  { label: 'Stocks', icon: 'briefcase', key: 'Stocks' },
  { label: 'Real Estate', icon: 'home', key: 'Real Estate' },
  { label: 'Commodities', icon: 'box', key: 'Commodities' },
  { label: 'Membership', icon: 'user-plus', key: 'Membership' },
  { label: 'NFT', icon: 'image', key: 'NFT' },
];

const ASSETS = [
  {
    id: '1',
    images: [
      require('../../assets/image/build2.jpg'),
      require('../../assets/image/build1.jpg'),
    ],
    name: "Luxury Apartments",
    price: '$2,500 USDC',
    category: 'Real Estate',
    location: 'New York, USA',
    roi: '+12% ROI',
    rating: 5,
    reviews: 130,
  },
  {
    id: '2',
    images: [
      require('../../assets/image/apar.jpg'),
      require('../../assets/image/villa1.jpg'),
    ],
    name: "Luxury Apartments",
    price: '$2,500 USDC',
    category: 'Real Estate',
    location: 'Dubai, UAE',
    roi: '+12% ROI',
    rating: 4.5,
    reviews: 108,
  },
  {
    id: '3',
    images: [
      require('../../assets/image/watch.jpg'),
      require('../../assets/image/collectible.jpg'),
    ],
    name: 'Vintage Watches',
    price: '$5,200 USDC',
    category: 'Collectibles',
    location: 'Geneva, Switzerland',
    roi: '+13% ROI',
    rating: 4.7,
    reviews: 200,
  },
  {
    id: '4',
    images: [
      require('../../assets/image/gold1.jpg'),
      require('../../assets/image/gold2.jpg'),
    ],
    name: 'Gold Bar',
    price: '$2,100 USDC',
    category: 'Commodities',
    location: 'Global',
    roi: '+4% YOY',
    rating: 4,
    reviews: 93,
  },
  {
    id: '5',
    images: [
      require('../../assets/image/art.jpeg'),
      require('../../assets/image/art1.jpg'),
    ],
    name: 'Contemporary Art',
    price: '$11,000 USDC',
    category: 'Collectibles',
    location: 'Paris, France',
    roi: '+9% ROI',
    rating: 5,
    reviews: 51,
  },
  {
    id: '6',
    images: [
      require('../../assets/image/commodities.jpg'),
      require('../../assets/image/copper.jpeg'),
    ],
    name: 'Copper',
    price: '$3,450 USDC',
    category: 'Commodities',
    location: 'Middle East',
    roi: '+7% ROI',
    rating: 4.2,
    reviews: 74,
  },
];

function ReviewStars({ rating, reviews, isDarkMode }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const color = rating >= i ? (isDarkMode ? '#FFD700' : '#FFC107') : (isDarkMode ? '#aaa' : '#ccc');
    stars.push(
      <FontAwesome key={i} name="star" size={10} color={color} style={{ marginRight: 2 }} />
    );
  }
  return (
    <View style={styles.reviewContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {stars}
      </View>
      <Text style={[styles.reviewText, { color: isDarkMode ? "#fff" : "#000" }]}>{rating} ({reviews})</Text>
    </View>
  );
}

function ImageSlider({ images, isDarkMode }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= images.length) nextIndex = 0;
      flatListRef.current?.scrollToOffset({ offset: nextIndex * SCREEN_WIDTH, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: (event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              setCurrentIndex(Math.round(offsetX / SCREEN_WIDTH));
            } }
        )}
        renderItem={({ item }) => (
          <Image source={item} style={styles.sliderImage} resizeMode="cover" />
        )}
      />
      <View style={styles.pagination}>
        {images.map((_, i) => (
          <Animated.View key={i.toString()} style={[styles.dot, { opacity: currentIndex === i ? 1 : 0.3, backgroundColor: isDarkMode ? "#fff" : "#000" }]} />
        ))}
      </View>
    </View>
  );
}

function AssetCard({ asset, animatedStyle, onPress, isDarkMode }) {
  const onFavoritePress = () => {};
  const onSharePress = () => {
    Share.share({ message: `Check out this asset: ${asset.name} for ${asset.price}!` });
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Animated.View style={[styles.assetCard, { backgroundColor: isDarkMode ? "#07392dff" : "#FAFAFA" }, animatedStyle]}>
        <View style={styles.imageWrapper}>
          <ImageSlider images={asset.images} isDarkMode={isDarkMode} />

          {/* Category tag at top of image with green bg */}
          <View style={styles.topTagRow}>
            <View style={[styles.topTag, { backgroundColor: isDarkMode ? 'rgba(0,150,100,0.8)' : 'rgba(2, 175, 106, 0.8)' }]}>
              <Text style={[styles.topTagText, { color: isDarkMode ? "#fff" : "#fff" }]}>{asset.category}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.iconBtn, styles.favBtn]} onPress={onFavoritePress}>
            <Icon name="heart" size={20} color={isDarkMode ? "white" : "#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.shareBtn]} onPress={onSharePress}>
            <Icon name="share-2" size={20} color={isDarkMode ? "white" : "#000"} />
          </TouchableOpacity>
        </View>

        <View style={styles.assetContent}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.assetTitle, { color: isDarkMode ? "#fff" : "#000" }]} numberOfLines={1}>{asset.name}</Text>
              <Text style={[styles.assetLocation, { color: isDarkMode ? "#fff" : "#000" }]}>{asset.location}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.assetPrice, { color: isDarkMode ? "#fff" : "#000" }]}>{asset.price}</Text>
              <ReviewStars rating={asset.rating} reviews={asset.reviews} isDarkMode={isDarkMode} />
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function MarketplaceScreen({ navigation }) {
  const { isDarkMode } = useTheme(); // ✅ ADDED
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSearch, setShowSearch] = useState(false);

  const [animatedValues, setAnimatedValues] = useState({ translateY: [], opacity: [] });

  const filteredAssets = useMemo(() => {
    return ASSETS.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  useEffect(() => {
    const translateYs = filteredAssets.map(() => new Animated.Value(50));
    const opacities = filteredAssets.map(() => new Animated.Value(0));
    setAnimatedValues({ translateY: translateYs, opacity: opacities });
  }, [filteredAssets]);

  useEffect(() => {
    if (!animatedValues.translateY.length) return;

    const animations = animatedValues.translateY.map((translateY, i) =>
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          delay: i * 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.opacity[i], {
          toValue: 1,
          duration: 600,
          delay: i * 150,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(150, animations).start();
  }, [animatedValues]);

  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient — ONLY in Dark Mode */}
      {isDarkMode && (
        <>
          <LinearGradient
            colors={['#001A13', '#003B28', '#017148ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.02)", "rgba(0,0,0,0.6)"]}
              style={StyleSheet.absoluteFillObject}
            />
          </LinearGradient>
        </>
      )}

      <SafeAreaView style={{ flex: 1 }}>
        <Navbar />

        {/* Header */}
        <View style={styles.headerBar}>
          {!showSearch ? (
            <>
              <Text style={[styles.heading, { color: isDarkMode ? "#fff" : "#000" }]}>Explore Marketplace</Text>
              <TouchableOpacity onPress={() => setShowSearch(true)}>
                <Icon style={styles.search} name="search" size={18} color={isDarkMode ? "#fff" : "#000"} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={[styles.searchWrapper, { backgroundColor: isDarkMode ? "#07392dff" : "#F5F5F5" }]}>
              <TextInput
                placeholder="Search assets..."
                placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: isDarkMode ? "#fff" : "#000" }]}
                autoFocus
              />
              <TouchableOpacity onPress={() => { setShowSearch(false); setSearch(''); }}>
                <Icon name="x" size={18} color={isDarkMode ? "#fff" : "#000"} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(cat => {
              const active = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.categoryTabWrapper, active && { borderBottomColor: isDarkMode ? "#048d51ff" : "#02af6a" }]}
                  onPress={() => setSelectedCategory(cat.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabInner}>
                    {active && (
                      <Icon
                        name={cat.icon}
                        size={16}
                        color={isDarkMode ? "#048d51ff" : "#02af6a"}
                        style={{ marginRight: 6 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.categoryTabLabel,
                        active ? { color: isDarkMode ? "#048d51ff" : "#02af6a", fontWeight: 'bold' } : { color: isDarkMode ? "#aaa" : "#666" },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Cards with animation */}
        <FlatList
          data={filteredAssets}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <AssetCard
              asset={item}
              animatedStyle={{
                transform: [{ translateY: animatedValues.translateY[index] || new Animated.Value(0) }],
                opacity: animatedValues.opacity[index] || new Animated.Value(1),
              }}
              onPress={() => navigation.navigate('AssetDetails', { asset: item })}
              isDarkMode={isDarkMode}
            />
          )}
        />

        <BottomNav />
      </SafeAreaView>
    </View>
  );
}

// ✅ Styles — PRESERVED YOUR DARK THEME, ADDED LIGHT THEME
const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 50,
    marginBottom: 12,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 50,
  },
  search: {
    marginTop: 50,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    flex: 1,
    height: 40,
    marginTop: 50,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  categoriesWrapper: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryTabWrapper: {
    marginRight: 20,
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabInner: { flexDirection: 'row', alignItems: 'center' },
  categoryTabLabel: {
    fontWeight: '500',
    fontSize: 14,
  },
  assetCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
  },
  sliderContainer: { width: '100%', height: 180 },
  sliderImage: {
    width: SCREEN_WIDTH - 32,
    height: 180,
  },
  pagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: { height: 8, width: 8, borderRadius: 4, marginHorizontal: 4 },
  iconBtn: {
    position: 'absolute',
    top: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  favBtn: { right: 44 },
  shareBtn: { right: 14 },
  topTagRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
  },
  topTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  topTagText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  assetContent: { paddingHorizontal: 12, paddingVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  assetTitle: { fontWeight: 'bold', fontSize: 18, flex: 1, marginBottom: 4 },
  assetLocation: { fontSize: 14 },
  reviewContainer: { flexDirection: 'row', alignItems: 'center' },
  assetPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
});