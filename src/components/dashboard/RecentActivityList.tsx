// src/components/dashboard/RecentActivityList.tsx

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/common/StatusBadge';

interface ActivityItem {
  id: string;
  title: string;
  status: string;
  date: string;
  type: 'change' | 'project' | 'task';
}

interface RecentActivityListProps {
  title: string;
  items: ActivityItem[];
  emptyMessage?: string;
}

export function RecentActivityList({
  title,
  items,
  emptyMessage = 'No recent activity',
}: RecentActivityListProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>

        {items.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {items.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider sx={{ my: 1 }} />}
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <StatusBadge status={item.status} size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(item.date), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
