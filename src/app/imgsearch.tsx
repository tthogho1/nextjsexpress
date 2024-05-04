"use client"

import React, { Dispatch, SetStateAction, useRef, useEffect } from "react";
import type { Photo } from '../type/type';

const ImgSearch = (props: { inputState: Dispatch<SetStateAction<Photo[]>> }) => {
  const { inputState } = props;

  const dropZoneRef = useRef(null);
  const previewRef = useRef(null);
  const fileInput = useRef<HTMLInputElement>(null)


  useEffect(() => {
    console.log("start useEffect")
    dragAndDropFile(dropZoneRef.current , fileInput.current, previewRef.current);
  }, [dropZoneRef.current, fileInput.current, previewRef.current]);

  function dragAndDropFile(dropZone: HTMLElement | null, fileInput: HTMLInputElement|null, preview: HTMLElement|null) {
      if (!dropZone || !fileInput || !preview) {
        console.log("element not found");
        return
      }
      dropZone.addEventListener('dragover', function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.style.background = '#e1e7f0';
      }, false);

      dropZone.addEventListener('dragleave', function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.style.background = '#ffffff';
      }, false);

      fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          previewFile(this.files[0], preview);          
        }
      });

      dropZone.addEventListener('drop', function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.style.background = '#ffffff';
          const files = e.dataTransfer?.files;
          if (files && files.length > 1) {
            return alert('only one file for upload');
          }
          if (!files) {
            return alert('file not found');
          }
          fileInput.files = files;
          previewFile(files[0], preview);
      }, false);
  }

  function previewFile(file: File, preview: HTMLElement) {
      console.log("preview" + file);
      var fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = function () {
          var img = document.createElement('img');
          img.setAttribute('src', fr.result as string);
          preview.innerHTML = '';
          preview.appendChild(img);
      };
  }
  const searchImagesByUrl = async () => {
    try {
     // const form = document.getElementById('search-file') as HTMLFormElement;
      const form_data = new FormData();
      form_data.append('file', fileInput.current!.files![0]);
      const response = await fetch('./api/searchWebcamByImage', {
        method: 'POST',
        body: form_data,
      });
      const result = await response.json();
      inputState(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  return (
    <div className="flex flex-col space-y-10 ml-10" >
      <div className="text-3xl font-bold items-left">Search Image by file</div>
      <div className="h-10 leading-10" style={{ height: "300px" }}>
        <form className="grid grid-cols-6 gap-10" id="search-file" method="POST" encType="multipart/form-data">
          <div className="col-span-3" ref={dropZoneRef} id="drop-zone" style={{ textAlign: "center", height: "250px", border: "1px solid" }}>
            <p> drag and drop image file </p>
            <div className="left-column" ref={previewRef} id="preview"></div>
            <input type="file" name="file" id="file-input" ref={fileInput} style={{ display: "none" }} />
          </div>
          <button className="col-span-1" type="button" id="search-btn-image" onClick={() => searchImagesByUrl()}>
            search
          </button>
          <div className="col-span-2"> </div>
        </form>
      </div>
    </div>
  );
}

export default ImgSearch;