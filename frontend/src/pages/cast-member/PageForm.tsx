import * as React from 'react';
import {Form} from './Form';
import {Page} from '../../components/Page';
import {useParams} from "react-router";

export type CastMemberParams = {
    id: string;
};

const PageForm = () => {
    const {id} = useParams<CastMemberParams>();
    return (
        <Page title={!id ? 'Criar elenco' : 'Editar elenco'}>
            <Form/>
        </Page>
    );
};

export default PageForm;
