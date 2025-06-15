import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    id: 'USR-010',
    name: 'Иван Иванов',
    avatar: '/assets/avatar-10.png',
    email: 'ivan.ivanov@example.ru',
    phone: '+7 (999) 123-45-67',
    address: { city: 'Москва', country: 'Россия', state: 'Московская область', street: 'ул. Ленина, 10' },
    createdAt: dayjs().subtract(5, 'days').toDate(),
  },
  {
    id: 'USR-009',
    name: 'Мария Смирнова',
    avatar: '/assets/avatar-9.png',
    email: 'maria.smirnova@example.ru',
    phone: '+7 (999) 234-56-78',
    address: { city: 'Санкт-Петербург', country: 'Россия', state: 'Ленинградская область', street: 'Невский пр., 25' },
    createdAt: dayjs().subtract(125, 'days').toDate(),
  },
  {
    id: 'USR-008',
    name: 'Алексей Петров',
    avatar: '/assets/avatar-8.png',
    email: 'alexey.petrov@example.ru',
    phone: '+7 (999) 345-67-89',
    address: { city: 'Новосибирск', country: 'Россия', state: 'Новосибирская область', street: 'ул. Красный проспект, 15' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-007',
    name: 'Елена Соколова',
    avatar: '/assets/avatar-7.png',
    email: 'elena.sokolova@example.ru',
    phone: '+7 (999) 456-78-90',
    address: { city: 'Екатеринбург', country: 'Россия', state: 'Свердловская область', street: 'ул. Мира, 5' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-006',
    name: 'Дмитрий Кузнецов',
    avatar: '/assets/avatar-6.png',
    email: 'dmitry.kuznetsov@example.ru',
    phone: '+7 (999) 567-89-01',
    address: { city: 'Казань', country: 'Россия', state: 'Республика Татарстан', street: 'ул. Баумана, 20' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-005',
    name: 'Ольга Морозова',
    avatar: '/assets/avatar-5.png',
    email: 'olga.morozova@example.ru',
    phone: '+7 (999) 678-90-12',
    address: { city: 'Нижний Новгород', country: 'Россия', state: 'Нижегородская область', street: 'ул. Большая Покровская, 30' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-004',
    name: 'Сергей Волков',
    avatar: '/assets/avatar-4.png',
    email: 'sergey.volkov@example.ru',
    phone: '+7 (999) 789-01-23',
    address: { city: 'Самара', country: 'Россия', state: 'Самарская область', street: 'ул. Ленинская, 40' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-003',
    name: 'Анна Новикова',
    avatar: '/assets/avatar-3.png',
    email: 'anna.novikova@example.ru',
    phone: '+7 (999) 890-12-34',
    address: { city: 'Ростов-на-Дону', country: 'Россия', state: 'Ростовская область', street: 'ул. Большая Садовая, 50' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-002',
    name: 'Павел Лебедев',
    avatar: '/assets/avatar-2.png',
    email: 'pavel.lebedev@example.ru',
    phone: '+7 (999) 901-23-45',
    address: { city: 'Воронеж', country: 'Россия', state: 'Воронежская область', street: 'ул. Плехановская, 60' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-001',
    name: 'Наталья Козлова',
    avatar: '/assets/avatar-1.png',
    email: 'natalya.kozlova@example.ru',
    phone: '+7 (999) 012-34-56',
    address: { city: 'Краснодар', country: 'Россия', state: 'Краснодарский край', street: 'ул. Красная, 70' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Customer[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
