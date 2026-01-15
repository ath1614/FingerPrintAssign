import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    } finally {
      setLoading(false);
    }
  };

  const instruction = step === 1 
    ? 'Position your first fingerprint in the camera'
    : 'Position your second fingerprint in the camera';

  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.title}>Step {step} of 2</Text>
        <CameraBox ref={cameraRef} instruction={instruction} />
        <PrimaryButton 
          title={step === 1 ? 'Capture First' : 'Capture & Verify'} 
          onPress={handleCapture} 
        />
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
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    color: colors.textPrimary,
  },
});