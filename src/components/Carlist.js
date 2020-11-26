import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
  const API_URL = 'https://carstockrest.herokuapp.com/cars';
  const [cars, setCars] = useState([]);

  const gridRef = useRef();

  useEffect(() => {
    getCars();
  }, [])

  const getCars = () => {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
  }

  const deleteCar = (link) => {
    if (window.confirm('Are you sure?')) {
      fetch(link, {method: 'DELETE'})
      .then(_ => gridRef.current.redrawRows({ rowNodes: getCars()}))
      .catch(err => console.error(err))
    }
  }

  const addCar = (car) => {
    fetch(API_URL, 
    {   method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(car)
    })
    .then(_ => gridRef.current.redrawRows({ rowNodes: getCars()}))
    .catch(err => console.error(err))
  }

  const editCar = (link, car) => {
    fetch(link, 
      { method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify(car)
      })
      .then(res => gridRef.current.redrawRows({rowNodes: getCars()}))
      .catch( err => console.error(err))
  }

  const exportData = () => {
    gridRef.current.exportDataAsCsv({columnSeparator: ';', columnKeys: ['brand', 'model', 'color', 'year', 'fuel', 'price']});
  }

  // colId is needed to filter exported columns (see exportData)
  const columns = [
    {
      colId: 'brand',
      headerName: 'Brand',
      field: 'brand',
      sort: 'asc',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      colId: 'model',
      headerName: 'Model',
      field: 'model',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      colId: 'color',
      headerName: 'Color',
      field: 'color',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      colId: 'fuel',
      headerName: 'Fuel',
      field: 'fuel',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      colId: 'year',
      headerName: 'Year',
      field: 'year',
      sortable: true,
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'price',
      headerName: 'Price (€)',
      field: 'price',
      sortable: true,
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => <Editcar car={params.data} link={params.value} editCar={editCar}/>
    },
    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => <Button color="secondary" size="small" onClick={() => deleteCar(params.value)}>Delete</Button>
    }
  ]

  return(
    <div className="ag-theme-material" style={{height: '700px', width: '100%'}}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Addcar addCar={addCar} />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={exportData} style={{marginTop: 10, marginBottom: 10}}>Export</Button>
        </Grid>
      </Grid>
      <AgGridReact 
        ref={gridRef}
        onGridReady={ params => { 
          gridRef.current = params.api;
          params.api.sizeColumnsToFit();
        }}
        pagination={true}
        suppressCellSelection={true} 
        paginationAutoPageSize={true} 
        animateRows={true}
        columnDefs={columns} 
        rowData={cars}>
      </AgGridReact>
    </div>
  );
}
