import { useState } from 'react';
import {
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { UserInfo } from '@/types/auth';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export interface UserLookupProps {
  // Define any props needed for the UserLookup component
  Label: string;
  items: UserInfo[];
  onSelect?: (userId: string) => void;
  multiple?: boolean;
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function UserLookup({
  Label,
  items,
  onSelect,
  multiple = false,
}: UserLookupProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const value = event.target.value;

    if (multiple) {
      const ids = typeof value === 'string' ? value.split(',') : value;
      setSelectedUserIds(ids);
      // For multiple selection, call onSelect with first selected (or handle differently)
      if (ids.length > 0) {
        onSelect?.(ids[0]);
      }
    } else {
      const userId = value as string;
      setSelectedUserId(userId);
      onSelect?.(userId);
    }
  };

  return (
    <>
      <Typography variant='body1' fontWeight={500}>
        {Label}
      </Typography>
      <Select
        id='users-lookup'
        multiple={multiple}
        value={multiple ? selectedUserIds : selectedUserId}
        onChange={handleChange}
        input={<OutlinedInput label={Label} />}
        renderValue={(selected) => {
          if (multiple) {
            const ids = selected as string[];
            return ids
              .map((id) => items.find((u) => u.userId === id)?.fullName)
              .filter(Boolean)
              .join(', ');
          } else {
            const user = items.find((u) => u.userId === selected);
            return user?.fullName || '';
          }
        }}
        displayEmpty
        MenuProps={MenuProps}
        fullWidth
      >
        {!multiple && (
          <MenuItem value=''>
            <em>Select a user</em>
          </MenuItem>
        )}
        {items.map((user) => (
          <MenuItem key={user.userId} value={user.userId}>
            {multiple && (
              <Checkbox checked={selectedUserIds.includes(user.userId)} />
            )}
            <ListItemText primary={user.fullName} secondary={user.email} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
