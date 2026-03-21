import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { StudentProvider } from './context/CareerAdviceModule/StudentContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Admin pages
import AdminDashboard from './pages/CareerAdviceModule/AdminDashboard';
import AddLeadership from './components/CareerAdviceModule/Admin/AddLeadership';
import ManageLeadership from './components/CareerAdviceModule/Admin/ManageLeadership';
import AddTechnicalResource from './components/CareerAdviceModule/Admin/AddTechnicalResource';
import ManageTechnical from './components/CareerAdviceModule/Admin/ManageTechnical';
import AddQuiz from './components/CareerAdviceModule/Admin/AddQuiz';
import ManageQuiz from './components/CareerAdviceModule/Admin/ManageQuiz';
import QuizResults from './components/CareerAdviceModule/Admin/QuizResults';
import EnrollmentReport from './components/CareerAdviceModule/Admin/EnrollmentReport';

// Student pages
import StudentDashboard from './pages/CareerAdviceModule/StudentDashboard';
import LeadershipPrograms from './components/CareerAdviceModule/Student/LeadershipPrograms';
import TechnicalResources from './components/CareerAdviceModule/Student/TechnicalResources';
import TakeQuiz from './components/CareerAdviceModule/Student/TakeQuiz';
import QuizList from './components/CareerAdviceModule/Student/QuizList';
import MyProgress from './components/CareerAdviceModule/Student/MyProgress';
import Chatbot from './components/CareerAdviceModule/Student/Chatbot';

import './App.css';

const MainContent = () => {
  const location = useLocation();
  const isStudent = location.pathname.startsWith('/student');

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/student/dashboard" />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/leadership" element={<LeadershipPrograms />} />
            <Route path="/student/technical" element={<TechnicalResources />} />
            <Route path="/student/quizzes" element={<QuizList />} />
            <Route path="/student/quiz/:id" element={<TakeQuiz />} />
            <Route path="/student/progress" element={<MyProgress />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leadership/add" element={<AddLeadership />} />
            <Route path="/admin/leadership/manage" element={<ManageLeadership />} />
            <Route path="/admin/technical/add" element={<AddTechnicalResource />} />
            <Route path="/admin/technical/manage" element={<ManageTechnical />} />
            <Route path="/admin/quiz/add" element={<AddQuiz />} />
            <Route path="/admin/quiz/manage" element={<ManageQuiz />} />
            <Route path="/admin/quiz/results" element={<QuizResults />} />
            <Route path="/admin/enrollments" element={<EnrollmentReport />} />
          </Routes>
          {isStudent && <Chatbot />}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <StudentProvider>
      <Router>
        <MainContent />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      </Router>
    </StudentProvider>
  );
}

export default App;
