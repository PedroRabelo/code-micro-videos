import * as React from 'react';
import {useEffect, useState} from 'react';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import {BadgeNo, BadgeYes} from '../../components/Badge';
import {Category, ListResponse} from "../../util/models";
import DefaultTable, {makeActionStyles, TableColumn} from '../../components/Table';
import {useSnackbar} from 'notistack';
import {IconButton, MuiThemeProvider} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {Link} from 'react-router-dom';

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "30%",
        options: {
            sort: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "43%",
    },
    {
        name: "is_active",
        label: "Ativo?",
        width: "4%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes/> : <BadgeNo/>
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        width: "10%",
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
                    to={`/categories/${tableMeta.rowData[0]}/edit`}
                  >
                      <EditIcon/>
                  </IconButton>
                )
            }
        }
    }
];

type Props = {};

const Table = (props: Props) => {

    const snackbar = useSnackbar();
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try{
                const {data} = await categoryHttp.list<ListResponse<Category>>();
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
