import React from 'react';
import { TextField } from '@mui/material';

interface InputFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
}

const InputField = ({ name, label, value, onChange, onBlur, error, type }: InputFieldProps) => {
    return (
        <TextField
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            fullWidth
            margin="normal"
            type={type}
            error={!!error}
            helperText={error}
            InputLabelProps={type === 'date' ? { shrink: true } : undefined}
        />
    );
};

export default InputField;
