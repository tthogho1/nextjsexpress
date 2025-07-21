import { describe, it, expect, vi, beforeEach } from 'vitest';
import searchbyimagefromatals from '../searchbyimagefromatlas';
import { vectorSearch } from '../vectorSearch';

// モック用のダミーデータ
const mockBlob = {} as Blob;
const mockCount = '3';
const mockImageServer = 'https://img.example.com/';

const mockEmbedding = {
  getBlobImgEmbedding: vi.fn(),
};

vi.mock('../vectorSearch', () => ({
  vectorSearch: vi.fn(),
}));

//const { vectorSearch } = require('../vectorSearch.ts');

describe('searchbyimagefromatals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return formatted photos from vectorSearch result', async () => {
    const mockVector = [1, 2, 3];
    const mockResult = [
      {
        id: 'photo1',
        score: 0.99,
        webcam: {
          title: 'Test Webcam',
          webcamid: 'w1',
          player: { day: 'https://player.example.com/w1' },
          location: {
            country: 'Japan',
            latitude: 35.0,
            longitude: 139.0,
          },
        },
      },
    ];
    mockEmbedding.getBlobImgEmbedding.mockResolvedValue(mockVector);
    vi.mocked(vectorSearch).mockResolvedValue(mockResult);

    const photos = await searchbyimagefromatals(
      mockBlob,
      mockCount,
      mockEmbedding as any,
      mockImageServer
    );

    expect(photos).toHaveLength(1);
    expect(photos[0]).toMatchObject({
      id: 'photo1',
      score: 0.99,
      description: 'Test Webcam',
      urls: { small: 'https://img.example.com/w1.jpg' },
      links: { html: 'https://player.example.com/w1' },
      location: {
        country: 'Japan',
        latitude: 35.0,
        longitude: 139.0,
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
    mockEmbedding.getBlobImgEmbedding.mockResolvedValue(mockVector);
    vi.mocked(vectorSearch).mockResolvedValue(mockResult);

    await expect(
      searchbyimagefromatals(mockBlob, mockCount, mockEmbedding as any, mockImageServer)
    ).rejects.toThrow();
  });
});
