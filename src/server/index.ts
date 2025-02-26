import express, { Request, Response } from "express";
import { Embedding } from './lib/embedding.js';
import { Pinecone , QueryResponse, FetchResponse ,RecordMetadata } from '@pinecone-database/pinecone';
import multer from 'multer';
import next from "next";
import dotenv from 'dotenv';
import searchByText from "./lib/searchbytext.js";
import searchbytextfromatlas from "./lib/searchbytextfromatlas.js";
import searchByUrl from "./lib/searchbyUrl.js";
import searchByImage from "./lib/searchbyImage.js";

const upload = multer({
    storage: multer.memoryStorage()
});

const wrap = (fn: (...args: any[]) => Promise<any>) => (...args: any[]) => fn(...args).catch(args[2]);

dotenv.config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ??  '',
});
const index = pinecone.index(process.env.PINECONE_INDEX_NAME ?? '');
const image_server = process.env.WINDY_IMAGE_SERVER ?? '';

const dev = process.env.NODE_ENV === "development";
//const dev = false;
const port = 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
    try {
        await app.prepare();

        const server: express.Express = express();
        server.use((req,res,next) =>{
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            next()
        })
        server.use(express.json())
        server.use(express.urlencoded({ extended: true }))

        const embedding = new Embedding() 
        server.post('/api/searchWebcam', wrap(async (req:express.Request, res:express.Response, next) => {
            //const query = req.body.query as string;
            //const count = req.body.count as string;
            const query  ={
                query: req.body.query as string,
                count: req.body.count as string
            }

            searchByText(query, embedding, index, image_server).then(result => {
                res.send(result)
            })
        })) 

        server.post('/api/searchWebcamFromAtlas', wrap(async (req:express.Request, res:express.Response, next) => {
            //const query = req.body.query as string;
            //const count = req.body.count as string;
            const query  ={
                query: req.body.query as string,
                count: req.body.count as string
            }

            searchbytextfromatlas(query, embedding, image_server).then(result => {
                res.send(result)
            })
        })) 

        server.post('/api/searchWebcamByURL', wrap(async (req:express.Request, res:express.Response, next) => {
            const query = { imageUrl: req.body.imageUrl ,
                count: req.body.count };
            searchByUrl(query, embedding, index, image_server).then(result => {
                res.send(result)
            })
        }))
        
        server.post('/api/searchWebcamByImage', upload.single('file') , wrap(async (req:express.Request, res:express.Response, next) => {
            const image = req.file?.buffer as Buffer;
            const count = req.body.count as string;
            const blobImage = new Blob([image], { type: req.file?.mimetype });
            if (!image) {
                res.status(400).send('No image uploaded');
                return;
            }

            searchByImage(blobImage, count ,embedding, index, image_server).then(result => {
                res.send(result)
            })
        }))

        server.all("*", (req: Request, res: Response) => {
            return handle(req, res);
        });
        server.listen(port, () => {
            console.log(`${port} start`);
        });
    } catch (e) {
        console.error(e);
    }
})();
