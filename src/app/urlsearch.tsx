"use client"

import React, { Dispatch, SetStateAction, useRef } from "react";
import type { Photo } from '../type/type';

const UrlSearch = (props: { inputState: Dispatch<SetStateAction<Photo[]>>, count: string }) => {
  const { inputState ,count } = props;

  const searchImagesByUrl= async () => {
    try {
      const data = { imageUrl: urlstring.current?.value ,count: count };
      const response = await fetch('./api/searchWebcamByURL', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });
      const result = await response.json();
      inputState(result);      
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  }

  const urlstring = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col space-y-10 ml-10" >
      <div className="text-3xl font-bold items-left">Search Image by url</div>
      <div className="h-10 leading-10">
        <form className="grid grid-cols-7 gap-10" id="search-url">
          <p className="col-span-1"> image url</p>
          <input className="col-span-3 float-left" id="prompt-url" type="text" ref={urlstring} style={{ width: "500px" }} />
          <button className="col-span-1" type="button" id="search-btn-url" onClick={() => searchImagesByUrl()}>
            search
          </button>
          <div className="col-span-2"> </div>
        </form>
      </div>
    </div>
  );
}

export default UrlSearch;