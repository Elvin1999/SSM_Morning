import { useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '../api/postsApi';
import { useAuthStore } from '../../auth/store/authStore';

export default function CreatePostCard() {
  const user = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  const [content, setContent] = useState('');

  const mutation = useMutation({
    mutationFn: createPost,

    onSuccess: () => {
      setContent('');

      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  function handleSubmit() {
    if (!content.trim()) {
      return;
    }

    mutation.mutate({
      content: content.trim(),
      imageUrl: null,
      videoUrl: null,
    });
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow:
          '0 10px 40px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        <Avatar
          sx={{
            width: 46,
            height: 46,
            fontWeight: 700,
          }}
        >
          {user?.firstName?.[0]}
        </Avatar>

        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={8}
          placeholder={`What's on your mind, ${user?.firstName ?? ''}?`}
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.default',
            },
          }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Photo">
            <IconButton>
              <ImageOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Video">
            <IconButton>
              <VideoLibraryOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Feeling">
            <IconButton>
              <SentimentSatisfiedAltOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Button
          variant="contained"
          disableElevation
          endIcon={<SendRoundedIcon />}
          disabled={
            !content.trim() ||
            mutation.isPending
          }
          onClick={handleSubmit}
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Post
        </Button>
      </Box>

      {mutation.isError && (
        <Typography
          color="error"
          variant="body2"
          mt={1.5}
        >
          Post could not be created.
        </Typography>
      )}
    </Paper>
  );
}