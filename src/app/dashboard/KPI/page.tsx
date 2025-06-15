'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import { Chart } from '@/components/core/chart';

// Mock data
const employees = [
  { employee_id: 'e1', name: 'Иван Иванов' },
  { employee_id: 'e2', name: 'Мария Смирнова' },
  { employee_id: 'e3', name: 'Алексей Петров' },
];
const kpiTypes = [
  { kpi_type_id: 'k1', name: 'Продажи' },
  { kpi_type_id: 'k2', name: 'Обслуживание клиентов' },
  { kpi_type_id: 'k3', name: 'Выполнение задач' },
];

const initialKpis = [
  { kpi_id: uuidv4(), employee_id: 'e1', period: '2024-01', kpi_type_id: 'k1', value: 120, comment: 'Хороший результат' },
  { kpi_id: uuidv4(), employee_id: 'e1', period: '2024-02', kpi_type_id: 'k1', value: 130, comment: '' },
  { kpi_id: uuidv4(), employee_id: 'e2', period: '2024-01', kpi_type_id: 'k2', value: 95, comment: 'Нужно улучшить' },
  { kpi_id: uuidv4(), employee_id: 'e3', period: '2024-01', kpi_type_id: 'k3', value: 110, comment: '' },
  { kpi_id: uuidv4(), employee_id: 'e2', period: '2024-02', kpi_type_id: 'k2', value: 105, comment: '' },
  { kpi_id: uuidv4(), employee_id: 'e3', period: '2024-02', kpi_type_id: 'k3', value: 120, comment: 'Рост' },
];

export default function KPIPage() {
  const [kpis, setKpis] = React.useState(initialKpis);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [form, setForm] = React.useState({
    employee_id: '',
    period: '',
    kpi_type_id: '',
    value: '',
    comment: '',
  });
  const [selectedEmployee, setSelectedEmployee] = React.useState<string | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedKpis = kpis.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Dialog
  const handleOpenDialog = () => {
    setForm({ employee_id: '', period: '', kpi_type_id: '', value: '', comment: '' });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleAddKpi = () => {
    setKpis([
      ...kpis,
      { kpi_id: uuidv4(), ...form, value: Number(form.value) },
    ]);
    setOpenDialog(false);
  };

  // Chart data
  const periods = Array.from(new Set(kpis.map(k => k.period))).sort();
  const branchChartSeries = employees.map(emp => ({
    name: emp.name,
    data: periods.map(period => {
      const found = kpis.find(k => k.employee_id === emp.employee_id && k.period === period);
      return found ? found.value : 0;
    })
  }));

  const selectedEmployeeObj = employees.find(e => e.employee_id === selectedEmployee);
  const employeeChartSeries = selectedEmployeeObj ? [
    {
      name: selectedEmployeeObj.name,
      data: periods.map(period => {
        const found = kpis.find(k => k.employee_id === selectedEmployeeObj.employee_id && k.period === period);
        return found ? found.value : 0;
      })
    }
  ] : [];

  return (
    <Stack spacing={4} sx={{ mt: 4 }}>
      <Typography variant="h4">Показатели эффективности (KPI)</Typography>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">Общая информация</Typography>
        <Typography>Количество сотрудников: {employees.length}</Typography>
        <Typography>Всего KPI записей: {kpis.length}</Typography>
        <Typography>Среднее значение KPI: {kpis.length ? (kpis.reduce((a, b) => a + b.value, 0) / kpis.length).toFixed(2) : 0}</Typography>
      </Card>
      <Card sx={{ mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
          <Typography variant="h6">Таблица KPI</Typography>
          <Button variant="contained" onClick={handleOpenDialog}>Добавить KPI</Button>
        </Stack>
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Идентификатор</TableCell>
                <TableCell>Сотрудник</TableCell>
                <TableCell>Период</TableCell>
                <TableCell>Тип показателя</TableCell>
                <TableCell>Значение</TableCell>
                <TableCell>Комментарий</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedKpis.map((kpi) => (
                <TableRow key={kpi.kpi_id} hover selected={selectedEmployee === kpi.employee_id} onClick={() => setSelectedEmployee(kpi.employee_id)} style={{ cursor: 'pointer' }}>
                  <TableCell>{kpi.kpi_id}</TableCell>
                  <TableCell>{employees.find(e => e.employee_id === kpi.employee_id)?.name || ''}</TableCell>
                  <TableCell>{kpi.period}</TableCell>
                  <TableCell>{kpiTypes.find(t => t.kpi_type_id === kpi.kpi_type_id)?.name || ''}</TableCell>
                  <TableCell>{kpi.value}</TableCell>
                  <TableCell>{kpi.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={kpis.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <Card sx={{ mt: 2 }}>
        <Typography variant="h6">График по всем сотрудникам</Typography>
        <Chart
          height={350}
          options={{
            chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
            dataLabels: { enabled: false },
            fill: { opacity: 1, type: 'solid' },
            grid: { borderColor: '#e0e0e0', strokeDashArray: 2, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
            legend: { show: true },
            plotOptions: { bar: { columnWidth: '40px' } },
            stroke: { colors: ['transparent'], show: true, width: 2 },
            xaxis: { categories: periods },
            yaxis: { labels: { formatter: (value: number) => value.toString() } },
          }}
          series={branchChartSeries}
          type="bar"
          width="100%"
        />
      </Card>
      {selectedEmployeeObj && (
        <Card sx={{ mt: 2 }}>
          <Typography variant="h6">График по сотруднику: {selectedEmployeeObj.name}</Typography>
          <Chart
            height={350}
            options={{
              chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
              dataLabels: { enabled: false },
              fill: { opacity: 1, type: 'solid' },
              grid: { borderColor: '#e0e0e0', strokeDashArray: 2, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
              legend: { show: false },
              plotOptions: { bar: { columnWidth: '40px' } },
              stroke: { colors: ['transparent'], show: true, width: 2 },
              xaxis: { categories: periods },
              yaxis: { labels: { formatter: (value: number) => value.toString() } },
            }}
            series={employeeChartSeries}
            type="bar"
            width="100%"
          />
        </Card>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить KPI</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField select label="Сотрудник" name="employee_id" value={form.employee_id} onChange={handleFormChange} fullWidth required>
            {employees.map(e => (
              <MenuItem key={e.employee_id} value={e.employee_id}>{e.name}</MenuItem>
            ))}
          </TextField>
          <TextField label="Период (YYYY-MM)" name="period" value={form.period} onChange={handleFormChange} fullWidth required />
          <TextField select label="Тип показателя" name="kpi_type_id" value={form.kpi_type_id} onChange={handleFormChange} fullWidth required>
            {kpiTypes.map(t => (
              <MenuItem key={t.kpi_type_id} value={t.kpi_type_id}>{t.name}</MenuItem>
            ))}
          </TextField>
          <TextField label="Значение" name="value" type="number" value={form.value} onChange={handleFormChange} fullWidth required />
          <TextField label="Комментарий" name="comment" value={form.comment} onChange={handleFormChange} fullWidth multiline minRows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleAddKpi} variant="contained">Добавить</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}