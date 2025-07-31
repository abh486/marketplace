import React, { useState, useRef } from 'react';
import {
  View, Text, Image, SafeAreaView, TouchableOpacity,
  ScrollView, Dimensions, StyleSheet, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import InvestmentScreen from './InvestmentScreen';
import InvestmentCalculator from './InvestmentCalculator';
import PropertyListing from './PropertyListing';

const { width, height } = Dimensions.get('window');

const RealEstateSingleView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');

  // Mock property data
  const propertyData = {
    title: "luxury villa paradise, Marina Promenade, miami, USA",
    type: "APARTMENT",
    bedrooms: 1,
    bathrooms: 1,
    area: "919 sqft",
    location: "miami USA",
    totalValue: "AED 1,900,000",
    investors: 242,
    fundedPercentage: 94,
    availableAmount: "AED 114,000",
    grossYield: "7.11%",
    netYield: "5.93%",
    annualizedReturn: "10.05%",
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300',
    ]
  };

  const tabs = ['Overview', 'Funding', 'Property details'];

  const renderImageSlider = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}
      >
        {propertyData.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {/* Header buttons overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="share" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Image indicators */}
      <View style={styles.imageIndicators}>
        {propertyData.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              selectedImageIndex === index ? styles.activeIndicator : styles.inactiveIndicator
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab && styles.activeTabText
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPropertyInfo = () => (
    <View style={styles.propertyInfoContainer}>
      <Text style={styles.propertyTitle}>{propertyData.title}</Text>
      
      <View style={styles.propertyDetailsRow}>
        <View style={styles.propertyTypeContainer}>
          <Text style={styles.propertyType}>{propertyData.type}</Text>
        </View>
        
        <View style={styles.propertySpecs}>
          <View style={styles.specItem}>
            <Icon name="bed" size={16} color="#4A90E2" />
            <Text style={styles.specText}>{propertyData.bedrooms}</Text>
          </View>
          
          <View style={styles.specItem}>
            <Icon name="bathtub" size={16} color="#4A90E2" />
            <Text style={styles.specText}>{propertyData.bathrooms}</Text>
          </View>
          
          <View style={styles.specItem}>
            <MaterialCommunityIcons name="floor-plan" size={16} color="#4A90E2" />
            <Text style={styles.specText}>{propertyData.area}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.locationRow}>
        <Icon name="location-on" size={16} color="#4A90E2" />
        <Text style={styles.locationText}>{propertyData.location}</Text>
      </View>
    </View>
  );

  const renderInvestmentInfo = () => (
    <View style={styles.investmentContainer}>
      <View style={styles.priceInvestorsRow}>
        <Text style={styles.totalValue}>{propertyData.totalValue}</Text>
        <View style={styles.investorsInfo}>
          <Icon name="people" size={16} color="#4A90E2" />
          <Text style={styles.investorsText}>{propertyData.investors} investors</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${propertyData.fundedPercentage}%` }]} />
        </View>
        <View style={styles.fundingInfo}>
          <Text style={styles.fundedText}>{propertyData.fundedPercentage}% Funded</Text>
          <Text style={styles.availableText}>{propertyData.availableAmount} available for investing</Text>
        </View>
      </View>
    </View>
  );

  const renderYieldInfo = () => (
    <View style={styles.yieldContainer}>
      <View style={styles.yieldRow}>
        <View style={styles.yieldItem}>
          <Text style={styles.yieldLabel}>Gross yield</Text>
          <Text style={styles.yieldValue}>{propertyData.grossYield}</Text>
        </View>
        
        <View style={styles.yieldItem}>
          <Text style={styles.yieldLabel}>Net yield</Text>
          <Text style={styles.yieldValue}>{propertyData.netYield}</Text>
        </View>
        
        <View style={styles.yieldItem}>
          <Text style={styles.yieldLabel}>Annualized return</Text>
          <Text style={styles.yieldValue}>{propertyData.annualizedReturn}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.helpContainer}>
        <Icon name="info" size={16} color="#999" />
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpText}>Need help to understand the details?</Text>
          <Text style={styles.learnMoreText}>Learn more</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderImageSlider()}
        {renderTabBar()}
        
        {activeTab === 'Overview' && (
          <View style={styles.contentContainer}>
            {renderPropertyInfo()}
            {renderInvestmentInfo()}
            {renderYieldInfo()}
            {/* Investment Screen integrated into Overview tab */}
            <InvestmentScreen />
            <InvestmentCalculator/>
            <PropertyListing/>
          </View>
        )}
        
        {activeTab === 'Funding' && (
          <View style={styles.contentContainer}>
            <Text style={styles.comingSoonText}>Funding timeline coming soon...</Text>
          </View>
        )}
        
        {activeTab === 'Property details' && (
          <View style={styles.contentContainer}>
            <Text style={styles.comingSoonText}>Property details coming soon...</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Bottom indicator */}
      <View style={styles.bottomIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  propertyImage: {
    width: width,
    height: 300,
  },
  headerOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 10,
  },
  propertyInfoContainer: {
    marginBottom: 20,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  propertyTypeContainer: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  propertyType: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '600',
  },
  propertySpecs: {
    flexDirection: 'row',
    gap: 15,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  specText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  investmentContainer: {
    marginBottom: 20,
  },
  priceInvestorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  investorsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  investorsText: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  fundingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fundedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  availableText: {
    fontSize: 14,
    color: '#666',
  },
  yieldContainer: {
    marginBottom: 20,
  },
  yieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  yieldItem: {
    alignItems: 'center',
  },
  yieldLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  yieldValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  bottomIndicator: {
    height: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 20,
  },
});

export default RealEstateSingleView;