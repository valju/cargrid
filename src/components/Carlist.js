import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export default function Carlist() {
  const [cars, setCars] = useState([]);
  const [columns, setColumns] = useState([
    {
      headerName: 'Brand',
      field: 'brand'
    },
    {
      headerName: 'Model',
      field: 'model'
    }
  ]);

  useEffect(() => {
    getCars();
  }, [])

  const getCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
  }

  return(
    <div className="ag-theme-balham" style={ {height: '400px', width: '1000px'} }>
      <AgGridReact columnDefs={columns} rowData={cars}>
      </AgGridReact>
    </div>
  );
}
