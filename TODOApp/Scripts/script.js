document.addEventListener('DOMContentLoaded', function(){
    const tasksrow = document.querySelector('#tasksrow'); //div to add
    const form = document.querySelector('#taskForm');
    const togglebutton = document.querySelector('.togglebutton');
    let tasks = [];

    //dialog booxs
    const editTaskForm = document.querySelector('#editTaskForm');
    const addsubtaskform = document.querySelector('#addsubtaskform');
    const editSubtaskForm = document.querySelector('#editSubtaskForm');

    //priority
    const prioritysortbutton = document.querySelector('.prioritysortbutton');
    const datesortbutton = document.querySelector('.datesortbutton');

    //export and import
    const importbutton = document.querySelector('.importbutton');
    const exportbutton = document.querySelector('.exportbutton');

    //searching
    const searchbutton = document.querySelector('.searchbutton');
    const searchinput = document.querySelector('.searchinput');

    //indexs
    let currenttaskindex = null;
    let currentsubtaskindex = null;

    function addingtasks(filteredTasks = tasks) {
        tasksrow.innerHTML = '';  
        filteredTasks.forEach((task, taskIndex) => {  
            const taskdiv = document.createElement('div');
            taskdiv.setAttribute('class', 'col-md-12 mb-3 divdrag');
            taskdiv.setAttribute('draggable', 'true');
            taskdiv.dataset.type = 'task'; 
            taskdiv.dataset.index = taskIndex;
    
            taskdiv.innerHTML = `
                <div class='card' draggable='true'>
                    <div class='card-body'>
                        <h5 class='card-title'>${task.task}</h5>
                        <p class="card-text">Priority: ${task.priority}</p>
                        <p class="card-text">Date: ${new Date(task.dateTime).toLocaleString()}</p>
                        <button class="btn btn-primary me-2 edittaskbutton" data-index="${taskIndex}" data-bs-toggle="modal" data-bs-target="#edittaskmodal">Edit</button>
                        <button class="btn btn-secondary me-2 addsubtaskbutton" data-index="${taskIndex}" data-bs-toggle="modal" data-bs-target="#addsubtaskmodal">Add Subtask</button>
                        <button class="btn btn-danger deletetaskbutton" data-index="${taskIndex}">Delete</button>
                        <div class="subtasksdiv mt-3">
                            <h6>SubTasks</h6>
                            <ul class="list-group">
                                ${task.subtasks.map((subtask, subtaskIndex) => `
                                    <li class="list-group-item" draggable="true" data-task-index="${taskIndex}" data-subtask-index="${subtaskIndex}">
                                        ${subtask.subtask}
                                        <span class="badge bg-primary ms-2">${subtask.priority}</span>
                                        <span class="badge bg-secondary ms-2">${new Date(subtask.dateTime).toLocaleString()}</span>
                                        <button class="btn btn-info btn-sm float-end me-2 editsubtaskbutton" data-task-index="${taskIndex}" data-subtask-index="${subtaskIndex}" data-bs-toggle="modal" data-bs-target="#editsubtasksmodal">Edit</button>
                                        <button class="btn btn-danger btn-sm float-end me-2 deletesubtaskbutton" data-task-index="${taskIndex}" data-subtask-index="${subtaskIndex}">Delete</button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `; 
            
            tasksrow.appendChild(taskdiv); 
        });

        updatedrag();
    }

    //drag and drop
    function updatedrag(){
        const draggables = document.querySelectorAll('.divdrag');
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', (event) => {
                console.log('you stared drag');
            });
    
            draggable.addEventListener('dragend', () => {
                console.log('you stopped drag');
            });
        });

    }

    function setdragcontainer(){
        const dragcontainer = document.querySelector('#tasksrow');
        dragcontainer.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            console.log('dragging over container');
        });

        dragcontainer.addEventListener('drop', (e) => {
            e.preventDefault(); 
            const draggableElement = document.querySelector('.dragging'); 
            console.log(`item dropped ${tasks.taskIndex}`, draggableElement);
        });
    }


    // taking tasks 
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Form submit ted");
    
        const taskInput = document.querySelector('#taskInput').value;
        const priorityInput = document.querySelector('#priorityInput').value;
        const dateInput = document.querySelector('#dateInput').value;
    
        if (taskInput.trim() === '' || priorityInput.trim() === '' || dateInput === '') {
            alert("Fill out all the fields");
            return;
        }
        tasks.push({
            task: taskInput,
            priority: priorityInput,
            dateTime: dateInput,
            subtasks: []
        });
        saveTasks();
        addingtasks();
    });

    tasksrow.addEventListener('click',(event) =>{
        const target = event.target;
        if(target.matches('.edittaskbutton')){
            edittaskfunction(event);
        }else if(target.matches('.addsubtaskbutton')){
            addsubtaskfunction(event);
        }else if(target.matches('.deletetaskbutton')){
            deletetaskfunction(event);
        }else if(target.matches('.editsubtaskbutton')){
            editsubtaskfunction(event);
        }else if(target.matches('.deletesubtaskbutton')){
            deletesubtaskfunction(event);
        }
    })



    //edit task 
    function edittaskfunction(event){
        alert('you have clicked edittask');
        currenttaskindex = parseInt(event.target.getAttribute('data-index'), 10);
        const task = tasks[currenttaskindex];

        // Populate it
        document.querySelector('#edittaskinput').value = task.task;
        document.querySelector('#editpriorityinput').value = task.priority;
        document.querySelector('#editdateinput').value = new Date(task.dateTime).toISOString().slice(0, 16);
    }

    editTaskForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        alert("you have submitted the edittask modal");
        const edittaskinput = document.querySelector("#edittaskinput").value;
        const editpriorityinput = document.querySelector("#editpriorityinput").value;
        const editdateinput = document.querySelector("#editdateinput").value;

        if (edittaskinput.trim() === '' || editpriorityinput.trim() === '' || editdateinput === '') {
            alert("Fill out all the fields");
            return;
        }

        tasks[currenttaskindex] = {
            task: edittaskinput,
            priority: editpriorityinput,
            dateTime: editdateinput,
            subtasks: tasks[currenttaskindex].subtasks
        };

        saveTasks();
        addingtasks();
        currenttaskindex = null;
        const editTaskModal = bootstrap.Modal.getInstance(document.querySelector('#edittaskmodal'));
        if (editTaskModal) editTaskModal.hide();
        document.querySelector('#edittaskinput').value = '';
        document.querySelector('#editpriorityinput').value = '';
        document.querySelector('#editdateinput').value = '';
    })


    
    //addsubtask form
    function addsubtaskfunction(event) {
        currenttaskindex = parseInt(event.target.getAttribute('data-index'), 10);
        console.log('you have clicked addsubtask');
    }

    addsubtaskform.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("you have submitted the addsubtaskform");
        const subtaskInput = document.querySelector('#subtaskinput').value;
        const subtaskPriorityInput = document.querySelector('#subtaskpriorityinput').value;
        const subtaskDateTimeInput = document.querySelector('#subtaskdatetimeinput').value;

        if (subtaskInput.trim() === '' || subtaskPriorityInput.trim() === '' || subtaskDateTimeInput.trim() === '') {
            alert("Fill out all the fields");
            return;
        }

        tasks[currenttaskindex].subtasks.push({
            subtask: subtaskInput,
            priority: subtaskPriorityInput,
            dateTime: subtaskDateTimeInput
        });

        saveTasks();
        addingtasks();
        currenttaskindex = null;

        // Hiding the modal and clearing the fields
        const addSubtaskModal = bootstrap.Modal.getInstance(document.querySelector('#addsubtaskmodal'));
        if (addSubtaskModal) addSubtaskModal.hide();
        document.querySelector('#subtaskinput').value = '';
        document.querySelector('#subtaskpriorityinput').value = '';
        document.querySelector('#subtaskdatetimeinput').value = '';
    });

    //deleting all tasks
    document.querySelector('#deleteAllTasks').addEventListener('click',(e) =>{
      if(confirm('Are you sure want to delete all Tasks?')){
        tasks = [];
        saveTasks();
        addingtasks();
      }  
    })
    

    //deleting tasks
    function deletetaskfunction(event){
        alert("you came here");
        const index = parseInt(event.target.getAttribute('data-index'), 10);
        tasks.splice(index,1);

        saveTasks();
        addingtasks();
    }



    //editing subtasks
    function editsubtaskfunction(event){
        currenttaskindex = parseInt(event.target.getAttribute('data-task-index'), 10);
        currentsubtaskindex = parseInt(event.target.getAttribute('data-subtask-index'), 10);
        const subtask = tasks[currenttaskindex].subtasks[currentsubtaskindex];

        //populate it
        document.querySelector('#editSubtaskInput').value = subtask.subtask;
        document.querySelector('#editSubtaskPriorityInput').value =  subtask.priority;
        document.querySelector('#editSubtaskDateTimeInput').value = new Date(subtask.dateTime).toISOString().slice(0, 16);
    }
    editSubtaskForm.addEventListener('submit',(e) =>{
        e.preventDefault();
        const editSubtaskInput = document.querySelector('#editSubtaskInput').value.trim();
        const editSubtaskPriorityInput = document.querySelector('#editSubtaskPriorityInput').value.trim();
        const editSubtaskDateTimeInput = document.querySelector('#editSubtaskDateTimeInput').value.trim();
        
        if(editSubtaskInput === '' || editSubtaskPriorityInput ==='' || editSubtaskDateTimeInput===''){
            alert("Fill out all the fields");
            return;
        }

        tasks[currenttaskindex].subtasks[currentsubtaskindex] = {
            subtask : editSubtaskInput,
            priority: editSubtaskPriorityInput,
            dateTime: editSubtaskDateTimeInput
        };

        saveTasks();
        addingtasks();
        currenttaskindex = null;
        currenttaskindex = null;
        const editTaskModal = bootstrap.Modal.getInstance(document.querySelector('#editsubtasksmodal'));
        if (editTaskModal) editTaskModal.hide();
        document.querySelector('#editSubtaskInput').value = '';
        document.querySelector('#editSubtaskPriorityInput').value =  '';
        document.querySelector('#editSubtaskDateTimeInput').value = '';
    });

    //deleting subtasks
    function deletesubtaskfunction(event) {
        const taskIndex = parseInt(event.target.getAttribute('data-task-index'), 10);
        const subtaskIndex = parseInt(event.target.getAttribute('data-subtask-index'), 10);
        tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
        saveTasks();
        addingtasks();
    }

    //sorting
    function priorityToNumber(priority) {
        switch (priority.toLowerCase()) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 0;
        }
    }
    function sortTasksByPriority(tasks) {
        return tasks.map(task => ({
            ...task, //used to copy all the elements of object
            subtasks: task.subtasks.sort((a, b) => priorityToNumber(b.priority) - priorityToNumber(a.priority))
        })).sort((a, b) => priorityToNumber(b.priority) - priorityToNumber(a.priority));
    }
    prioritysortbutton.addEventListener('click',(e) =>{
        e.preventDefault();
        const sortedTasks = sortTasksByPriority(tasks);
        saveTasks();
        addingtasks(sortedTasks);
    })

    datesortbutton.addEventListener('click',(e)=>{
        e.preventDefault();
        console.log('sorting by date');
        try{
            const sortedtasks = [...tasks].sort((a,b) =>{
                const dateA = new Date(a.dateTime);
                const dateB = new Date(b.dateTime);

                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                    throw new Error('Invalid date format encountered.');
                }
                return dateA - dateB;
            });
            addingtasks(sortedtasks);
        } catch(error){
            alert('Error sorting tasks by date:', error);
        }
    })


    //notifications(i am using notifiactions keyword)
    function notifications() {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                const notificationTimes = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
                const notificationsSent = new Map();
                setInterval(() => {
                    const timeNow = new Date();
                    tasks.forEach((task, taskIndex) => {
                        const taskDate = new Date(task.dateTime);
                        const timeDiff = taskDate - timeNow;
                        notificationTimes.forEach(minutes => {
                            const timeThreshold = minutes * 60 * 1000;
                            if (timeDiff > timeThreshold - 60 * 1000 && timeDiff <= timeThreshold && !notificationsSent.get(`${taskIndex}-${minutes}`)) {
                                const notification = new Notification("Task Deadline Approaching", {
                                    body: `Task "${task.task}" is due in ${minutes} minutes.`,
                                    icon: './Assests/Images/personlogo.png',
                                });
                                notification.addEventListener("error", () => {
                                    alert("Please grant permission");
                                });
                                notificationsSent.set(`${taskIndex}-${minutes}`, true);
                            }
                        });
                    });
                }, 60 * 1000);
            } else {
                alert("I think you have disabled permissions for notifications");
            }
        });
    }
    

    //import and export
    importbutton.addEventListener('click', (e) =>{
        e.preventDefault();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept ='application/JSON';
        fileInput.addEventListener('change',(e) =>{
            const file = event.target.files[0];
            if(file){
                const reader = new FileReader();
                reader.onload = function(e) {
                    try{
                        tasks = JSON.parse(e.target.result);
                        tasks = sortTasksByPriority(tasks);
                        saveTasks();
                        addingtasks();
                    }catch(error){
                        console.error('error importing tasks:',error);
                    }
                };
                reader.readAsText(file);
            }
        });
        fileInput.click();
    });

    exportbutton.addEventListener('click', function() {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    //searching
    searchbutton.addEventListener('click', (e) =>{
        e.preventDefault();
        const searchvalue = searchinput.value.toLowerCase();
        const includesSearchTerm = (str) => str.toLowerCase().includes(searchvalue);

        const filteredTasks = tasks.filter(task => {
            return includesSearchTerm(task.task) ||
                   includesSearchTerm(task.priority) ||
                   (task.subtasks && task.subtasks.some(subtask => 
                       includesSearchTerm(subtask.subtask) || includesSearchTerm(subtask.priority))
                   );
        });

        addingtasks(filteredTasks);
    });


    //saving in localstroage
    function saveTasks(){
        try{
            localStorage.setItem('tasks',JSON.stringify(tasks));
            console.log("saved");
        }catch(error){
            console.error("Error saving tasks",error);
        }
    }

    function loadtasks() { // to load when refreshed
        try {
            const stored = JSON.parse(localStorage.getItem('tasks'));
            if (Array.isArray(stored)) {
                tasks = sortTasksByPriority(stored);
                console.log('Tasks loaded and sorted by priority:', tasks);
            } else {
                console.error('Loaded data is not an array:', stored);
                tasks = [];
            }
        } catch (error) {
            console.error("Error loading tasks", error);
            tasks = [];
        }
    }
    


    //toggle functionality
    let currenttheme = 'white';
    togglebutton.addEventListener('click',()=>{
        if(currenttheme==='white'){
            currenttheme = 'black';
            document.body.style.backgroundColor = 'black';
        }else{
            currenttheme = 'white';
            document.body.style.backgroundColor = 'white';
        }
    });


    //rendering to check
    loadtasks(); // to get the saved localstorage
    addingtasks();
    notifications();
    setdragcontainer();
});
