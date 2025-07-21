import { describe, it, expect, vi, beforeEach } from 'vitest';
import searchbyUrlfromatlas from '../searchbyUrlfromatlas';
import { vectorSearch } from '../vectorSearch';

const mockQuery = { imageUrl: 'https://example.com', count: '2' };
const mockImageServer = 'https://img.example.com/';

const mockEmbedding = {
  getImageEmbedding: vi.fn(),
};

vi.mock('../vectorSearch', () => ({
  vectorSearch: vi.fn(),
}));

describe('searchbyUrlfromatlas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return formatted photos from vectorSearch result', async () => {
    const mockVector = [1, 2, 3];
    const mockResult = [
      {
        id: 'photo1',
        score: 0.77,
        metadata: {
          title: 'URL Webcam',
          webcamid: 'w3',
          player: { day: 'https://player.example.com/w3' },
          country: 'France',
          latitude: 48.8,
          longitude: 2.3,
          day: 'https://player.example.com/w3',
        },
      },
    ];
    mockEmbedding.getImageEmbedding.mockResolvedValue(mockVector);
    (vectorSearch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    const photos = await searchbyUrlfromatlas(mockQuery, mockEmbedding as any, mockImageServer);

    expect(photos).toHaveLength(1);
    expect(photos[0]).toMatchObject({
      id: 'photo1',
      score: 0.77,
      description: 'URL Webcam',
      urls: { small: 'https://img.example.com/photo1.jpg' },
      links: { html: 'https://player.example.com/w3' },
      location: {
        country: 'France',
        latitude: 48.8,
        longitude: 2.3,
      },
    });
  });

  it('should throw error if mapping fails', async () => {
    const mockVector = [1, 2, 3];
    const mockResult = [
      {
        id: 'photo2',
        score: 0.5,
        metadata: null,
      },
    ];
    mockEmbedding.getImageEmbedding.mockResolvedValue(mockVector);
    (vectorSearch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    await expect(
      searchbyUrlfromatlas(mockQuery, mockEmbedding as any, mockImageServer)
    ).rejects.toThrow();
  });
});
