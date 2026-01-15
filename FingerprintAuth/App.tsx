import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LandingScreen } from './src/screens/LandingScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { ResultScreen } from './src/screens/ResultScreen';

type Screen = 'landing' | 'capture' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [result, setResult] = useState<{ match: boolean; similarity: number } | null>(null);

  const handleStartCapture = () => {
    setScreen('capture');
  };

  const handleResult = (verificationResult: { match: boolean; similarity: number }) => {
    setResult(verificationResult);
    setScreen('result');
  };

  const handleReset = () => {
    setResult(null);
    setScreen('landing');
  };

  return (
    <>
      {screen === 'landing' && <LandingScreen onStartCapture={handleStartCapture} />}
      {screen === 'capture' && <CaptureScreen onResult={handleResult} />}
      {screen === 'result' && result && (
        <ResultScreen match={result.match} similarity={result.similarity} onReset={handleReset} />
      )}
      <StatusBar style="auto" />
    </>
  );
}
