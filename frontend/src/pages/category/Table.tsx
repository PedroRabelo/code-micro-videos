import * as React from 'react';
import {useEffect, useRef, useState} from 'react';

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

interface Pagination {
    page: number;
    total: number;
    per_page: number;
}

interface Order {
    sort: string | null;
    dir: string | null;
}

interface SearchState {
    search: string | null;
    pagination: Pagination;
    order: Order;
}

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

const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchstate, setSearchState] = useState<SearchState>({
        search: '',
        pagination: {
            page: 1,
            total: 0,
            per_page: 10,
        },
        order: {
            sort: null,
            dir: null,
        }
    });

    const columns = columnsDefinition.map(column => {
        return column.name === searchstate.order.sort
          ? {
              ...column,
              options: {
                  ...column.options,
                  sortDirection: searchstate.order.dir as any
              }
          }
          : column;
    });

    useEffect(() => {
        subscribed.current = true;
        getData();
        return () => {
            subscribed.current = false;
        }

    }, [
      searchstate.search,
      searchstate.pagination.page,
      searchstate.pagination.per_page,
      searchstate.order
    ]);

    async function getData() {
        setLoading(true);
        try{
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: searchstate.search,
                    page: searchstate.pagination.page,
                    per_page: searchstate.pagination.per_page,
                    sort: searchstate.order.sort,
                    dir: searchstate.order.dir,
                }
            });
            if (subscribed.current) {
                setData(data.data);
                setSearchState((prevState => ({
                    ...prevState,
                    pagination: {
                        ...prevState.pagination,
                        total: data.meta.total,
                    }
                })))
            }
        } catch (error) {
            console.log(error);
            if (categoryHttp.isCancelledRequest(error)) {
              return;
            }
            snackbar.enqueueSnackbar(
              'Não foi possível salvar o membro de elenco',
              {variant: 'error'}
            )
        } finally {
            setLoading(false);
        }
    }

    return (
      <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
          <DefaultTable
            title=""
            columns={columns}
            data={data}
            loading={loading}
            options={{
                serverSide: true,
                responsive: "vertical",
                searchText: searchstate.search != null ? searchstate.search : undefined,
                page: searchstate.pagination.page - 1,
                rowsPerPage: searchstate.pagination.per_page,
                count: searchstate.pagination.total,
                onSearchChange: (value) => setSearchState((prevState => ({
                      ...prevState,
                      search: value
                    }
                ))),
                onChangePage: (page) => setSearchState((prevState => ({
                      ...prevState,
                      pagination: {
                          ...prevState.pagination,
                          page: page + 1,
                      }
                  }
                ))),
                onChangeRowsPerPage: (perPage) => setSearchState((prevState => ({
                      ...prevState,
                      pagination: {
                          ...prevState.pagination,
                          per_page: perPage,
                      }
                  }
                ))),
                onColumnSortChange: (changedColumn: string, direction: string) => setSearchState((prevState => ({
                      ...prevState,
                      order: {
                          sort: changedColumn,
                          dir: direction.includes('desc') ? 'desc' : 'asc',
                      }
                  }
                ))),
            }}
          />
      </MuiThemeProvider>

    );
};

export default Table;
