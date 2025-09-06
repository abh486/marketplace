// screens/MapScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';

export default function MapScreen({ route, location, coordinates }) {
  // Handle both route.params and direct props
  const routeParams = route?.params || {};
  const propLocation = location || routeParams.location || 'Miami, USA';
  const propCoordinates = coordinates || routeParams.coordinates;

  // Default fallback if coordinates are missing
  const defaultCoords = {
    latitude: 25.7617, // Miami coordinates
    longitude: -80.1918,
  };

  const finalCoords = propCoordinates || defaultCoords;

  const handleEmail = () => {
    Linking.openURL(`mailto:agent@example.com?subject=Inquiry about ${propLocation}`);
  };

  const handleCall = () => {
    Linking.openURL('tel:+971501234567');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+971501234567');
  };

  return (
    <View style={styles.container}>
      {/* Debug info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Map Loading...</Text>
        <Text style={styles.debugText}>Location: {propLocation}</Text>
        <Text style={styles.debugText}>Coords: {finalCoords.latitude}, {finalCoords.longitude}</Text>
      </View>
      
      {/* Fallback if map doesn't load */}
      <View style={styles.mapFallback}>
        <Text style={styles.mapFallbackText}>Map Loading...</Text>
        <Text style={styles.mapFallbackSubtext}>Property Location: {propLocation}</Text>
        <Text style={styles.mapFallbackSubtext}>Coordinates: {finalCoords.latitude}, {finalCoords.longitude}</Text>
      </View>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: finalCoords.latitude,
          longitude: finalCoords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        showsCompass={false}
        showsMyLocationButton={false}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        onError={(error) => console.log('Map Error:', error)}
        onMapReady={() => console.log('Map is ready')}
      >
        <Marker coordinate={finalCoords} title={propLocation} />
      </MapView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={handleEmail}>
            <Icon name="mail" size={18} color="#000" />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={handleCall}>
            <Icon name="phone" size={18} color="#000" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={handleWhatsApp}>
            <Icon name="message-circle" size={18} color="#000" />
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  map: { 
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  debugInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  mapFallback: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 5,
  },
  mapFallbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  mapFallbackSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
});