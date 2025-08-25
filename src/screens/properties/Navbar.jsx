import React, { useState } from 'react';
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

const HEADER_HEIGHT = 80;

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

      {/* Right side: Hamburger Menu Only */}
      <View style={styles.rightButtonsContainer}>
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
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000,
    backgroundColor: '#012419ff',
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
    backgroundColor: '#ffffffff',
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,16,32,0.83)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: HEADER_HEIGHT,
  },
  modalContent: {
    backgroundColor: '#1d3125',
    width: '90%',
    maxHeight: 400,
    borderRadius: 20,
    shadowColor: '#00ff66',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.17,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1.1,
    borderColor: '#00ff6633',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
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
    fontWeight: '600',
    color: '#00ff66',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default Navbar;