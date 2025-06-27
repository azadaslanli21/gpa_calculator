document.addEventListener('DOMContentLoaded', () => {

    const gradePoints = {
        'a+': 4.0, 'a': 4.0, 'a-': 3.7,
        'b+': 3.3, 'b': 3.0, 'b-': 2.7,
        'c+': 2.3, 'c': 2.0, 'c-': 1.7,
        'd+': 1.3, 'd': 1.0, 'f': 0.0
    };
    const excludedGrades = ['au', 's', 'u', 'w', 'i'];

    const semestersContainer = document.getElementById('semesters-container');
    const addSemesterBtn = document.getElementById('add-semester-btn');
    const calculateGpaBtn = document.getElementById('calculate-gpa-btn');
    let semesterCount = 0;

    // --- ADD SEMESTER ---
    addSemesterBtn.addEventListener('click', () => {
        semesterCount++;
        const semesterId = semesterCount;

        const semesterBlock = document.createElement('div');
        semesterBlock.classList.add('semester-block');
        semesterBlock.id = `semester-${semesterId}`;
        
        // ★ NEW: HTML template for a new semester
        semesterBlock.innerHTML = `
            <div class="semester-header">
                <input type="text" value="Semester ${semesterId}" class="semester-title">
                <button class="remove-btn delete-semester-btn">Delete Semester</button>
            </div>
            <div class="add-course-form">
                <input type="text" placeholder="Course Name">
                <input type="number" placeholder="Credits">
                <input type="text" placeholder="Grade">
                <div class="retake-option">
                    <input type="checkbox" id="retake-checkbox-${semesterId}">
                    <label for="retake-checkbox-${semesterId}">Retake?</label>
                </div>
                <button class="add-course-btn">Add Course</button>
            </div>
            <div class="courses-list"></div>
        `;
        
        semestersContainer.appendChild(semesterBlock);

        // Add event listener to the new "Add Course" button
        semesterBlock.querySelector('.add-course-btn').addEventListener('click', () => {
            addCourseToSemester(semesterBlock);
        });

        // Add event listener to the new "Delete Semester" button
        semesterBlock.querySelector('.delete-semester-btn').addEventListener('click', () => {
            semesterBlock.remove();
        });
    });

    // --- ADD COURSE TO A SPECIFIC SEMESTER ---
    function addCourseToSemester(semesterBlock) {
        const form = semesterBlock.querySelector('.add-course-form');
        const courseName = form.children[0].value.trim();
        const credits = parseFloat(form.children[1].value);
        const grade = form.children[2].value.trim().toLowerCase();
        const isRetake = form.querySelector('input[type="checkbox"]').checked;

        const isExcluded = excludedGrades.includes(grade);
        if (courseName === '' || isNaN(credits) || credits <= 0 || (!gradePoints.hasOwnProperty(grade) && !isExcluded)) {
            alert('Please enter valid course details.');
            return;
        }

        const coursesList = semesterBlock.querySelector('.courses-list');
        const courseItem = document.createElement('div');
        courseItem.classList.add('course-item');

        let tagsHTML = '';
        if (isRetake) tagsHTML += '<span class="course-tag tag-retake">Retake</span>';
        if (isExcluded) tagsHTML += '<span class="course-tag tag-excluded">No GPA</span>';

        courseItem.innerHTML = `
            <div class="course-details">
                <span class="course-name">${courseName}</span>${tagsHTML}
                <br>
                <span>Credits: ${credits}, Grade: ${grade.toUpperCase()}</span>
            </div>
            <button class="remove-btn">Remove</button>
        `;

        courseItem.dataset.credits = credits;
        courseItem.dataset.grade = grade;
        courseItem.dataset.isRetake = isRetake;
        courseItem.dataset.isExcluded = isExcluded;

        courseItem.querySelector('.remove-btn').addEventListener('click', () => courseItem.remove());
        coursesList.appendChild(courseItem);

        // Clear form fields
        form.children[0].value = '';
        form.children[1].value = '';
        form.children[2].value = '';
        form.querySelector('input[type="checkbox"]').checked = false;
    }

    // --- CALCULATE FINAL GPA ---
    calculateGpaBtn.addEventListener('click', () => {
        const currentGpa = parseFloat(document.getElementById('current-gpa').value) || 0;
        const currentCredits = parseFloat(document.getElementById('current-credits').value) || 0;

        let totalQualityPoints = currentGpa * currentCredits;
        let totalCredits = currentCredits;

        // ★ NEW: Loop through each semester, then each course
        document.querySelectorAll('.semester-block').forEach(semesterBlock => {
            semesterBlock.querySelectorAll('.course-item').forEach(course => {
                const credits = parseFloat(course.dataset.credits);
                const grade = course.dataset.grade;
                const isRetake = course.dataset.isRetake === 'true';
                const isExcluded = course.dataset.isExcluded === 'true';

                if (isExcluded) return; // Skip excluded grade

                const points = gradePoints[grade];
                totalQualityPoints += points * credits;
                if (!isRetake) {
                    totalCredits += credits;
                }
            });
        });

        const finalGpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
        document.getElementById('final-gpa').textContent = finalGpa.toFixed(3);
    });
});