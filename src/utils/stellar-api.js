const API_BASE_URL = 'https://norma.education-services.ru';

const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Ошибка: ${response.status} - ${response.statusText}`);
};

export const getIngredientsAPI = () =>
  fetch(`${API_BASE_URL}/api/ingredients`).then(checkResponse);

export const sendOrderAPI = (order) =>
  fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  }).then(checkResponse);
