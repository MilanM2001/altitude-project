import React from 'react';
import { TextField } from '@mui/material';

interface InputFieldProps {
    name: string
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
}

const InputField = (props: InputFieldProps) => {
    return (
        <TextField
            name={props.name}
            label={props.label}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            fullWidth
            margin="normal"
            type={props.type}
            error={!!props.error}
            helperText={props.error}
        />
    );
};

export default InputField;
