import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserProfileContext } from '../Context/UserProfileContext';
import { useTheme } from '../../Theme/ThemeContext'; // ✅ ADDED — adjust path if needed

const HEADER_HEIGHT = 80;

const Navbar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Theme Context
  const { theme, isDarkMode, toggleTheme } = useTheme(); // ✅ Get theme & toggle

  // Get KYC status from context
  const { profile } = useContext(UserProfileContext);
  const kycVerified = profile?.kycVerified || false;

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

  const handleKYC = () => {
    closeModal();
    if (!kycVerified) {
      alert('Please verify your KYC.');
    } else {
      alert('KYC Verified');
    }
  };

  const handleHelp = () => {
    closeModal();
    alert('Navigate to Help Centre');
  };

  const handleTerms = () => {
    closeModal();
    alert('Navigate to Terms and Privacy');
  };

  const handleLogout = () => {
    closeModal();
    alert('Logging out...');
  };

  const handleToggleTheme = () => {
    closeModal();
    toggleTheme(); // ✅ Toggle between light/dark
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Hamburger Menu */}
      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={openModal}
          accessibilityLabel="Open Menu"
        >
          <View style={styles.hamburgerIcon}>
            <View style={[styles.hamburgerLine, { backgroundColor: theme.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.text }]} />
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
                      outputRange: [-30, 0],
                    }),
                  },
                ],
                backgroundColor: theme.card,
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButton}
                accessibilityLabel="Close Menu"
              >
                <Icon name="close" size={25} color={theme.textSecondary} />
              </TouchableOpacity>

              {/* Menu Items */}
              <View style={styles.menuItemsContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={handleKYC}>
                  <Icon name="document-text-outline" size={24} color={theme.textSecondary} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    {kycVerified ? 'KYC Verified' : 'Verify KYC'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
                  <Icon name="help-circle-outline" size={24} color={theme.textSecondary} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>Help Centre</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
                  <Icon name="reader-outline" size={24} color={theme.textSecondary} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>Terms & Privacy</Text>
                </TouchableOpacity>

                {/* ✅ THEME TOGGLE OPTION */}
                <TouchableOpacity style={styles.menuItem} onPress={handleToggleTheme}>
                  <Icon
                    name={isDarkMode ? "sunny-outline" : "moon-outline"}
                    size={24}
                    color={theme.textSecondary}
                  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <Icon name="log-out-outline" size={24} color={theme.textSecondary} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>Logout</Text>
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
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 40,
    zIndex: 1001,
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  hamburgerIcon: {
    width: 20,
    height: 15,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,16,32,0.83)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: HEADER_HEIGHT - 10,
  },
  modalContent: {
    width: '90%',
    maxHeight: 320, // Increased to fit new option
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 16,
    padding: 3,
    zIndex: 20,
  },
  menuItemsContainer: {
    marginTop: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 14,
  },
});

export default Navbar;