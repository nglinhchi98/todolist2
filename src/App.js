import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DeleteIcon from '@mui/icons-material/Delete';

function Todolist() {
  const [todo, setTodo] = useState({description: '', date: '', priority:''});
  const [todos, setTodos] = useState([]);
  const gridRef = useRef();
  const [value, setValue] = useState('one');
  
  const inputChanged = (event) => {
    setTodo({...todo, [event.target.name]: event.target.value});
  }

  const addTodo = (event) => {
    if(todo.date) {
    const formattedDate = todo.date.format('DD-MM-YYYY');
    setTodos([...todos, {...todo, date: formattedDate}]);
    } else {
    setTodos([...todos, todo]);
    }
  }

  const columns = [
    { field: "description", sortable: true, filter: true },
    { field: "date", sortable: true, filter: true },
    { field: "priority", sortable: true, filter: true,
      cellStyle: params => params.value === "High" ? {color: 'red'} : {color: 'black'} }
  ];

  const deleteTodo = () => {
    if(gridRef.current.getSelectedNodes().length > 0) {
      setTodos(todos.filter((todo, index) =>
            index !== gridRef.current.getSelectedNodes()[0].id))
    }
    else {
      alert('Select row first');
    }
    
  }

  const handleDate = (date) => {
    if (date) {
      setTodo({
        ...todo,
        date: date,
      });
    } else {
      setTodo({
        ...todo,
        date: null,
      });
    }
  };

  const handleChange = (event, value) => {
    setValue(value);
  }

  return (
    <div>
      <Tabs value={value} onChange={handleChange}>
            <Tab value="one" label="HOME" />
            <Tab value="two" label="TODOS" />
        </Tabs>
        {value === 'one' && (<div> <h2>Welcome to the todo app!</h2></div>)}
        {value === 'two' && ( 
          <div>
            <h5>Todo List</h5>
            <Stack direction="row" spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DatePicker
                  label="Date"
                  variant="standard"
                  name="date" value={todo.date}
                  onChange={handleDate}
                  /> 
              </LocalizationProvider>

              <TextField
                label="Description"
                variant="standard"
                name="description" value={todo.description}
                onChange={inputChanged} />

              <TextField
                label="Priority"
                variant="standard"
                name="priority" value={todo.priority}
                onChange={inputChanged} />

              <Button onClick={addTodo} variant="outlined">Add</Button>
              <Button onClick={deleteTodo} variant = "outlined" color="error">Delete<DeleteIcon /></Button>
            </Stack> 
            <div className='ag-theme-material'
            style = {{height: '700px', width: '70%'}}>
              <AgGridReact
                ref = {gridRef}
                onGridReady={ params => gridRef.current = params.api }
                rowSelection='single'
                columnDefs={columns}
                rowData={todos}
                animateRows={true}
                defaultColDef={{filter:true, floatingFilter:true}}>
              </AgGridReact> 
            </div>
          </div> )}
      </div>
  );
};

export default Todolist;

