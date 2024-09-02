document.addEventListener('DOMContentLoaded', function() {
//     Select buttons and modal elements
    const leavesbutton = document.querySelector(".leavesbutton");
    const applyleavesbutton = document.querySelector('.applyleavesbutton');
     const dashboard = document.querySelector('#dashboard');
     const leaverequestbutton = document.querySelector('.leaverequestbutton');
     const logoutbutton = document.querySelector('.logoutbutton');
     const profileInfoDiv = document.querySelector('#profile-info');
     const getleavesbytype = document.querySelector('#getleavesbytype');
     const myleavetracker = document.querySelector('.myleavetracker');
     const myteamleavetracker = document.querySelector('.myteamleavetracker');
     var Usergender = null;
     let limitedsickleaves = null;
     let limitedcasualleaves = null;
     let limitedpaternityleaves = null;
     let limitedmaternityleaves = null;
     let userSickLeaves = null;
     let userCasualLeaves = null
     let userPaternityLeaves = null;
     let userMaternityLeaves = null;
     let remainingCasualLeaves = limitedcasualleaves - userCasualLeaves;
     let remainingSickLeaves = limitedsickleaves - userSickLeaves;
     let remainingMaternityLeaves = limitedmaternityleaves - userMaternityLeaves;
     let remainingPaternityLeaves = limitedpaternityleaves - userPaternityLeaves;
    // Function to show the modal
    const showLeaveRequestModal = () => {
        console.log("opening modal");
        const leaveRequestModal = new bootstrap.Modal(document.getElementById('leaverequestmodal'));
        leaveRequestModal.show();
    };

    myleavetracker.addEventListener('click', function() {
        userleavesDashboard()
            .catch(error => {
                console.error('Error displaying user leaves dashboard:', error);
            });
    });
    function addingleaves() {

        if (!dashboard) {
            console.error('Dashboard element not found!');
            return;
        }

        fetch('/LeaveManagement/leaveServlet', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log("I am in response block");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);


            if (!Array.isArray(data) || data.length === 0) {
                dashboard.innerHTML = '';

                const container = document.createElement('div');
                container.className = 'container text-center my-5';

                // Creating a card to hold the message
                const card = document.createElement('div');
                card.className = 'card shadow-lg border-light bg-light p-4';
                card.innerHTML = `
                      <div class='card-body'>
                            <h2 class='card-title text-success'>No Leaves Applied</h2>
                            <p class='card-text'>It looks like you have not applied for any leaves yet.</p>
                            <i class='fas fa-calendar-times fa-3x text-muted'></i>
                      </div>
                `;

                container.appendChild(card);
                dashboard.appendChild(container);
                return;
            }

            dashboard.innerHTML = '';

            const row = document.createElement('div');
            row.className = 'row';

            data.forEach(leave => {
                const col = document.createElement('div');
                col.className = 'col-md-4';

                const leavediv = document.createElement('div');
                leavediv.className = 'card bg-light mb-4';

                leavediv.innerHTML = `
                    <div class='card-body'>
                        <p class='card-text'>Employee ID: ${leave.Empid}</p>
                        <p class='card-text'>From-Date: ${leave.fromDate}</p>
                        <p class='card-text'>To-Date: ${leave.toDate}</p>
                        <p class='card-text'>Applied Date: ${leave.appliedDate}</p>
                        <p class='card-text'>Leave Type: ${leave.leaveType}</p>
                        <p class='card-text'>Leave Comment: ${leave.leaveComment}</p>
                        <p class='card-text'>Status : ${leave.status}</p>
                    </div>
                `;
                col.appendChild(leavediv);
                row.appendChild(col);
            });

//            dashboard.appendChild(row);
            dashboard.insertBefore(row, dashboard.firstChild);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    applyleavesbutton.addEventListener('click', (e) => {
        console.log("I am going into this button");
        console.log(Usergender);
        handleGenderBasedOptions();
        showLeaveRequestModal();
    });

    function handleGenderBasedOptions() {
            const leaveTypeSelect = document.querySelector('#leavetypeinput');
            console.log('Usergender:', Usergender); // Debug Usergender
            console.log('LeaveTypeSelect options before:', leaveTypeSelect.innerHTML); // Debug options before removal

            if (Usergender === 'MALE') {
                removeOption(leaveTypeSelect, 'MATERNITY');
            } else if (Usergender === 'FEMALE') {
                removeOption(leaveTypeSelect, 'PATERNITY');
            }

            console.log('LeaveTypeSelect options after:', leaveTypeSelect.innerHTML); // Debug options after removal
        }

        function removeOption(selectElement, valueToRemove) {
            const option = Array.from(selectElement.options).find(option => option.value === valueToRemove);
            if (option) {
                console.log('Removing option:', option.text); // Debug removed option
                selectElement.removeChild(option);
            }
        }


    leaverequestform.addEventListener('submit',(e) =>{
        e.preventDefault();


        const fromdateinput = document.querySelector("#fromdateinput").value.trim();
        const todateinput = document.querySelector("#todateinput").value.trim();
        const applieddateinput = document.querySelector("#applieddateinput").value.trim();
        const leavetypeinput = document.querySelector("#leavetypeinput").value.trim();
        const leavecommentinput = document.querySelector("#leavecommentinput").value.trim();
        console.log(fromdateinput,todateinput,applieddateinput,leavetypeinput,leavecommentinput);


        const leaveLimits = {
                'SICK': remainingSickLeaves,
                'CASUAL': remainingCasualLeaves,
                'MATERNITY': remainingMaternityLeaves,
                'PATERNITY': remainingPaternityLeaves
        };
        if (leaveLimits[leavetypeinput] <= 0) {
             alert(`There are no ${leavetypeinput} Leaves Left`);
             return;
        }




         const fromDate = new Date(fromdateinput);
         const toDate = new Date(todateinput);
         const appliedDate = new Date(applieddateinput);
         const today = new Date();
         today.setHours(0, 0, 0, 0);
         appliedDate.setHours(0, 0, 0, 0);



         // Check if 'fromdate' is in the past
         if (fromDate < today) {
               alert("The 'From Date' cannot be a past date.");
               return;
         }

         if(toDate < fromDate){
               alert("The 'To Date' cannot Before 'From Date'");
               return;
         }

         if (appliedDate.getTime() !== today.getTime()) {
              alert("The 'Applied Date' should be today's date.");
              return; // Stop the form submission
         }

         const diffTime = Math.abs(toDate - fromDate);
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates

         if (diffDays > leaveLimits[leavetypeinput]) {
             alert(`The number of leave days (${diffDays}) exceeds the remaining ${leavetypeinput} leave days.`, 'warning');
             return;
         }
        // Gender-based validation
        if (leavetypeinput === 'PATERNITY' && Usergender === 'FEMALE') {
            alert("PATERNITY LEAVES ARE NOT APPLIED FOR FEMALE");
            return;
        }

        if (leavetypeinput === 'MATERNITY' && Usergender === 'MALE') {
            alert("MATERNITY LEAVES ARE NOT APPLIED FOR MALE");
            return;
        }


        const leavedata = {
           fromdate : fromdateinput,
           todate : todateinput,
           Applieddate : applieddateinput,
           leavetype : leavetypeinput,
           leavecomment : leavecommentinput
        }

         fetch('/LeaveManagement/leaveServlet', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(leavedata),
         })
         .then(response => {
               if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
               }
              return response.json();
         })
         .then(data =>{
              console.log(data);
              console.log(data.leaveid);
              const leaveRequestModal = bootstrap.Modal.getInstance(document.querySelector('#leaverequestmodal'));
              if (leaveRequestModal) leaveRequestModal.hide();
              leaverequestform.reset();
              addingleaves();
              employeeUsedLeavesByType();
         })
         .catch(error => {
             console.error('There was a problem with the fetch operation:', error);
         });
    })

    leaverequestbutton.addEventListener('click',(e) =>{
       e.preventDefault();
       leaverequestfun();
    })



    function givingNameforManager() {
        fetch("/LeaveManagement/getnamesformanager", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('EmployeeData:', data);

            // Flatten the data if it's nested
            const flattenedData = data.flat(); // Use .flat() to handle nested arrays

            // Populate the dropdown with options
            const select = document.getElementById('employeesunderloginuser');
            flattenedData.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.Id; // Use 'Id' field from data
                option.textContent = employee.name; // Use 'name' field from data
                select.appendChild(option);
            });

            select.addEventListener('change', giveleavesbyid);
        })
        .catch(error => {
            console.error('Error fetching names:', error);
        });
    }


    function giveleavesbyid(event) {
        const selectElement = event.target;
        const selectedEmployeeId = selectElement.value; // Get the selected value
        const selectedEmployeeName = selectElement.options[selectElement.selectedIndex].textContent;

        if (!selectedEmployeeId) {
            // Handle the case where no valid employee is selected
            console.log('No employee selected');
            return;
        }

        fetch(`/LeaveManagement/getleavesbyid?id=${selectedEmployeeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Leave data for selected employee:', data);
            if (!Array.isArray(data) || data.length === 0) {
                 dashboard.innerHTML = '';

                 const rowtop = document.createElement('div');
                             rowtop.className = 'row';
                 rowtop.innerHTML = `
                     <div class="col-12 mb-1">
                         <select class="form-select " id="employeesunderloginuser" name="employeesunderloginuser">
                             <option value="ManagerEmployees" disabled selected>Employees</option>
                             <option value="AllEmployees" class="allemployeesahowing">All</option>

                         </select>
                     </div>
                 `;
                 dashboard.appendChild(rowtop);

                 givingNameforManager();

                 const container = document.createElement('div');
                 container.className = 'container text-center my-5';

                            // Creating a card to hold the message
                            const card = document.createElement('div');
                            card.className = 'card shadow-lg border-light bg-light p-4';
                 card.innerHTML = `
                       <div class='card-body'>
                             <h2 class='card-title text-success'>No Leaves Applied By ${selectedEmployeeName}</h2>
                             <p class='card-text'>It looks like ${selectedEmployeeName} not applied for any leaves yet.</p>
                             <i class='fas fa-calendar-times fa-3x text-muted'></i>
                       </div>
                 `;

                 container.appendChild(card);
                 dashboard.appendChild(container);

                 document.getElementById('employeesunderloginuser').addEventListener('change', event => {
                     const selectedValue = event.target.value;
                     if (selectedValue === 'AllEmployees') {
                          leaverequestfun();
                     } else {
                          Console.log("Not correctly selected for geting all Leaverequests")
                     }
                 });
                 return;
            }

            dashboard.innerHTML = '';

            const rowtop = document.createElement('div');
            rowtop.className = 'row';
            rowtop.innerHTML = `
                <div class="col-12 mb-1">
                    <select class="form-select " id="employeesunderloginuser" name="employeesunderloginuser">
                        <option value="ManagerEmployees" disabled selected>Employees</option>
                        <option value="AllEmployees" class="allemployeesahowing">All</option>

                </select>
                </div>
            `;
            dashboard.appendChild(rowtop);

            givingNameforManager();

            const row = document.createElement('div');
            row.className = 'row';

            data.forEach(leave => {
                const col = document.createElement('div');
                col.className = 'col-md-4';

                const leavediv = document.createElement('div');
                leavediv.className = 'card bg-light mb-4';

                leavediv.innerHTML = `
                    <div class='card-body'>
                        <p class='card-text'>Employee ID: ${leave.Empid}</p>
                        <p class='card-text'>From-Date: ${leave.fromDate}</p>
                        <p class='card-text'>To-Date: ${leave.toDate}</p>
                        <p class='card-text'>Applied Date: ${leave.appliedDate}</p>
                        <p class='card-text'>Leave Type: ${leave.leaveType}</p>
                        <p class='card-text'>Leave Comment: ${leave.leaveComment}</p>
                        <p class='card-text'>Status : ${leave.status}</p>
                        ${leave.status === 'PENDING' ? `
                           <button class='btn btn-success approveleavebutton' data-id='${leave.Id}'>Approve</button>
                           <button class='btn btn-danger rejectleavebutton' data-id='${leave.Id}'>Reject</button>
                        ` : ''}
                    </div>
                `;
                col.appendChild(leavediv);
                row.appendChild(col);
            });
            dashboard.appendChild(row);


            // Add event listeners for the buttons
            document.querySelectorAll('.approveleavebutton').forEach(button => {
                button.addEventListener('click', handleApproval);
            });

            document.querySelectorAll('.rejectleavebutton').forEach(button => {
                button.addEventListener('click', handleRejection);
            });

            document.getElementById('employeesunderloginuser').addEventListener('change', event => {
                const selectedValue = event.target.value;
                if (selectedValue === 'AllEmployees') {
                     leaverequestfun();
                } else {
                     Console.log("Not correctly selected for geting all Leaverequests")
                }
            });
        })
        .catch(error => {
            console.error('Error fetching leave data:', error);
        });
    }





    function leaverequestfun() {
        console.log("this function will be called when leavequestbutton is clicked")
        const dashboard = document.getElementById('dashboard'); // Ensure this is the correct selector

        fetch('/LeaveManagement/managerservlet', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data:', data); // Log the data for debugging

            // Clear existing content
            dashboard.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                // Create a container for the "No Leave Requests" message
                const container = document.createElement('div');
                container.className = 'container text-center my-5';

                // Create a card to hold the message
                const card = document.createElement('div');
                card.className = 'card shadow-lg border-light bg-light p-4';
                card.innerHTML = `
                    <div class='card-body'>
                        <h2 class='card-title text-danger'>No Leave Requests</h2>
                        <p class='card-text'>It looks like there are currently no leave requests.</p>
                        <i class='fas fa-calendar-times fa-3x text-muted'></i>
                    </div>
                `;

                // Append card to container and container to dashboard
                container.appendChild(card);
                dashboard.appendChild(container);
                return;
            }

            return fetch('/LeaveManagement/getnamesformanager', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(employeeData => {
                        // Create a map of employee IDs to names
                        console.log("EmployeeData ===",employeeData);
                        const employeeNames = {};
                        employeeData.forEach(employeeList => {
                            employeeList.forEach(employee => {
                                employeeNames[employee.Id] = employee.name; // Adjust this based on actual structure
                            });
                        });

                        console.log('Employee Names Map:', employeeNames);

                        // Create a row element for the dropdown
                        const rowtop = document.createElement('div');
                        rowtop.className = 'row';
                        rowtop.innerHTML = `
                            <div class="col-12 mb-1">
                                <select class="form-select" id="employeesunderloginuser" name="employeesunderloginuser">
                                    <option value="ManagerEmployees" disabled selected>Employees</option>
                                    <option value="AllEmployees" class="allemployeesahowing">All</option>
                                    <!-- Options will be added here -->
                                </select>
                            </div>
                        `;
                        dashboard.appendChild(rowtop);

                        givingNameforManager(); //fetching names for manager

                        // Create a row for leave cards
                        const row = document.createElement('div');
                        row.className = 'row';

                        data.forEach(leave => {
                            // Create column and card elements
                            const col = document.createElement('div');
                            col.className = 'col-md-4'; // Adjust the column size as needed

                            const leavediv = document.createElement('div');
                            leavediv.className = 'card bg-light mb-4'; // Card styling and margin
                            leavediv.innerHTML = `
                                <div class='card-body'>
                                    <p class='card-text'>Employee Name: ${employeeNames[leave.Empid] || 'Unknown'}</p>
                                    <p class='card-text'>Employee ID: ${leave.Empid}</p>
                                    <p class='card-text'>From-Date: ${leave.fromDate}</p>
                                    <p class='card-text'>To-Date: ${leave.toDate}</p>
                                    <p class='card-text'>Applied Date: ${leave.appliedDate}</p>
                                    <p class='card-text'>Leave Type: ${leave.leaveType}</p>
                                    <p class='card-text'>Leave Comment: ${leave.leaveComment}</p>
                                    <p class='card-text'>Status: ${leave.status}</p>
                                    ${leave.status === 'PENDING' ? `
                                        <button class='btn btn-success approveleavebutton' data-id='${leave.Id}'>Approve</button>
                                        <button class='btn btn-danger rejectleavebutton' data-id='${leave.Id}'>Reject</button>
                                    ` : ''}
                                </div>
                            `;

                            // Append card to column and column to row
                            col.appendChild(leavediv);
                            row.appendChild(col);
                        });

                        // Append row to dashboard
                        dashboard.appendChild(row);

                        // Add event listeners for the buttons
                        document.querySelectorAll('.approveleavebutton').forEach(button => {
                            button.addEventListener('click', handleApproval);
                        });

                        document.querySelectorAll('.rejectleavebutton').forEach(button => {
                            button.addEventListener('click', handleRejection);
                        });

                        document.getElementById('employeesunderloginuser').addEventListener('change', event => {
                            const selectedValue = event.target.value;
                            if (selectedValue === 'AllEmployees') {
                                 leaverequestfun();
                           } else {
                                Console.log("Not correctly selected for geting all Leaverequests")
                           }
                       });
                    })
                    .catch(error => {
                           console.error('Error fetching Employeedata:', error);
                    });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }



    function handleApproval(e) {
        const button = e.target;
        const leaveId = button.getAttribute('data-id');

        // Handle approval logic here
        console.log('Approved leave request with ID:', leaveId);

        const leavedata = {
            leaveid: leaveId,
            status: 'APPROVED'
        };

        fetch('/LeaveManagement/managerservlet', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leavedata),
        })
        .then(response => {
            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Debug response content
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers]);
            return response.text(); // Read the response as text for debugging
        })
        .then(data => {
                console.log('Response JSON data:', data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
        .finally(() => {
            // Refresh the leave requests
            leaverequestfun();
        });
    }


    function handleRejection(e) {
       const button = e.target;
       const leaveId = button.getAttribute('data-id');
       console.log('Rejected leave request with ID:', leaveId);
       const leavedata = {
           leaveid: leaveId,
           status: 'REJECTED'
       };
       fetch('/LeaveManagement/managerservlet', {
           method: 'PUT',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(leavedata),
       })
       .then(response => {
               // Check if the response is OK
           if (!response.ok) {
               throw new Error(`HTTP error! Status: ${response.status}`);
           }
           // Debug response content
           console.log('Response status:', response.status);
           console.log('Response headers:', [...response.headers]);
           return response.text(); // Read the response as text for debugging
       })
       .then(data => {
               console.log('Response JSON data:', data);
       })
       .catch(error => {
               console.error('Error fetching data:', error);
       })
       .finally(() => {
          // Refresh the leave requests
          leaverequestfun();
       });
    }


    function profilefun() {
            fetch('/LeaveManagement/profileservlet', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                console.log("Limitedcasualleaves",limitedsickleaves,limitedpaternityleaves,limitedmaternityleaves,limitedcasualleaves);
                console.log('Profile data:', data);
                const dashboard = document.getElementById('dashboard'); // Ensure 'dashboard' is defined
                dashboard.innerHTML = '';

                if (Array.isArray(data) && data.length > 0) {
                    const profile = data[0]; // Access the first item in the array
                    const div = document.createElement('div');
                    div.className = 'container mt-4'; // Container with top margin
                     const managerId = profile.ManagerId === 0 ? 'N/A' : profile.ManagerId;
                    div.innerHTML = `
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h2 class="card-title mb-0">Profile Information</h2>
                            </div>
                            <div class="card-body">
                                <ul class="list-group">
                                    <li class="list-group-item"><strong>EMPLOYEE ID:</strong> ${profile.Id}</li>
                                    <li class="list-group-item"><strong>Name:</strong> ${profile.name}</li>
                                    <li class="list-group-item"><strong>Manager ID:</strong> ${managerId}</li>
                                    <li class="list-group-item"><strong>Gender:</strong> ${profile.gender}</li>
                                </ul>
                            </div>
                        </div>
                    `;

                    dashboard.appendChild(div);
                } else {
                    console.log('No profile data found');
                    dashboard.innerHTML = '<p class="text-center">No profile data found</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }




    //logout
    logoutbutton.addEventListener('click',(e) =>{
         e.preventDefault();
         logoutfun();
    })

    function logoutfun() {
        let isTrue = false;
        fetch('/LeaveManagement/logoutservlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            window.location.href = "/LeaveManagement/";
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

        if (getleavesbytype) {
            getleavesbytype.addEventListener('change', handleSelection);
        } else {
            console.error('Dropdown element not found!');
        }

    function handleSelection(event) {
        const selectedValue = event.target.value;
        console.log(" i am about to handle handleselection");

        switch (selectedValue) {
            case 'ALL':
                addingleaves();
                break;
            case 'PENDING':
                pendingLeaves();
                break;
            case 'APPROVED':
                approvedLeaves();
                break;
            case 'REJECTED':
                rejectedLeaves();
            default:
                console.log('No matching option');
                break;
        }
    }

    function pendingLeaves(){
       fetch("/LeaveManagement/pendingleavesServlet",{
          method: 'GET',
          headers: {
             'Content-Type': 'application/json',
          },
       })
       .then(response => {
           if (!response.ok) {
               throw new Error(`HTTP error! Status: ${response.status}`);
           }
           return response.json();
       })
       .then(data => {
           console.log(data);


           if (!Array.isArray(data) || data.length === 0) {
               dashboard.innerHTML = '';

               const container = document.createElement('div');
               container.className = 'container text-center my-5';

               // Creating a card to hold the message
               const card = document.createElement('div');
               card.className = 'card shadow-lg border-light bg-light p-4';
               card.innerHTML = `
                     <div class='card-body'>
                           <h2 class='card-title text-success'>No Pending Leaves</h2>
                           <p class='card-text'>It looks like you have no Pending Leaves.</p>
                           <i class='fas fa-calendar-times fa-3x text-muted'></i>
                     </div>
               `;
               container.appendChild(card);
               dashboard.appendChild(container);
               return;
           }

           dashboard.innerHTML = '';

           const row = document.createElement('div');
           row.className = 'row';

           data.forEach(leave => {
               const col = document.createElement('div');
               col.className = 'col-md-4';

               const leavediv = document.createElement('div');
               leavediv.className = 'card bg-light mb-4';

               leavediv.innerHTML = `
                   <div class='card-body'>
                       <p class='card-text'>Employee ID: ${leave.Empid}</p>
                       <p class='card-text'>From-Date: ${leave.fromDate}</p>
                       <p class='card-text'>To-Date: ${leave.toDate}</p>
                       <p class='card-text'>Applied Date: ${leave.appliedDate}</p>
                       <p class='card-text'>Leave Type: ${leave.leaveType}</p>
                       <p class='card-text'>Leave Comment: ${leave.leaveComment}</p>
                       <p class='card-text'>Status : ${leave.status}</p>
                   </div>
               `;
               col.appendChild(leavediv);
               row.appendChild(col);
           });

//           dashboard.appendChild(row);
           dashboard.insertBefore(row, dashboard.firstChild);
       })
    }


    function approvedLeaves(){
           fetch("/LeaveManagement/approvedleaves",{
              method: 'GET',
              headers: {
                 'Content-Type': 'application/json',
              },
           })
           .then(response => {
               if (!response.ok) {
                   throw new Error(`HTTP error! Status: ${response.status}`);
               }
               return response.json();
           })
           .then(data => {
               console.log(data);


               if (!Array.isArray(data) || data.length === 0) {
                   dashboard.innerHTML = '';

                   const container = document.createElement('div');
                   container.className = 'container text-center my-5';

                   // Creating a card to hold the message
                   const card = document.createElement('div');
                   card.className = 'card shadow-lg border-light bg-light p-4';
                   card.innerHTML = `
                         <div class='card-body'>
                               <h2 class='card-title text-danger'>No Approved Leaves</h2>
                               <p class='card-text'>It looks like you have no Approved Leaves.</p>
                               <i class='fas fa-calendar-times fa-3x text-muted'></i>
                         </div>
                   `;
                   container.appendChild(card);
                   dashboard.appendChild(container);
                   return;
               }

               dashboard.innerHTML = '';

               const row = document.createElement('div');
               row.className = 'row';

               data.forEach(leave => {
                   const col = document.createElement('div');
                   col.className = 'col-md-4';

                   const leavediv = document.createElement('div');
                   leavediv.className = 'card bg-light mb-4';

                   leavediv.innerHTML = `
                       <div class='card-body'>
                           <p class='card-text'>Employee ID: ${leave.Empid}</p>
                           <p class='card-text'>From-Date: ${leave.fromDate}</p>
                           <p class='card-text'>To-Date: ${leave.toDate}</p>
                           <p class='card-text'>Applied Date: ${leave.appliedDate}</p>
                           <p class='card-text'>Leave Type: ${leave.leaveType}</p>
                           <p class='card-text'>Leave Comment: ${leave.leaveComment}</p>
                           <p class='card-text'>Status : ${leave.status}</p>
                       </div>
                   `;
                   col.appendChild(leavediv);
                   row.appendChild(col);
               });

//               dashboard.appendChild(row);
               dashboard.insertBefore(row, dashboard.firstChild);
           })
    }


    function rejectedLeaves(){
               fetch("/LeaveManagement/rejectedleaves",{
                  method: 'GET',
                  headers: {
                     'Content-Type': 'application/json',
                  },
               })
               .then(response => {
                   if (!response.ok) {
                       throw new Error(`HTTP error! Status: ${response.status}`);
                   }
                   return response.json();
               })
               .then(data => {
                   console.log(data);


                   if (!Array.isArray(data) || data.length === 0) {
                       dashboard.innerHTML = '';

                       const container = document.createElement('div');
                       container.className = 'container text-center my-5';

                       // Creating a card to hold the message
                       const card = document.createElement('div');
                       card.className = 'card shadow-lg border-light bg-light p-4';
                       card.innerHTML = `
                             <div class='card-body'>
                                   <h2 class='card-title text-success'>No Rejected Leaves</h2>
                                   <p class='card-text'>It looks like you have no Rejected Leaves.</p>
                                   <i class='fas fa-calendar-times fa-3x text-muted'></i>
                             </div>
                       `;
                       container.appendChild(card);
                       dashboard.appendChild(container);
                       return;
                   }

                   dashboard.innerHTML = '';

                   const row = document.createElement('div');
                   row.className = 'row';

                   data.forEach(leave => {
                       const col = document.createElement('div');
                       col.className = 'col-md-4';

                       const leavediv = document.createElement('div');
                       leavediv.className = 'card bg-light mb-4';

                       leavediv.innerHTML = `
                           <div class='card-body'>
                               <p class='card-text'>Employee ID: ${leave.Empid}</p>
                               <p class='card-text'>From-Date: ${leave.fromDate}</p>
                               <p class='card-text'>To-Date: ${leave.toDate}</p>
                               <p class='card-text'>Applied Date: ${leave.appliedDate}</p>
                               <p class='card-text'>Leave Type: ${leave.leaveType}</p>
                               <p class='card-text'>Leave Comment: ${leave.leaveComment}</p>
                               <p class='card-text'>Status : ${leave.status}</p>
                           </div>
                       `;
                       col.appendChild(leavediv);
                       row.appendChild(col);
                   });

//                   dashboard.appendChild(row);
                   dashboard.insertBefore(row, dashboard.firstChild);
               })
    }



   function limitedleavesdata() {
       return fetch("/LeaveManagement/limitedleavesperuser", {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
           },
       })
       .then(response => {
           if (!response.ok) {
               throw new Error(`HTTP error! Status: ${response.status}`);
           }
           return response.json();
       })
       .then(data => {
           console.log("Limited leaves data", data);

           data.forEach(entry => {
               switch(entry.key) {
                   case 'CASUAL':
                       limitedcasualleaves = entry.value;
                       break;
                   case 'MATERNITY':
                       limitedmaternityleaves = entry.value;
                       break;
                   case 'PATERNITY':
                       limitedpaternityleaves = entry.value;
                       break;
                   case 'SICK':
                       limitedsickleaves = entry.value;
                       break;
                   default:
                       console.warn(`Unknown leave type: ${entry.key}`);
               }
           });

           // Return a resolved promise to indicate completion
           return Promise.resolve();
       })
       .catch(error => {
           console.error('Error fetching limited leaves data:', error);
           return Promise.reject(error);
       });
   }



   function employeeUsedLeavesByType() {
       return fetch("/LeaveManagement/leaveofuserbytype", {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
           },
       })
       .then(response => {
           if (!response.ok) {
               throw new Error(`HTTP error! Status: ${response.status}`);
           }
           return response.json();
       })
       .then(data => {
           console.log("User leaves data", data);
           userSickLeaves = data.SICK || 0;
           userCasualLeaves = data.CASUAL || 0;
           userPaternityLeaves = data.PATERNITY || 0;
           userMaternityLeaves = data.MATERNITY || 0;

           remainingCasualLeaves = limitedcasualleaves - userCasualLeaves;
           remainingSickLeaves = limitedsickleaves - userSickLeaves;
           remainingMaternityLeaves = limitedmaternityleaves - userMaternityLeaves;
           remainingPaternityLeaves = limitedpaternityleaves - userPaternityLeaves;

           console.log(`Sick Leaves: ${userSickLeaves}`);
           console.log(`Casual Leaves: ${userCasualLeaves}`);
           console.log(`Paternity Leaves: ${userPaternityLeaves}`);
           console.log(`Maternity Leaves: ${userMaternityLeaves}`);

           // Return a resolved promise to indicate completion
           return Promise.resolve();
       })
       .catch(error => {
           console.error('Error fetching employee used leaves data:', error);
           return Promise.reject(error);
       });
   }


   function userleavesDashboard() {
       return new Promise((resolve) => {
           dashboard.innerHTML = '';
           const container = document.createElement('div');
           container.className = "bg-primary text-white p-4 mt-5 border-radius-25";
           const row = document.createElement('div');
           row.className = "row";

           // Define leave types and their data
           const leaveTypes = [
               { type: "Sick", used: userSickLeaves, remaining: remainingSickLeaves, limit: limitedsickleaves },
               { type: "Casual", used: userCasualLeaves, remaining: remainingCasualLeaves, limit: limitedcasualleaves },
               { type: "Paternity", used: userPaternityLeaves, remaining: remainingPaternityLeaves, limit: limitedpaternityleaves },
               { type: "Maternity", used: userMaternityLeaves, remaining: remainingMaternityLeaves, limit: limitedmaternityleaves }
           ];

           leaveTypes.forEach(leave => {
               if ((Usergender === 'MALE' && leave.type === 'Maternity') ||
                   (Usergender === 'FEMALE' && leave.type === 'Paternity')) {
                   return;
               }
               const col = document.createElement('div');
               col.className = "col-md-3 mb-4 d-flex align-items-stretch";
               const card = document.createElement('div');
               card.className = "card bg-light shadow-sm border-radius-10";
               const cardBody = document.createElement('div');
               cardBody.className = "card-body p-3";
               const cardTitle = document.createElement('h5');
               cardTitle.className = "card-title mb-2";
               cardTitle.textContent = `${leave.type} Leave`;
               const cardText = document.createElement('p');
               cardText.className = "card-text mb-0";
               cardText.innerHTML = `
                   <strong>Used:</strong> ${leave.used} <br>
                   <strong>Remaining:</strong> ${leave.remaining} <br>
                   <strong>Limit:</strong> ${leave.limit}
               `;
               cardBody.appendChild(cardTitle);
               cardBody.appendChild(cardText);
               card.appendChild(cardBody);
               col.appendChild(card);

               row.appendChild(col);
           });
           container.appendChild(row);

           // Append container to the dashboard
           dashboard.appendChild(container);

           // Resolve the promise to indicate completion
           resolve();
       });
   }

   //manager view of employeeTracker

   myteamleavetracker.addEventListener('click', function() {
   console.log("Emtering into my Employees leaveTracker");
    fetchEmployeesLeaveData();
   });

   async function fetchEmployeesLeaveData() {
       try {
           // Make a GET request to the servlet
           const response = await fetch('/LeaveManagement/leavetrackerempundermanager');

           // Check if the response status is OK (status code 200-299)
           if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
           }

           // Parse the JSON response

           const leaveData = await response.json();

           console.log(leaveData);

           // Process the leave data
           displayEmployeesLeaveData(leaveData);

       } catch (error) {
           // Handle errors (e.g., network issues, parsing issues)
           console.error('Error fetching leave data:', error);
           alert('An error occurred while fetching leave data. Please try again later.');
       }
   }


   function displayEmployeesLeaveData(leaveData) {
       // Check if leaveData is an object
       if (typeof leaveData !== 'object' || leaveData === null) {
           alert("leaveData is Empty");
           return;
       }


       if (Object.keys(leaveData).length === 0) {
               dashboard.innerHTML = '';
               const container = document.createElement('div');
               container.className = 'container text-center my-5';

               // Creating a card to hold the message
               const card = document.createElement('div');
               card.className = 'card shadow-lg border-light bg-light p-4';
               card.innerHTML = `
                   <div class='card-body'>
                       <h2 class='card-title text-success'>No Employees Found</h2>
                       <p class='card-text'>It looks like there are no employees under You.</p>
                       <i class='fas fa-user-times fa-3x text-muted'></i>
                   </div>
               `;
               container.appendChild(card);
               dashboard.appendChild(container);
               return;
       }
       dashboard.innerHTML = '';

       // Create a container for the leave data
       const leaveContainer = document.createElement('div');
       leaveContainer.className = 'container';

       // Iterate through each employee's leave data
       for (const [empId, data] of Object.entries(leaveData)) {
           // Debug: log each employee's data
           console.log(`Employee ${empId}:`, data);

           // Check if data is valid
           if (!data || typeof data !== 'object') {
               console.error(`Invalid data for employee ${empId}:`, data);
               continue; // Skip this employee if data is invalid
           }

           const empDiv = document.createElement('div');
           empDiv.className = 'card mb-3'; // Card with margin-bottom

           const cardBody = document.createElement('div');
           cardBody.className = 'card-body';

           // Create card header
           const cardHeader = document.createElement('h5');
           cardHeader.className = 'card-title bg-primary text-white p-2';
           cardHeader.textContent = `Employee ID: ${empId}`;
           cardBody.appendChild(cardHeader);

           // Create leave type details
           const leaveList = document.createElement('ul');
           leaveList.className = 'list-group list-group-flush';

           for (const [leaveType, totalDays] of Object.entries(data)) {
               const listItem = document.createElement('li');
               listItem.className = 'list-group-item';

               // Determine the limit for each leave type
               let leaveLimit = 0;
               switch (leaveType.toLowerCase()) {
                   case 'sick':
                       leaveLimit = limitedsickleaves;
                       break;
                   case 'casual':
                       leaveLimit = limitedcasualleaves;
                       break;
                   case 'paternity':
                       leaveLimit = limitedpaternityleaves;
                       break;
                   case 'maternity':
                       leaveLimit = limitedmaternityleaves;
                       break;
                   default:
                       leaveLimit = 'N/A';
               }

               // Create leave type and total days with limit
               listItem.innerHTML = `
                   <strong>${leaveType}</strong>: ${totalDays} days
                   <br>
                   <small class="text-muted">Limit: ${leaveLimit} days</small>
               `;
               leaveList.appendChild(listItem);
           }

           // Append leave list to card body
           cardBody.appendChild(leaveList);

           // Add leave limits details
           const leaveLimits = document.createElement('div');
           leaveLimits.className = 'mt-3';
           leaveLimits.innerHTML = `
               <h6 class="bg-light p-2">Leave Limits</h6>
               <ul class="list-group">
                   <li class="list-group-item">Casual Leaves: ${limitedcasualleaves} days</li>
                   <li class="list-group-item">Sick Leaves: ${limitedsickleaves} days</li>
                   <li class="list-group-item">Maternity Leaves: ${limitedmaternityleaves} days</li>
                   <li class="list-group-item">Paternity Leaves: ${limitedpaternityleaves} days</li>
               </ul>
           `;
           cardBody.appendChild(leaveLimits);

           empDiv.appendChild(cardBody);
           leaveContainer.appendChild(empDiv);
       }
       dashboard.appendChild(leaveContainer);
   }

    fetch("/LeaveManagement/profileservlet", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        profileInfoDiv.innerHTML = '';
        const profileContent = document.createElement('div');
        profileContent.className = 'alert alert-info';
        const profile = data[0];
        Usergender = profile.gender;
        profileContent.innerHTML = `
            <button class='profileupdatedbutton'><h5 class="mb-0">Hi, ${profile.name}</h5></button>
        `;
        profileInfoDiv.appendChild(profileContent);

        document.querySelector('.profileupdatedbutton').addEventListener('click', function() {
             console.log('Profile Updated button clicked!');
             profilefun()
        });
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
    });



    fetch("/LeaveManagement/validatecokkie",{
        method: 'GET',
        headers: {
             'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
         if (data.message === 'isnotvalid') {
             window.location.href = "/LeaveManagement/";
         }
    })
    .catch(error => {
         console.error('Error fetching data:', error);
    });

    handleGenderBasedOptions();
    limitedleavesdata()
    .then(employeeUsedLeavesByType)
    .then(userleavesDashboard)
    .catch(error => {
        console.error('Error in sequence:', error);
    });
});