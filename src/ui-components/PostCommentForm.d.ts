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
export declare type PostCommentFormInputValues = {
    message?: string;
};
export declare type PostCommentFormValidationValues = {
    message?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PostCommentFormOverridesProps = {
    PostCommentFormGrid?: FormProps<GridProps>;
    message?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PostCommentFormProps = React.PropsWithChildren<{
    overrides?: PostCommentFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PostCommentFormInputValues) => PostCommentFormInputValues;
    onSuccess?: (fields: PostCommentFormInputValues) => void;
    onError?: (fields: PostCommentFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: PostCommentFormInputValues) => PostCommentFormInputValues;
    onValidate?: PostCommentFormValidationValues;
}>;
export default function PostCommentForm(props: PostCommentFormProps): React.ReactElement;
