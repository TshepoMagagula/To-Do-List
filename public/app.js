
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

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

                const span = document.createElement("span");
                span.innerHTML = "&times;";
                li.appendChild(span);
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
    }
}, false)