import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  // use Effect
  useEffect(() => {
    const getTask = async () =>
    {
      const taskFromServer = await  fetchData()
      setTasks(taskFromServer);
    }
    getTask();
  },[])
  // Fetch Task
    const fetchData = async () =>
    {
      const res = await fetch("http://localhost:5000/tasks");
      const data = await res.json(); 
      return data;
    }

  // Fetch Task with id
  const fetchTask = async (id) =>
    {
      const res = await fetch(`http://localhost:5000/tasks/${id}`);
      const data = await res.json();
      return data;
    }


  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,{method:"DELETE"})
    setTasks(tasks.filter((task) => task.id !== id))
  }


  // toggle Reminder
  const toggleReminder = async (id) =>
  {
    const toggleData = await fetchTask(id);
    console.log(toggleData);
    const updatedData = {...toggleData, reminder:!toggleData.reminder}  
    const res=await fetch(`http://localhost:5000/tasks/${id}`,{
      method:"PUT",
      headers:{
        'Content-Type':'application/json'
        },
      body:(JSON.stringify(updatedData))
    })
    const data = await res.json()
    // cl
    setTasks(tasks.map((task)=> task.id === id? {...task, reminder:data.reminder}: task))
    // console.log(tasks);
  }



  // Add Task
  const addTask = async(task)=>
  {
    const res=await fetch(`http://localhost:5000/tasks`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
        },
      body:(JSON.stringify(task))
    })
    const data = await  res.json();
    setTasks([...tasks, data])

    
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>

        <Routes>
            <Route 
            path = "/" 
            element = {
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                  {tasks.length > 0?
                   (<Tasks tasks={tasks} onDelete = {deleteTask} onToggle ={toggleReminder} />)
                : "No Task To Show " }
              </> 
              }
          />
        <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
