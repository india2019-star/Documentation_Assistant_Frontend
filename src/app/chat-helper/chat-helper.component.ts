import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, finalize, Observable, of, Subscription, tap } from 'rxjs';
import { ChatBotService } from '../services/chat-bot.service';
import { FormControl, Validators } from '@angular/forms';
import { ChatMessage } from '../models/chat-message';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ChatRequest } from '../models/chat-request';
import { ChatResponse } from '../models/chat-response';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-chat-helper',
  templateUrl: './chat-helper.component.html',
  styleUrls: ['./chat-helper.component.css']
})
export class ChatHelperComponent implements OnInit, OnDestroy {

  @ViewChild('endOfChat', {static: true})
  endOfChat! : ElementRef;

  fileName = '';
  uploadProgress: number = 0;
  spinnerMode: ProgressSpinnerMode = 'indeterminate';
  loading: boolean = false
  answer: string = "";
  chatHistory: any = [];
  subscription$: Subscription[] = [];
  inputFormControl : FormControl = new FormControl('');
  
  allChatMessages : ChatMessage[] = [];
  chatMessageSubject = new BehaviorSubject<ChatMessage[]>(this.allChatMessages);
  allChatMessage$ = this.chatMessageSubject.asObservable();
  currenDate: Date = new Date();
  timeOutVar : any;


  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  fileInfos?: Observable<any>;

  constructor(private genericService: ChatBotService){}
  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
    if(this.timeOutVar){
      clearInterval(this.timeOutVar);
    }
  }

  ngOnInit(): void {

    this.subscription$.push(this.allChatMessage$
      .subscribe(resp => {
        this.scrollToBottom();
      }));
  }

  

  cancelUpload(){
    this.uploadProgress = 0;
  }

  findAnswer(){
    let promptVal: string = this.inputFormControl.value;
    console.log(promptVal);
    if(promptVal.length > 0){
      this.allChatMessages.push({message: promptVal, senderType: 'human'});
      this.chatMessageSubject.next(this.allChatMessages);
      this.inputFormControl.disable();
      this.loading = true;
      this.inputFormControl.setValue('');
      
      console.log(this.chatHistory)
      this.answer = "";
      let inputPrompt : ChatRequest = {
        "question": promptVal,
        "chat_history": this.chatHistory
      }

      
      this.subscription$.push(this.genericService.retrieveAnswer(inputPrompt).pipe(
        finalize(() => {
          this.loading = false;
          this.inputFormControl.enable();
        })
      ).subscribe((res: ChatResponse) => {
        if(res && res.answer.length > 0){
          this.answer = res.answer;
          if(["Hi there, How can I help you?", "Glad I could help, Bye Bye..."].indexOf(res.answer) === -1){
            this.chatHistory.push({"human": promptVal});
            this.chatHistory.push({"ai": res.answer});
          }
          
          this.allChatMessages.push({message: res.answer, senderType: 'ai', sourceDocuments: res.sourceDocuments});
          this.chatMessageSubject.next(this.allChatMessages);
        }
       
        console.log(res);
      },error => {
        console.log(error)
      }));
    }else{
      alert("Please give a valid prompt");
    }
  }

  scrollToBottom(){
    this.timeOutVar = setTimeout(() => {
      if(this.endOfChat){
        this.endOfChat.nativeElement.scrollIntoView({behaviour: 'smooth'});
      }
    },100);
  }

  ingestionEvent(event : boolean){
    if(event){
      this.inputFormControl.disable();
    }else{
      this.inputFormControl.enable();
    }
  }

}
