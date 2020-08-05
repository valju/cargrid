import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@material-ui/core/Button';

import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
  const [cars, setCars] = useState([]);

  const gridRef = useRef();

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
      .then(_ => gridRef.current.redrawRows({ rowNodes: getCars()}))
      .catch(err => console.error(err))
    }
  }

  const addCar = (car) => {
    fetch('https://carstockrest.herokuapp.com/cars', 
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
    gridRef.current.exportDataAsCsv({columnSeparator: ';'});
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
      <Addcar addCar={addCar} />
      <button onClick={exportData}>Export</button>
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
