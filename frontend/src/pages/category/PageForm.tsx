import * as React from 'react';
import {useParams} from 'react-router';
import {Form} from './Form';
import {Page} from '../../components/Page';

export type CategoryParams = {
    id: string;
};

const PageForm = () => {
    const {id} = useParams<CategoryParams>();
    return (
        <Page title={!id ? 'Criar categoria' : 'Editar Categoria'}>
            <Form/>
        </Page>
    );
};

export default PageForm;
