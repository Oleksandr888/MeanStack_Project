import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box } from '@material-ui/core';
import CustomMap from './CustomMap';


const MapDialog=(props)=> {

  return (
    <div>
      
      <Dialog open={props.open} onClose={props.close} fullWidth maxWidth="md">
            <DialogContent>
                <Box width="100%" height="500px">                          
                    <CustomMap 
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&language=EN&key=
                        ${process.env.REACT_APP_GOOGLE_KEY}`}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </Box>
            </DialogContent>
      </Dialog>
    </div>
  );
  }

export default MapDialog;