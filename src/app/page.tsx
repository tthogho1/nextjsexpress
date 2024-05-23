"use client"

import React ,{useState, useRef} from "react";
import PromptSearch  from "./promptsearch";
import UrlSearch from "./urlsearch";
import ImgSearch from "./imgsearch";
import type { Photo } from '../type/type';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [photos, setInputState] = useState<Photo[]>([]);

  return ( 
    <main className="flex flex-col space-y-10 ml-10" >
      <div></div>
      <div></div>
      <PromptSearch inputState={setInputState}></PromptSearch>
      <ImgSearch inputState={setInputState}></ImgSearch>
      <UrlSearch inputState={setInputState}></UrlSearch>

      <div className="grid grid-cols-4 gap-2">
        {photos.map((item, index) => (
          <div key={index}>
            <div>
              <span>ID: {item.id}</span>  <span> Score: {item.score}</span>
            </div>

            <Link href={item.links.html}   target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}> 
              <div>{item.description}</div>
            </Link>
            <Image src={item.urls.small} alt={item.description} width={200} height={112} />
          </div>
        ))}
      </div>
    </main>
  );
}