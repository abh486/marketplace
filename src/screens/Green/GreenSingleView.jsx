import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const GreenSingleView = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Impact', 'Projects', 'FAQ'];

  const greenData = {
    title: 'Solar Energy Fund',
    description: 'Invest in solar energy projects and help save the planet while earning returns.',
    impact: '5 tons CO2 saved',
    return: '7.2% APY',
    risk: 'Low',
    duration: '24 months',
    certified: true,
    projects: [
      { name: 'Solar Plant A', progress: 80 },
      { name: 'Solar Plant B', progress: 60 },
      { name: 'Solar Plant C', progress: 100 },
    ],
    faqs: [
      { q: 'How does this fund help the environment?', a: 'By investing in renewable energy projects.' },
      { q: 'What is the expected return?', a: '7.2% APY.' },
      { q: 'Is my investment safe?', a: 'The fund is certified and has a low risk profile.' },
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
      <Text style={styles.title}>{greenData.title}</Text>
      <Text style={styles.description}>{greenData.description}</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <Text>Impact: {greenData.impact}</Text>
        <Text>Return: {greenData.return}</Text>
        <Text>Duration: {greenData.duration}</Text>
      </View>
    </ScrollView>
  );

  const renderImpact = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Environmental Impact</Text>
      <View style={styles.sectionCard}>
        <Text>CO2 Saved: {greenData.impact}</Text>
        <Text>Certified: {greenData.certified ? 'Yes' : 'No'}</Text>
        <Text style={styles.placeholder}>[Live impact chart placeholder]</Text>
      </View>
    </ScrollView>
  );

  const renderProjects = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Funded Projects</Text>
      {greenData.projects.map((proj, idx) => (
        <View key={idx} style={styles.projectRow}>
          <Text style={styles.projectName}>{proj.name}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${proj.progress}%` }]} />
          </View>
          <Text style={styles.projectProgress}>{proj.progress}%</Text>
        </View>
      ))}
      <Text style={styles.placeholder}>[Project timeline placeholder]</Text>
    </ScrollView>
  );

  const renderFAQ = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>FAQ</Text>
      {greenData.faqs.map((faq, idx) => (
        <View key={idx} style={styles.faqRow}>
          <Text style={styles.faqQ}>{faq.q}</Text>
          <Text style={styles.faqA}>{faq.a}</Text>
        </View>
      ))}
      <Text style={styles.placeholder}>[Contact support placeholder]</Text>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview': return renderOverview();
      case 'Impact': return renderImpact();
      case 'Projects': return renderProjects();
      case 'FAQ': return renderFAQ();
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
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#4CAF50' },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: '#4CAF50', fontWeight: '700' },
  section: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 15, color: '#555', marginBottom: 12 },
  sectionCard: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  projectRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  projectName: { flex: 1, fontWeight: '500', color: '#333' },
  progressBarBg: { flex: 2, height: 8, backgroundColor: '#eee', borderRadius: 4, marginHorizontal: 8 },
  progressBar: { height: 8, backgroundColor: '#4CAF50', borderRadius: 4 },
  projectProgress: { width: 40, textAlign: 'right', color: '#4CAF50', fontWeight: '600' },
  faqRow: { marginBottom: 14 },
  faqQ: { fontWeight: '700', color: '#333' },
  faqA: { color: '#555', marginTop: 2 },
  placeholder: { color: '#aaa', fontStyle: 'italic', marginTop: 8 },
});

export default GreenSingleView;
