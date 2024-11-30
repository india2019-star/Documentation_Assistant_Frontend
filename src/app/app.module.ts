import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { CoreModule } from "./core/core.module";
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ChatHelperComponent } from './chat-helper/chat-helper.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MultipleFileUploadComponent } from './multiple-file-upload/multiple-file-upload.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import { RestHttpInterceptorInterceptor } from './services/rest-http-interceptor.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { SummarizationComponent } from './summarization/summarization.component';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ChatHelperComponent,
    MultipleFileUploadComponent,
    SummarizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    CoreModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRadioModule,
    MatCardModule,
    MatSelectModule,
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true,
      includeTitleDuplicates: true,
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'decreasing',
      maxOpened: 5,
      autoDismiss: true
    })
    
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: RestHttpInterceptorInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
