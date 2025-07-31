import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Cards = ({ item, type, activeTab, onBuy, onFavorite, onPress }) => {
  const [favorited, setFavorited] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Simplified animations - only keep essential ones
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const detailsAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const images = Array.isArray(item.images) && item.images.length > 0 
    ? item.images 
    : (item.image ? [item.image] : ['https://via.placeholder.com/400x300?text=No+Image']);

  useEffect(() => {
    // Single slide-in animation on mount
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    onFavorite?.(item);
  };

  const toggleDetails = () => {
    const toValue = showDetails ? 0 : 1;
    Animated.timing(detailsAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowDetails(!showDetails);
  };

  const getTypeIcon = () => {
    const icons = {
      realestate: 'home',
      upcoming: 'home',
      gold: 'star',
      tokenization: 'token',
      green: 'eco'
    };
    return icons[type] || 'apps';
  };

  const getGradientColors = () => {
    const gradients = {
      realestate: ['#667eea', '#764ba2'],
      upcoming: ['#f093fb', '#f5576c'],
      gold: ['#f6d365', '#fda085'],
      tokenization: ['#4facfe', '#00f2fe'],
      green: ['#43e97b', '#38f9d7']
    };
    return gradients[type] || ['#667eea', '#764ba2'];
  };

  const slideTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View 
      style={[
        styles.cardContainer, 
        { 
          transform: [
            { scale: scaleAnim },
            { translateY: slideTranslate }
          ],
          opacity: slideAnim
        }
      ]}
    >
      <TouchableOpacity 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card} 
        activeOpacity={0.95}
      >
        <View style={styles.imageContainer}>
          {!imageLoaded && (
            <View style={styles.imagePlaceholder}>
              <Icon name="image" size={40} color="#e5e7eb" />
            </View>
          )}
          
          <Swiper 
            style={styles.swiperContainer}
            showsButtons={false}
            showsPagination={images.length > 1}
            autoplay={images.length > 1}
            autoplayTimeout={6}
            loop={images.length > 1}
            dot={<View style={styles.swiperDot} />}
            activeDot={<View style={styles.swiperDotActive} />}
            paginationStyle={styles.swiperPagination}
          >
            {images.map((imageUri, index) => (
              <View key={index} style={styles.slideContainer}>
                <Image 
                  source={{ uri: imageUri }}
                  style={styles.cardImage}
                  onLoad={() => setImageLoaded(true)}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradientOverlay}
          />

          {type === 'upcoming' && (
            <View style={styles.upcomingShade}>
              <LinearGradient
                colors={['rgba(17, 24, 39, 0.9)', 'rgba(17, 24, 39, 0.6)']}
                style={styles.upcomingGradient}
              />
              <View style={styles.lockIconContainer}>
                <Icon name="lock" size={20} color="#fff" />
              </View>
            </View>
          )}

          <View style={styles.headerContentOverImage}>
            <View style={styles.categoryBadge}>
              <LinearGradient
                colors={getGradientColors()}
                style={styles.categoryGradient}
              >
                <Icon name={getTypeIcon()} size={12} color="white" />
                <Text style={styles.categoryText}>{activeTab}</Text>
              </LinearGradient>
            </View>
            
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
              <Icon 
                name={favorited ? "favorite" : "favorite-border"} 
                size={16} 
                color={favorited ? "#ff4757" : "white"} 
              />
            </TouchableOpacity>
          </View>

          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <LinearGradient
                colors={['#f6d365', '#fda085']}
                style={styles.premiumGradient}
              >
                <Icon name="star" size={10} color="white" />
                <Text style={styles.premiumText}>PREMIUM</Text>
              </LinearGradient>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <View style={styles.priceRow}>
            <Text style={styles.priceProminent}>{item.price}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPriceProminent}>{item.originalPrice}</Text>
            )}
            {item.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}% OFF</Text>
              </View>
            )}
          </View>
          
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <TouchableOpacity onPress={toggleDetails} style={styles.detailsToggle}>
              <Icon 
                name={showDetails ? "expand-less" : "expand-more"} 
                size={20} 
                color="#6366f1" 
              />
            </TouchableOpacity>
          </View>
          
          {(type === 'realestate' || type === 'upcoming') && (
            <>
              {item.location && (
                <View style={styles.locationRow}>
                  <View style={styles.locationIcon}>
                    <Icon name="location-on" size={10} color="#6366f1" />
                  </View>
                  <Text style={styles.locationText}>{item.location}</Text>
                  {item.distance && (
                    <Text style={styles.distanceText}>• {item.distance}</Text>
                  )}
                </View>
              )}
              
              {(item.bedrooms || item.bathrooms || item.area) && (
                <View style={styles.propertyDetails}>
                  <LinearGradient
                    colors={['#f8fafc', '#f1f5f9']}
                    style={styles.propertyDetailsGradient}
                  >
                    {item.bedrooms && (
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Icon name="bed" size={10} color="#6366f1" />
                        </View>
                        <Text style={styles.detailText}>{item.bedrooms}</Text>
                      </View>
                    )}
                    {item.bathrooms && (
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Icon name="bathtub" size={10} color="#6366f1" />
                        </View>
                        <Text style={styles.detailText}>{item.bathrooms}</Text>
                      </View>
                    )}
                    {item.area && (
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <MaterialCommunityIcons name="floor-plan" size={10} color="#6366f1" />
                        </View>
                        <Text style={styles.detailText}>{item.area}</Text>
                      </View>
                    )}
                  </LinearGradient>
                </View>
              )}
            </>
          )}

          <Animated.View
            style={[
              styles.expandedDetails,
              {
                opacity: detailsAnim,
                transform: [{ translateY: detailsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }) }],
              },
            ]}
          >
            {showDetails && (
              <>
                {item.date && (
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Coming {item.date}</Text>
                  </View>
                )}
                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
                
                {type === 'gold' && (
                  <View style={styles.goldDetails}>
                    <LinearGradient colors={['#fef7ed', '#fed7aa']} style={styles.goldGradient}>
                      <View style={styles.detailRow}>
                        <Icon name="scale" size={12} color="#f39c12" />
                        <Text style={styles.goldDetailText}>Weight: {item.weight}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Icon name="diamond" size={12} color="#f39c12" />
                        <Text style={styles.goldDetailText}>Purity: {item.purity}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                )}
                
                {type === 'tokenization' && (
                  <View style={styles.tokenDetails}>
                    <LinearGradient colors={['#ecfeff', '#a7f3d0']} style={styles.tokenGradient}>
                      <View style={styles.detailRow}>
                        <Icon name="trending-up" size={12} color="#00d2d3" />
                        <Text style={styles.tokenDetailText}>Yield: {item.yield}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Icon name="account-balance-wallet" size={12} color="#00d2d3" />
                        <Text style={styles.tokenDetailText}>Tokens: {item.tokens}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                )}
                
                {type === 'green' && (
                  <View style={styles.greenDetails}>
                    <LinearGradient colors={['#f0fdf4', '#bbf7d0']} style={styles.greenGradient}>
                      <View style={styles.detailRow}>
                        <Icon name="eco" size={12} color="#10ac84" />
                        <Text style={styles.greenDetailText}>Impact: {item.impact}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Icon name="monetization-on" size={12} color="#10ac84" />
                        <Text style={styles.greenDetailText}>Return: {item.return}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </>
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 340,
    height: 340,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageContainer: {
    position: 'relative',
    height: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  swiperContainer: {
    height: '100%',
  },
  slideContainer: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  swiperPagination: {
    bottom: 10,
  },
  swiperDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
  },
  swiperDotActive: {
    backgroundColor: '#6366f1',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  upcomingShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 2,
  },
  upcomingGradient: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  lockIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerContentOverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoryBadge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'flex-start',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  priceProminent: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  originalPriceProminent: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  discountBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    flex: 1,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  detailsToggle: {
    padding: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 4,
    marginRight: 6,
  },
  locationText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  distanceText: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
  propertyDetails: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  propertyDetailsGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  detailIcon: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 4,
    marginRight: 4,
  },
  detailText: {
    color: '#6366f1',
    fontWeight: '700',
    fontSize: 12,
  },
  expandedDetails: {
    overflow: 'hidden',
  },
  dateContainer: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  dateText: {
    color: '#f59e0b',
    fontWeight: '800',
    fontSize: 10,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  goldDetails: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  goldGradient: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tokenDetails: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tokenGradient: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  greenDetails: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  greenGradient: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  goldDetailText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  tokenDetailText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  greenDetailText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Cards;