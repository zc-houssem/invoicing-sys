export interface WorkflowStep {
  label: string;
}

export interface ResponseWorkflowDto {
  status: string;
  nextSteps: WorkflowStep[];
  isUpdatable: boolean;
}
