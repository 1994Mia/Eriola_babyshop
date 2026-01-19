import React, { useEffect, useState } from "react";
import {
  getItemReviews,
  canReviewItem,
  createReview,
} from "../services/reviewService";

const ReviewsPage = ({ itemId, orderId }) => {
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();

    if (orderId) {
      checkCanReview();
    }
  }, [itemId, orderId]);

  const loadReviews = async () => {
    try {
      const res = await getItemReviews(itemId);
      setReviews(res.data);
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const res = await canReviewItem(orderId, itemId);
      setCanReview(res.data.canReview);
    } catch {
      setCanReview(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createReview(orderId, itemId, {
        rating,
        comment,
      });

      setRating(5);
      setComment("");
      setCanReview(false);
      loadReviews();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not submit review."
      );
    }
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto" }}>
      <h2>Customer Reviews</h2>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "15px 0",
          }}
        >
          <p><strong>⭐ {review.rating} / 5</strong></p>
          <p>{review.comment}</p>
          <small>
            {review.user?.email} •{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}

      {canReview && (
        <>
          <h3 style={{ marginTop: "30px" }}>Add Your Review</h3>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label>Rating:</label>
              <br />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>Comment:</label>
              <br />
              <textarea
                rows="4"
                style={{ width: "100%" }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={{ marginTop: "10px" }}>
              Submit Review
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ReviewsPage;