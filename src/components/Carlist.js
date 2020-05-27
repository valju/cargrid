import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@material-ui/core/Button';
import NoSsr from '@material-ui/core/NoSsr';

export default function Carlist() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getCars();
  }, [])

  const getCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
  }

  const deleteCar = (link) => {
    if (window.confirm('Are you sure?')) {
      fetch(link, {method: 'DELETE'})
      .then(_ => getCars())
      .catch(err => console.error(err))
    }
  }

  const columns = [
    {
      headerName: 'Brand',
      field: 'brand',
      sort: 'asc',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      headerName: 'Model',
      field: 'model',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      headerName: 'Color',
      field: 'color',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      headerName: 'Fuel',
      field: 'fuel',
      sortable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      headerName: 'Year',
      field: 'year',
      sortable: true,
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Price (€)',
      field: 'price',
      sortable: true,
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: '',
      field: '_links.self.href',
      cellRendererFramework: params => <NoSsr><Button color="secondary" size="small" onClick={() => deleteCar(params.value)}>Delete</Button></NoSsr>
    }
  ]

  return(
    <div className="ag-theme-material" style={{height: '700px', width: '100%'}}>
      <AgGridReact 
        pagination={true}
        suppressCellSelection={true} 
        paginationAutoPageSize={true} 
        columnDefs={columns} 
        rowData={cars}>
      </AgGridReact>
    </div>
  );
}
