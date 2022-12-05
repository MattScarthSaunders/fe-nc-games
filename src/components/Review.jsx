import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByReview, getReview, patchReviewVotes } from "./api";
import Votes from "./Votes";

const Review = () => {
  const { review_id } = useParams();
  const [review, setReview] = useState({});
  const [reviewLoading, setReviewLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    setReviewLoading(true);
    setCommentsLoading(true);

    getReview(review_id).then((response) => {
      setReview(response);
      setReviewLoading(false);
      setVotes((currVotes) => {
        let newVotes = { ...currVotes };
        newVotes.reviewVotes = 0;
        return newVotes;
      });
    });
    getCommentsByReview(review_id).then((response) => {
      setComments(response);
      setCommentsLoading(false);
      setVotes((currVotes) => {
        let newVotes = { ...currVotes };
        response.forEach((comment) => {
          newVotes[comment.comment_id] = 0;
        });
        return newVotes;
      });
    });
  }, []);

  useEffect(() => {
    patchReviewVotes(votes.reviewVotes, review_id)
      .then()
      .catch((err) => {
        if (err) {
          setVotes((currVotes) => {
            let newVotes = { ...currVotes };
            newVotes.reviewVotes += votes.reviewVotes * -1;
            return newVotes;
          });
        }
      });
  }, [votes.reviewVotes]);

  const reviewVotes = review.votes + votes.reviewVotes;

  return reviewLoading ? (
    <p>Loading Review...</p>
  ) : (
    <>
      <section className="Review">
        <img
          className="Review--Img"
          src={review.review_img_url}
          alt="review.title"
        />
        <section className="Review--About">
          <h2>{review.title}</h2>
          <h3>Game Designer: {review.designer}</h3>
          <h3>Category: {review.category}</h3>
        </section>
        <section className="Review--Body">
          <h3>Review:</h3>
          <p>{review.review_body}</p>
          <p>Review by: {review.owner}</p>
          <p>Reviewed on: {review.created_at.slice(0, 10)}</p>
          <p>Votes: {reviewVotes}</p>
          <Votes buttonName="reviewVotes" setVotes={setVotes} />
        </section>
      </section>
      {commentsLoading ? (
        <p>Loading Comments...</p>
      ) : (
        <section className="Comments">
          <h3>Comments</h3>
          {comments.length < 1 ? (
            <p>There are no comments yet!</p>
          ) : (
            <ul className="Comments--List">
              {comments.map((comment) => {
                return (
                  <li key={comment.comment_id}>
                    <h4>{comment.author}</h4>
                    <p>at {comment.created_at}</p>
                    <p>Votes: {comment.votes + votes[comment.comment_id]}</p>
                    <Votes
                      buttonName={comment.comment_id}
                      setVotes={setVotes}
                    />

                    <p>{comment.body}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </>
  );
};

export default Review;
