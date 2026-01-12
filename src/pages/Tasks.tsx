import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Add, PlayArrow, CheckCircle, Block, DetailsRounded } from '@mui/icons-material';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { taskApi } from '@/api/tasks';
import { getErrorMessage } from '@/api/client';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/project';
import { SideDrawer } from '@/components/common/SideDrawer';

export default function TasksPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  // const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  
  // Create Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    priority: 'Medium',
  });
  const [taskData, setTaskData] = useState<UpdateTaskRequest>({
    title: '',
    description: '',
    status: 'NotStarted',
    priority: 'Medium',

  });

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId]);

  const loadTasks = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const data = await taskApi.getByProject(projectId);
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadTask = async (taskId: string) => {
    try {
      const data = await taskApi.getById(taskId);
      setTaskData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCreate = async () => {
    if (!projectId) return;
    try {
      setCreateLoading(true);
      await taskApi.create(projectId, formData);
      setCreateDialogOpen(false);
      setFormData({ title: '', description: '', priority: 'Medium' });
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStart = async (taskId: string) => {
    try {
      await taskApi.start(taskId);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await taskApi.complete(taskId);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDetails = (taskId: string) => {
    setSideDrawerOpen(true);
    loadTask(taskId);
  };

  const groupedTasks = {
    notStarted: tasks.filter((t) => t.status === 'NotStarted'),
    inProgress: tasks.filter((t) => t.status === 'InProgress'),
    blocked: tasks.filter((t) => t.status === 'Blocked'),
    completed: tasks.filter((t) => t.status === 'Completed'),
  };

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  return (
    <>
      <title>Tasks - APEX</title>
      <AppLayout>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Project Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tasks.length} tasks total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Kanban Board */}
      <Grid container spacing={2}>
        {/* Not Started */}
        <Grid  size={{ xs: 12, md: 3 }}>
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Not Started ({groupedTasks.notStarted.length})
            </Typography>
            {groupedTasks.notStarted.map((task) => (
              <Card key={task.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Box mt={1}>
                    <Chip label={task.priority} size="small" />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center', // Optional: Aligns items vertically in the center
                      width: '100%', // Optional: Ensures the box takes full width to show spacing effect
                      border: 'none', // Optional: for visualization
                      padding: '10px'
                    }}
                  >
                    <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleStart(task.id)}
                        sx={{ mt: 1 }}
                      >
                        Start
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DetailsRounded />}
                        onClick={() => handleDetails(task.id)}
                        sx={{ mt: 1, ml: 1 }}
                      >
                      Details
                      </Button>
                    </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* In Progress */}
        <Grid  size={{ xs: 12, md: 3 }}>
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              In Progress ({groupedTasks.inProgress.length})
            </Typography>
            {groupedTasks.inProgress.map((task) => (
              <Card key={task.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {task.assignedToUserName || 'Unassigned'}
                  </Typography>
                  <Box mt={1}>
                    <Typography variant="caption">
                      {task.actualHours}h logged
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => handleComplete(task.id)}
                    sx={{ mt: 1 }}
                  >
                    Complete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Blocked */}
        <Grid  size={{ xs: 12, md: 3 }}>
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Blocked ({groupedTasks.blocked.length})
            </Typography>
            {groupedTasks.blocked.map((task) => (
              <Card key={task.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {task.title}
                  </Typography>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    <Typography variant="caption">{task.blockedReason}</Typography>
                  </Alert>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Completed */}
        <Grid  size={{ xs: 12, md: 3 }}>
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Completed ({groupedTasks.completed.length})
            </Typography>
            {groupedTasks.completed.map((task) => (
              <Card key={task.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {task.actualHours}h total
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
        
        <SideDrawer open={sideDrawerOpen} onClose={() => setSideDrawerOpen(false)}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Task Details
            </Typography>
            <Divider sx={{ mb: 2, mt: 2 }} />
            <Typography variant="body1">
              Detailed information about the task will be displayed here.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Task Title
                </Typography>
                <TextField
                  label="Title"
                  fullWidth
                  required
                  value={taskData.title || ''}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  sx={{ mt: 2, mb: 2 }}
                />
              </Grid>
              <Grid size={ { xs: 4 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Priority
                </Typography>
                <TextField
                  label="Priority"
                  select
                  fullWidth
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  sx={{ mt: 2, mb: 2 }}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Status
                </Typography>
                <TextField
                  label="Status"
                  select
                  fullWidth
                  required
                  value={taskData.status}
                  onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                  sx={{ mt: 2, mb: 2 }}
                >
                  <MenuItem value="NotStarted">Not Started</MenuItem>
                  <MenuItem value="InProgress">In Progress</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Created Date
                </Typography>
                <TextField
                  label="Created Date"
                  type="date"
                  fullWidth
                  value={taskData.createdDate || ''}
                  onChange={(e) => setTaskData({ ...taskData, createdDate: e.target.value })}
                  sx={{ mt: 2, mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Description
                </Typography>
                <TextField
                  label="Description"
                  fullWidth
                  required
                  multiline
                  rows={5}
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  sx={{ mt: 2, mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </SideDrawer>


      {/* Create Task Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Priority"
            select
            fullWidth
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.title}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
    </>
  );
}
