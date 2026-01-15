import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

interface ResultScreenProps {
  match: boolean;
  similarity: number;
  onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ match, similarity, onReset }) => {
  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.title}>Verification Result</Text>
        <View style={[styles.resultBox, { backgroundColor: match ? colors.success : colors.error }]}>
          <Text style={styles.resultText}>{match ? 'MATCH' : 'NO MATCH'}</Text>
        </View>
        <Text style={styles.similarity}>
          Similarity: {(similarity * 100).toFixed(1)}%
        </Text>
        <PrimaryButton title="Try Again" onPress={onReset} />
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text,
  },
  resultBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
  },
  similarity: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text,
  },
});