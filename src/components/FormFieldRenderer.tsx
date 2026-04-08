import { FormField } from "@/lib/formTemplates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SignaturePad } from "@/components/SignaturePad";

interface Props {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const FormFieldRenderer = ({ field, value, onChange }: Props) => {
  const labelEl = field.type !== "heading" && field.type !== "paragraph" && field.type !== "checkbox" && (
    <label className="text-sm font-medium text-foreground">
      {field.label}
      {field.required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  );

  switch (field.type) {
    case "heading":
      return <h2 className="text-xl font-bold text-foreground pt-3 pb-1 border-b border-border/50">{field.label}</h2>;
    case "paragraph":
      return <p className="text-sm text-muted-foreground leading-relaxed">{field.label}</p>;
    case "text":
    case "email":
    case "phone":
    case "number":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        </div>
      );
    case "date":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} required={field.required} />
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Textarea placeholder={field.placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={field.required} rows={3} />
        </div>
      );
    case "select":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-start gap-2 py-1">
          <Checkbox
            id={field.id}
            checked={value === "true"}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
          />
          <label htmlFor={field.id} className="text-sm text-foreground leading-snug cursor-pointer">
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        </div>
      );
    case "signature":
      return <SignaturePad label={`${field.label}${field.required ? " *" : ""}`} value={value} onChange={onChange} />;
    default:
      return null;
  }
};
