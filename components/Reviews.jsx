export default function Reviews({ rating, reviews = 0 }) {
  return (
    <section className="reviews-card">
      <div className="review-summary">
        {rating ? (
          <>
            ⭐ <b>{rating}</b> ({reviews} reviews)
          </>
        ) : (
          <>No reviews yet</>
        )}
      </div>
    </section>
  );
}
