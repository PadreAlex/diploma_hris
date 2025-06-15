'use client';

import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';

import { HiringFlowChart } from '@/components/dashboard/hiring/HiringFlowChart';

// Mock data for departments, positions, users
const departments = [
  { dept_id: 'd1', name: 'ИТ' },
  { dept_id: 'd2', name: 'HR' },
  { dept_id: 'd3', name: 'Финансы' },
];
const positions = [
  { position_id: 'p1', name: 'Frontend разработчик' },
  { position_id: 'p2', name: 'HR менеджер' },
  { position_id: 'p3', name: 'Бухгалтер' },
];
const users = [
  { user_id: 'u1', name: 'Акакий Акакиевич' },
  { user_id: 'u2', name: 'Анна Новикова' },
  { user_id: 'u3', name: 'Джарлакс Бэнр' },
];

// Types
interface Candidate {
  id: string;
  name: string;
  phone: string;
  email: string;
  work_experience: string;
  status: string;
  interview_date: string;
  pdf: File | null;
  pdfUrl: string;
  plainText: string;
}

interface Vacancy {
  vacancy_id: string;
  title: string;
  dept_id: string;
  position_id: string;
  requirements: string;
  status: string;
  date_opened: string;
  date_closed: string;
  created_by: string;
  salary_range: string;
  location: string;
  candidates: Candidate[];
}

const initialVacancies: Vacancy[] = [
  {
    vacancy_id: uuidv4(),
    title: 'Frontend разработчик',
    dept_id: 'd1',
    position_id: 'p1',
    requirements: 'React, TypeScript, опыт от 2 лет',
    status: 'OPEN',
    date_opened: '2024-05-01',
    date_closed: '',
    created_by: 'u1',
    salary_range: '150 000 - 200 000 ₽',
    location: 'Москва',
    candidates: [],
  },
  {
    vacancy_id: uuidv4(),
    title: 'HR менеджер',
    dept_id: 'd2',
    position_id: 'p2',
    requirements: 'Опыт работы в HR от 1 года',
    status: 'OPEN',
    date_opened: '2024-04-15',
    date_closed: '',
    created_by: 'u2',
    salary_range: '80 000 - 120 000 ₽',
    location: 'Санкт-Петербург',
    candidates: [],
  },
  {
    vacancy_id: uuidv4(),
    title: 'Бухгалтер',
    dept_id: 'd3',
    position_id: 'p3',
    requirements: 'Знание 1С, опыт от 3 лет',
    status: 'ON_HOLD',
    date_opened: '2024-03-20',
    date_closed: '',
    created_by: 'u3',
    salary_range: '100 000 - 140 000 ₽',
    location: 'Екатеринбург',
    candidates: [],
  },
];

const candidateStatuses = [
  { value: 'viewed', label: 'Просмотрен' },
  { value: 'analyzed', label: 'Проанализирован' },
  { value: 'interview', label: 'Интервью' },
  { value: 'hired', label: 'Принят' },
];

