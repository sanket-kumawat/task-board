export type Task = {
  id: string;
  task: string;
  status: string;
  assignedTo: string;
};

export type ApiResponse = {
  [key: string]: Task;
};
