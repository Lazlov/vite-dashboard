import React from 'react';
import { Box, Grid, Typography, Link, List, ListItem } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'inherit', 
        position: 'fixed',
        bottom: 0,
        padding: '0px 0px 10px 0px',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)', 
      }}
      component="footer"
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ marginBottom: 1 }}
      >
        <Typography variant="body1" color="textSecondary" textAlign="center">
          MERN project 2024
        </Typography>
      </Grid>

      {/* Icon Section */}
      <Grid container justifyContent="center" alignItems="center">
        <List sx={{ display: 'flex' }}>
          <ListItem>
            <Link href="#" color="inherit">
              <EmailIcon />
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#" color="inherit">
              <LinkedInIcon />
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#" color="inherit">
              <GitHubIcon />
            </Link>
          </ListItem>
        </List>
      </Grid>
    </Box>
  );
};