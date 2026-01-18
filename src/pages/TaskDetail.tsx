import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  CheckCircle,
  Block,
  MoreVert,
  Timer,
} from '@mui/icons-material';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { taskApi } from '@/api/tasks';
import { getErrorMessage } from '@/api/client';
import type { Task } from '@/types/project';
import { format, differenceInDays } from 'date-fns';

export default function TaskDetailPage() {
  const { id, taskId } = useParams<{ id: string; taskId: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Action Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Dialogs
  const [logTimeOpen, setLogTimeOpen] = useState(false);
  const [hours, setHours] = useState('');
  const [blockReasonOpen, setBlockReasonOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      const data = await taskApi.getById(taskId);
      setTask(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleStart = async () => {
    if (!task) return;
    
    try {
      setActionLoading(true);
      await taskApi.start(task.id);
      handleActionClose();
      await loadTask();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!task) return;
    
    try {
      setActionLoading(true);
      await taskApi.complete(task.id);
      handleActionClose();
      await loadTask();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogTime = async () => {
    if (!task || !hours) return;
    
    try {
      setActionLoading(true);
      await taskApi.logTime(task.id, parseFloat(hours));
      setLogTimeOpen(false);
      setHours('');
      await loadTask();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!task || !blockReason) return;
    
    try {
      setActionLoading(true);
      await taskApi.block(task.id, blockReason);
      setBlockReasonOpen(false);
      setBlockReason('');
      handleActionClose();
      await loadTask();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async () => {
    if (!task) return;
    
    try {
      setActionLoading(true);
      await taskApi.unblock(task.id);
      handleActionClose();
      await loadTask();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const getDaysUntilDue = () => {
    if (!task?.dueDate) return null;
    return differenceInDays(new Date(task.dueDate), new Date());
  };

  const getHoursProgress = () => {
    if (!task?.estimatedHours || task.estimatedHours === 0) return 0;
    return Math.round(((task.actualHours || 0) / task.estimatedHours) * 100);
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

  if (error && !task) {
    return (
      <AppLayout>
        <Alert severity="error">{error}</Alert>
      </AppLayout>
    );
  }

  if (!task) {
    return (
      <AppLayout>
        <Alert severity="error">Task not found</Alert>
      </AppLayout>
    );
  }

  const daysUntilDue = getDaysUntilDue();
  const hoursProgress = getHoursProgress();

  return (
    <>
      <title>{task.title} - Task - APEX</title>
      <AppLayout>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <IconButton onClick={() => navigate(`/projects/${task.projectId}/tasks`)}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={700}>
                {task.title}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} ml={7}>
              <StatusBadge status={task.status} size="small" />
              <Chip
                label={task.priority}
                size="small"
                color={
                  task.priority === 'Urgent'
                    ? 'error'
                    : task.priority === 'High'
                    ? 'warning'
                    : 'default'
                }
              />
            </Box>
          </Box>
          
          <IconButton onClick={handleActionClick} disabled={actionLoading}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Time Tracking Overview */}
        {task.estimatedHours && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Time Progress
                  </Typography>
                  <Box display="flex" alignItems="baseline" gap={1}>
                    <Typography variant="h4" fontWeight={700}>
                      {task.actualHours || 0}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      / {task.estimatedHours}h
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(hoursProgress, 100)}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color={hoursProgress > 100 ? 'error' : 'primary'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {hoursProgress}% of estimated time
                  </Typography>
                </Grid>

                {daysUntilDue !== null && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Time Until Due
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color={daysUntilDue < 0 ? 'error' : daysUntilDue < 3 ? 'warning.main' : 'inherit'}
                    >
                      {Math.abs(daysUntilDue)} days
                    </Typography>
                    {daysUntilDue < 0 && (
                      <Typography variant="caption" color="error">
                        Overdue
                      </Typography>
                    )}
                  </Grid>
                )}

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Actions
                  </Typography>
                  <Button
                    startIcon={<Timer />}
                    size="small"
                    onClick={() => setLogTimeOpen(true)}
                    disabled={task.status !== 'InProgress'}
                  >
                    Log Time
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Description */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {task.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Blocked Reason */}
            {task.blockedReason && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Blocked
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.50' }}>
                    <Typography variant="body2">{task.blockedReason}</Typography>
                    {task.blockedDate && (
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Since {format(new Date(task.blockedDate), 'MMM d, yyyy h:mm a')}
                      </Typography>
                    )}
                  </Paper>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Assigned To */}
            {task.assignedToUser && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Assigned To
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {task.assignedToUser?.fullName?.[0] || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {task.assignedToUser?.fullName || 'Unknown User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.assignedToUser?.email}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Created By */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created By
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 48, height: 48 }}>
                    {task.createdByUser?.fullName?.[0] || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {task.createdByUser?.fullName || 'Unknown User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.createdByUser?.email}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Details
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Priority
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {task.priority}
                    </Typography>
                  </Box>

                  <Divider />

                  {task.dueDate && (
                    <>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                      <Divider />
                    </>
                  )}

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {format(new Date(task.createdDate), 'MMM d, yyyy h:mm a')}
                    </Typography>
                  </Box>

                  {task.startedDate && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Started
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(task.startedDate), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Box>
                    </>
                  )}

                  {task.completedDate && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(task.completedDate), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleActionClose}
        >
          {task.status === 'NotStarted' && (
            <MenuItem onClick={handleStart}>
              <PlayArrow fontSize="small" sx={{ mr: 1 }} />
              Start Task
            </MenuItem>
          )}
          {task.status === 'InProgress' && [
            <MenuItem key="complete" onClick={handleComplete}>
              <CheckCircle fontSize="small" sx={{ mr: 1 }} />
              Complete
            </MenuItem>,
            <MenuItem
              key="block"
              onClick={() => {
                handleActionClose();
                setBlockReasonOpen(true);
              }}
            >
              <Block fontSize="small" sx={{ mr: 1 }} />
              Block Task
            </MenuItem>,
          ]}
          {task.status === 'Blocked' && (
            <MenuItem onClick={handleUnblock}>
              <PlayArrow fontSize="small" sx={{ mr: 1 }} />
              Unblock
            </MenuItem>
          )}
        </Menu>

        {/* Log Time Dialog */}
        <Dialog open={logTimeOpen} onClose={() => !actionLoading && setLogTimeOpen(false)}>
          <DialogTitle>Log Time</DialogTitle>
          <DialogContent>
            <TextField
              label="Hours"
              type="number"
              fullWidth
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              sx={{ mt: 2 }}
              inputProps={{ min: 0.5, step: 0.5 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogTimeOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleLogTime}
              disabled={actionLoading || !hours}
            >
              {actionLoading ? 'Logging...' : 'Log Time'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Block Reason Dialog */}
        <Dialog
          open={blockReasonOpen}
          onClose={() => !actionLoading && setBlockReasonOpen(false)}
        >
          <DialogTitle>Block Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Reason"
              multiline
              rows={3}
              fullWidth
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockReasonOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleBlock}
              disabled={actionLoading || !blockReason}
            >
              {actionLoading ? 'Blocking...' : 'Block Task'}
            </Button>
          </DialogActions>
        </Dialog>
      </AppLayout>
    </>
  );
}
