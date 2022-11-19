import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-scroller',
  templateUrl: './video-scroller.component.html',
  styleUrls: ['./video-scroller.component.scss'],
})
export class VideoScrollerComponent implements OnInit {

  suggestions = [
    {
      title: 'The Best of 2019',
    }, {
      title: 'The Best of 2020',
    }, {
      title: 'The Best of 2021',
    }
  ]

  constructor() { }

  ngOnInit() {}

}
