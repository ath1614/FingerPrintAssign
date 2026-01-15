import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

interface LandingScreenProps {
  onStartCapture: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartCapture }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fingerprint Verification</Text>
      <Text style={styles.subtitle}>Secure biometric demo</Text>
      <PrimaryButton title="Start" onPress={onStartCapture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: colors.textSecondary,
  },
});