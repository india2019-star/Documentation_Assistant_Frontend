import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-summarization',
  templateUrl: './summarization.component.html',
  styleUrls: ['./summarization.component.css']
})
export class SummarizationComponent implements OnInit {
  
  summaryFormGroup!: FormGroup;
  summary: string = '';
  disableGenerateBtn: boolean= false;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initiateForm();
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


  ingestionEvent(event : boolean){
    if(event){
      this.disableGenerateBtn = true;
    }else{
      this.disableGenerateBtn = false;
    }
  }

  generateSummary(){
    console.log((this.summaryFormGroup.get('userSummaryChoice') as FormControl).value);
    this.summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet pellentesque turpis, sed tincidunt lorem. Maecenas ut leo ut lorem vehicula tristique. Duis at orci ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque dapibus imperdiet finibus. Nunc vitae mauris rutrum, sollicitudin ligula sed, posuere lacus. Cras luctus non neque at volutpat. Aliquam erat volutpat. Maecenas augue orci, porttitor nec massa eget, accumsan vehicula lacus. Nulla vitae arcu dolor. Nullam tincidunt massa a tellus accumsan, sed iaculis velit efficitur. Nullam dictum eget massa id dictum. Curabitur id elit at neque venenatis elementum id ac lectus. Mauris gravida purus vestibulum ante imperdiet, non consectetur turpis tempus. In rhoncus dignissim dui, a pulvinar felis blandit id. Morbi finibus risus sit amet risus elementum, nec finibus erat hendrerit. Nunc tortor nulla, dignissim a ante id, cursus cursus est. Integer molestie ultrices dolor, rutrum semper sem cursus ac. Etiam lectus ex, viverra venenatis risus ut, mollis semper mauris. Proin sodales eleifend eleifend. Proin sodales eleifend eleifend. Proin sodales eleifend eleifend. Proin sodales eleifend eleifend. Proin sodales eleifend eleifend. Proin sodales eleifend eleifend. Proin sodales eleifend eleifend."
  }

  

}
