import { Injectable } from '@angular/core';
import { SSE } from 'sse.js';

@Injectable({
  providedIn: 'root'
})
export class GenericStreamingService {

  constructor() { }

  private readonly streamUrl = 'http://localhost:8000/summarization';

  uploadFileAndStream(
    file: File,
    summary_type: string,
    onUploadProgress: (progress: number) => void, // Callback for upload progress
    onStreamData: (data: string) => void, // Callback for streaming response
    onStreamComplete: () => void,
    onError: (error: any) => void // Callback for handling errors
  ): void {
    const xhr = new XMLHttpRequest();

    // Open the POST request
    xhr.open('POST', this.streamUrl, true);

    // Set upload progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onUploadProgress(progress);
      }
    };


    let lastProcessedLength = 0; // Track the length of already processed text

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.LOADING) {
        const responseText = xhr.responseText;
        const newChunk = responseText.slice(lastProcessedLength); // Get only the unprocessed part
        lastProcessedLength = responseText.length; // Update the tracker

        if (newChunk.trim()) {
          const chunks = newChunk.split('\n\n');
          chunks.forEach((chunk) => {
            if (chunk.startsWith('data:')) {
              let cleanedData =  chunk.replace(/^data:\s*/, '').replace(/^"|"$/g, '');
              onStreamData(cleanedData);
            }
          });
        }
      }

      if(xhr.readyState === XMLHttpRequest.DONE){
        onStreamComplete();
      }
    };




    xhr.onerror = () => {
      onError('Error occurred during file upload or streaming.');
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('summary_type', summary_type);

    xhr.send(formData);
  }
}
