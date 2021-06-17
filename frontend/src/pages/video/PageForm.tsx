import * as React from 'react';
import {Page} from "../../components/Page";
import {useParams} from 'react-router';
import {Form} from "./Form";

export type VideoParams = {
    id: string;
};

const PageForm = () => {
    const {id} = useParams<VideoParams>();
    return (
        <Page title={!id ? 'Criar vídeo' : 'Editar vídeo'}>
            <Form/>
        </Page>
    );
};

export default PageForm;
