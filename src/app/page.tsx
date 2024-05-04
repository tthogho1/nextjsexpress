"use client"

import React ,{useState, useRef} from "react";
import PromptSearch  from "./promptsearch";
import UrlSearch from "./urlsearch";
import ImgSearch from "./imgsearch";
import type { Photo } from '../type/type';

import Image from 'next/image'

export default function Home() {
  const [photos, setInputState] = useState<Photo[]>([]);

  return ( 
    <main className="flex flex-col space-y-10 ml-10" >
      <PromptSearch inputState={setInputState}></PromptSearch>
      <ImgSearch inputState={setInputState}></ImgSearch>
      <UrlSearch inputState={setInputState}></UrlSearch>

      <div>
        {photos.map((item, index) => (
          <div key={index}>
            <div>{item.id}</div>
            <div>{item.description}</div>
            <Image src={item.urls.small} alt={item.description} width={200} height={112} />
          </div>
        ))}
      </div>
    </main>
  );
}