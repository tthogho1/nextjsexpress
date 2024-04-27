"use client"

import React, { Dispatch, SetStateAction, useRef } from "react";
import type { Photo } from '../type/type';

const PromptSearch = (props: { inputState: Dispatch<SetStateAction<Photo[]>> }) => {
  const { inputState } = props;

  const searchImagesByText = async () => {
    const query = prompt.current?.value;
    console.log(`query : ${query}`);

    const url = "./api/searchWebcam";
    const body = {
      query: query,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        inputState(data);
      }).catch((error) => {
        console.error("Error:", error);
      });
  }

  const prompt = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col space-y-10 ml-10" >
      <div className="text-3xl font-bold items-left" >Search Image by Text</div>
      <div className="h-10 leading-10">
        <form className="grid grid-cols-6 gap-10" id="search-text">
          <p className="col-span-1" >enter word for search </p>
          <input className="col-span-1" id="prompt" type="text" ref={prompt} />
          <button className="col-span-1" type="button" id="search-btn-text" onClick={() => searchImagesByText()}>
            search
          </button>
          <div className="col-span-2"> </div>
        </form>
      </div>
    </div>
  );
}

export default PromptSearch;