import './App.css';
import {
  Box,
  Button, Chip, CircularProgress,
  Container, Divider, FormControl, IconButton, InputAdornment, InputLabel, Link, MenuItem, Modal, OutlinedInput,
  Paper, Select, Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Tooltip,
  Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import SearchIcon from '@mui/icons-material/Search';
import {useQuery} from "react-query";
import BreweryService from "./api/BreweryService";
import React, { useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WebIcon from '@mui/icons-material/Web';
import CloudOffIcon from '@mui/icons-material/CloudOff';

function App() {
  // Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailedBrewery, setDetailedBrewery] = useState();

  // API Filters
  const [cityFilter, setCityFilter] = useState();
  const [nameFilter, setNameFilter] = useState();
  const [typeFilter, setTypeFilter] = useState();

  const { data: breweries, isLoading } = useQuery(
      ["breweries", cityFilter, nameFilter, typeFilter],
      () => BreweryService.findAll(cityFilter, nameFilter, typeFilter),
      {
        // time until stale data is garbage collected
        cacheTime: 60 * 1000,
        // time until data becomes stale
        staleTime: 30 * 1000
        // and many more
      }
  );

  const handleOpenModal = (brewery) => {
      setDetailedBrewery(brewery);
      setIsDetailModalOpen(true);
  }

  return (
    <Container maxWidth="md">
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <Typography variant="h1" gutterBottom>
            Brewery Nerd
          </Typography>
          <Typography variant="h4" gutterBottom>
            Get to know your birras!
          </Typography>
        </Grid2>
        <Grid2 xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="city_input">Search for a brewery</InputLabel>
            <OutlinedInput
                id="city_input"
                type='text'
                value={cityFilter}
                placeholder='Write down a city name to start searching'
                onChange={(e) => setCityFilter(e.target.value)}
                aria-label='Search for a brewery'
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                label="Search for a brewery"
            />
          </FormControl>
        </Grid2>
        {
          cityFilter && (
            <>
              <Grid2 xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel
                      htmlFor="filter-by-name">
                    Filter by name
                  </InputLabel>
                  <OutlinedInput
                      id="filter-by-name"
                      type='text'
                      value={nameFilter}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setNameFilter(e.target.value)
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle password visibility"
                              // onClick={handleClickShowPassword}
                              edge="end"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Filter by name"
                  />
                </FormControl>
              </Grid2>
              <Grid2 xs={6}>
                <FormControl fullWidth>
                  <InputLabel
                      id="type-filter-label">
                    Filter by type
                  </InputLabel>
                  <Select
                      labelId="type-filter-label"
                      label="Filter by type"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)} >
                    <MenuItem value='micro'>micro</MenuItem>
                    <MenuItem value='nano'>nano</MenuItem>
                    <MenuItem value='regional'>regional</MenuItem>
                    <MenuItem value='brewpub'>brewpub</MenuItem>
                    <MenuItem value='large'>large</MenuItem>
                    <MenuItem value='planning'>planning</MenuItem>
                    <MenuItem value='bar'>bar</MenuItem>
                    <MenuItem value='contract'>contract</MenuItem>
                    <MenuItem value='proprietor'>proprietor</MenuItem>
                    <MenuItem value='closed'>closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              {/*Loading list*/}
              {
                isLoading && (
                  <Grid2
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ width: '100%' }}
                  >
                    <Grid2 item xs={1}>
                      <CircularProgress />
                    </Grid2>
                    <Grid2 item xs={12}>
                      <Typography variant="h5" align='center' gutterBottom>
                        Searching for cool breweries...
                      </Typography>
                    </Grid2>
                  </Grid2>
                )
              }
              {/*Empty list*/}
              {
                !isLoading && (!breweries || !breweries?.length) && (
                  <Grid2
                      container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      style={{ width: '100%' }}
                  >
                      <Grid2 item xs={1}>
                          <Tooltip title="Empty list">
                              <IconButton
                                  size="large"
                                  color='warning'
                              >
                                  <CloudOffIcon fontSize='large' />
                              </IconButton>
                          </Tooltip>
                      </Grid2>
                      <Grid2 item xs={12}>
                          <Typography variant="h5" align='center' gutterBottom>
                              We didn't find a brewery with that query.
                          </Typography>
                      </Grid2>
                      <Grid2 item xs={12}>
                        <Typography variant="h5" align='center' gutterBottom>
                          Try searching with different params!
                        </Typography>
                      </Grid2>
                  </Grid2>
                )
              }
              {/*List*/}
              {
                !isLoading && breweries && !!breweries.length && (
                  <Grid2 xs={12}>
                    <TableContainer component={Paper}>
                      <Table aria-label="Birra table">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Brewery Type</TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            breweries.map((row) => (
                              <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.id}
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.brewery_type}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardIosIcon />}
                                    onClick={() => handleOpenModal(row)}
                                  >
                                    Detalle
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid2>
                )
              }
            </>
          )
        }
      </Grid2>

      {/*Detail Modal*/}
      <Modal
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
      >
          <Paper elevation={16} sx={{ ...modalStyle, width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
              <Box sx={{ my: 3, mx: 2 }}>
                  <Grid2 container alignItems="center">
                      <Grid2 item xs>
                          <Typography gutterBottom variant="h4" component="div">
                              {detailedBrewery?.name}
                          </Typography>
                      </Grid2>
                      <Grid2 item>
                          <Chip color="primary" label={detailedBrewery?.brewery_type} />
                      </Grid2>
                  </Grid2>
                  <Typography color="text.secondary" variant="body2">
                      {detailedBrewery?.country}, {detailedBrewery?.state}, {detailedBrewery?.city}, {detailedBrewery?.street} ZIP {detailedBrewery?.postal_code}
                  </Typography>
              </Box>
              <Divider variant="middle" />
              {
                  ( detailedBrewery?.phone || detailedBrewery?.website_url ) && (
                  <Box sx={{ m: 2 }}>
                      <Typography gutterBottom variant="body1">
                          Contact
                      </Typography>
                      <Stack direction="row" spacing={1}>
                          {
                              detailedBrewery?.phone && (
                              <Tooltip title="Phone Number">
                              <Chip color="secondary"  icon={<LocalPhoneIcon />} label={detailedBrewery?.phone} />
                              </Tooltip>
                              )
                          }

                          {
                              detailedBrewery?.website_url && (
                                  <Tooltip title="Website">
                                      <Link href={detailedBrewery?.website_url}>
                                          <Chip color="success" icon={<WebIcon />} label='Go to Website' />
                                      </Link>
                                  </Tooltip>
                              )
                          }
                      </Stack>
                  </Box>
                  )
              }
              <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                  <Button onClick={() => setIsDetailModalOpen(false)}>
                      Close
                  </Button>
              </Box>
          </Paper>
      </Modal>

    </Container>
  );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

export default App;
