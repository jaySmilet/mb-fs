import { useQuery } from "@tanstack/react-query";
import { useForm, useField } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { type FormField } from "../types";
import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "../api/clients";

export default function FormPage() {
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    data: schema,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["formSchema"],
    queryFn: apiClient.getFormSchema,
  });

  const form = useForm({
    defaultValues: {} as Record<string, any>,
    onSubmit: async ({ value }) => {
      console.log("submitted", value);
      setSubmitStatus("loading");
      const result = await apiClient.submitForm(value);
      if (result.success) {
        setSubmitStatus("success");
        setTimeout(() => navigate("/submissions"), 1500);
        return { success: true };
      } else {
        setSubmitStatus("error");
        return { success: false, serverErrors: result.errors };
      }
    },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {schema!.title}
        </h1>
        <p className="text-gray-600 mb-8">{schema!.description}</p>

        <form onSubmit={form.handleSubmit} className="space-y-6">
          {schema!.fields.map((field: FormField) => (
            <FormFieldComponent key={field.name} field={field} />
          ))}

          <button
            type="submit"
            disabled={submitStatus === "loading"}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {submitStatus === "loading" ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

interface FormFieldProps {
  field: FormField;
}

function FormFieldComponent({ field }: FormFieldProps) {
  const form = useForm(); // get form instance

  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {field.label}{" "}
        {field.validation?.required && <span className="text-red-500">*</span>}
      </label>

      <form.Field
        name={field.name}
        children={(fieldApi) => (
          <div>
            <FieldInput
              field={field}
              value={fieldApi.state.value}
              onChange={fieldApi.handleChange}
              onBlur={fieldApi.handleBlur}
            />
            {fieldApi.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {fieldApi.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}

interface FieldInputProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
}

function FieldInput({ field, value, onChange, onBlur }: FieldInputProps) {
  const common = {
    id: field.name,
    name: field.name,
    placeholder: field.placeholder,
    className:
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
    onBlur,
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let v: any = e.currentTarget.value;

    if (field.type === "number") {
      v = v === "" ? "" : Number(v);
    } else if (field.type === "switch") {
      v = (e.currentTarget as HTMLInputElement).checked;
    }

    onChange(v); // pass pure value
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vals = Array.from(
      e.currentTarget.selectedOptions,
      (o: HTMLOptionElement) => o.value
    );
    onChange(vals); // pass array of values
  };

  switch (field.type) {
    case "text":
      return (
        <input
          {...common}
          type="text"
          value={value ?? ""}
          onChange={handleChange}
        />
      );

    case "textarea":
      return (
        <textarea
          {...common}
          rows={4}
          value={value ?? ""}
          onChange={handleChange}
        />
      );

    case "number":
      return (
        <input
          {...common}
          type="number"
          value={value ?? ""}
          onChange={handleChange}
        />
      );

    case "select":
      return (
        <select {...common} value={value ?? ""} onChange={handleChange}>
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "multi-select":
      return (
        <select
          {...common}
          multiple
          value={Array.isArray(value) ? value : []}
          className="h-32"
          onChange={handleMultiSelectChange}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "date":
      return (
        <input
          {...common}
          type="date"
          value={value ?? ""}
          onChange={handleChange}
        />
      );

    case "switch":
      return (
        <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            {...common}
            type="checkbox"
            checked={!!value}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            {field.placeholder || field.label}
          </span>
        </label>
      );

    default:
      return (
        <input
          {...common}
          type="text"
          value={value ?? ""}
          onChange={handleChange}
        />
      );
  }
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex items-center justify-center min-h-[400px] space-x-2 text-red-600">
      <AlertCircle className="w-8 h-8" />
      <span>Failed to load form. Please refresh.</span>
    </div>
  );
}
