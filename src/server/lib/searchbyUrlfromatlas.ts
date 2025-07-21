import { Embedding } from './embedding';
import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import type { webCamMetadata, Photo } from './type';
import { vectorSearch } from './vectorSearch.js';

const searchByUrlfromatlas = async (
  query: { imageUrl: string; count: string },
  embedding: Embedding,
  image_server: string
) => {
  console.log('imageUrl: ' + query.imageUrl);
  console.log('count: ' + query.count);

  const imageVector = await embedding.getImageEmbedding(query.imageUrl);
  const result = await vectorSearch(imageVector, query.count);

  const photos = result.map(match => {
    try {
      //console.log('match: ', match);
      const photo: Photo = {
        id: match.webcam.webcamid,
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
      throw new Error(
        'Failed to map result to Photo: ' + (error instanceof Error ? error.message : String(error))
      );
    }
  });
  return photos;
};

export default searchByUrlfromatlas;
