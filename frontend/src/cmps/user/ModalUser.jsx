// OUTSOURCE IMPORTS
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// LOCAL IMPORTS
import { Signup } from './Signup'
import { Login } from './Login'

export function ModalUser(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cmpMap = {
    Signup: Signup,
    Login: Login
  }

  const DynamicCmp = cmpMap[props.childern];
  if (!DynamicCmp) return <h1>Loading..</h1>
  return (
    <div className="modal-signup">
      <div variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.childern}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle >
        {props.childern}
        </DialogTitle>

        <DialogContent>
          <DynamicCmp handleClose={handleClose} />
        </DialogContent>

        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  );
}
