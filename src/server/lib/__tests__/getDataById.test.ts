import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDataById } from '../vectorSearch';
import { ObjectId } from 'mongodb';

// dbConnectをモック
vi.mock('../dbConnect', () => ({
  default: vi.fn(),
}));

const mockConnectToDatabase = require('../dbConnect').default;

describe('getDataById', () => {
  const mockCollection = {
    findOne: vi.fn(),
  };

  const mockDatabase = {
    collection: vi.fn().mockReturnValue(mockCollection),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConnectToDatabase.mockResolvedValue(mockDatabase);
  });

  it('should return document when ID exists', async () => {
    const testId = '507f1f77bcf86cd799439011';
    const mockDocument = {
      _id: new ObjectId(testId),
      webcam: {
        title: 'Test Webcam',
        webcamid: 'test123',
        location: {
          country: 'Japan',
          latitude: 35.0,
          longitude: 139.0,
        },
        player: {
          day: 'https://player.example.com/test123',
        },
      },
      embedding: [1, 2, 3],
    };

    mockCollection.findOne.mockResolvedValue(mockDocument);

    const result = await getDataById(testId);

    expect(mockDatabase.collection).toHaveBeenCalledWith('webcam');
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId(testId) });
    expect(result).toEqual(mockDocument);
  });

  it('should throw error when document not found', async () => {
    const testId = '507f1f77bcf86cd799439011';
    mockCollection.findOne.mockResolvedValue(null);

    await expect(getDataById(testId)).rejects.toThrow(`Document with ID ${testId} not found`);
  });

  it('should throw error when database operation fails', async () => {
    const testId = '507f1f77bcf86cd799439011';
    const dbError = new Error('Database connection failed');
    mockConnectToDatabase.mockRejectedValue(dbError);

    await expect(getDataById(testId)).rejects.toThrow('Database connection failed');
  });

  it('should throw error for invalid ObjectId format', async () => {
    const invalidId = 'invalid-id';

    await expect(getDataById(invalidId)).rejects.toThrow();
  });
});
