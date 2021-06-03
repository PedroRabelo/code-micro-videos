import * as React from 'react';
import {useEffect, useState} from 'react';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import genreHttp from "../../util/http/genre-http";
import {Genre, ListResponse} from "../../util/models";
import DefaultTable, {makeActionStyles, TableColumn} from '../../components/Table';
import {BadgeNo, BadgeYes} from '../../components/Badge';
import {useSnackbar} from 'notistack';
import {IconButton, MuiThemeProvider} from '@material-ui/core';
import {Link} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        width: '30%',
        options: {
            sort: false,
            filter: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "23%",
    },
    {
        name: "is_active",
        label: "Ativo?",
        width: '4%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes/> : <BadgeNo/>;
            }
        },
    },
    {
        name: "categories",
        label: "Categorias",
        width: '20%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value.map((value: any) => value.name).join(', ');
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        width: '10%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: "actions",
        label: "Ações",
        width: '13%',
        options: {
            sort: false,
            filter: false,
            customBodyRender: (value, tableMeta) => {
                return (
                  <IconButton
                    color={'secondary'}
                    component={Link}
                    to={`/genres/${tableMeta.rowData[0]}/edit`}
                  >
                      <EditIcon/>
                  </IconButton>
                )
            }
        }
    }
]

const Table = () => {

    const snackbar = useSnackbar();
    const [data, setData] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const {data} = await genreHttp.list<ListResponse<Genre>>();
                if (isSubscribed) {
                    setData(data.data);
                }
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                  'Não foi possível salvar o membro de elenco',
                  {variant: 'error'}
                )
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            isSubscribed = false;
        };
    }, []);

    return (
      <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
        <DefaultTable
            title=""
            columns={columnsDefinition}
            data={data}
            loading={loading}
            options={{responsive: "vertical"}}
        />
      </MuiThemeProvider>
    );
};

export default Table;
