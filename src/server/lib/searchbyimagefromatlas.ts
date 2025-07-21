import { Embedding } from './embedding';
import type { webCamMetadata, Photo } from './type';
import { vectorSearch } from './vectorSearch.js';

const searchbyimagefromatals = async (
  blobImage: Blob,
  count: string,
  embedding: Embedding,
  image_server: string
) => {
  const blobVector = await embedding.getBlobImgEmbedding(blobImage);
  const result = await vectorSearch(blobVector, count);
  const photos = result.map(match => {
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

  return photos;
};

export default searchbyimagefromatals;
