import apiClient from './client';

export interface Student {
  id: string;
  code: string;
  firstName: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  gender?: string;
  email: string;
  phone?: string;
  address?: string;
  parentPhone?: string;
  parentEmail?: string;
  batchId?: string;
  section?: string;
  photo?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentPayload {
  code: string;
  firstName: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  gender?: string;
  email: string;
  phone?: string;
  address?: string;
  parentPhone?: string;
  parentEmail?: string;
  batchId?: string;
  section?: string;
  photo?: string;
  status?: 'active' | 'inactive';
}

// Get all students
export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await apiClient.get('/students');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
};

// Get student by ID
export const getStudentById = async (id: string): Promise<Student> => {
  try {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch student ${id}:`, error);
    throw error;
  }
};

// Create new student
export const createStudent = async (
  payload: CreateStudentPayload
): Promise<Student> => {
  try {
    const response = await apiClient.post('/students', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to create student:', error);
    throw error;
  }
};

// Update student
export const updateStudent = async (
  id: string,
  payload: Partial<CreateStudentPayload>
): Promise<Student> => {
  try {
    const response = await apiClient.put(`/students/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to update student ${id}:`, error);
    throw error;
  }
};

// Delete student
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/students/${id}`);
  } catch (error) {
    console.error(`Failed to delete student ${id}:`, error);
    throw error;
  }
};

// Enrollment API functions
export interface Enrollment {
  id: string;
  studentId: string;
  batchId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enroll student in batch
export const enrollStudentInBatch = async (
  studentId: string,
  batchId: string
): Promise<Enrollment> => {
  try {
    const response = await apiClient.post('/enrollments', {
      studentId,
      batchId,
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to enroll student:', error);
    throw error;
  }
};

// Get student enrollments
export const getStudentEnrollments = async (studentId: string): Promise<Enrollment[]> => {
  try {
    const response = await apiClient.get(`/enrollments/${studentId}`);
    return response.data.data || [];
  } catch (error: any) {
    // Return empty array if not found (student may not be enrolled yet)
    if (error.response?.status === 404) {
      return [];
    }
    console.error(`Failed to fetch enrollments for student ${studentId}:`, error);
    return [];
  }
};

// Remove enrollment
export const removeEnrollment = async (studentId: string, batchId: string): Promise<void> => {
  try {
    await apiClient.post('/enrollments/remove', {
      studentId,
      batchId,
    });
  } catch (error) {
    console.error('Failed to remove enrollment:', error);
    throw error;
  }
};

