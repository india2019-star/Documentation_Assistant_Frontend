import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatRequest } from '../models/chat-request';
import { ChatResponse } from '../models/chat-response';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {

  constructor(private httpClient: HttpClient) { }

  retrieveAnswer(inputPrompt: ChatRequest){
    return this.httpClient.post<ChatResponse>("http://localhost:8000/user-prompt", inputPrompt)
  }


  ingestDocuments(){
    return this.httpClient.get("http://localhost:8000/ingest-code")
  }

  uploadDocumentsFromUser(file : File, functionality_type: string){
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('func_type', functionality_type);

    return this.httpClient.post("http://localhost:8000/file-upload", formData,{
      reportProgress: true,
      observe: 'events'
    });
  }
}
