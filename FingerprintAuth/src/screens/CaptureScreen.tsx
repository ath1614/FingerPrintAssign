import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { CameraBox } from '../components/CameraBox';
import { PrimaryButton } from '../components/PrimaryButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { api } from '../services/api';
import { colors } from '../theme/colors';

interface CaptureScreenProps {
  onResult: (result: { match: boolean; similarity: number }) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onResult }) => {
  const [step, setStep] = useState(1);
  const [fingerprint1, setFingerprint1] = useState<string>('');
  const [fingerprint2, setFingerprint2] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    const uri = await cameraRef.current.capture();
    if (!uri) return;

    if (step === 1) {
      setFingerprint1(uri);
      setStep(2);
    } else {
      setFingerprint2(uri);
      await uploadAndVerify(fingerprint1, uri);
    }
  };

  const uploadAndVerify = async (uri1: string, uri2: string) => {
    setLoading(true);
    try {
      const result = await api.verifyFingerprints(uri1, uri2);
      onResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed. Please check your network connection and ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const instruction = step === 1 
    ? 'Position your first fingerprint in the frame'
    : 'Position your second fingerprint in the frame';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
        </View>
        <Text style={styles.stepText}>Step {step} of 2</Text>
      </View>
      
      <GlassCard>
        <CameraBox ref={cameraRef} instruction={instruction} />
        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title={step === 1 ? 'Capture First Fingerprint' : 'Capture & Verify'} 
            onPress={handleCapture} 
          />
        </View>
        {step === 2 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
            <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Retake First</Text>
          </TouchableOpacity>
        )}
      </GlassCard>
      <LoadingOverlay visible={loading} />
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.textSecondary,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 8,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginTop: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 8,
  },
  backText: {
    marginLeft: 4,
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
  },
});