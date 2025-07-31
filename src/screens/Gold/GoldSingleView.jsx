import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const GoldSingleView = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Specifications', 'Certification', 'Price History'];

  const goldData = {
    title: 'Premium Gold Bullion 1oz',
    description: 'A premium 1oz gold bullion bar, certified and sealed. Perfect for investment and gifting.',
    weight: '1 Troy Oz',
    purity: '99.9%',
    manufacturer: 'PAMP Suisse',
    certification: {
      authority: 'LBMA',
      number: 'GB2024-001247',
      date: '2024-06-15',
      grade: 'A+',
      authenticity: 'Verified',
    },
    priceHistory: [
      { date: 'Jan', price: 1950 },
      { date: 'Feb', price: 1975 },
      { date: 'Mar', price: 2000 },
      { date: 'Apr', price: 1980 },
      { date: 'May', price: 2020 },
      { date: 'Jun', price: 2045 },
    ],
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.title}>{goldData.title}</Text>
      <Text style={styles.description}>{goldData.description}</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Text>Weight: {goldData.weight}</Text>
        <Text>Purity: {goldData.purity}</Text>
        <Text>Manufacturer: {goldData.manufacturer}</Text>
      </View>
    </ScrollView>
  );

  const renderSpecifications = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Technical Specifications</Text>
      <View style={styles.sectionCard}>
        <Text>Weight: {goldData.weight}</Text>
        <Text>Purity: {goldData.purity}</Text>
        <Text>Manufacturer: {goldData.manufacturer}</Text>
        <Text>Dimensions: 24.5mm x 40.0mm</Text>
        <Text>Thickness: 1.2mm</Text>
      </View>
    </ScrollView>
  );

  const renderCertification = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Certification Details</Text>
      <View style={styles.sectionCard}>
        <Text>Authority: {goldData.certification.authority}</Text>
        <Text>Number: {goldData.certification.number}</Text>
        <Text>Date: {goldData.certification.date}</Text>
        <Text>Grade: {goldData.certification.grade}</Text>
        <Text>Authenticity: {goldData.certification.authenticity}</Text>
        <Text style={styles.placeholder}>[Download certificate PDF placeholder]</Text>
      </View>
    </ScrollView>
  );

  const renderPriceHistory = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Price History (6 Months)</Text>
      <View style={styles.sectionCard}>
        {goldData.priceHistory.map((item, idx) => (
          <View key={idx} style={styles.priceRow}>
            <Text style={styles.priceMonth}>{item.date}</Text>
            <Text style={styles.priceValue}>${item.price}</Text>
          </View>
        ))}
        <Text style={styles.placeholder}>[Interactive price chart placeholder]</Text>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview': return renderOverview();
      case 'Specifications': return renderSpecifications();
      case 'Certification': return renderCertification();
      case 'Price History': return renderPriceHistory();
      default: return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderTabBar()}
      {renderTabContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, padding: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#FFD700' },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: '#FFD700', fontWeight: '700' },
  section: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 15, color: '#555', marginBottom: 12 },
  sectionCard: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  priceMonth: { color: '#888', fontWeight: '500' },
  priceValue: { color: '#333', fontWeight: '700' },
  placeholder: { color: '#aaa', fontStyle: 'italic', marginTop: 8 },
});

export default GoldSingleView;
