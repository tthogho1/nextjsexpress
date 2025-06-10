import { describe, it, expect, vi, beforeEach } from 'vitest';
import searchbytextfromatlas from '../searchbytextfromatlas';
import { vectorSearch } from '../vectorSearch';

const mockQuery = { query: 'test', count: '2' };
const mockImageServer = 'https://img.example.com/';

const mockEmbedding = {
  getTextEmbedding: vi.fn(),
};

vi.mock('../vectorSearch', () => ({
  vectorSearch: vi.fn(),
}));

describe('searchbytextfromatlas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return formatted photos from vectorSearch result', async () => {
    const mockVector = [1, 2, 3];
    const mockResult = [
      {
        id: 'photo1',
        score: 0.88,
        webcam: {
          title: 'Text Webcam',
          webcamid: 'w2',
          player: { day: 'https://player.example.com/w2' },
          location: {
            country: 'USA',
            latitude: 40.0,
            longitude: -74.0,
          },
        },
      },
    ];
    mockEmbedding.getTextEmbedding.mockResolvedValue(mockVector);
    (vectorSearch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    const photos = await searchbytextfromatlas(mockQuery, mockEmbedding as any, mockImageServer);

    expect(photos).toHaveLength(1);
    expect(photos[0]).toMatchObject({
      id: 'photo1',
      score: 0.88,
      description: 'Text Webcam',
      urls: { small: 'https://img.example.com/w2.jpg' },
      links: { html: 'https://player.example.com/w2' },
      location: {
        country: 'USA',
        latitude: 40.0,
        longitude: -74.0,
      },
    });
  });

  it('should throw error if mapping fails', async () => {
    const mockVector = [1, 2, 3];
    const mockResult = [
      {
        id: 'photo2',
        score: 0.5,
        webcam: null, // 故意にnullでエラーを発生させる
      },
    ];
    mockEmbedding.getTextEmbedding.mockResolvedValue(mockVector);
    (vectorSearch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    await expect(
      searchbytextfromatlas(mockQuery, mockEmbedding as any, mockImageServer)
    ).rejects.toThrow();
  });
});
