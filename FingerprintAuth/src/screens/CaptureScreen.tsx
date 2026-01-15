import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GlassCard } from '../components/GlassCard';
import { CameraBox } from '../components/CameraBox';
import { PrimaryButton } from '../components/PrimaryButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { SuccessPopup } from '../components/SuccessPopup';
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
  const [progress, setProgress] = useState(0);
  const [showCamera, setShowCamera] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successIcon, setSuccessIcon] = useState<'check-circle' | 'photo-library'>('check-circle');
  const cameraRef = useRef<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (step === 1) {
        setSuccessMessage('First fingerprint selected!');
        setSuccessIcon('photo-library');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFingerprint1(uri);
          setStep(2);
        }, 1500);
      } else {
        setSuccessMessage('Second fingerprint selected!');
        setSuccessIcon('photo-library');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFingerprint2(uri);
          uploadAndVerify(fingerprint1, uri);
        }, 1500);
      }
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    const uri = await cameraRef.current.capture();
    if (!uri) return;

    if (step === 1) {
      setSuccessMessage('First fingerprint captured!');
      setSuccessIcon('check-circle');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFingerprint1(uri);
        setStep(2);
      }, 1500);
    } else {
      setSuccessMessage('Second fingerprint captured!');
      setSuccessIcon('check-circle');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFingerprint2(uri);
        uploadAndVerify(fingerprint1, uri);
      }, 1500);
    }
  };

  const uploadAndVerify = async (uri1: string, uri2: string) => {
    setLoading(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await api.verifyFingerprints(uri1, uri2);
      setProgress(100);
      setTimeout(() => {
        clearInterval(progressInterval);
        onResult(result);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Verification failed:', error);
      Alert.alert(
        'Verification Failed',
        'Please check your network connection and ensure the backend server is running.',
        [{ text: 'OK' }]
      );
      setLoading(false);
      setProgress(0);
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
        {showCamera ? (
          <CameraBox ref={cameraRef} instruction={instruction} />
        ) : (
          <View style={styles.galleryPlaceholder}>
            <MaterialIcons name="photo-library" size={64} color={colors.textSecondary} />
            <Text style={styles.galleryText}>Select from gallery</Text>
          </View>
        )}
        
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, showCamera && styles.toggleButtonActive]}
            onPress={() => setShowCamera(true)}
          >
            <MaterialIcons name="camera-alt" size={20} color={showCamera ? colors.surface : colors.textSecondary} />
            <Text style={[styles.toggleText, showCamera && styles.toggleTextActive]}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, !showCamera && styles.toggleButtonActive]}
            onPress={() => setShowCamera(false)}
          >
            <MaterialIcons name="photo-library" size={20} color={!showCamera ? colors.surface : colors.textSecondary} />
            <Text style={[styles.toggleText, !showCamera && styles.toggleTextActive]}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {showCamera ? (
            <PrimaryButton 
              title={step === 1 ? 'Capture First Fingerprint' : 'Capture & Verify'} 
              onPress={handleCapture} 
            />
          ) : (
            <PrimaryButton 
              title={step === 1 ? 'Select First Fingerprint' : 'Select & Verify'} 
              onPress={pickImage} 
            />
          )}
        </View>
        
        {step === 2 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
            <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Retake First</Text>
          </TouchableOpacity>
        )}
      </GlassCard>
      <SuccessPopup visible={showSuccess} message={successMessage} icon={successIcon} />
      <LoadingOverlay visible={loading} progress={progress} />
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
  galleryPlaceholder: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  galleryText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textSecondary,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 4,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.surface,
  },
  buttonContainer: {
    marginTop: 20,
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