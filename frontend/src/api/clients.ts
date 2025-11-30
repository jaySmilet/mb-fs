const API_BASE = import.meta.env.DEV ? "/api" : "http://localhost:4000/api";

export const apiClient = {
  getFormSchema: () =>
    fetch(`${API_BASE}/form-schema`).then((res) => res.json()),
  submitForm: (data: Record<string, any>) =>
    fetch(`${API_BASE}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  getSubmissions: (
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  ) =>
    fetch(
      `${API_BASE}/submissions?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    ).then((res) => res.json()),
};
