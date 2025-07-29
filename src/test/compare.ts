import { getDataById } from '../server/lib/vectorSearch';

// Pineconeから指定したIDのデータを取得するテスト関数
const testGetDataById = async () => {
  try {
    // テスト用のObjectId（実際のIDに置き換えてください）
    const testId = '507f1f77bcf86cd799439011'; // 例：有効なObjectId形式

    console.log(`Getting data for ID: ${testId}`);
    const result = await getDataById(testId);

    console.log('Retrieved data:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('Error in testGetDataById:', error);
    throw error;
  }
};

// 関数を実行
testGetDataById().catch(console.error);

export { testGetDataById };
