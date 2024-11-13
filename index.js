import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3008;

export let task_list = [

]

app.post('/api/to-do-list/addTask', async function(req, res){
    const task = req.body.task;

    if(task_list.includes(task)){
        res.json({
            status: 'failed',
            message: 'The task already exists in the To-Do-List'
        })
    }else {
        task_list.push(task);
        res.json({
            status: 'success',
            message: `Task "${task}" has been added to the To-Do-List`
        })
    }
});

app.get('/api/to-do-list', (req, res) => {
    res.json(task_list);
});

app.post('/api/to-do-list/deleteTask', async function(req, res){
    const taskToRemove = req.body.task;

    if(task_list.includes(taskToRemove)){

        // task_list = task_list.filter(task => task !== taskToRemove);

        const index = task_list.indexOf(taskToRemove);
        if (index > -1) {
            task_list.splice(index, 1);
        }
        res.json({
            status: 'success',
            message: `Task "${taskToRemove}" has been removed from the To-Do-List`
        })
    }else {
        res.json({
            status: 'failed',
            message: 'The task does not exist in the To-Do-List'
        })
    }
});

app.post('/api/to-do-list/editTask', async function(req, res){
    const {oldTask, newTask} = req.body;
    console.log("Old Task:", oldTask);
    console.log("New Task:", newTask);
    console.log("Task List:", task_list);

    const taskIndex = task_list.findIndex(task => task.toLowerCase().trim() === oldTask.toLowerCase().trim());;

    if (taskIndex > -1) {
        task_list[taskIndex] = newTask.trim();
        res.json({
            status: 'success',
            message: `Task updated to "${newTask}"`
        });
    }else {
        res.json({
            status: 'failed',
            message: 'The task does not exist in the To-Do-List'
        })
    }

})

app.listen(PORT, () => console.log(`started on port : ${PORT}`))
console.log("done!")