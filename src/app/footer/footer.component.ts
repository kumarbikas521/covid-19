import { Component, OnInit } from '@angular/core';
import * as URLs from '../../assets/URL.json';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  URLs = URLs;
  constructor() { }

  ngOnInit() {
  }

}
