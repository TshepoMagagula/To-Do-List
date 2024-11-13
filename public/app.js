
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeBtn = document.querySelector(".close-btn");

let taskToEdit = ""; // This holds the task that will be edited

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        fetch('http://localhost:3008/api/to-do-list/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: inputBox.value })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                inputBox.value = '';
                renderTasks();
                listContainer.scrollTop = listContainer.scrollHeight;
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was an error adding the task.");
        });
    }
}

function renderTasks() {
    // Fetch the current task list from the server
    fetch('http://localhost:3008/api/to-do-list')
        .then(response => response.json())
        .then(tasks => {
            listContainer.innerHTML = '';

            tasks.forEach(task => {
                const li = document.createElement("li");
                li.innerHTML = task;
                listContainer.appendChild(li);

                const deleteSpan = document.createElement("span");
                deleteSpan.classList.add("delete-icon");
                deleteSpan.innerHTML = "&times;";
                li.appendChild(deleteSpan);

                const editSpan = document.createElement("span");
                editSpan.classList.add("edit-icon"); 
                li.appendChild(editSpan);
                listContainer.scrollTop = listContainer.scrollHeight;
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            alert("There was an error retrieving tasks.");
        });
}

function deleteTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        fetch('http://localhost:3008/api/to-do-list/deleteTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: inputBox.value })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                inputBox.value = '';
                renderTasks();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was an error adding the task.");
        });
    }
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
    }else if(e.target.tagName ==="SPAN"){
        if (e.target.classList.contains("delete-icon")){
            const taskToRemove = e.target.parentElement.innerText.replace("×", "").trim();

            fetch('http://localhost:3008/api/to-do-list/deleteTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: taskToRemove })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderTasks();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error deleting the task.");
            });
        }else if (e.target.classList.contains("edit-icon")){
            //Opens the modal when clicking the edit icon
            taskToEdit = e.target.parentElement.innerText.replace("×", "").trim();
            editInput.value = taskToEdit; 
            editModal.style.display = "flex"; 
        }
    }
}, false)

// Event listener to close the modal on clicking close or cancel
closeBtn.addEventListener("click", () => editModal.style.display = "none");
cancelBtn.addEventListener("click", () => editModal.style.display = "none");

// Save the edited task
saveBtn.addEventListener("click", () => {
    const updatedTask = editInput.value.trim();

    if (updatedTask && updatedTask !== taskToEdit) {
        // Send update request to server
        fetch('http://localhost:3008/api/to-do-list/editTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldTask: taskToEdit, newTask: updatedTask })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                editModal.style.display = "none"; // Hide the modal
                renderTasks(); // Re-render the tasks
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was an error updating the task.");
        });
    } else {
        alert("Task cannot be empty or the same as before!");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    renderTasks();
});

inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

