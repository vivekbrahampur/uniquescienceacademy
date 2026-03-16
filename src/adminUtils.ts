import React from 'react';
import { useNavigate } from 'react-router-dom';

export function useAdminFetch() {
  const navigate = useNavigate();
  return React.useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
      throw new Error('Unauthorized');
    }
    return res;
  }, [navigate]);
}
