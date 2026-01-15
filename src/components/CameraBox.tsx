import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors } from '../theme/colors';

interface CameraBoxRef {
  capture: () => Promise<string | null>;
}

interface CameraBoxProps {
  instruction: string;
}

export const CameraBox = forwardRef<CameraBoxRef, CameraBoxProps>(({ instruction }, ref) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useImperativeHandle(ref, () => ({
    capture: async () => {
      if (!cameraRef.current) return null;
      try {
        const photo = await cameraRef.current.takePictureAsync();
        return photo?.uri || null;
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image');
        return null;
      }
    },
  }));

  if (!permission) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <Text style={styles.instruction} onPress={requestPermission}>Tap to grant</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={CameraType.back} />
      <Text style={styles.instruction}>{instruction}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  camera: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  instruction: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  permissionText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
});