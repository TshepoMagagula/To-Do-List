
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

/* function addTask(){
    if(inputBox.value === '') {
        alert("You must write something!");
    }
    else{
        let li =document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "&times;";
        li.appendChild(span);
    }
    inputBox.value = "";
} */

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        fetch('/api/to-do-list/addTask', {
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
        e.target.parentElement.remove();
    }
}, false)