import axios from "axios";

const API_URL = "http://localhost:8080/api/reviews";

// Uses the same token logic as the rest of your project
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all reviews for a product/item
export const getItemReviews = (itemId) => {
  return axios.get(`${API_URL}/item/${itemId}`);
};

// Check if logged-in user can review a specific item from an order
export const canReviewItem = (orderId, itemId) => {
  return axios.get(
    `${API_URL}/can-review/${orderId}/${itemId}`,
    authHeader()
  );
};

// Create a new review
export const createReview = (orderId, itemId, reviewData) => {
  return axios.post(
    `${API_URL}/order/${orderId}/item/${itemId}`,
    reviewData,
    authHeader()
  );
};
