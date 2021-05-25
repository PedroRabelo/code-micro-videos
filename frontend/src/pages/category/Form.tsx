import * as React from 'react';
import {TextField, Checkbox, Box, Button, ButtonProps, makeStyles} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles';
import {useForm, Controller} from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: 'outlined',
    };

    const {handleSubmit, control, getValues} = useForm();

    function onSubmit(formData, event) {
        categoryHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value}, fieldState: { error }}) => (
                    <TextField
                        label="Nome"
                        fullWidth
                        variant={'outlined'}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                    />
                )}
            />

            <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value}, fieldState: { error }}) => (
                    <TextField
                        label="Descrição"
                        multiline
                        rows="4"
                        fullWidth
                        variant={'outlined'}
                        margin={'normal'}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                    />
                )}
            />

            <Controller
                name="is_active"
                control={control}
                defaultValue={true}
                render={({ field: { onChange, value}}) => (
                    <Checkbox
                        defaultChecked
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
            Ativo?
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};
