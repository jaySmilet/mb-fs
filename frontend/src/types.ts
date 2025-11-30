export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "multi-select"
    | "date"
    | "textarea"
    | "switch";
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: string;
    min?: number;
    max?: number;
    minDate?: string;
    minSelected?: number;
    maxSelected?: number;
  };
}

export interface Submission {
  id: string;
  createdAt: string;
  data: Record<string, any>;
}

export interface SubmissionsResponse {
  success: boolean;
  items: Submission[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface FormSubmissionResponse {
  success: boolean;
  id?: string;
  createdAt?: string;
  errors?: Record<string, string>;
}
