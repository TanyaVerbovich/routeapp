import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container } from "@mui/material";
import Button from '@mui/material/Button';
import { Box, TextField } from "@mui/material";
import Typography from '@mui/material/Typography';
import { height } from '@mui/system';

export default function MediaCard() {
  return (
    <Container>
    <Box
    component="form1"
    sx={{
      display: "flex",
      flexDirection: "column",
      align: "center",
      m: 10,
      pt: 5,
      pr: 5,
      pl: 5
    }}
  >   
      <CardMedia
        component="img"
        height="200"
        src={require('./1.jpg')}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          For customers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You can public your order offer via preparing  csv file with information about your order. 
          The example of such file you can see above. Could you please create this file exactly in such format, that means using comma as delimiter of columns 
          and write information about name, weigth and number of items of your order. When you will add necessary information about the order 
          the price of such order will appear at the page and you can confirm the order if everything about the order is suitable for you.
          Also, please time should be written in format "DD/MM/YYYY HH:MM", addressFrom and addressTo should be written in formats "Town Street house building of the house(optional) flat"
        </Typography>
      </CardContent>
    </Box>
   </Container>
  );
}
