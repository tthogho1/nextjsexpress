import {
  getDataById,
  getDataByIdFromPinecone,
  getPineconeStats,
  searchSampleFromPinecone,
} from '../server/lib/vectorSearch.js';

// MongoDB版：指定したIDのデータを取得するテスト関数
const testGetDataById = async (specificId?: string) => {
  try {
    // 引数で指定されたIDまたはデフォルトのテスト用webcamid
    const testId = specificId || '1234952298'; // 例：有効なwebcamid形式

    console.log(`🔍 Getting data from MongoDB for webcamid: ${testId}`);
    const result = await getDataById(testId);

    console.log('✅ MongoDB Retrieved data:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('❌ Error in testGetDataById (MongoDB):', error);
    throw error;
  }
};

// Pineconeのインデックス情報を確認する関数
const testPineconeStats = async () => {
  try {
    console.log('📊 Getting Pinecone index stats...');
    const stats = await getPineconeStats();
    console.log('✅ Pinecone Stats:', JSON.stringify(stats, null, 2));
    return stats;
  } catch (error) {
    console.error('❌ Error getting Pinecone stats:', error);
    throw error;
  }
};

// Pineconeから実際に存在するIDを取得してテストする関数
const testGetDataByIdFromPineconeWithRealId = async (specificId?: string) => {
  try {
    if (specificId) {
      // 特定のIDが指定された場合、そのIDで直接テスト
      console.log(`🔍 Getting vector data from Pinecone for specific ID: ${specificId}`);
      const result = await getDataByIdFromPinecone(specificId);

      console.log('✅ Pinecone Retrieved vector data:', JSON.stringify(result, null, 2));

      // Vectorの詳細情報も表示
      if (result.values) {
        console.log(`� Vector dimensions: ${result.values.length}`);
        console.log(`📋 First 5 vector values: [${result.values.slice(0, 5).join(', ')}...]`);
      }

      return result;
    }

    // IDが指定されていない場合、サンプルから取得
    console.log('�🔍 Getting sample IDs from Pinecone...');
    const samples = await searchSampleFromPinecone(3);

    if (samples.length === 0) {
      console.log('⚠️ No data found in Pinecone index');
      return;
    }

    console.log(`📝 Found ${samples.length} sample records`);
    samples.forEach((sample, index) => {
      console.log(`  ${index + 1}. ID: ${sample.id}, Score: ${sample.score}`);
    });

    // 最初のサンプルIDを使ってテスト
    const testId = samples[0].id;
    console.log(`🔍 Getting data from Pinecone for ID: ${testId}`);
    const result = await getDataByIdFromPinecone(testId);

    console.log('✅ Pinecone Retrieved data:', JSON.stringify(result, null, 2));

    // Vectorの詳細情報も表示
    if (result.values) {
      console.log(`📊 Vector dimensions: ${result.values.length}`);
      console.log(`📋 First 5 vector values: [${result.values.slice(0, 5).join(', ')}...]`);
    }

    return result;
  } catch (error) {
    console.error('❌ Error in testGetDataByIdFromPineconeWithRealId:', error);
    throw error;
  }
};

// 固定IDでのPineconeテスト（元の関数）
const testGetDataByIdFromPinecone = async () => {
  try {
    // テスト用のPinecone ID（実際のIDに置き換えてください）
    const testId = '1234952298'; // 例：有効なPinecone ID形式

    console.log(`🔍 Getting data from Pinecone for ID: ${testId}`);
    const result = await getDataByIdFromPinecone(testId);

    console.log('✅ Pinecone Retrieved data:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('❌ Error in testGetDataByIdFromPinecone:', error);
    throw error;
  }
};

// 両方の関数を実行
const runTests = async () => {
  console.log('🚀 Starting tests...');

  const specificTestId = '1180633999';

  // MongoDBのテスト
  var mognodbResult;
  /*try {
    console.log('\n--- Testing MongoDB ---');
    mognodbResult = await testGetDataById();
  } catch (error) {
    console.error('MongoDB test failed:', error);
  }*/

  // 特定のIDでMongoDBテスト
  try {
    console.log('\n--- Testing MongoDB with Specific ID ---');
    mognodbResult = await testGetDataById(specificTestId);
  } catch (error) {
    console.error('MongoDB specific ID test failed:', error);
  }

  if (mognodbResult) {
    console.log('MongoDB Result:', mognodbResult.embedding);
  } else {
    console.log('MongoDB Result: undefined');
  }

  var pineconeResult;
  try {
    console.log('\n--- Testing Pinecone Stats ---');
    pineconeResult = await testPineconeStats();
  } catch (error) {
    console.error('Pinecone stats test failed:', error);
  }

  console.log('Pinecone Result:', pineconeResult);

  /*
  try {
    console.log('\n--- Testing Pinecone with Real ID ---');
    await testGetDataByIdFromPineconeWithRealId(specificId);
  } catch (error) {
    console.error('Pinecone real ID test failed:', error);
  }*/

  // 特定のIDでテスト（例）
  var pineconeResult;
  try {
    console.log('\n--- Testing Pinecone with Specific ID ---');
    // 実際に存在するIDに変更してください
    pineconeResult = await testGetDataByIdFromPineconeWithRealId(specificTestId);
  } catch (error) {
    console.error('Pinecone specific ID test failed:', error);
  }

  if (pineconeResult) {
    if ('values' in pineconeResult) {
      console.log('Pinecone Result:', pineconeResult.values);
    } else {
      console.log('Pinecone Result: No values property (likely index stats)');
    }
  } else {
    console.log('Pinecone Result: undefined');
  }
};

// 関数を実行
runTests().catch(console.error);

export { testGetDataById, testGetDataByIdFromPinecone, testGetDataByIdFromPineconeWithRealId };
