import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { finalize, Observable, of, Subscription } from 'rxjs';
import { ChatBotService } from '../services/chat-bot.service';
import { FormControl, Validators } from '@angular/forms';
import { ChatMessage } from '../models/chat-message';

@Component({
  selector: 'app-chat-helper',
  templateUrl: './chat-helper.component.html',
  styleUrls: ['./chat-helper.component.css']
})
export class ChatHelperComponent implements OnInit, OnDestroy {

  @ViewChild('endOfChat', {static: true})
  endOfChat! : ElementRef;

  disableBtn: boolean = false;
  loading: boolean = false;
  answer: string = "";
  chatHistory: any = [];
  subscription$: Subscription[] = [];
  inputFormControl : FormControl = new FormControl('');
  allChatMessage$ : Observable<ChatMessage[]> | undefined;
  allChatMessages : ChatMessage[] = [];
  currenDate: Date = new Date();

  constructor(private genericService: ChatBotService){}
  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {}

  findAnswer(){
    let promptVal: string = this.inputFormControl.value;
    console.log(promptVal);
    if(promptVal.length > 0){
      this.allChatMessages.push({message: promptVal, senderType: 'human'});
      this.allChatMessage$ = of(this.allChatMessages);
      this.subscription$.push(this.allChatMessage$.subscribe(resp => {
        this.scrollToBottom();
      } ));
      this.disableBtn = true;
      this.loading = true;
      this.inputFormControl.setValue('');
      
      console.log(this.chatHistory)
      this.answer = "";
      let inputPrompt = {
        "question": promptVal,
        "chatHistory": this.chatHistory
      }

      
      this.subscription$.push(this.genericService.retrieveAnswer(inputPrompt).pipe(
        finalize(() => {
          this.loading = false;
          this.disableBtn = false;
        })
      ).subscribe((res: string) => {
        if(res && res.length > 0){
          this.answer = res;
          this.chatHistory.push({"human": promptVal});
          this.chatHistory.push({"ai": res});
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
    setTimeout(() => {
      if(this.endOfChat){
        this.endOfChat.nativeElement.scrollIntoView({behaviour: 'smooth'});
      }
    },100);
  }

}
