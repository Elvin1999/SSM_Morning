import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    Toolbar,
    Typography,
  } from '@mui/material';
  
  import LogoutIcon from '@mui/icons-material/Logout';
  
  import { useAuthStore } from '../features/auth/store/authStore';
  import { logout as logoutRequest } from '../features/auth/api/authApi';
  
  export default function FeedPage() {
    const user = useAuthStore((state) => state.user);
  
    const refreshToken = useAuthStore(
      (state) => state.refreshToken
    );
  
    const logout = useAuthStore(
      (state) => state.logout
    );
  
    async function handleLogout() {
      try {
        if (refreshToken) {
          await logoutRequest(refreshToken);
        }
      } finally {
        logout();
      }
    }
  
    return (
      <>
        <AppBar position="sticky">
          <Toolbar>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ flexGrow: 1 }}
            >
              SMM
            </Typography>
  
            <Avatar sx={{ mr: 1 }}>
              {user?.firstName?.[0]}
            </Avatar>
  
            <Typography sx={{ mr: 2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
  
            <IconButton
              color="inherit"
              onClick={handleLogout}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
  
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <Typography variant="h5">
              Welcome, {user?.firstName}
            </Typography>
  
            <Typography color="text.secondary">
              Feed will be here.
            </Typography>
          </Box>
        </Container>
      </>
    );
  }