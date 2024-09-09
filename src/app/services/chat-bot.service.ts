import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {

  constructor(private httpClient: HttpClient) { }

  retrieveAnswer(inputPrompt: any){
    return this.httpClient.post<string>("http://localhost:5000/user-prompt", inputPrompt)
  }


  ingestDocuments(){
    return this.httpClient.get("http://localhost:5000/ingest-code")
  }
}
