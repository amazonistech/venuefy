import { eventTypes } from "../lib/publicApi";

export default function SearchBar({ service = false, categories = [], filters = {} }) {
  const action = service ? "/services/list" : "/venues";
  return (
    <form className="finder" action={action} role="search" key={JSON.stringify(filters)}>
      <label><i className="bi bi-geo-alt" aria-hidden="true" /><span>Where<input name="search" defaultValue={filters.search || filters.city || ""} maxLength={100} placeholder={service ? "City, area or service" : "City, area or venue"} /></span></label>
      {!service && <>
        <label><i className="bi bi-calendar-event" aria-hidden="true" /><span>Event date<input name="date" type="date" defaultValue={filters.date || ""} /></span></label>
        <label><i className="bi bi-people" aria-hidden="true" /><span>Guests<input name="guests" type="number" min="1" max="1000000" defaultValue={filters.guests || ""} placeholder="Add guests" /></span></label>
        <label><i className="bi bi-list" aria-hidden="true" /><span>Event type<select name="eventType" defaultValue={filters.eventType || ""}><option value="">Any event</option>{Object.entries(eventTypes).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></span></label>
        {filters.category && <input type="hidden" name="category" value={filters.category} />}
      </>}
      {service && <label><i className="bi bi-grid" aria-hidden="true" /><span>Type of service<select name="category" defaultValue={filters.category || ""}><option value="">All services</option>{categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></span></label>}
      <button type="submit" aria-label={service ? "Search services" : "Search venues"}><i className="bi bi-search" aria-hidden="true" /></button>
    </form>
  );
}
