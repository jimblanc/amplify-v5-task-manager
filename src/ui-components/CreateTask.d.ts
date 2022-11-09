/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, SelectFieldProps, TextAreaFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CreateTaskInputValues = {
    Field1?: string;
    Field0?: string;
};
export declare type CreateTaskValidationValues = {
    Field1?: ValidationFunction<string>;
    Field0?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CreateTaskOverridesProps = {
    CreateTaskGrid?: FormProps<GridProps>;
    Field1?: FormProps<SelectFieldProps>;
    Field0?: FormProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type CreateTaskProps = React.PropsWithChildren<{
    overrides?: CreateTaskOverridesProps | undefined | null;
} & {
    onSubmit: (fields: CreateTaskInputValues) => void;
    onCancel?: () => void;
    onChange?: (fields: CreateTaskInputValues) => CreateTaskInputValues;
    onValidate?: CreateTaskValidationValues;
}>;
export default function CreateTask(props: CreateTaskProps): React.ReactElement;
