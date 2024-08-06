document.addEventListener('DOMContentLoaded', function() {
    fetch('https://randomuser.me/api/')
        .then(response => response.json())
        .then(data => {
            const user = data.results[0]; // Assuming you want the first user
            console.log(user);

            // Populate form fields with user data
            document.getElementById('firstname').value = user.name.first;
            document.getElementById('lastname').value = user.name.last;
            document.getElementById('email').value = user.email;
            document.getElementById('agetext').value = user.dob.age;

            // Set default values
            document.getElementById('sourceincome').value = 'employed';
            document.getElementById('incomerangebar').value = 20000;
            document.getElementById('incomeDisplay').textContent = '20k';

            // Set gender
            if (user.gender === 'female') {
                document.getElementById('femaleradio').checked = true;
            } else if (user.gender === 'male') {
                document.getElementById('maleradio').checked = true;
            }

            // Set hobbies
            const hobbies = ['music', 'sports', 'travel', 'movies'];
            hobbies.forEach(hobby => {
                const checkbox = document.getElementById(hobby);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });

            // Handle form submission
            document.querySelector('form').addEventListener('submit', function(event) {
                event.preventDefault();

                // Collect form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries()); 
                console.log(data);

                // Send data to the server
                fetch('https://reqres.in/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    alert('Form submitted successfully!');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Form submission failed.');
                });
            });

            // Update income display
            document.getElementById('incomerangebar').addEventListener('input', function() {
                document.getElementById('incomeDisplay').textContent = `${this.value / 1000}k`;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
