import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse, Task } from '../types/task';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTaskList() {
    return this.http.get<ApiResponse>(`${this.apiUrl}/task.json`);
  }

  createTask(body: Task) {
    return this.http.post<{ name: string }>(`${this.apiUrl}/task.json`, body);
  }

  updateTask(body: Task) {
    return this.http.patch(`${this.apiUrl}/task/${body.id}.json`, body);
  }

  deleteTask(body: Task) {
    return this.http.delete(`${this.apiUrl}/task/${body.id}.json`);
  }
}
