import connectToDatabase from './dbConnect.js';
import type { Photo } from './type';

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

const vectorSearch = async (queryVector: number[], countS: string) =>{
    try {
      const database = await connectToDatabase();
      const collection = database.collection('webcam');
      
      const count = parseInt(countS);

      // アグリゲーションパイプラインの実行
      const pipeline = [
        {
          $vectorSearch: {
            index: "imgembindex",
            path: "embedding",
            queryVector: queryVector,
            numCandidates: 100,
            limit: count
          }
        },
        {
          $project: {
            score: { $meta: "vectorSearchScore" },
            "webcam.webcamid": 1,
            "webcam.title": 1,
            "webcam.location.country": 1,
            "webcam.location.latitude": 1,
            "webcam.location.longitude": 1,
            "webcam.player.day": 1
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

const convertToPhoto = (result: Document[] , image_server: string) =>{

  (result as unknown as Match[]).map( match  => {

    try{
      const photo : Photo = {
          id: match.id,
          score: match.score,
          created_at: "",
          width: 200,
          height: 112,
          description: match.webcam.title,
          urls: {
              small: image_server + match.webcam.webcamid + ".jpg",
          },
          links: {
              html: match.webcam.player.day,
          },
          location:{
              country:match.webcam.location.country,
              latitude:match.webcam.location.latitude,
              longitude:match.webcam.location.longitude
          }
      }
      return photo;
    }catch(error){
      console.error('Error:', error);
      throw error;
    }
  })
}

export  {vectorSearch , convertToPhoto};