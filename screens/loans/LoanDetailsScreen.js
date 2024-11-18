import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  getNextDueDate,
  getFormatDate,
  getDayCountBetweenDates,
} from '../utils/Helper';

const LoanDetailsScreen = ({route, navigation}) => {
  const {loan} = route.params; // Get the loan details from navigation

  if (!loan) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: 20}}>
          No Loan Data Found
        </Text>
      </View>
    );
  }

  const daysUntilDue = getDayCountBetweenDates(loan.startDate);

  // Apply red or green color based on the number of days
  const dueDateStyle = daysUntilDue <= 30 ? styles.redValue : styles.greenValue;

  const renderDetailRow = (label, value, highlight = false) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={[styles.value, highlight && dueDateStyle]}>{value}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/background-image.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <Text style={styles.header}>Loan Details</Text>

        {/* Borrower Details */}
        <Text style={styles.sectionTitle}>Borrower Information</Text>
        {renderDetailRow('Name', loan.borrower.name)}
        {renderDetailRow('Phone Number', loan.borrower.phoneNumber)}
        {renderDetailRow('Alt. Number', loan.borrower.alternativeNumber)}
        {renderDetailRow('Address', loan.borrower.address)}

        {/* Loan Details */}
        <Text style={styles.sectionTitle}>Loan Information</Text>
        {renderDetailRow('Principal', `₹${loan.principal}`)}
        {renderDetailRow('Interest/Month', `₹${loan.interestPerMonth}`)}
        {renderDetailRow('Remaining Interest', `₹${loan.remainingInterest}`)}
        {renderDetailRow(
          'Total Amount (Elapsed)',
          `₹${loan.totalAmountForElapsedMonths}`,
        )}
        {renderDetailRow('Partial Payment', `₹${loan.partialPayment}`)}
        {renderDetailRow('Interest Payment Period', loan.interestPeriodType)}
        {renderDetailRow('Period Type', loan.periodType)}
        {renderDetailRow('Period', `${loan.period} ${loan.periodType}s`)}
        {renderDetailRow('Months Elapsed', `${loan.monthsElapsed}`)}
        {renderDetailRow('Start Date', getFormatDate(loan.startDate))}
        {renderDetailRow('Next Due Date', getNextDueDate(loan.startDate), true)}
        {renderDetailRow('Next Due Days', `${daysUntilDue} days`, true)}

        {/* Lender Details */}
        <Text style={styles.sectionTitle}>Lender Information</Text>
        {renderDetailRow('Name', loan.lender.name)}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  backgroundImage: {
    flex: 1, // Ensures the background covers the whole screen
  },
  detailsContainer: {
    padding: 20,
    flexGrow: 1, // Ensures content grows within ScrollView
    backgroundColor: '#ffffff', // Adds a white background color to the card
    borderRadius: 10, // Rounds the edges of the card
    margin: 15, // Adds space around the card
    elevation: 5, // Adds a shadow for Android
    shadowColor: '#000', // Adds a shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6a11cb',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6a11cb',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  redValue: {
    color: 'red', // Make the "Next Due Date" red when within 30 days
  },
  greenValue: {
    color: 'green', // Make the "Next Due Date" green when more than 30 days away
  },
});

export default LoanDetailsScreen;
