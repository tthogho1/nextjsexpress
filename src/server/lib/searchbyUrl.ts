import { Embedding } from './embedding';
import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import type { webCamMetadata,Photo } from './type';

const searchByUrl = async (query : {imageUrl: string, count: string} ,embedding: Embedding, index:Index<RecordMetadata> , image_server: string) => {
    console.log("imageUrl: " + query.imageUrl);
    console.log("count: " + query.count);

    const y = await embedding.getImageEmbedding(query.imageUrl);
    const response = await index.namespace('webcamInfo').query({
        topK: parseInt(query.count) ,
        vector: y,
        includeValues: false,   
        includeMetadata: true
    });
    
    const { matches } = response ;
    const photos = matches.map(match => {
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
    })
    return photos;
}   

export default searchByUrl;