export default function HiringPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [vacancies, setVacancies] = React.useState<Vacancy[]>(initialVacancies);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [tab, setTab] = React.useState(0);
  const [form, setForm] = React.useState<Vacancy>({
    vacancy_id: '',
    title: '',
    dept_id: '',
    position_id: '',
    requirements: '',
    status: 'OPEN',
    date_opened: '',
    date_closed: '',
    created_by: '',
    salary_range: '',
    location: '',
    candidates: [],
  });
  // Candidate form state
  const [candidateForm, setCandidateForm] = React.useState<Candidate>({
    id: '',
    name: '',
    phone: '',
    email: '',
    work_experience: '',
    status: 'viewed',
    interview_date: '',
    pdf: null,
    pdfUrl: '',
    plainText: '',
  });
  const [candidateDialog, setCandidateDialog] = React.useState(false);
  const [pdfViewUrl, setPdfViewUrl] = React.useState('');
  const [aiAnalysisDialog, setAiAnalysisDialog] = React.useState(false);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedVacancies = vacancies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Dialog open/close
  const handleOpenDialog = () => {
    setEditIndex(null);
    setForm({
      vacancy_id: '',
      title: '',
      dept_id: '',
      position_id: '',
      requirements: '',
      status: 'OPEN',
      date_opened: '',
      date_closed: '',
      created_by: '',
      salary_range: '',
      location: '',
      candidates: [],
    });
    setTab(0);
    setOpenDialog(true);
  };
  const handleEditDialog = (idx: number) => {
    setEditIndex(idx);
    setForm({ ...vacancies[idx] });
    setTab(0);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  // Form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save vacancy (add or edit)
  const handleSaveVacancy = () => {
    if (editIndex !== null) {
      // Edit
      setVacancies(vacancies.map((v, i) => (i === editIndex ? { ...form } : v)));
    } else {
      // Add
      setVacancies([...vacancies, { ...form, vacancy_id: uuidv4(), candidates: [] }]);
    }
    setOpenDialog(false);
  };

  // Candidate dialog
  const handleOpenCandidateDialog = () => {
    setCandidateForm({
      id: '',
      name: '',
      phone: '',
      email: '',
      work_experience: '',
      status: 'viewed',
      interview_date: '',
      pdf: null,
      pdfUrl: '',
      plainText: '',
    });
    setCandidateDialog(true);
  };
  const handleCloseCandidateDialog = () => setCandidateDialog(false);

  // Candidate form change
  const handleCandidateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCandidateForm({ ...candidateForm, [e.target.name]: e.target.value });
  };
  const handleCandidatePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCandidateForm((prev) => ({ ...prev, pdf: file, pdfUrl: URL.createObjectURL(file) }));
    }
  };

  // Add candidate to vacancy
  const handleAddCandidate = () => {
    const newCandidate = { ...candidateForm, id: uuidv4() };
    setForm({ ...form, candidates: [...(form.candidates || []), newCandidate] });
    setCandidateDialog(false);
  };

  // PDF view
  const handleViewPdf = (url: string) => setPdfViewUrl(url);
  const handleClosePdfView = () => setPdfViewUrl('');

  // Tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  const handleOpenAiAnalysis = () => setAiAnalysisDialog(true);
  const handleCloseAiAnalysis = () => setAiAnalysisDialog(false);

  return (
    <Stack spacing={4} sx={{ mt: 4 }}>
      <Typography variant="h4">Управление наймом и адаптацией</Typography>
      <HiringFlowChart />
      <Card sx={{ mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
          <Typography variant="h6">Вакансии</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenDialog} startIcon={<AddIcon />}>
            Добавить вакансию
          </Button>
        </Stack>
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Идентификатор</TableCell>
                <TableCell>Название вакансии</TableCell>
                <TableCell>Отдел</TableCell>
                <TableCell>Должность</TableCell>
                <TableCell>Требования</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата открытия</TableCell>
                <TableCell>Дата закрытия</TableCell>
                <TableCell>Создано пользователем</TableCell>
                <TableCell>Диапазон зарплат</TableCell>
                <TableCell>Местоположение</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVacancies.map((vacancy, idx) => (
                <TableRow key={vacancy.vacancy_id}>
                  <TableCell>{vacancy.vacancy_id}</TableCell>
                  <TableCell>{vacancy.title}</TableCell>
                  <TableCell>{departments.find((d) => d.dept_id === vacancy.dept_id)?.name || ''}</TableCell>
                  <TableCell>{positions.find((p) => p.position_id === vacancy.position_id)?.name || ''}</TableCell>
                  <TableCell>{vacancy.requirements}</TableCell>
                  <TableCell>{vacancy.status}</TableCell>
                  <TableCell>{vacancy.date_opened}</TableCell>
                  <TableCell>{vacancy.date_closed}</TableCell>
                  <TableCell>{users.find((u) => u.user_id === vacancy.created_by)?.name || ''}</TableCell>
                  <TableCell>{vacancy.salary_range}</TableCell>
                  <TableCell>{vacancy.location}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditDialog(idx)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={vacancies.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      {/* Vacancy Dialog (Add/Edit) */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Редактировать вакансию' : 'Добавить вакансию'}</DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Основная информация" />
            <Tab label="Кандидаты" disabled={editIndex === null} />
          </Tabs>
          {tab === 0 && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Название вакансии"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                fullWidth
                required
              />
              <TextField
                select
                label="Отдел"
                name="dept_id"
                value={form.dept_id}
                onChange={handleFormChange}
                fullWidth
                required
              >
                {departments.map((d) => (
                  <MenuItem key={d.dept_id} value={d.dept_id}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Должность"
                name="position_id"
                value={form.position_id}
                onChange={handleFormChange}
                fullWidth
                required
              >
                {positions.map((p) => (
                  <MenuItem key={p.position_id} value={p.position_id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Требования"
                name="requirements"
                value={form.requirements}
                onChange={handleFormChange}
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                select
                label="Статус"
                name="status"
                value={form.status}
                onChange={handleFormChange}
                fullWidth
                required
              >
                <MenuItem value="OPEN">Открыта</MenuItem>
                <MenuItem value="CLOSED">Закрыта</MenuItem>
                <MenuItem value="ON_HOLD">На паузе</MenuItem>
              </TextField>
              <TextField
                label="Дата открытия"
                name="date_opened"
                type="date"
                value={form.date_opened}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Дата закрытия"
                name="date_closed"
                type="date"
                value={form.date_closed}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Создано пользователем"
                name="created_by"
                value={form.created_by}
                onChange={handleFormChange}
                fullWidth
              >
                {users.map((u) => (
                  <MenuItem key={u.user_id} value={u.user_id}>
                    {u.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Диапазон зарплат"
                name="salary_range"
                value={form.salary_range}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                label="Местоположение"
                name="location"
                value={form.location}
                onChange={handleFormChange}
                fullWidth
              />
            </Stack>
          )}
          {tab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Кандидаты</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCandidateDialog}>
                  Добавить кандидата
                </Button>
              </Stack>
              {(form.candidates || []).length === 0 && <Typography color="text.secondary">Нет кандидатов</Typography>}
              <Stack spacing={2}>
                {(form.candidates || []).map((cand, idx) => (
                  <Paper key={cand.id} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle1">{cand.name}</Typography>
                      <Typography color="text.secondary">{cand.email}</Typography>
                      <Typography color="text.secondary">{cand.phone}</Typography>
                      <Typography color="text.secondary">{cand.work_experience}</Typography>
                      <Typography color="text.secondary">
                        {candidateStatuses.find((s) => s.value === cand.status)?.label}
                      </Typography>
                      {cand.status === 'interview' && cand.interview_date && (
                        <Typography color="text.secondary">Интервью: {cand.interview_date}</Typography>
                      )}
                      {cand.pdfUrl && (
                        <Button size="small" onClick={() => handleViewPdf(cand.pdfUrl)}>
                          PDF
                        </Button>
                      )}

                      <Button size="small" onClick={handleOpenAiAnalysis}>
                        AI-анализ
                      </Button>
                    </Stack>
                    {cand.plainText && <Typography variant="body2">{cand.plainText}</Typography>}
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSaveVacancy} variant="contained">
            {editIndex !== null ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Candidate Dialog */}
      <Dialog open={candidateDialog} onClose={handleCloseCandidateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить кандидата</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Имя"
            name="name"
            value={candidateForm.name}
            onChange={handleCandidateFormChange}
            fullWidth
            required
          />
          <TextField
            label="Телефон"
            name="phone"
            value={candidateForm.phone}
            onChange={handleCandidateFormChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={candidateForm.email}
            onChange={handleCandidateFormChange}
            fullWidth
          />
          <TextField
            label="Опыт работы"
            name="work_experience"
            value={candidateForm.work_experience}
            onChange={handleCandidateFormChange}
            fullWidth
          />
          <TextField
            select
            label="Статус"
            name="status"
            value={candidateForm.status}
            onChange={handleCandidateFormChange}
            fullWidth
          >
            {candidateStatuses.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
          {candidateForm.status === 'interview' && (
            <TextField
              label="Дата интервью"
              name="interview_date"
              type="date"
              value={candidateForm.interview_date}
              onChange={handleCandidateFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          )}
          <TextField
            label="Информация (текст)"
            name="plainText"
            value={candidateForm.plainText}
            onChange={handleCandidateFormChange}
            fullWidth
            multiline
            minRows={2}
          />
          <Button variant="outlined" component="label">
            Загрузить PDF
            <input type="file" accept="application/pdf" hidden onChange={handleCandidatePdfChange} />
          </Button>
          {candidateForm.pdfUrl && <Typography color="primary">PDF загружен</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCandidateDialog}>Отмена</Button>
          <Button onClick={handleAddCandidate} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
      {/* PDF Viewer Dialog (placeholder) */}
      <Dialog open={!!pdfViewUrl} onClose={handleClosePdfView} maxWidth="md" fullWidth>
        <DialogTitle>Просмотр PDF</DialogTitle>
        <DialogContent>
          {/* PDF Viewer placeholder. To enable, install react-pdf and use Document/Page components. */}
          {pdfViewUrl ? (
            <iframe src={pdfViewUrl} title="PDF" width="100%" height="600px" style={{ border: 0 }} />
          ) : (
            <Typography>PDF не выбран</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdfView}>Закрыть</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={aiAnalysisDialog} onClose={handleCloseAiAnalysis} maxWidth="sm" fullWidth>
        <DialogTitle>AI-анализ кандидата</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Общий анализ — 89%
          </Typography>
          <Typography variant="body2" gutterBottom>
            Оценка скилов — 70% соответствия вакансии
          </Typography>
          <Typography variant="body2" gutterBottom>
            Коммуникативные навыки — 82%
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Сильные стороны:</b> большой опыт работы с необходимой технологией (TypeScript, React), знание библиотек
            (Redux, Material-UI), написание высоконагруженных сервисов и баз данных.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <b>Слабые стороны:</b> нет высшего технического образования, частая смена компаний, нет упоминания работы с
            библиотекой pg.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAiAnalysis}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
