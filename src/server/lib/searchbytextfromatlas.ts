import { MongoClient, UpdateResult } from 'mongodb';  
import { Embedding } from './embedding';
import type { webCamMetadata, Photo } from './type';


const uri = process.env.MONGODB_URI;  
if (!uri) {
    throw new Error('MONGODB_URI missing in .env');  
}
const client = new MongoClient(uri);  

async function connectToDatabase() {  
    try {  
      await client.connect();  
      await client.db('admin').command({ ping: 1 }); 
  
      return client.db('webcamNew');  
    } catch (error) {  
  
      console.error('Connection error:', error);  
      await client.close();  
      throw error;  
    }  
}  

async function vectorSearch(queryVector: number[]) {
    try {
      await client.connect();
      
      const database = client.db('webcamNew');
      const collection = database.collection('webcam');
  
      // アグリゲーションパイプラインの実行
      const pipeline = [
        {
          $vectorSearch: {
            index: "imgembindex",
            path: "embedding",
            queryVector: queryVector,
            numCandidates: 100,
            limit: 10
          }
        },
        {
          $project: {
            score: { $meta: "vectorSearchScore" },
            "webcam.webcamid": 1
          }
        }
      ] ;
    
      const result = await collection.aggregate(pipeline).toArray();
      return result;
    }catch(error){
        console.error('Error:', error);
        throw error;
    }

  }


const searchbytextfromatlas = async (query: {query:string,count:string}, 
    embedding: Embedding , image_server: string): Promise<Photo[]> => {

    const queryVector = await embedding.getTextEmbedding(query.query);
    const result = await vectorSearch(queryVector);

/*    const { matches } = result;
    const photos = matches.map( match  => {
        const metadata = match.metadata as webCamMetadata;
        const photo : Photo = {
            id: match.id,
            score: match.score,
            created_at: "",
            width: 200,
            height: 112,
            description: metadata.title,
            urls: {
                small: image_server + match.id + ".jpg",
            },
            links: {
                html: metadata.day,
            },
            location:{
                country:metadata.country,
                latitude:metadata.latitude,
                longitude:metadata.longitude
            }
        }
        return photo;
    })*/
    return {} as Photo[];
}

export default searchbytextfromatlas;