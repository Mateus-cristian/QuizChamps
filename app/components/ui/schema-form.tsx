import { SchemaForm as RemixForm } from "remix-forms";
import type { FormSchema, SchemaFormProps } from "remix-forms";
import { Field } from "./field";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Select } from "./select";
import { RadioGroup } from "./radio-group";
import { Radio } from "./Radio";
import { InputWrapper } from "./input-wrapper";
import { Errors } from "./errors";
import { Error } from "./error";

function SchemaForm<Schema extends FormSchema>(props: SchemaFormProps<Schema>) {
  return (
    <RemixForm
      className="flex flex-col space-y-6"
      fieldComponent={Field}
      labelComponent={Label}
      inputComponent={Input}
      multilineComponent={Textarea}
      selectComponent={Select}
      radioComponent={Radio}
      radioGroupComponent={RadioGroup}
      radioWrapperComponent={InputWrapper}
      checkboxWrapperComponent={InputWrapper}
      checkboxComponent={Checkbox}
      buttonComponent={Button}
      globalErrorsComponent={Errors}
      errorComponent={Error}
      {...props}
    />
  );
}

export { SchemaForm };
