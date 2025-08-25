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

export default function MapScreen({ route }) {
  const { location, coordinates } = route.params;

  // Default fallback if coordinates are missing
  const defaultCoords = {
    latitude: 40.7128, // New York
    longitude: -74.0060,
  };

  const finalCoords = coordinates || defaultCoords;

  const handleEmail = () => {
    Linking.openURL(`mailto:agent@example.com?subject=Inquiry about ${location}`);
  };

  const handleCall = () => {
    Linking.openURL('tel:+971501234567');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+971501234567');
  };

  return (
    <View style={styles.container}>
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
      >
        <Marker coordinate={finalCoords} title={location} />
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
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
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
});