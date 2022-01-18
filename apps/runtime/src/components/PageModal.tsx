import * as React from 'react'

import Draggable from 'react-draggable'

import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper, { PaperProps } from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

function DraggableComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2, height: '48px', cursor: 'move' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 4,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

interface PageModalProperty {
  title?: string
  children?: JSX.Element | JSX.Element[] | null
}

const PageModal = function (props: PageModalProperty) {
  const [open, setOpen] = React.useState(true)
  const handleClose = () => {
    setOpen(false)
  }
  if (!open) {
    return null
  }
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        maxWidth={false}
        PaperComponent={DraggableComponent}
        aria-labelledby="draggable-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="draggable-dialog-title" onClose={handleClose}>
          <h4
            style={{ lineHeight: '100%', fontSize: '16px', fontWeight: 'bold' }}
          >
            {props.title ? props.title : ''}
          </h4>
        </BootstrapDialogTitle>
        <DialogContent
          sx={{
            width: '960px',
            height: '600px'
          }}
          dividers
        >
          {props.children}
        </DialogContent>
      </BootstrapDialog>
    </div>
  )
}

export default PageModal
