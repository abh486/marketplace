import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const InvestmentScreen = () => {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dropdown options (can be customized)
  const dropdownAmounts = [1000, 2000, 3000, 5000, 10000, 20000];
  const popularAmounts = [3000, 5000, 10000];

  const formatCurrency = (amount) => {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const AmountButton = ({ amount, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.amountButton,
        isSelected && styles.selectedAmountButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.amountButtonText,
          isSelected && styles.selectedAmountButtonText,
        ]}
      >
        AED {amount.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Investment Amount Section */}
        <View style={styles.investmentCard}>
          <Text style={styles.title}>How much do you want to invest?</Text>

          <View style={styles.amountInputContainer}>
            <View style={styles.amountInput}>
              <View>
                <Text style={styles.amountLabel}>Amount to invest</Text>
                <Text style={styles.amountValue}>
                  AED {selectedAmount.toLocaleString()}
                </Text>
                {/* Example "balance" in small text */}
                <Text style={styles.smallText}>balance: AED 20,000.00</Text>
              </View>

              <View style={styles.dropdownContainer}>
                <View style={styles.dropdownBadge}>
                  <Text style={styles.dropdownBadgeText}>50</Text>
                  <View style={styles.cube} />
                </View>
                <TouchableOpacity
                  style={styles.dropdownArrow}
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Text style={styles.dropdownArrowText}>
                    {isDropdownOpen ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {dropdownAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.dropdownMenuItem,
                      selectedAmount === amount && styles.selectedDropdownItem,
                    ]}
                    onPress={() => {
                      setSelectedAmount(amount);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownMenuItemText,
                        selectedAmount === amount && styles.selectedDropdownItemText,
                      ]}
                    >
                      AED {amount.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Most Popular Label */}
          <View style={styles.mostPopularContainer}>
            <Text style={styles.mostPopularText}>Most popular</Text>
            <Text style={styles.fireEmoji}>🔥</Text>
          </View>

          {/* Amount Options */}
          <View style={styles.amountOptionsContainer}>
            {popularAmounts.map((amount) => (
              <AmountButton
                key={amount}
                amount={amount}
                isSelected={selectedAmount === amount}
                onPress={() => setSelectedAmount(amount)}
              />
            ))}
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartIcon}>⚡</Text>
            <Text style={styles.addToCartText}>Add to cart (pending verification)</Text>
          </TouchableOpacity>
        </View>

        {/* Investment Cost Breakdown as normal text */}
        <View style={{ marginTop: 24, paddingHorizontal: 8 }}>
          <Text style={styles.breakdownTitle}>Investment cost breakdown</Text>
          <Text style={styles.normalText}>
            Property cost:
            {'\n'}
             {formatCurrency(1900000.0)}
          </Text>
          <Text style={styles.normalText}>
            Purchase cost:
            {'\n'}
             {formatCurrency(171008.0)}
          </Text>
          <Text style={styles.normalText}>
            Transaction cost:
            {'\n'}
             {formatCurrency(36967.0)}
          </Text>
          <Text style={styles.normalText}>
            Running cost:
            {'\n'}
             {formatCurrency(22271.0)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  investmentCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Add elevation for Android
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  amountInputContainer: {
    marginBottom: 16,
  },
  amountInput: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafbfc',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  smallText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#64b5f6',
    backgroundColor: '#e3f2fd',
  },
  dropdownBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginRight: 6,
  },
  cube: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#64b5f6',
  },
  dropdownArrow: {
    padding: 4,
  },
  dropdownArrowText: {
    fontSize: 14,
    color: '#666666',
  },
  // Dropdown menu styles
  dropdownMenu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 8,
    elevation: 3,
    zIndex: 100,
  },
  dropdownMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownMenuItemText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  selectedDropdownItem: {
    backgroundColor: '#e3f2fd',
  },
  selectedDropdownItemText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  mostPopularContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mostPopularText: {
    fontSize: 16,
    color: '#64b5f6',
    fontWeight: '500',
    marginRight: 4,
  },
  fireEmoji: {
    fontSize: 16,
  },
  amountOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  amountButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedAmountButton: {
    borderColor: '#64b5f6',
    backgroundColor: '#e3f2fd',
  },
  amountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  selectedAmountButtonText: {
    color: '#1976d2',
  },
  addToCartButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    backgroundColor: '#f5f5f5',
  },
  addToCartIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#666666',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  normalText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
});

export default InvestmentScreen;
