import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ChatBotService } from '../services/chat-bot.service';
import { BehaviorSubject, combineLatest, map, of, startWith, Subscription } from 'rxjs';
import { Functionality } from '../ircas.config';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-summarization',
  templateUrl: './summarization.component.html',
  styleUrls: ['./summarization.component.css']
})
export class SummarizationComponent implements OnInit, OnDestroy {
  
  summaryFormGroup!: FormGroup;
  summary: string = '';
  isLoading: boolean = false;
  selectedFiles?: FileList;
  selectFilesInArrayFormat : File[] = [];
  private selectedFilesSubject = new BehaviorSubject<File[]>([]);
  selectedFiles$ = this.selectedFilesSubject.asObservable();
  subscription$: Subscription[] = [];

  isButtonEnabled: boolean = false;


  constructor(private fb: FormBuilder,
              private genericService: ChatBotService) { }


  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.initiateForm();

     combineLatest([
      this.selectedFiles$, // Wrap selectedFiles as an observable
      (this.summaryFormGroup.get('userSummaryChoice') as FormControl).valueChanges.pipe(startWith('')), // Watch form control changes
    ]).subscribe(([files, summaryType]) => {
      console.log(files);
      console.log(summaryType);
      if (files && files.length > 0 && summaryType !== ''){
        this.isButtonEnabled = true;
      }else{
        this.isButtonEnabled = false;
      }
    });

  }

  initiateForm(){
    this.summaryFormGroup = this.fb.group({
      userSummaryChoice: new FormControl('', [Validators.required])
    });
  }

  handleSelectionChange(event: MatSelectChange){
    console.log(event.value);
    this.summary= "";
  }



  generateSummary() {
    let file: File;
    if (this.selectedFiles && this.selectFilesInArrayFormat?.length > 0) {
      this.summary = "";
      this.isLoading = true;
      file = this.selectedFiles[0];
      if (file) {
        this.subscription$.push(
          this.genericService.summarizeDocument(file, (this.summaryFormGroup.get('userSummaryChoice') as FormControl).value)
            .subscribe(res => {
              console.log(res);
              if (res.type === HttpEventType.UploadProgress) {
                let progressValue = Math.round(100 * (res.loaded / (res.total ? res.total : 100)));
                if (progressValue === 100) {
                   //to do
                }
              } else if (res instanceof HttpResponse) {
                console.log(res);
                this.isLoading = false;
                this.summary = res.body ? res.body.toString() : "NO SUMMARY GENERATED";
              }
            }, error => {
              this.isLoading = false;
            })
        );
      }
    }
  }

  selectFiles(event : any){
    this.selectedFiles = event.target.files;
    this.selectFilesInArrayFormat = Array.from(event.target.files);
    this.selectedFilesSubject.next(this.selectFilesInArrayFormat);
  }

  

}
