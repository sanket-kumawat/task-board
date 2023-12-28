import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Task } from '../../types/task';

@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.scss'],
})
export class TaskFormModalComponent implements OnInit {
  taskForm!: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      id: [''],
      task: ['', Validators.required],
      assignedTo: ['', Validators.required],
      status: ['1'],
    });

    if (this.data) {
      this.taskForm.patchValue({
        id: this.data.id,
        task: this.data.task,
        assignedTo: this.data.assignedTo,
        status: this.data.status,
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.taskForm.value);
  }
}
