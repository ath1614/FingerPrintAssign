import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface LoadingOverlayProps {
  visible: boolean;
  progress?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, progress }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <BlurView intensity={20} style={styles.blur}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.text}>Analyzing fingerprints...</Text>
          {progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 16,
    minWidth: 200,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 20,
    width: 200,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
});