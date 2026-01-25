import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { User } from '@/api/users';

interface UserListTableProps {
  users: User[];
  onEditUser: (user: User) => void;
}

export default function UserListTable({
  users,
  onEditUser,
}: UserListTableProps) {
  if (users.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
        No users found
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Last Login</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {user.fullName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {user.phoneNumber || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {user.roles.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {user.roles.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No roles
                    </Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell align="center">
                {user.isActive ? (
                  <Tooltip title="Active">
                    <CheckCircleIcon color="success" fontSize="small" />
                  </Tooltip>
                ) : (
                  <Tooltip title="Inactive">
                    <CancelIcon color="error" fontSize="small" />
                  </Tooltip>
                )}
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" color="text.secondary">
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleDateString()
                    : 'Never'}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Edit User">
                  <IconButton
                    size="small"
                    onClick={() => onEditUser(user)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
