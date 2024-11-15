const pageAnimation = () => {
    document.querySelector('body').style.opacity = 1;
}

let flag = false;

const onSubmit = async () => {
    let gender;
    let skills = [];

    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const website = document.getElementById('inputWebsite').value;
    const imageFile = document.getElementById('inputImageFile').files[0]; // Changed for file upload
    const gen = document.getElementsByName('gender');
    const ele = document.getElementsByName('skills');

    // Get selected gender
    for (let i = 0; i < gen.length; i++) {
        if (gen[i].checked) {
            gender = gen[i].value;
        }
    }

    // Get selected skills
    for (let i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            skills.push(ele[i].value);
        }
    }

    // Frontend display table data
    const data = [{
        name: name,
        email: email,
        website: website,
        gender: gender,
        skills: skills,
        image: URL.createObjectURL(imageFile) // Temporarily display chosen image
    }];

    if (!flag) {
        showTable();
        flag = true;
    }
    addRow(data);

    // Create FormData to send to backend server
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('website', website);
    formData.append('gender', gender);
    formData.append('skills', skills.join(', '));
    if (imageFile) formData.append('imageFile', imageFile);

    // Send data to backend
    try {
        const response = await fetch('http://localhost:3000/enroll', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const student = await response.json();
            console.log('Student enrolled in PostgreSQL:', student);
            alert('Student successfully enrolled in the database!');
        } else {
            alert('Failed to enroll student in the database.');
        }
    } catch (error) {
        console.error('Error submitting form to server:', error);
    }
}

// Function to display the table structure for enrolled students
const showTable = () => {
    const temp = document.querySelector('template');
    const dataTable = temp.content.cloneNode(true);
    const enrolledSection = document.querySelector('.enrolled-section');
    const old_child = enrolledSection.children[0];
    enrolledSection.replaceChild(dataTable, old_child);
}

// Function to add a new row in the table for the enrolled student
const addRow = (data) => {
    let table = document.getElementById('table-data');
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML = `
       <td>
           <span class="font-weight-bold">${data[0].name}</span><br/>
           <span>${data[0].gender}</span><br/>
           <span>${data[0].email}</span><br/>
           <a href="http://${data[0].website}" target="_blank" rel="noopener noreferrer">
               <u>${data[0].website}</u>
           </a><br/>
           ${data[0].skills.map(skill => `<span>${skill}</span>`).join(', ')}
       </td>`;

    row.insertCell(1).innerHTML = `
       <td style="width:100px; height:100px;">
           <img src="${data[0].image}" onerror="this.src='assets/fallback-image.jpg'" alt="image" />
       </td>`;
}
