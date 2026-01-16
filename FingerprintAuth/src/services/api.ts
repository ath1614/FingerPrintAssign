const API_BASE_URL = 'http://192.168.137.91:4000';

export const api = {
  async verifyFingerprints(image1Uri: string, image2Uri: string) {
    console.log('Starting verification...', { image1Uri, image2Uri });
    
    const formData = new FormData();
    formData.append('fingerprint1', {
      uri: image1Uri,
      type: 'image/jpeg',
      name: 'fingerprint1.jpg',
    } as any);
    formData.append('fingerprint2', {
      uri: image2Uri,
      type: 'image/jpeg',
      name: 'fingerprint2.jpg',
    } as any);

    console.log('Sending request to:', `${API_BASE_URL}/verify`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Verification result:', result);
      
      return { match: result.match, similarity: result.similarity };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('API Error:', error);
      throw error;
    }
  },
};