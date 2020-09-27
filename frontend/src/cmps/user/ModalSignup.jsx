import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Signup } from './Signup'

export function ModalSignup() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="modal-signup">
      <div variant="outlined" color="primary" onClick={handleClickOpen}>
        Signup
      </div>
      <Dialog 
        open={open}
        onClose={handleClose}
      >
        <DialogTitle >
          Signup
        </DialogTitle>
        <DialogContent>
          <Signup handleClose={handleClose}/>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  );
}
