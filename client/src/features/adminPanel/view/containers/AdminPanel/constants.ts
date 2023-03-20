import { TableColumn } from 'consta-uikit-fork/Table';

const USERS_COLUMNS: TableColumn<{ num: number; id: string; email: string; datasetId: number;
  trace: JSX.Element; activeUntil: JSX.Element; isActive: JSX.Element;
  removeButton: JSX.Element; changePasswordComponent: JSX.Element; }>[] = [
  {
    title: '№',
    accessor: 'num',
    width: 80,
    sortable: true,
  },
  {
    title: 'ID',
    accessor: 'id',
    width: 270,
    sortable: true,
  },
  {
    title: 'Логин',
    accessor: 'email',
    width: 230,
    sortable: true,
  },
  {
    title: '№ набора данных',
    accessor: 'datasetId',
    width: 120,
    sortable: true,
  },
  {
    title: 'Трек пользователя',
    accessor: 'trace',
    width: 150,
    align: 'center',
  },
  {
    title: 'Активен до',
    accessor: 'activeUntil',
    width: 220,
    align: 'center',
    sortable: true,
  },
  {
    title: 'Активен?',
    accessor: 'isActive',
    width: 130,
    align: 'center',
    sortable: true,
  },
  {
    title: 'Изменить пароль',
    accessor: 'changePasswordComponent',
    width: 200,
    align: 'center',
  },
  {
    title: 'Удалить пользователя (необратимо)',
    accessor: 'removeButton',
    width: 200,
    align: 'center',
  },
];

const DATA_SETS_COLUMNS: TableColumn<{ id: string; num: number; datasetId: number;
  description: string; downloadDate: string;
  removeButton: JSX.Element; }>[] = [
  {
    title: '№',
    accessor: 'num',
    width: 60,
    sortable: true,
  },
  {
    title: 'Набор данных №',
    accessor: 'datasetId',
    width: 150,
    sortable: true,
  },
  {
    title: 'Дата загрузки',
    accessor: 'downloadDate',
    width: 350,
    align: 'center',
  },
  {
    title: 'Описание',
    accessor: 'description',
    width: 750,
    sortable: true,
  },
  {
    title: 'Удалить набор (необратимо)',
    accessor: 'removeButton',
    width: 250,
    align: 'center',
  },
];

export { USERS_COLUMNS, DATA_SETS_COLUMNS };
