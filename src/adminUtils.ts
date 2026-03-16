import React from 'react';
import { useNavigate } from 'react-router-dom';

export function useAdminFetch() {
  const navigate = useNavigate();
  return React.useCallback(async (url: string, options: RequestInit = {}) => {
    console.log("AdminFetch request:", url, options);
    const token = localStorage.getItem('adminToken');
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    };
    try {
      const res = await fetch(url, { ...options, headers });
      console.log("AdminFetch response:", res);
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        throw new Error('Unauthorized');
      }
      return res;
    } catch (error) {
      console.error("AdminFetch error:", error);
      throw error;
    }
  }, [navigate]);
}
