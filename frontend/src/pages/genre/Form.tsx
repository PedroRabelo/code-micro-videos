import * as React from 'react';
import {Box, Button, ButtonProps, makeStyles, MenuItem, TextField} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles';
import {Controller, useForm} from 'react-hook-form';
import genreHttp from '../../util/http/genre-http';
import {useEffect, useState} from 'react';
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

    const [categories, setCategories] = useState<any[]>([]);
    const {register, handleSubmit, control, getValues, setValue, watch} = useForm({
        defaultValues: {
            categories_id: []
        }
    });
    const category = getValues()['categories_id'];

    useEffect(() => {
        register("categories_id")
    }, [register]);

    useEffect(() => {
        categoryHttp
            .list()
            .then(({data}) => setCategories(data.data));
    }, []);

    function onSubmit(formData, event) {
        genreHttp
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
                name="categories_id"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value}, fieldState: { error }}) => (
                    <TextField
                        select
                        label="Categorias"
                        fullWidth
                        variant={'outlined'}
                        margin={'normal'}
                        value={watch('categories_id')}
                        onChange={(e) => {
                            setValue('categories_id', e.target.value);
                        }}
                        SelectProps={{
                            multiple: true
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                    >
                        <MenuItem value="">
                            <em>Selectione categorias</em>
                        </MenuItem>
                        {
                            categories.map(
                                (category, key) => (
                                    <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                                )
                            )
                        }
                    </TextField>
                )}
            />

            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};
