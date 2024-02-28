import { Avatar, Box, Icon, IconButton } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useState } from "react";
import { IUser, sigOutEndpoint } from "../backend/backend";

interface IUserMenuProps {
  onSignOut: () => void;
  user: IUser;
}

export function UserMenu(props: IUserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function signOut() {
    sigOutEndpoint();
    props.onSignOut();
  }

  return(
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>

      <Menu 
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box sx={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid rgba(224, 224, 224)" }}>
          <Avatar sx={{ margin: "auto" }}>
            <Icon>person</Icon>
          </Avatar>
          <div>{props.user.name}</div>
          <div>{props.user.email}</div>
        </Box>
        <MenuItem onClick={signOut}>Sair</MenuItem>
      </Menu>
    </div>
  )
}