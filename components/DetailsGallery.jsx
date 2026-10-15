export default function DetailsGallery({ venue }) {
  const images = venue?.images || [];
  const gallery = images.slice(0, 5);
  if (!gallery.length)
    return (
      <div className="details-gallery empty-gallery">
        <div>No venue images available.</div>
      </div>
    );
  return (
    <div className="details-gallery">
      <div
        className="gallery-main"
        style={{ backgroundImage: `url(${gallery[0]})` }}
      >
        <span>Featured</span>
      </div>
      <div className="gallery-side">
        {[1, 2, 3, 4].map((index) =>
          gallery[index] ? (
            <div
              key={gallery[index]}
              style={{ backgroundImage: `url(${gallery[index]})` }}
            >
              {index === 4 && <b>{images.length} Images</b>}
            </div>
          ) : (
            <div key={index} className="gallery-empty" />
          ),
        )}
      </div>
    </div>
  );
}
