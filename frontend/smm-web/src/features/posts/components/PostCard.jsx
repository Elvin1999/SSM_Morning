import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Paper,
    Typography,
  } from '@mui/material';
  
  import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
  import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
  import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
  import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
  import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
  
  import {
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query';
  
  import {
    likePost,
    unlikePost,
  } from '../api/postsApi';
  
  export default function PostCard({ post }) {
    const queryClient = useQueryClient();
  
    const likeMutation = useMutation({
      mutationFn: () =>
        post.isLikedByCurrentUser
          ? unlikePost(post.id)
          : likePost(post.id),
  
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ['posts'],
        });
  
        const previous =
          queryClient.getQueryData(['posts']);
  
        queryClient.setQueryData(
          ['posts'],
          (old) => {
            if (!old) {
              return old;
            }
  
            return {
              ...old,
  
              items: old.items.map((item) =>
                item.id === post.id
                  ? {
                      ...item,
                      isLikedByCurrentUser:
                        !item.isLikedByCurrentUser,
  
                      likeCount:
                        item.likeCount +
                        (item.isLikedByCurrentUser
                          ? -1
                          : 1),
                    }
                  : item
              ),
            };
          }
        );
  
        return { previous };
      },
  
      onError: (_error, _variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(
            ['posts'],
            context.previous
          );
        }
      },
  
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
      },
    });
  
    return (
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow:
            '0 12px 40px rgba(15, 23, 42, 0.07)',
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={post.profileImageUrl || undefined}
              sx={{
                width: 46,
                height: 46,
                mr: 1.5,
                fontWeight: 700,
              }}
            >
              {post.firstName?.[0]}
            </Avatar>
  
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                fontWeight={750}
                lineHeight={1.25}
              >
                {post.firstName} {post.lastName}
              </Typography>
  
              <Typography
                variant="body2"
                color="text.secondary"
              >
                @{post.userName}
              </Typography>
            </Box>
  
            <IconButton>
              <MoreHorizRoundedIcon />
            </IconButton>
          </Box>
  
          {post.content && (
            <Typography
              sx={{
                mt: 2,
                whiteSpace: 'pre-wrap',
                fontSize: 15.5,
                lineHeight: 1.7,
              }}
            >
              {post.content}
            </Typography>
          )}
        </Box>
  
        {post.imageUrl && (
          <Box
            component="img"
            src={post.imageUrl}
            alt=""
            sx={{
              width: '100%',
              maxHeight: 620,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}
  
        <Box sx={{ px: 2.5, pt: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {post.likeCount} likes
            </Typography>
  
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {post.commentCount} comments
            </Typography>
          </Box>
  
          <Divider sx={{ my: 1.2 }} />
  
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
            }}
          >
            <Box
              onClick={() =>
                !likeMutation.isPending &&
                likeMutation.mutate()
              }
              sx={{
                cursor: 'pointer',
                py: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.8,
                borderRadius: 2,
                transition: '0.2s ease',
  
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {post.isLikedByCurrentUser ? (
                <FavoriteRoundedIcon color="error" />
              ) : (
                <FavoriteBorderRoundedIcon />
              )}
  
              <Typography
                fontWeight={650}
                variant="body2"
              >
                Like
              </Typography>
            </Box>
  
            <Box
              sx={{
                cursor: 'pointer',
                py: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.8,
                borderRadius: 2,
  
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ChatBubbleOutlineRoundedIcon />
  
              <Typography
                fontWeight={650}
                variant="body2"
              >
                Comment
              </Typography>
            </Box>
  
            <Box
              sx={{
                cursor: 'pointer',
                py: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.8,
                borderRadius: 2,
  
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ShareOutlinedIcon />
  
              <Typography
                fontWeight={650}
                variant="body2"
              >
                Share
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }