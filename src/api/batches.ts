import apiClient from './client';

export interface Batch {
  id: string;
  code: string;
  name: string;
  year?: number;
  semester?: number;
  course?: string;
  coordinator?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  students?: any[];
  sections?: any[];
}

export interface CreateBatchPayload {
  code: string;
  name: string;
  year?: number;
  semester?: number;
  course?: string;
  coordinator?: string;
  description?: string;
  section?: string;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'inactive';
}

// Get all batches
export const getBatches = async (): Promise<Batch[]> => {
  try {
    const response = await apiClient.get('/batches');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch batches:', error);
    throw error;
  }
};

// Get batch by ID
export const getBatchById = async (id: string): Promise<Batch> => {
  try {
    const response = await apiClient.get(`/batches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch batch ${id}:`, error);
    throw error;
  }
};

// Create new batch
export const createBatch = async (
  payload: CreateBatchPayload
): Promise<Batch> => {
  try {
    const response = await apiClient.post('/batches', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to create batch:', error);
    throw error;
  }
};

// Update batch
export const updateBatch = async (
  id: string,
  payload: Partial<CreateBatchPayload>
): Promise<Batch> => {
  try {
    const response = await apiClient.put(`/batches/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to update batch ${id}:`, error);
    throw error;
  }
};

// Delete batch
export const deleteBatch = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/batches/${id}`);
  } catch (error) {
    console.error(`Failed to delete batch ${id}:`, error);
    throw error;
  }
};
