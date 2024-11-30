import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ChatHelperComponent } from './chat-helper/chat-helper.component';
import { HomeComponent } from './home/home.component';
import { SummarizationComponent } from './summarization/summarization.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'chatBot', component: ChatHelperComponent},
  {path: 'summarization', component: SummarizationComponent},
  {path: 'aboutus', component: AboutComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
