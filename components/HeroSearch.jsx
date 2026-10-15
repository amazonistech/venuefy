"use client";

export default function HeroSearch({
  search,
  setSearch,
  categories = [],
  category,
  setCategory,
  locations = [],
  eventDate,
  setEventDate,
  guests,
  setGuests,
  onSearch,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch?.();
  }

  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="container text-center">
          <h1>
            Find the perfect
            <br />
            venue for your <em>celebration</em>
          </h1>
          <p>Discover verified venues for weddings, parties, corporate events and more</p>
          <form className="hero-search" onSubmit={handleSubmit} role="search">
            <label className="hero-search-field hero-location-field">
              <i className="bi bi-geo-alt-fill search-field-icon" aria-hidden="true" />
              <span>
                <b>Where</b>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search city, area or venue"
                  list="venue-locations"
                  aria-label="Search city, area or venue"
                />
              </span>
            </label>
            <label className="hero-search-field">
              <i className="bi bi-calendar-event search-field-icon" aria-hidden="true" />
              <span>
                <b>Event Date</b>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  aria-label="Event date"
                />
              </span>
            </label>
            <label className="hero-search-field">
              <i className="bi bi-people-fill search-field-icon" aria-hidden="true" />
              <span>
                <b>Guests</b>
                <select value={guests} onChange={(event) => setGuests(event.target.value)} aria-label="Number of guests">
                  <option value="">Any guests</option>
                  <option value="50">Up to 50</option>
                  <option value="100">Up to 100</option>
                  <option value="250">Up to 250</option>
                  <option value="500">Up to 500</option>
                  <option value="1000">500+</option>
                </select>
              </span>
            </label>
            <label className="hero-search-field event-type-field">
              <i className="bi bi-grid-fill search-field-icon" aria-hidden="true" />
              <span>
                <b>Event Type</b>
                <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Venue category">
                  <option value="">All venue types</option>
                  {categories.map((item) => (
                    <option value={item._id} key={item._id}>{item.name}</option>
                  ))}
                </select>
              </span>
            </label>
            <button className="hero-search-submit" type="submit" aria-label="Search venues" title="Search venues">
              <i className="bi bi-search" aria-hidden="true" />
            </button>
          </form>
          <datalist id="venue-locations">
            {locations.map((location) => <option value={location} key={location} />)}
          </datalist>
          <div className="location-pills" aria-label="Popular locations">
            {locations.slice(0, 6).map((location) => (
              <button type="button" onClick={() => { setSearch(location); onSearch?.(location); }} key={location}>
                <i className="bi bi-geo-alt" aria-hidden="true" /> {location}
              </button>
            ))}
          </div>
          <p className="search-filter-note">Date and guest count are selectable; results currently filter by venue, location and category supported by the API.</p>
        </div>
      </div>
    </section>
  );
}
