import { Component } from '@angular/core';

@Component({
  selector: 'tasks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taskify';
  links = [
    {path: '/tasks', label: 'TASKS', icon: 'loyalty'}
  ];
}
