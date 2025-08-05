import connectToDatabase from './dbConnect.js';
import type { Photo } from './type';
import { Pinecone } from '@pinecone-database/pinecone';

interface Match {
  id: string;
  webcam: {
    id: string;
    title: string;
    webcamid: string;
    location: {
      country: string;
      latitude: number;
      longitude: number;
    };
    player: {
      day: string;
    };
  };
  score: number;
}

const client = connectToDatabase();

const vectorSearch = async (queryVector: number[], countS: string) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('webcam');

    const count = parseInt(countS);

    // アグリゲーションパイプラインの実行
    const pipeline = [
      {
        $vectorSearch: {
          index: 'imgembindex',
          path: 'embedding',
          queryVector: queryVector,
          numCandidates: 100,
          limit: count,
        },
      },
      {
        $project: {
          score: { $meta: 'vectorSearchScore' },
          'webcam.webcamid': 1,
          'webcam.title': 1,
          'webcam.location.country': 1,
          'webcam.location.latitude': 1,
          'webcam.location.longitude': 1,
          'webcam.player.day': 1,
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const convertToPhoto = (result: Document[], image_server: string) => {
  (result as unknown as Match[]).map(match => {
    try {
      const photo: Photo = {
        id: match.id,
        score: match.score,
        created_at: '',
        width: 200,
        height: 112,
        description: match.webcam.title,
        urls: {
          small: image_server + match.webcam.webcamid + '.jpg',
        },
        links: {
          html: match.webcam.player.day,
        },
        location: {
          country: match.webcam.location.country,
          latitude: match.webcam.location.latitude,
          longitude: match.webcam.location.longitude,
        },
      };
      return photo;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });
};

const getDataById = async (id: string) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('webcam');

    const idInt = parseInt(id, 10);
    // 指定されたwebcamidでドキュメントを検索
    const result = await collection.findOne({ 'webcam.webcamid': idInt });

    if (!result) {
      throw new Error(`Document with webcamid ${id} not found`);
    }

    return result;
  } catch (error) {
    console.error('Error getting data by webcamid:', error);
    throw error;
  }
};

// PineconeからIDでデータを取得する関数
const getDataByIdFromPinecone = async (id: string) => {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pc.index(process.env.PINECONE_INDEX_NAME!);

    // PineconeからIDでベクターデータを取得（webcamInfoネームスペース）
    const fetchResult = await index.namespace('webcamInfo').fetch([id]);

    if (!fetchResult.records || !fetchResult.records[id]) {
      throw new Error(`Data with ID ${id} not found in Pinecone namespace 'webcamInfo'`);
    }

    const record = fetchResult.records[id];

    return {
      id: record.id,
      values: record.values,
      metadata: record.metadata,
    };
  } catch (error) {
    console.error('Error fetching data from Pinecone:', error);
    throw new Error(
      `Failed to fetch data from Pinecone: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// Pineconeのインデックス統計を取得する関数
const getPineconeStats = async () => {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pc.index(process.env.PINECONE_INDEX_NAME!);

    // インデックスの統計情報を取得（webcamInfoネームスペース）
    const stats = await index.namespace('webcamInfo').describeIndexStats();

    return stats;
  } catch (error) {
    console.error('Error getting Pinecone stats:', error);
    throw error;
  }
};

// Pineconeからサンプルデータを検索する関数（テスト用）
const searchSampleFromPinecone = async (limit: number = 5) => {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pc.index(process.env.PINECONE_INDEX_NAME!);

    // ダミーのベクターでクエリして存在するIDを取得（webcamInfoネームスペース）
    const dummyVector = new Array(512).fill(0); // 512次元のダミーベクター

    const queryResult = await index.namespace('webcamInfo').query({
      vector: dummyVector,
      topK: limit,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.error('Error searching sample from Pinecone:', error);
    throw error;
  }
};

export {
  vectorSearch,
  convertToPhoto,
  getDataById,
  getDataByIdFromPinecone,
  getPineconeStats,
  searchSampleFromPinecone,
};
