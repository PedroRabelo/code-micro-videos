import {setLocale} from 'yup';

const ptBr = {
    mixed: {
        required: '${path} é requerido',
        notType: '${path} é inválido'
    },
    string: {
        max: '${path} precisa ter no máximo ${max} caracteres'
    },
    number: {
        min: '${path} precisa ser no mínimo ${max}'
    }
};

setLocale(ptBr);

export * from 'yup';
