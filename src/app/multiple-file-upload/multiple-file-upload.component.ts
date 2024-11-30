import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChatBotService } from '../services/chat-bot.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-multiple-file-upload',
  templateUrl: './multiple-file-upload.component.html',
  styleUrls: ['./multiple-file-upload.component.css']
})
export class MultipleFileUploadComponent implements OnInit, OnDestroy {

  @Input()
  multipleUploadFlag: boolean = true;

  @Output()
  ingestionInProgessEventEmitter : EventEmitter<boolean> = new EventEmitter<boolean>();



  selectedFiles?: FileList;
  selectFilesInArrayFormat : File[] = [];
  progressInfos: { value: number, fileName: string, processingFlag: boolean }[] = [];
  message: string[] = [];
  uploadedFileCnt = 0;
  disableUploadBtn: boolean = false;
  fileInfos?: Observable<any>;
  subscription$ : Subscription[] = [];
  constructor(private genericService: ChatBotService) { }
  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
  }


  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.selectFilesInArrayFormat = Array.from(event.target.files);
  }

  uploadFiles(): void {
    this.message = [];
    this.uploadedFileCnt = 0;
    this.disableUploadBtn = true;
    this.ingestionInProgessEventEmitter.emit(true);
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(id: number, file: File){
    this.progressInfos[id] = { value: 0, fileName: file.name, processingFlag: false };

    if(file){
      this.subscription$.push(
        this.genericService.uploadDocumentsFromUser(file)
        .subscribe(res =>{
          console.log(res);
          if(res.type === HttpEventType.UploadProgress){
            this.progressInfos[id].value  = Math.round(100 * (res.loaded / (res.total ? res.total : 100)));
            if(this.progressInfos[id].value === 100){
              this.progressInfos[id].processingFlag = true;
            }
          }else if(res instanceof HttpResponse){
            this.progressInfos[id].processingFlag = false;
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);

            if(++this.uploadedFileCnt === this.selectFilesInArrayFormat.length){
              this.selectedFiles = undefined;
              this.disableUploadBtn = false;
              this.ingestionInProgessEventEmitter.emit(false);
              
            }
          }
        }, error =>{
          this.ingestionInProgessEventEmitter.emit(false);
          this.disableUploadBtn = false;
          this.progressInfos[id].processingFlag = false;
          this.progressInfos[id].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        })
      );
    }

  }

}
