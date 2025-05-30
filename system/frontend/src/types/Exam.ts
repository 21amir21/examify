export interface Exam {
  id: string;
  name: string;
  duration: number;
  startDateTime: string;
  courseName: string;
  invigilationInstanceSocketID?: string;
}
