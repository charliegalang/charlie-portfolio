const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchPortfolio = async () => {
  try {
    const response = await fetch(`${API_URL}/portfolio`);
    if (!response.ok) throw new Error('Failed to fetch portfolio data');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

export const savePortfolio = async (portfolioData) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/portfolio`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(portfolioData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to save portfolio');
    return data;
  } catch (error) {
    console.error('Save error:', error);
    throw error;
  }
};
