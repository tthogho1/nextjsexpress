import { MongoClient } from 'mongodb';  
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_URI;  
if (!uri) {
    throw new Error('MONGODB_URI missing in .env');  
}
const client = new MongoClient(uri);  

const connectToDatabase = async () => {
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

export default connectToDatabase;