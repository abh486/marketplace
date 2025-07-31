import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PropertyListing = () => {
  return (
    <ScrollView style={styles.container}>
      {/* About the property section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the property</Text>
        
        <View style={styles.propertyGrid}>
          <View style={styles.propertyItem}>
            <Icon name="bed" size={20} color="#64B5F6" />
            <Text style={styles.propertyText}>1 Bedroom</Text>
          </View>
          
          <View style={styles.propertyItem}>
            <Icon name="bathtub" size={20} color="#64B5F6" />
            <Text style={styles.propertyText}>1 Bathroom</Text>
          </View>
          
          <View style={styles.propertyItem}>
            <Icon name="kitchen" size={20} color="#64B5F6" />
            <Text style={styles.propertyText}>1 Kitchen</Text>
          </View>
          
          <View style={styles.propertyItem}>
            <Icon name="weekend" size={20} color="#64B5F6" />
            <Text style={styles.propertyText}>1 Living room</Text>
          </View>
        </View>
        
        <TouchableOpacity>
          <Text style={styles.showMore}>Show more</Text>
        </TouchableOpacity>
      </View>

      {/* Amenities section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        
        <View style={styles.amenitiesGrid}>
          <View style={styles.amenityItem}>
            <View style={styles.amenityDot} />
            <Text style={styles.amenityText}>Gym</Text>
          </View>
          
          <View style={styles.amenityItem}>
            <View style={styles.amenityDot} />
            <Text style={styles.amenityText}>Swimming pool</Text>
          </View>
          
          <View style={styles.amenityItem}>
            <View style={styles.amenityDot} />
            <Text style={styles.amenityText}>Supermarket</Text>
          </View>
          
          <View style={styles.amenityItem}>
            <View style={styles.amenityDot} />
            <Text style={styles.amenityText}>Restaurant</Text>
          </View>
        </View>
        
        <TouchableOpacity>
          <Text style={styles.showMore}>Show more</Text>
        </TouchableOpacity>
      </View>

      {/* Blurred content section */}
      <View style={styles.blurredSection}>
        <View style={styles.blurredRow}>
          <View style={styles.blurredIcon} />
          <View>
            <View style={styles.blurredLine} />
            <View style={styles.blurredLineShort} />
          </View>
          <View style={styles.blurredValues}>
            <View style={styles.blurredValue} />
            <View style={styles.blurredValue} />
            <View style={styles.blurredValueSmall} />
          </View>
        </View>

        {/* Call to action overlay */}
        <View style={styles.overlay}>
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>
              Become an investor to view{'\n'}the property documents.
            </Text>
          </View>
        </View>

        <View style={styles.blurredRow}>
          <View style={styles.blurredIcon} />
          <View style={styles.blurredContent}>
            <View style={styles.blurredLine} />
          </View>
          <View style={styles.blurredValues}>
            <View style={styles.blurredValue} />
            <View style={styles.blurredValueSmall} />
          </View>
        </View>
      </View>

      {/* Description section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          LIV Residence, located in the vibrant Marina Promenade district of Dubai Marina, is a distinguished 28-storey residential tower developed by LIV Real Estate Development. Surrounded by waterfront attractions and...
        </Text>
        <TouchableOpacity>
          <Text style={styles.showMore}>Show more</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  propertyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  propertyText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  amenityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64B5F6',
    marginRight: 12,
  },
  amenityText: {
    fontSize: 16,
    color: '#333333',
  },
  showMore: {
    fontSize: 16,
    color: '#64B5F6',
    marginTop: 10,
  },
  blurredSection: {
    position: 'relative',
    marginVertical: 20,
  },
  blurredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  blurredIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 15,
  },
  blurredLine: {
    width: 120,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 8,
  },
  blurredLineShort: {
    width: 80,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  blurredContent: {
    flex: 1,
  },
  blurredValues: {
    alignItems: 'flex-end',
  },
  blurredValue: {
    width: 60,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 4,
  },
  blurredValueSmall: {
    width: 40,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  ctaContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
});

export default PropertyListing;