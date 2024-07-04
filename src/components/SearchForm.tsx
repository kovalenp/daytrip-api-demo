/* eslint-disable react/no-children-prop */
import { Flex, Button, Spinner } from "@radix-ui/themes";
import React from "react";
import { Field, FieldApi, FormApi } from "@tanstack/react-form";
import { TripSearchParams } from "@/app/page";
import DatePicker from "react-datepicker";

type SearchFormProps = {
  form: FormApi<TripSearchParams>;
  isLoading: boolean;
};

const SearchForm: React.FC<SearchFormProps> = ({ form, isLoading }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <form
      className="my-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Flex gap={"4"} align={"start"} className="">
        <Field
          form={form}
          name="origin"
          validators={{
            onChange: ({ value }) => (!value ? "From is required" : undefined),
          }}
          children={(field) => {
            return (
              <Flex
                direction={"column"}
                gap={"2"}
                justify={"between"}
                flexGrow={"1"}
              >
                <label htmlFor={field.name}>From:</label>
                <input
                  id={field.name}
                  className="outline outline-1 outline-gray-300 rounded-md py-2 px-3"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Origin"
                />
                <FieldInfo field={field} />
              </Flex>
            );
          }}
        />
        <Field
          form={form}
          name="destination"
          validators={{
            onChange: ({ value }) => (!value ? "To is required" : undefined),
          }}
          children={(field) => {
            return (
              <Flex
                direction={"column"}
                gap={"2"}
                justify={"between"}
                flexGrow={"1"}
              >
                <label htmlFor={field.name}>To:</label>
                <input
                  id={field.name}
                  className="outline outline-1 outline-gray-300 rounded-md py-2 px-3"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Destination"
                />
                <FieldInfo field={field} />
              </Flex>
            );
          }}
        />
        <Field
          form={form}
          name="date"
          children={(field) => {
            return (
              <Flex
                className="max-h-10"
                direction={"column"}
                gap={"2"}
                justify={"between"}
                flexGrow={"1"}
              >
                <label htmlFor={field.name}>Date:</label>
                <DatePicker
                  selected={form.state.values.date}
                  onChange={(date) => {
                    form.setFieldValue("date", date as Date);
                  }}
                  calendarStartDay={1}
                  minDate={tomorrow}
                  dateFormat={"dd MMM yyyy"}
                />
                <FieldInfo field={field} />
              </Flex>
            );
          }}
        />
        <Field
          form={form}
          name="passengersCount"
          validators={{
            onChange: ({ value }) =>
              !value ? "Passengers is required" : undefined,
          }}
          children={(field) => {
            return (
              <Flex direction={"column"} gap={"2"} justify={"between"}>
                <label htmlFor={field.name}>Passengers:</label>
                <input
                  id={field.name}
                  className="outline outline-1 outline-gray-300 rounded-md py-2 px-3"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  type="number"
                  min={1}
                  max={10}
                />
                <FieldInfo field={field} />
              </Flex>
            );
          }}
        />
      </Flex>

      <Flex gap={"4"} align={"center"} className="mt-6">
        <Field
          form={form}
          name="includeStops"
          children={(field) => {
            return (
              <Flex gap={"2"} align={"center"}>
                <input
                  id={field.name}
                  className="rounded-md w-4 h-4"
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  type="checkbox"
                />
                <label htmlFor={field.name}>Include Stops</label>
                <FieldInfo field={field} />
              </Flex>
            );
          }}
        />
        <Field
          form={form}
          name="includeNonEnglishSpeaking"
          children={(field) => {
            return (
              <Flex gap={"2"} flexGrow={"1"} align={"center"}>
                <input
                  id={field.name}
                  className="rounded-md w-4 h-4"
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  type="checkbox"
                />
                <label htmlFor={field.name}>
                  Include non-English speaking drivers
                </label>
                <FieldInfo field={field} />
              </Flex>
            );
          }}
        />
        <Button
          className={`${!isLoading && "cursor-pointer"}`}
          size={"4"}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Searching
              <Spinner />
            </>
          ) : (
            "Search"
          )}
        </Button>
      </Flex>
    </form>
  );
};

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return field.state.meta.touchedErrors.length ? (
    <em>{field.state.meta.touchedErrors}</em>
  ) : null;
}

export default SearchForm;
