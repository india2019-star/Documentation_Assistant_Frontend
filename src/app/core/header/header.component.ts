import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeBtn : string = "button1";
  currentRoute : string | null = null;
  availableRoutesAndBtns: {[routeUrl: string]: string} = {
    '/' : 'button1',
    '/chatBot' : 'button2',
    '/aboutUs' : 'button3'
  };




  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeRoute();
  }

  setActiveButton(clickedBtn: string){
    this.activeBtn = clickedBtn;
  }

  activeRoute(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
      console.log(this.currentRoute);
      this.setActiveButton(this.availableRoutesAndBtns[this.currentRoute]);
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

}
