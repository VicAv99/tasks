import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task } from './task.model';

const BASE_URL = 'http://afb1a1ca3ec8d11e9ae4416a878cfa82-1345605086.us-east-1.elb.amazonaws.com:8080/api/v1';
const model    = 'tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpClient: HttpClient) { }

  all(): Observable<Task[]> {
    return this.httpClient.get<{data: Task[]}>(this.getUrl()).pipe(
      map((task: {data: Task[]}) => task.data)
    );
  }

  findOne(taskId: string): Observable<Task> {
    return this.httpClient.get<Task>(this.getUrlById(taskId));
  }

  create(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(this.getUrl(), task);
  }

  update(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(this.getUrlById(task.id), task);
  }

  delete(taskId: string): Observable<unknown> {
    return this.httpClient.delete<any>(this.getUrlById(taskId));
  }

  private getUrl() {
    return `${BASE_URL}/${model}`;
  }

  private getUrlById(id: string) {
    return `${this.getUrl()}/${id}`;
  }
}
