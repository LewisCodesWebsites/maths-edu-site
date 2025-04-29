import React, { useState } from 'react';

const SchoolDashboard = () => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState('');
  const [newStudent, setNewStudent] = useState('');

  const addTeacher = () => {
    if (newTeacher.trim()) {
      setTeachers([...teachers, newTeacher]);
      setNewTeacher('');
    }
  };

  const addStudent = () => {
    if (newStudent.trim()) {
      setStudents([...students, newStudent]);
      setNewStudent('');
    }
  };

  return (
    <div>
      <h1>School Dashboard</h1>

      <div>
        <h2>Manage Teachers</h2>
        <input
          type="text"
          placeholder="Enter teacher's name"
          value={newTeacher}
          onChange={(e) => setNewTeacher(e.target.value)}
        />
        <button onClick={addTeacher}>Add Teacher</button>
        <ul>
          {teachers.map((teacher, index) => (
            <li key={index}>{teacher}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Manage Students</h2>
        <input
          type="text"
          placeholder="Enter student's name"
          value={newStudent}
          onChange={(e) => setNewStudent(e.target.value)}
        />
        <button onClick={addStudent}>Add Student</button>
        <ul>
          {students.map((student, index) => (
            <li key={index}>{student}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchoolDashboard;