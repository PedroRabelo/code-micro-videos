import * as React from 'react';
import {Form} from './Form';
import {Page} from '../../components/Page';
import {useParams} from "react-router";

export type GenreParams = {
    id: string;
};


const PageForm = () => {
    const {id} = useParams<GenreParams>();
    return (
        <Page title={!id ? 'Criar gênero' : 'Editar gênero'}>
            <Form/>
        </Page>
    );
};

export default PageForm;
