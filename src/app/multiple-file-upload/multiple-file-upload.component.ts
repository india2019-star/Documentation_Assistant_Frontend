import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChatBotService } from '../services/chat-bot.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-multiple-file-upload',
  templateUrl: './multiple-file-upload.component.html',
  styleUrls: ['./multiple-file-upload.component.css']
})
export class MultipleFileUploadComponent implements OnInit, OnDestroy {


  selectedFiles?: FileList;
  selectFilesInArrayFormat : File[] = [];
  progressInfos: any[] = [];
  message: string[] = [];

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
  
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(id: number, file: File){
    this.progressInfos[id] = { value: 0, fileName: file.name };

    if(file){
      this.subscription$.push(
        this.genericService.uploadDocumentsFromUser(file)
        .subscribe(res =>{
          console.log(res);
          if(res.type === HttpEventType.UploadProgress){
            this.progressInfos[id].value  = Math.round(100 * (res.loaded / (res.total ? res.total : 100)));
          }else if(res instanceof HttpResponse){
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
          }
        }, error =>{

          this.progressInfos[id].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        })
      );
    }

  }

}
