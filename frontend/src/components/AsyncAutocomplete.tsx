import * as React from 'react';
import { Autocomplete } from '@material-ui/lab';
import {Props} from "react";
import {TextField} from "@material-ui/core";
import {AutocompleteProps} from "@material-ui/lab/index";

interface AsyncAutocompleteProps {
    TextFieldProps?: TextFieldProps;
}
export const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {

    const textFieldProps = TextFieldProps = {
        margin: 'normal',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: {shrink: true}
    }

    const autocompleteProps: AutocompleteProps = {
        renderInput: params => (
            <TextField
                {...params}
                {...textFieldProps}
            />
        )
    }

    return (
        <Autocomplete/>
    );
};

export default AsyncAutocomplete;
