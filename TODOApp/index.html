<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TODO App</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <div class="container bg-secondary mt-5 p-4">
        <div class="row justify-content-center mb-4">
            <h1 class="text-center text-white">TODO APP</h1>
        </div>
        <div class="row justify-content-center mb-4">
            <div class="col-md-8 d-flex">
                <input type="text" class="form-control me-2 searchinput" placeholder="Search tasks">
                <button type="button" class="btn btn-primary me-2 prioritysortbutton">Priority Sort</button>
                <button type="button" class="btn btn-primary me-2 datesortbutton">Date Sort</button>
                <button type="button" class="btn btn-primary searchbutton">Search</button>
                <button type="button" class="btn btn-primary ms-2 togglebutton">Toggle</button>
            </div>
        </div>
        <div class="row justify-content-center mb-4">
            <div class="col-md-8">
                <div class="form-container">
                    <form id="taskForm">
                        <div class="row mb-3">
                            <div class="col-md-3">
                                <input type="text" id="taskInput" class="form-control" placeholder="Enter Task">
                            </div>
                            <div class="col-md-2">
                                <input type="text" id="priorityInput" class="form-control" placeholder="Priority">
                            </div>
                            <div class="col-md-3">
                                <input type="datetime-local" id="dateInput" class="form-control">
                            </div>
                            <div class="col-md-4">
                                <button type="submit" class="btn btn-primary w-100">Add Task</button>
                            </div>
                        </div>
                    </form>
                    <button id="deleteAllTasks" class="btn btn-danger w-100">Delete All Tasks</button>
                </div>
            </div>
        </div>
        <div class="row" id="tasksrow">
            <!-- Tasks will come here -->
        </div>
        <div class="row justify-content-center mb-4">
            <div class="d-flex">
                <button type="button" class="btn btn-warning ms-2 importbutton">Import</button>
                <input type="file" id="importFile" style="display: none;">
                <button type="button" class="btn btn-danger ms-2 exportbutton">Export</button>
            </div>
        </div>
    </div>

    <!--edit task modal is over-->
    <div class="modal fade" id="edittaskmodal" tabindex="-1" aria-labelledby="modal-title" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                </div>
                <div class="modal-body">
                    <form id="editTaskForm">
                        <div class="mb-3">
                            <label for="edittaskinput">Task</label>
                            <input type="text" class="form-control" id="edittaskinput" required>
                        </div>
                        <div class="mb-3">
                            <label for="editpriorityinput">Priority</label>
                            <input type="text" class="form-control" id="editpriorityinput" required>
                        </div>
                        <div class="mb-3">
                            <label for="editdateinput">Date and Time</label>
                            <input type="datetime-local" class="form-control" id="editdateinput" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- addsubtasks modal-->
    <div class="modal fade" id="addsubtaskmodal" tableindex="-1" aria-labelledby="addsubtaskmodallabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addsubtaskmodallabel">Add SubTask</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                </div>
                <div class="modal-body">
                    <form id="addsubtaskform">
                        <div class="mb-3">
                            <label for="subtaskinput" class="form-label">SubTask</label>
                            <input type="text" class="form-control" id="subtaskinput" required>
                        </div>
                        <div class="mb-3">
                            <label for="subtaskpriorityinput" class="form-label">Priority</label>
                            <input type="text" class="form-control" id="subtaskpriorityinput" required>
                        </div>
                        <div class="mb-3">
                            <label for="subtaskdatetimeinput" class="form-label">Date and Time</label>
                            <input type="datetime-local" class="form-control" id="subtaskdatetimeinput" required>
                        </div>
                        <input type="hidden" id="currentTaskIndex">
                        <button type="submit" class="btn btn-primary">Add Subtask</button>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <!--editing subtasks dialog box-->
    <div class="modal fade" id="editsubtasksmodal" tabindex="-1" aria-labelledby="editsubtasksmodallabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editsubtasksmodallabel">Edit Subtask</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editSubtaskForm">
                        <div class="mb-3">
                            <label for="editSubtaskInput" class="form-label">Subtask</label>
                            <input type="text" class="form-control" id="editSubtaskInput" required>
                        </div>
                        <div class="mb-3">
                            <label for="editSubtaskPriorityInput" class="form-label">Priority</label>
                            <input type="text" class="form-control" id="editSubtaskPriorityInput" required>
                        </div>
                        <div class="mb-3">
                            <label for="editSubtaskDateTimeInput" class="form-label">Date and Time</label>
                            <input type="datetime-local" class="form-control" id="editSubtaskDateTimeInput" required>
                        </div>
                        <input type="hidden" id="editSubtaskTaskIndex">
                        <input type="hidden" id="editSubtaskIndex">
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="./Scripts/script.js"></script>
</body>
</html>
