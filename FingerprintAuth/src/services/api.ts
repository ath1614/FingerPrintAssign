const API_BASE_URL = 'http://10.2.90.211:4000';

export const api = {
  async verifyFingerprints(image1Uri: string, image2Uri: string) {
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

    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();
    return { match: result.match, similarity: result.similarity };
  },
};