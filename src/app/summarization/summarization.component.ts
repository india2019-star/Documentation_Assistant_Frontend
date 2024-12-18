import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ChatBotService } from '../services/chat-bot.service';
import { BehaviorSubject, combineLatest, startWith, Subscription } from 'rxjs';
import { GenericStreamingService } from '../services/generic-streaming.service';

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
  updateInterval: any;
  buffer: string = "";


  constructor(private fb: FormBuilder,
              private genericService: ChatBotService,
              private genericStreamingSerivce: GenericStreamingService) { }


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
        this.buffer="";
        this.summary="";
        this.genericStreamingSerivce.uploadFileAndStream(file, 
          (this.summaryFormGroup.get('userSummaryChoice') as FormControl).value,
          (progress) => {
            // Update progress
          },
          (data) => {
            this.summary += data;
          },
          () => {
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          })
      }
    }
  }

  selectFiles(event : any){
    this.selectedFiles = event.target.files;
    this.selectFilesInArrayFormat = Array.from(event.target.files);
    this.selectedFilesSubject.next(this.selectFilesInArrayFormat);
  }
}
