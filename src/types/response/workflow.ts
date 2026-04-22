export interface ResponseWorkflowDto {
  status: string;
  nextSteps: { label: string }[];
  isUpdatable: boolean;
}
