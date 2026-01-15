import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../components/PrimaryButton';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';

interface LandingScreenProps {
  onStartCapture: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartCapture }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="fingerprint" size={80} color={colors.primary} />
        <Text style={styles.title}>Fingerprint Verification</Text>
        <Text style={styles.subtitle}>Secure biometric authentication system</Text>
      </View>

      <GlassCard>
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          
          <View style={styles.feature}>
            <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Camera & Gallery Support</Text>
              <Text style={styles.featureDesc}>Capture or select fingerprint images</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <MaterialIcons name="compare" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Advanced Matching</Text>
              <Text style={styles.featureDesc}>Pixel-wise comparison algorithm</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <MaterialIcons name="speed" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Real-time Processing</Text>
              <Text style={styles.featureDesc}>Instant verification results</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <MaterialIcons name="security" size={24} color={colors.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureName}>85% Accuracy Threshold</Text>
              <Text style={styles.featureDesc}>High-precision matching</Text>
            </View>
          </View>
        </View>
      </GlassCard>

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Start Verification" onPress={onStartCapture} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  featuresContainer: {
    paddingVertical: 8,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginTop: 24,
  },
});