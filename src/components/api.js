import axios from "axios";

const reviewsAPI = axios.create({
  baseURL: "https://boardgame-reviews.cyclic.app/api",
});

export const getReviews = (page = 0, limit = 10) => {
  return reviewsAPI
    .get("/reviews", { params: { p: page, limit: limit } })
    .then((response) => {
      return response.data;
    });
};

export const getReview = (review_id) => {
  return reviewsAPI.get(`/reviews/${review_id}`).then((response) => {
    return response.data.review;
  });
};

export const getCommentsByReview = (review_id) => {
  return reviewsAPI.get(`/reviews/${review_id}/comments`).then((response) => {
    return response.data.comments;
  });
};

export const patchReviewVotes = (voteIncrement, review_id) => {
  return reviewsAPI
    .patch(`/reviews/${review_id}`, { inc_votes: voteIncrement })
    .then((response) => {
      return response.data.review.votes;
    });
};

export const patchCommentVotes = (voteIncrement, comment_id) => {
  return reviewsAPI
    .patch(`/comments/${comment_id}`, { inc_votes: voteIncrement })
    .then((response) => {
      return response.data.comment.votes;
    });
};
