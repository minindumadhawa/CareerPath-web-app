import React, { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    try {
      const saved = sessionStorage.getItem('careerpath_student');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (name, email) => {
    const s = { name, email };
    setStudent(s);
    sessionStorage.setItem('careerpath_student', JSON.stringify(s));
  };

  const logout = () => {
    setStudent(null);
    sessionStorage.removeItem('careerpath_student');
  };

  return (
    <StudentContext.Provider value={{ student, login, logout }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
