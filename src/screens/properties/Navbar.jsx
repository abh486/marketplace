import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HEADER_HEIGHT = 80;

// Example notification count (replace with your state/props)
const notificationCount = 7;

const Navbar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Logo on the left */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/image/Copym-01.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Right side: Notification and Hamburger Menu */}
      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => { /* handle notifications */ }}>
          <Icon name="notifications-outline" size={22} color="#000" />
          {notificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={openModal}>
          <View style={styles.hamburgerIcon}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <View style={styles.headerOptions}>
                  <TouchableOpacity style={styles.headerOption} onPress={() => { /* handle profile */ }}>
                    <Icon name="person-outline" size={20} color="#255f99" />
                    <Text style={styles.headerOptionText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerOption} onPress={() => { /* handle notification */ }}>
                    <Icon name="notifications-outline" size={20} color="#255f99" />
                    <Text style={styles.headerOptionText}>Notification</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerOption} onPress={() => { /* handle investment */ }}>
                    <Icon name="trending-up-outline" size={20} color="#255f99" />
                    <Text style={styles.headerOptionText}>Investment</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000, // Increased zIndex to ensure visibility
    backgroundColor: '#fff', // Added background color
    paddingHorizontal: 20,
    paddingTop: 40, // Account for status bar
  },
  logoContainer: {
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 50,
    borderRadius: 8,
  },

  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 40, // Match paddingTop of headerContainer
    zIndex: 1001, // Higher than header zIndex
  },
  iconButton: {
    marginLeft: 16,
    padding: 4, // Add touch area
  },
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: HEADER_HEIGHT,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: 400,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerOptions: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  headerOption: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#255f99',
    marginTop: 4,
  },
});

export default Navbar;