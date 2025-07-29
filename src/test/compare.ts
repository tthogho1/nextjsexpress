import { getDataById } from '../server/lib/vectorSearch';

// 指定したwebcamidのデータを取得するテスト関数
const testGetDataById = async () => {
  try {
    // テスト用のwebcamid（実際のwebcamidに置き換えてください）
    const testId = '1234567890'; // 例：有効なwebcamid形式

    console.log(`Getting data for webcamid: ${testId}`);
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
