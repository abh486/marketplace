import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import Cards from './Cards';
import Tabs from './Tabs';
import BottomNav from './BottomNav';
import Navbar from './Navbar';

const MarketScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const navigation = useNavigation();

  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  // ScrollView ref for scroll-to-top
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, contentAnim]);

  const tabData = [
    { id: 'All', title: 'All', icon: 'apps', color: '#FFD600'},
    { id: 'Upcoming', title: 'Upcoming', icon: 'event',  color: '#00C853' },
    { id: 'Real Estate', title: 'Real Estate', icon: 'home', color: '#2979FF' },
    { id: 'Gold', title: 'Gold', icon: 'star', color: '#FFD700' },
    { id: 'Tokenization', title: 'Tokenization', icon: 'token', color: '#9C27B0' },
    { id: 'Green', title: 'Green', icon: 'eco', color: '#4CAF50' },
  ];

  const realEstateData = [
    {
      id: 1,
      title: 'Luxury Villa Paradise',
      location: 'Miami, USA',
      price: '$3.2M',
      originalPrice: '$3.5M',
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      trending: true,
      featured: true,
      rating: 4.8,
      reviews: 124,
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
        'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=400'
      ],
    },
    {
      id: 2,
      title: 'Modern Penthouse',
      location: 'New York, USA',
      price: '$5.8M',
      bedrooms: 3,
      bathrooms: 2,
      area: 2800,
      trending: false,
      featured: false,
      rating: 4.6,
      reviews: 89,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400'
      ],
    },
    {
      id: 3,
      title: 'Beachfront Apartment',
      location: 'California, USA',
      price: '$2.1M',
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      trending: true,
      featured: false,
      rating: 4.9,
      reviews: 156,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400',
        'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400',
        'https://images.unsplash.com/photo-1600566752734-d1d4e5c6c9c6?w=400'
      ],
    },
  ];

  const upcomingData = [
    {
      id: 1,
      title: 'Skyline Towers Phase 2',
      location: 'Downtown, Metro City',
      price: '₹1.2Cr',
      originalPrice: '₹1.5Cr',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      trending: true,
      featured: true,
      rating: 4.9,
      reviews: 89,
      date: 'Q2 2024',
      description: 'Premium residential towers with world-class amenities. Pre-booking available with special early bird discounts.',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400'
      ],
    },
    {
      id: 2,
      title: 'Green Valley Residences',
      location: 'Suburban District',
      price: '₹85L',
      originalPrice: '₹95L',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      trending: false,
      featured: false,
      rating: 4.7,
      reviews: 156,
      date: 'Q3 2024',
      description: 'Eco-friendly residential complex with sustainable features and modern amenities.',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400',
        'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400'
      ],
    },
    {
      id: 3,
      title: 'Marina Bay Luxury',
      location: 'Waterfront District',
      price: '₹2.8Cr',
      originalPrice: '₹3.2Cr',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      trending: true,
      featured: true,
      rating: 4.8,
      reviews: 234,
      date: 'Q4 2024',
      description: 'Exclusive waterfront luxury apartments with private marina access and premium finishes.',
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'
      ],
    },
  ];

  const goldData = [
    {
      id: 1,
      title: 'Gold Bullion 1oz',
      description: '99.9% Pure Gold Bar',
      price: '$2,045',
      originalPrice: '$2,100',
      weight: '1 Troy Oz',
      purity: '99.9%',
      trending: true,
      certified: true,
      change: '+2.3%',
      images: [
        'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
        'https://images.unsplash.com/photo-1641897620206-b3f1b23a0e67?w=400',
        'https://images.unsplash.com/photo-1610375461456-8e2d2d6da8d6?w=400',
        'https://images.unsplash.com/photo-1600607687312-e06b0b10e1b4?w=400'
      ],
    },
    {
      id: 2,
      title: 'Gold Coins Set',
      description: 'American Eagle Collection',
      price: '$8,200',
      weight: '4 Troy Oz',
      purity: '99.99%',
      certified: true,
      change: '+1.8%',
      images: [
        'https://images.unsplash.com/photo-1641897620206-b3f1b23a0e67?w=400',
        'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
        'https://images.unsplash.com/photo-1600607687312-e06b0b10e1b4?w=400',
        'https://images.unsplash.com/photo-1610375461456-8e2d2d6da8d6?w=400'
      ],
    },
    {
      id: 3,
      title: 'Investment Gold',
      description: 'Swiss Mint Certificate',
      price: '$12,300',
      weight: '6 Troy Oz',
      purity: '99.9%',
      certified: true,
      change: '+3.1%',
      images: [
        'https://images.unsplash.com/photo-1610375461456-8e2d2d6da8d6?w=400',
        'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
        'https://images.unsplash.com/photo-1641897620206-b3f1b23a0e67?w=400',
        'https://images.unsplash.com/photo-1600607687312-e06b0b10e1b4?w=400'
      ],
    },
  ];

  const tokenizationData = [
    {
      id: 1,
      title: 'Real Estate Token',
      description: 'Fractional Property Ownership',
      price: '$500',
      yield: '8.5% APY',
      tokens: '1000 RET',
      volume: '$2.4M',
      holders: '1.2k',
      verified: true,
      images: [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400',
        'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400',
        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400'
      ],
    },
    {
      id: 2,
      title: 'Art Collection NFT',
      description: 'Digital Art Investment',
      price: '$1,200',
      yield: '12% APY',
      tokens: '50 ART',
      volume: '$890k',
      holders: '856',
      verified: true,
      images: [
        'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
        'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400'
      ],
    },
    {
      id: 3,
      title: 'Commodity Token',
      description: 'Diversified Asset Pool',
      price: '$750',
      yield: '6.8% APY',
      tokens: '500 COM',
      volume: '$1.1M',
      holders: '923',
      verified: false,
      images: [
        'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400',
        'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400'
      ],
    },
  ];

  const greenData = [
    {
      id: 1,
      title: 'Solar Energy Fund',
      description: 'Renewable Energy Investment',
      price: '$2,500',
      impact: '5 tons CO2 saved',
      return: '7.2% APY',
      risk: 'Low',
      duration: '24 months',
      certified: true,
      images: [
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
        'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400',
        'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400'
      ],
    },
    {
      id: 2,
      title: 'Wind Farm Project',
      description: 'Clean Energy Portfolio',
      price: '$4,800',
      impact: '12 tons CO2 saved',
      return: '8.9% APY',
      risk: 'Medium',
      duration: '36 months',
      certified: true,
      images: [
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
        'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400',
        'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400'
      ],
    },
    {
      id: 3,
      title: 'Carbon Credits',
      description: 'Environmental Offset Investment',
      price: '$1,800',
      impact: '3 tons CO2 offset',
      return: '5.5% APY',
      risk: 'Low',
      duration: '12 months',
      certified: false,
      images: [
        'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400',
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
        'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400'
      ],
    },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'All':
        // Only show real estate and tokenization cards in the All tab, and set correct type for each
        const allData = [
          ...realEstateData.map(item => ({ ...item, category: 'Real Estate', type: 'realestate' })),
          ...tokenizationData.map(item => ({ ...item, category: 'Tokenization', type: 'tokenization' })),
        ];
        return { data: allData, type: 'all' };
      case 'Real Estate':
        return { data: realEstateData, type: 'realestate' };
      case 'Upcoming':
        return { data: upcomingData, type: 'upcoming' };
      case 'Gold':
        return { data: goldData, type: 'gold' };
      case 'Tokenization':
        return { data: tokenizationData, type: 'tokenization' };
      case 'Green':
        return { data: greenData, type: 'green' };
      default:
        return { data: realEstateData, type: 'realestate' };
    }
  };


  const handleCardPress = (item, type) => {
    let screen = 'RealEstateSingleView';
    switch (type) {
      case 'gold':
      case 'Gold':
        screen = 'GoldSingleView';
        break;
      case 'financial':
      case 'Financial':
        screen = 'FinancialSingleView';
        break;
      case 'green':
      case 'Green':
        screen = 'GreenSingleView';
        break;
      case 'tokenization':
      case 'Tokenization':
        screen = 'TokenizationSingleView';
        break;
      case 'realestate':
      case 'Real Estate':
        screen = 'RealEstateSingleView';
        break;
      default:
        screen = 'RealEstateSingleView';
    }
    navigation.navigate(screen, { item, type });
  };

  const handleBuy = (item) => {
    // Handle buy action
    console.log('Buy pressed for:', item.title);
    // Add your buy logic here
  };

  const handleFavorite = (item) => {
    // Handle favorite action
    console.log('Favorite pressed for:', item.title);
    // Add your favorite logic here
  };

  const { data, type } = getCurrentData();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Navbar */}
      <Navbar />
      
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, backgroundColor: '#fff' }}
          contentContainerStyle={{ paddingBottom: 200, paddingTop: 100, backgroundColor: '#fff' }} // Adjusted top padding for smaller navbar
          showsVerticalScrollIndicator={false}
        >
          {/* Cards */}
          <Animated.View
            style={{
              paddingHorizontal: 16,
              paddingTop: 8,
              opacity: contentAnim,
              transform: [
                {
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            }}
          >
            {data.map((item, index) => (
              <Animated.View
                key={item.id}
                style={{
                  opacity: contentAnim,
                  transform: [
                    {
                      translateY: contentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 + index * 20, 0],
                      }),
                    },
                  ],
                }}
              >
                <Cards
                  item={item}
                  type={item.type || type}
                  activeTab={activeTab}
                  onPress={() => handleCardPress(item, item.type || type)}
                  onBuy={handleBuy}
                  onFavorite={handleFavorite}
                />
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>

        {/* Fixed Bottom Bar: Tabs */}
        <View style={{ position: 'absolute', left: 0, right: 0, backgroundColor: '#fff', zIndex: 10, borderTopWidth: 1, borderTopColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 8 }}>
          <View>
            <Tabs tabData={tabData} activeTab={activeTab} setActiveTab={setActiveTab} />
          </View>
        </View>

        {/* Bottom Navigation (already fixed) */}
        <BottomNav />
      </View>
    </View>
  );
};

export default MarketScreen;