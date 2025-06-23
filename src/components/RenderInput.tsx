import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type StepType = "text" | "email" | "number" | "textarea" | "tel" | "select";

export type Step = {
  question: string;
  type: StepType;
  name: string;
  description?: string;
  placeholder?: string;
  options?: { value: string; label: string }[]; // Solo para select
};

type RenderInputProps = {
  step: Step;
  value: string | number;
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
};

export default function RenderInput({
  step,
  value,
  onChange,
}: RenderInputProps) {
  switch (step.type) {
    case "text":
    case "email":
    case "number":
      return (
        <input
          type={step.type}
          name={step.name}
          placeholder={step.placeholder || ""}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className="border-light-primary dark:border-dark-primary text-light-text-primary dark:text-dark-text-primary mt-4 w-full rounded-md border bg-transparent p-2 text-sm outline-none"
        />
      );

    case "textarea":
      return (
        <textarea
          name={step.name}
          placeholder={step.placeholder || ""}
          value={value}
          onChange={onChange}
          className="border-light-primary dark:border-dark-primary text-light-text-primary dark:text-dark-text-primary mt-4 w-full resize-none rounded-md border bg-transparent p-2 text-sm outline-none"
          rows={4}
        />
      );

    case "tel":
      return (
        <div className="mt-4">
          <PhoneInput
            country={"bo"}
            value={value.toString()}
            onChange={(phone) => {
              const formattedPhone = phone.startsWith("+")
                ? phone
                : `+${phone}`;
              onChange({
                target: { name: step.name, value: formattedPhone },
              } as any);
            }}
            inputProps={{
              name: step.name,
              required: true,
              autoFocus: false,
            }}
            inputClass="!w-full !border-light-primary dark:!border-dark-primary !bg-transparent !text-light-text-primary dark:!text-dark-text-primary !rounded-md !text-sm"
            dropdownClass="dark:!bg-dark-bg-surface !bg-light-bg-surface dark:!text-dark-text-primary !text-sm"
            buttonClass="!bg-transparent !border-none !rounded-md !absolute !z-10 !text-sm"
            containerClass="!w-full !text-sm"
          />
        </div>
      );

    case "select":
      return (
        <select
          name={step.name}
          value={value}
          onChange={onChange}
          className="border-light-primary dark:border-dark-primary bg-light-bg-surface dark:bg-dark-bg-surface text-light-text-primary dark:text-dark-text-primary focus:ring-none mt-4 w-full rounded-md border p-2 text-sm outline-none"
        >
          {step.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    default:
      return null;
  }
}
