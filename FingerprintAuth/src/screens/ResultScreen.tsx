import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

interface ResultScreenProps {
  match: boolean;
  similarity: number;
  onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ match, similarity, onReset }) => {
  const resultColor = match ? colors.success : colors.error;
  const iconName = match ? 'check-circle' : 'cancel';
  
  return (
    <View style={styles.container}>
      <GlassCard>
        <MaterialIcons name={iconName} size={80} color={resultColor} style={styles.icon} />
        <Text style={[styles.resultText, { color: resultColor }]}>
          {match ? 'Match' : 'No Match'}
        </Text>
        <View style={styles.similarityContainer}>
          <Text style={styles.similarityLabel}>Similarity Score</Text>
          <Text style={styles.similarityValue}>{(similarity * 100).toFixed(1)}%</Text>
        </View>
        <PrimaryButton title="Restart Verification" onPress={onReset} />
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  similarityContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  similarityLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  similarityValue: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});