/*~~~~~$ Selectors $~~~~~*/
const form = document.getElementById("student-form");
const studentNameInput = document.getElementById("student-name");
const studentScoreInput = document.getElementById("student-score");
const addBtn = document.getElementById("add-btn");
const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");
const searchInput = document.getElementById("search");
const studentTableBody = document.querySelector(".student-infromation tbody");
const studentTable = document.querySelector(".student-infromation table");

/*~~~~~$ Global Variables $~~~~~*/
let students = JSON.parse(localStorage.getItem("students")) || [];
let currentEditingIndex = null;

/*~~~~~$ Handlers $~~~~~*/
form.addEventListener("submit", handleFormSubmit);
sortSelect.addEventListener("change", handleSort);
filterSelect.addEventListener("change", handleFilter);
searchInput.addEventListener("input", handleSearch);

/*~~~~~$ Validation $~~~~~*/

// ? Function to validate student name using regex
function validateName(name) {
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(name);
}

// ? Function to validate student score using regex
function validateScore(score) {
  const scoreRegex = /^\d+$/;
  return scoreRegex.test(score) && score >= 0 && score <= 100;
}

/*~~~~~$ Utility $~~~~~*/
// ? Function to calculate grade based on score
function calculateGrade(score) {
  if (score >= 90) return "A";
  if (score < 90 && score >= 85) return "-A";
  if (score < 85 && score >= 80) return "B+";
  if (score < 80 && score >= 75) return "B";
  if (score < 75 && score >= 70) return "-B";
  if (score < 75 && score >= 70) return "c+";
  if (score < 70 && score >= 65) return "c";
  if (score < 65 && score >= 60) return "-c";
  if (score < 60 && score >= 55) return "D+";
  if (score < 55 && score >= 50) return "D";
  return "F";
}

// ? Function to render the students table
function renderTable(studentsToRender = students) {
  if (!studentTableBody) return; // ? Ensure the table body exists
  studentTableBody.innerHTML = "";
  if (studentsToRender.length === 0) {
    studentTableBody.innerHTML =
      '<tr><td colspan="5" class="empty-table"><p>No student data added yet!</p></td></tr>';
    return;
  }
  studentsToRender.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.department}</td>
      <td>${student.grade}</td>
      <td>
        <div class="buttons">
          <button onclick="editStudent(${index})">Update</button>
          <button class="delete" onclick="confirmDelete(${index})">Delete</button>
        </div>
      </td>
    `;
    studentTableBody.appendChild(tr);
  });
}

// ? Function to show custom popup
function showPopup(message, type = "info") {
  const popup = document.createElement("div");
  popup.classList.add("custom-popup", type);
  popup.innerHTML = `
    <div class="popup-content">
      <p>${message}</p>
      <button class="popup-close" onclick="closePopup()">Close</button>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
  setTimeout(() => {
    closePopup();
  }, 3000);
}

// ? Function to create confirmation popup
function confirmDelete(index) {
  const popup = document.createElement("div");
  popup.classList.add("custom-popup", "confirm");
  popup.innerHTML = `
    <div class="popup-content">
      <p>Are you sure you want to delete this student?</p>
      <div>
        <button onclick="deleteStudent(${index})">Yes</button>
        <button onclick="closePopup()">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}

// ? Function to close popup
function closePopup() {
  const popup = document.querySelector(".custom-popup.show");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 300);
  }
}

/*$ CRUD Functions $*/
// ? Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const name = studentNameInput.value.trim();
  const score = parseInt(studentScoreInput.value.trim());
  const department = form.department.value;

  if (!validateName(name)) {
    showError(studentNameInput, "*Invalid name");
    return;
  }
  if (!validateScore(score)) {
    showError(studentScoreInput, "*Invalid score");
    return;
  }

  const student = {
    name,
    department,
    score,
    grade: calculateGrade(score),
  };

  if (currentEditingIndex !== null) {
    students[currentEditingIndex] = student;
    currentEditingIndex = null;
    addBtn.innerText = "Add Student";
    showPopup("Student updated successfully", "success");
    studentNameInput.classList.remove("editing");
    studentScoreInput.classList.remove("editing");
  } else {
    students.push(student);
    showPopup("Student added successfully", "success");
  }

  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
  form.reset();
}

// ? Function to edit a student
function /* The `editStudent` function is responsible for populating the form fields with the details
of a selected student for editing. When a user clicks the "Update" button on a specific
student row in the table, the `editStudent` function is called with the index of that
student in the `students` array. */
editStudent(index) {
  const student = students[index];
  studentNameInput.value = student.name;
  studentScoreInput.value = student.score;
  form.department.value = student.department;
  currentEditingIndex = index;
  addBtn.innerText = "Update Student";
  studentNameInput.classList.add("editing");
  studentScoreInput.classList.add("editing");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ? Function to delete a student
function deleteStudent(index) {
  closePopup();
  students.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
  showPopup("Student deleted successfully", "success");
}

/*$ Error Handling Functions $*/
// ? Function to show error message
function showError(input, message) {
  const errorElement = document.createElement("p");
  errorElement.classList.add("error-message");
  errorElement.innerText = message;
  input.parentNode.appendChild(errorElement);
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.parentNode.removeChild(errorElement);
    }
  }, 3000);
}

/*$ Sorting and Filtering Functions $*/
// ? Function to handle sorting
function handleSort() {
  const sortValue = sortSelect.value;
  if (sortValue === "gpa_desc") {
    students.sort((a, b) => b.score - a.score);
  } else if (sortValue === "gpa_asc") {
    students.sort((a, b) => a.score - b.score);
  } else if (sortValue === "name_desc") {
    students.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortValue === "name_asc") {
    students.sort((a, b) => a.name.localeCompare(b.name));
  }
  renderTable();
}

// ? Function to handle filtering
function handleFilter() {
  const filterValue = filterSelect.value;
  let filteredStudents = students;
  if (filterValue === "passed") {
    filteredStudents = students.filter((student) => student.score >= 50);
  } else if (filterValue === "failed") {
    filteredStudents = students.filter((student) => student.score < 50);
  } else if (filterValue !== "all") {
    filteredStudents = students.filter(
      (student) => student.grade.toLowerCase() === filterValue.toLowerCase()
    );
  }
  renderTable(filteredStudents);
}

// ? Function to handle search
function handleSearch() {
  const searchValue = searchInput.value.toLowerCase();
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchValue)
  );
  renderTable(filteredStudents);
}

// ? Initial render
renderTable();
