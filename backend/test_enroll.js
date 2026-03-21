async function testEnroll() {
    try {
        const techRes = await fetch('http://localhost:5000/api/technical');
        const techData = await techRes.json();
        const courses = techData.data;
        if (!courses || courses.length === 0) {
            console.log('No technical resources exist.');
            return;
        }
        const courseId = courses[0]._id;
        console.log(`Enrolling in Technical Resource: ${courseId}`);

        const enrollRes = await fetch('http://localhost:5000/api/enrollments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentName: 'Test Student',
                studentEmail: 'test@gmail.com',
                programId: courseId,
                programType: 'TechnicalResource'
            })
        });
        const enrollData = await enrollRes.json();
        console.log('Response:', enrollData);
    } catch (e) {
        console.log('Error:', e.message);
    }
}

testEnroll();
