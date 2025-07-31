import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const FinancialSingleView = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Performance', 'Portfolio', 'Activity'];

  const financialData = {
    title: 'Growth Mutual Fund - Alpha',
    description: 'A diversified mutual fund focused on long-term capital growth with moderate risk.',
    risk: 'Moderate',
    duration: '5 years',
    returns: '12.5% CAGR',
    minInvestment: '$500',
    performance: [
      { year: 2020, value: 100 },
      { year: 2021, value: 112 },
      { year: 2022, value: 125 },
      { year: 2023, value: 140 },
    ],
    portfolio: [
      { asset: 'Tech Stocks', percent: 40 },
      { asset: 'Healthcare', percent: 25 },
      { asset: 'Energy', percent: 15 },
      { asset: 'Bonds', percent: 20 },
    ],
    activity: [
      { date: '2024-06-01', action: 'Dividend', amount: '$20' },
      { date: '2024-06-15', action: 'Buy', amount: '$500' },
      { date: '2024-07-01', action: 'Sell', amount: '$200' },
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
      <Text style={styles.title}>{financialData.title}</Text>
      <Text style={styles.description}>{financialData.description}</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <Text>Risk: {financialData.risk}</Text>
        <Text>Duration: {financialData.duration}</Text>
        <Text>Returns: {financialData.returns}</Text>
        <Text>Min Investment: {financialData.minInvestment}</Text>
      </View>
    </ScrollView>
  );

  const renderPerformance = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Performance</Text>
      <View style={styles.sectionCard}>
        {financialData.performance.map((item, idx) => (
          <View key={idx} style={styles.performanceRow}>
            <Text style={styles.performanceYear}>{item.year}</Text>
            <Text style={styles.performanceValue}>{item.value}</Text>
          </View>
        ))}
        <Text style={styles.placeholder}>[Performance chart placeholder]</Text>
      </View>
    </ScrollView>
  );

  const renderPortfolio = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Portfolio Allocation</Text>
      {financialData.portfolio.map((item, idx) => (
        <View key={idx} style={styles.portfolioRow}>
          <Text style={styles.portfolioAsset}>{item.asset}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${item.percent}%` }]} />
          </View>
          <Text style={styles.portfolioPercent}>{item.percent}%</Text>
        </View>
      ))}
      <Text style={styles.placeholder}>[Pie chart placeholder]</Text>
    </ScrollView>
  );

  const renderActivity = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {financialData.activity.map((item, idx) => (
        <View key={idx} style={styles.activityRow}>
          <Text style={styles.activityDate}>{item.date}</Text>
          <Text style={styles.activityAction}>{item.action}</Text>
          <Text style={styles.activityAmount}>{item.amount}</Text>
        </View>
      ))}
      <Text style={styles.placeholder}>[Transaction history placeholder]</Text>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview': return renderOverview();
      case 'Performance': return renderPerformance();
      case 'Portfolio': return renderPortfolio();
      case 'Activity': return renderActivity();
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
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#4A90E2' },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: '#4A90E2', fontWeight: '700' },
  section: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 15, color: '#555', marginBottom: 12 },
  sectionCard: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  performanceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  performanceYear: { color: '#888', fontWeight: '500' },
  performanceValue: { color: '#333', fontWeight: '700' },
  portfolioRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  portfolioAsset: { flex: 1, fontWeight: '500', color: '#333' },
  progressBarBg: { flex: 2, height: 8, backgroundColor: '#eee', borderRadius: 4, marginHorizontal: 8 },
  progressBar: { height: 8, backgroundColor: '#4A90E2', borderRadius: 4 },
  portfolioPercent: { width: 40, textAlign: 'right', color: '#4A90E2', fontWeight: '600' },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  activityDate: { color: '#888', fontWeight: '500' },
  activityAction: { color: '#333', fontWeight: '600' },
  activityAmount: { color: '#4A90E2', fontWeight: '700' },
  placeholder: { color: '#aaa', fontStyle: 'italic', marginTop: 8 },
});

export default FinancialSingleView; 