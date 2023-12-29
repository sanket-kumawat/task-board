import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs/internal/Observable';
import { Task } from '../types/task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private dbPath = '/tasks';
  tasks$!: Observable<any>;
  TasksRef!: AngularFireList<Task>;

  constructor(private db: AngularFireDatabase) {
    this.TasksRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Task> {
    return this.TasksRef;
  }

  create(task: Task): any {
    return this.TasksRef.push(task);
  }

  update(key: string, value: any): Promise<void> {
    return this.TasksRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.TasksRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.TasksRef.remove();
  }
}
