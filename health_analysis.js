// Define variables
const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];

// Function to add patient data
function addPatient() {
  const name = document.getElementById("name").value;
  const genderEl = document.querySelector('input[name="gender"]:checked');
  const gender = genderEl ? genderEl.value : '';
  const age = document.getElementById("age").value;
  const condition = document.getElementById("condition").value;

  if (name && gender && age && condition) {
    patients.push({ name, gender, age, condition });
    resetForm();
    generateReport();
  } else {
    alert("Please fill all fields");
  }
}

// Reset form fields
function resetForm() {
  document.getElementById("name").value = "";
  const genderChecked = document.querySelector('input[name="gender"]:checked');
  if (genderChecked) genderChecked.checked = false;
  document.getElementById("age").value = "";
  document.getElementById("condition").value = "";
}

// Generate analysis report
function generateReport() {
  const numPatients = patients.length;
  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };
  const genderConditionsCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };
  for (const patient of patients) {
    if (conditionsCount.hasOwnProperty(patient.condition))
      conditionsCount[patient.condition]++;
    if (genderConditionsCount.hasOwnProperty(patient.gender))
      genderConditionsCount[patient.gender][patient.condition]++;
  }
  report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
  report.innerHTML += `Conditions Breakdown:<br>`;
  for (const cond in conditionsCount) {
    report.innerHTML += `${cond}: ${conditionsCount[cond]}<br>`;
  }
  report.innerHTML += `<br>Gender-Based Conditions:<br>`;
  for (const gender in genderConditionsCount) {
    report.innerHTML += `${gender}:<br>`;
    for (const cond in genderConditionsCount[gender]) {
      report.innerHTML += `&nbsp;&nbsp;${cond}: ${genderConditionsCount[gender][cond]}<br>`;
    }
  }
}

// Event listener for add patient button
addPatientButton.addEventListener("click", addPatient);

// Search function for condition details
function searchCondition() {
  const input = document.getElementById('conditionInput').value.toLowerCase();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  fetch('health_analysis.json')
    .then(response => response.json())
    .then(data => {
      const condition = data.conditions.find(item => item.name.toLowerCase() === input);
      if (condition) {
        const symptoms = condition.symptoms.join(', ');
        const prevention = condition.prevention.join(', ');
        const treatment = condition.treatment.join(', ');
        resultDiv.innerHTML = `
          <h2>${condition.name}</h2>
          <img src="${condition.imagesrc}" alt="${condition.name}" />
          <p><strong>Symptoms:</strong> ${symptoms}</p>
          <p><strong>Prevention:</strong> ${prevention}</p>
          <p><strong>Treatment:</strong> ${treatment}</p>
        `;
      } else {
        resultDiv.innerHTML = 'Condition not found.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.innerHTML = 'Error fetching data.';
    });
}
btnSearch.addEventListener('click', searchCondition);
