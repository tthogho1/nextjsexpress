"use client"

import React ,{useState, useRef} from "react";
import PromptSearch  from "./promptsearch";
import UrlSearch from "./urlsearch";
import ImgSearch from "./imgsearch";
import type { Photo } from '../type/type';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [count, setCount ]= useState('');
  const [photos, setInputState] = useState<Photo[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // input only allows numbers
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      setCount(event.target.value);
    }
  }

  return ( 
    <main className="flex flex-col space-y-10 ml-10" >
      <div></div>
      <div className="font-bold">Number of data acquired : 
          <input className="text-right" type="text" style={{ width: "80px" }}
            value={count} onChange={handleInputChange}/></div>
      <PromptSearch inputState={setInputState} count={count}></PromptSearch>
      <ImgSearch inputState={setInputState} count={count}></ImgSearch>
      <UrlSearch inputState={setInputState} count={count}></UrlSearch>

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