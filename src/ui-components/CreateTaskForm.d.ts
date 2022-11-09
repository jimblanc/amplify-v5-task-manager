/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CreateTaskFormInputValues = {
    title?: string;
    description?: string;
    dueDate?: string;
};
export declare type CreateTaskFormValidationValues = {
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    dueDate?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CreateTaskFormOverridesProps = {
    CreateTaskFormGrid?: FormProps<GridProps>;
    title?: FormProps<TextFieldProps>;
    description?: FormProps<TextFieldProps>;
    dueDate?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CreateTaskFormProps = React.PropsWithChildren<{
    overrides?: CreateTaskFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CreateTaskFormInputValues) => CreateTaskFormInputValues;
    onSuccess?: (fields: CreateTaskFormInputValues) => void;
    onError?: (fields: CreateTaskFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: CreateTaskFormInputValues) => CreateTaskFormInputValues;
    onValidate?: CreateTaskFormValidationValues;
}>;
export default function CreateTaskForm(props: CreateTaskFormProps): React.ReactElement;
