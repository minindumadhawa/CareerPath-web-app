async function testEnroll() {
    try {
        const enrollRes = await fetch('http://localhost:5000/api/enrollments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentName: 'Test Student',
                studentEmail: 'test@gmail.com',
                programId: '65e9b8b8f2a1b1a13c9a0000', // random object id
                programType: 'TechnicalResource'
            })
        });
        const data = await enrollRes.json();
        console.log(data);
    } catch (e) { console.error('Error', e); }
}
testEnroll();
