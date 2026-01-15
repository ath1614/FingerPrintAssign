import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface CameraBoxRef {
  capture: () => Promise<string | null>;
}

interface CameraBoxProps {
  instruction: string;
}

export const CameraBox = forwardRef<CameraBoxRef, CameraBoxProps>(({ instruction }, ref) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [enableTorch, setEnableTorch] = useState(false);
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
    return (
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <MaterialIcons name="camera" size={48} color={colors.textSecondary} />
          <Text style={styles.loadingText}>Initializing camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionBox}>
          <MaterialIcons name="camera-alt" size={64} color={colors.primary} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>We need camera access to capture fingerprints</Text>
          <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
            <Text style={styles.grantButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef} 
          style={styles.camera} 
          facing="back"
          enableTorch={enableTorch}
        />
        <View style={styles.overlayContainer}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>
        <TouchableOpacity 
          style={[styles.flashButton, enableTorch && styles.flashButtonActive]} 
          onPress={() => setEnableTorch(!enableTorch)}
        >
          <MaterialIcons 
            name={enableTorch ? 'flash-on' : 'flash-off'} 
            size={24} 
            color={colors.surface} 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.instruction}>{instruction}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  cameraContainer: {
    position: 'relative',
  },
  camera: {
    width: 280,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  flashButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  flashButtonActive: {
    backgroundColor: 'rgba(26, 115, 232, 0.8)',
  },
  instruction: {
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  loadingBox: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  permissionBox: {
    width: 280,
    padding: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  grantButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  grantButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '600',
  },
});