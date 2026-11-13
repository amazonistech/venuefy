"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { QuoteBreakdown } from "./PackagePricing";
import { downloadBookingReceipt } from "../lib/bookingReceipt";
import useCustomerData from "./useCustomerData";
import usePublicData from "./usePublicData";
import {
  customerApi,
  logout,
  setSession,
  useCustomer,
} from "./customerSession";
import { hrefWith, eventTypes, money } from "../lib/publicApi";
import {
  indiaTime,
  indiaInterval,
  paise,
  stateLabel,
  fromRupees,
} from "../lib/bookingDisplay";
import { openCheckout } from "../lib/checkout";

function Panel({ children, customer, title, path }) {
  return (
    <>
      <Header />
      <main className="container account-content">
        <nav className="account-tabs" aria-label="Customer account">
          <Link href="/bookings">My bookings</Link>
          <Link href="/account/enquiries">Enquiries</Link>
          <Link href="/account/notifications">Notifications</Link>
          <Link href="/change-password">Change password</Link>
          {customer && (
            <button
              type="button"
              className="vf-text-button"
              onClick={() => logout().catch(() => {})}
            >
              Log out
            </button>
          )}
        </nav>
        <h1>{title}</h1>
        {customer ? (
          children
        ) : (
          <p>
            <Link
              className="vf-button"
              href={hrefWith("/login", { next: path })}
            >
              Log in to continue
            </Link>
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}

function Pager({ page, total, limit = 20, setPage }) {
  if (!total || total <= limit) return null;
  return (
    <nav className="account-links" aria-label="Results pages">
      <button
        className="vf-button outline"
        type="button"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
      <span>
        Page {page} of {Math.ceil(total / limit)}
      </span>
      <button
        className="vf-button outline"
        type="button"
        disabled={page * limit >= total}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

function VenueName({ id }) {
  const venue = usePublicData(
    id ? `/venue/public/${encodeURIComponent(id)}` : null,
  );
  return venue.data?.venueName || "Venue booking";
}

function ServiceBookings({ customer }) {
  const [page, setPage] = useState(1);
  const resource = useCustomerData(
    customer
      ? "/services/booking-requests/mine?page=" + page + "&limit=20"
      : null,
  );
  return (
    <section aria-labelledby="service-bookings-heading">
      <h2 id="service-bookings-heading">Service bookings</h2>
      {resource.loading && <p role="status">Loading service bookings…</p>}
      {resource.error && <p role="alert">{resource.error.message}</p>}
      {!resource.loading &&
        !resource.error &&
        !resource.data?.requests.length && (
          <p>
            No service bookings yet.{" "}
            <Link href="/services">Browse services</Link>
          </p>
        )}
      <div className="account-records">
        {resource.data?.requests.map((request) => (
          <article className="vf-panel" key={request._id}>
            <h3>{request.serviceName}</h3>
            <p className="booking-status">
              <strong>{stateLabel(request.status)}</strong>
            </p>
            <p>
              {indiaTime(request.startAt)} IST · {request.location}
            </p>
            <p>{money(request.listedPrice)} listed price</p>
            <small>Reference {request._id}</small>
          </article>
        ))}
      </div>
      <Pager
        page={page}
        total={resource.data?.totalRecords}
        setPage={setPage}
      />
    </section>
  );
}

export function BookingsPage() {
  const customer = useCustomer();
  const [page, setPage] = useState(1);
  const resource = useCustomerData(
    customer ? `/bookings?page=${page}&limit=20` : null,
  );
  return (
    <Panel title="My bookings" customer={customer} path="/bookings">
      <section aria-labelledby="venue-bookings-heading">
        <h2 id="venue-bookings-heading">Venue bookings</h2>
        {resource.loading && <p role="status">Loading bookings…</p>}
        {resource.error && <p role="alert">{resource.error.message}</p>}
        {!resource.loading &&
          !resource.error &&
          !resource.data?.bookings.length && (
            <p>
              No bookings yet. <Link href="/venues">Find a venue</Link>
            </p>
          )}
        <div className="account-records">
          {resource.data?.bookings.map((booking) => (
            <article className="vf-panel" key={booking._id}>
              <h2>
                <VenueName id={booking.venue} />
              </h2>
              <p>
                {eventTypes[booking.eventType] || stateLabel(booking.eventType)}{" "}
                · {indiaTime(booking.startAt)}
              </p>
              <p>
                {stateLabel(booking.status)} ·{" "}
                {paise(booking.price?.totalPaise)}
              </p>
              <Link
                className="vf-button outline"
                href={`/bookings/${booking._id}`}
              >
                View booking
              </Link>
            </article>
          ))}
        </div>
        <Pager
          page={page}
          total={resource.data?.pagination?.totalRecords}
          setPage={setPage}
        />
      </section>
      <ServiceBookings customer={customer} />
    </Panel>
  );
}

const stopped = [
  "cancelled",
  "refund_pending",
  "partially_refunded",
  "refunded",
  "completed",
  "disputed",
];
const canReschedule = ["confirmed", "awaiting_payment", "payment_pending"];
const refundStates = [
  "cancelled",
  "refund_pending",
  "partially_refunded",
  "refunded",
  "disputed",
];

function PaymentRows({ booking }) {
  const groups = [
    ["Online payments", booking.payments],
    ["Online refunds", booking.refunds],
    ["Direct payments", booking.directPayments],
    ["Direct refunds", booking.directRefunds],
  ];
  return groups
    .filter(([, rows]) => rows?.length)
    .map(([title, rows]) => (
      <div key={title}>
        <h3>{title}</h3>
        <ul className="money-rows">
          {rows.map((row) => (
            <li key={row._id}>
              <span>
                {row.reference || row.paymentId || stateLabel(row.status)}
              </span>
              <span>
                {paise(row.amountPaise)} · {stateLabel(row.status)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ));
}

function ActionForm({ action, booking, onSubmit, onClose, busy }) {
  const financial = ["direct-payments", "direct-refunds"].includes(action);
  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    onSubmit(action, () => {
      if (financial) {
        data.amountPaise = fromRupees(data.amount);
        delete data.amount;
      }
      if (action === "reschedule") {
        Object.assign(data, indiaInterval(data.start, data.end));
        delete data.start;
        delete data.end;
      }
      return data;
    });
  }
  return (
    <form className="vf-form vf-panel" onSubmit={submit}>
      <h3>{stateLabel(action.replaceAll("-", "_"))}</h3>
      {action === "reschedule" && (
        <div className="vf-field-grid">
          <label>
            New start (IST)
            <input name="start" type="datetime-local" required />
          </label>
          <label>
            New end (IST)
            <input name="end" type="datetime-local" required />
          </label>
        </div>
      )}
      {financial && (
        <>
          <div className="vf-field-grid">
            {action === "direct-refunds" && (
              <label>
                Verified direct payment
                <select name="directPayment" required>
                  {booking.directPayments
                    .filter((row) => row.status === "verified")
                    .map((row) => (
                      <option key={row._id} value={row._id}>
                        {row.reference} · {paise(row.amountPaise)}
                      </option>
                    ))}
                </select>
              </label>
            )}
            <label>
              Amount in rupees
              <input name="amount" inputMode="decimal" required />
            </label>
            <label>
              Transaction reference
              <input name="reference" required maxLength="150" />
            </label>
          </div>
          <label>
            Payment evidence details
            <textarea name="evidence" required maxLength="1000" />
          </label>
        </>
      )}
      {action !== "direct-payments" && (
        <label>
          Reason
          <textarea name="reason" required maxLength="1000" />
        </label>
      )}
      <div className="account-links">
        <button className="vf-button" disabled={busy}>
          Submit request
        </button>
        <button type="button" className="vf-button outline" onClick={onClose}>
          Close
        </button>
      </div>
    </form>
  );
}

function ReviewEditor({ booking, run, busy }) {
  const reviews = useCustomerData(`/reviews/mine?booking=${booking._id}`);
  const review = reviews.data?.reviews?.[0];
  if (reviews.loading) return <p role="status">Loading your review…</p>;
  if (reviews.error) return <p role="alert">{reviews.error.message}</p>;
  async function save(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const payload = { ...fields, rating: Number(fields.rating) };
    await run(async () => {
      await customerApi(review ? `/reviews/${review._id}` : "/reviews", {
        method: review ? "PUT" : "POST",
        body: {
          ...payload,
          ...(review ? { version: review.version } : { booking: booking._id }),
        },
      });
      reviews.reload();
      return "Review submitted for moderation.";
    });
  }
  if (review?.status === "withdrawn") return <p>Your review was withdrawn.</p>;
  return (
    <section className="vf-panel">
      <h2>Your venue review</h2>
      {review && (
        <p>
          {stateLabel(review.status)}
          {review.moderationReason && ` · ${review.moderationReason}`}
        </p>
      )}
      <form className="vf-form" onSubmit={save} key={review?.version ?? "new"}>
        <label>
          Rating
          <select name="rating" defaultValue={review?.rating || "5"}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} / 5
              </option>
            ))}
          </select>
        </label>
        <label>
          Title
          <input
            name="title"
            defaultValue={review?.title || ""}
            maxLength="150"
          />
        </label>
        <label>
          Review
          <textarea
            name="comment"
            defaultValue={review?.comment || ""}
            required
            minLength="10"
            maxLength="3000"
          />
        </label>
        <div className="account-links">
          <button className="vf-button" disabled={busy}>
            {review ? "Update review" : "Submit review"}
          </button>
          {review && (
            <button
              className="vf-button outline"
              type="button"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await customerApi(`/reviews/${review._id}`, {
                    method: "DELETE",
                    body: { version: review.version },
                  });
                  reviews.reload();
                  return "Review withdrawn.";
                })
              }
            >
              Withdraw
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export function BookingDetails({ id }) {
  const customer = useCustomer();
  const endpoint = `/bookings/${encodeURIComponent(id)}`;
  const resource = useCustomerData(customer ? endpoint : null);
  const [action, setAction] = useState("");
  const [feedback, setFeedback] = useState({});
  const [busy, setBusy] = useState(false);
  const booking = resource.data;
  async function run(task) {
    if (busy) return;
    setBusy(true);
    setFeedback({});
    try {
      const message = await task();
      if (message) setFeedback({ message });
      resource.reload();
    } catch (error) {
      setFeedback({ error: error.message, fields: error.fields });
    } finally {
      setBusy(false);
    }
  }
  const post = (name, body = {}) =>
    customerApi(`${endpoint}/${name}`, { body });
  function apply(name, makeBody) {
    return run(async () => {
      await post(name, makeBody?.());
      setAction("");
      return "Request saved.";
    });
  }
  function pay() {
    run(async () => {
      const order = await post("payment-order");
      const result = await openCheckout(order, customer);
      if (!result)
        return "Checkout closed. Refresh this booking to see the latest status.";
      const saved = await post("verify-payment", {
        orderId: result.razorpay_order_id,
        paymentId: result.razorpay_payment_id,
        signature: result.razorpay_signature,
      });
      return saved.status === "confirmed"
        ? "Advance verified. Your booking is confirmed."
        : "Check the latest payment status below.";
    });
  }
  function receipt() {
    run(async () => {
      const data = await customerApi(endpoint + "/receipt");
      await downloadBookingReceipt(data);
    });
  }
  return (
    <Panel title="Booking details" customer={customer} path={endpoint}>
      <Link href="/bookings">← My bookings</Link>
      {resource.loading && <p role="status">Loading booking status…</p>}
      {resource.error && <p role="alert">{resource.error.message}</p>}
      {booking && (
        <>
          <section className="vf-panel">
            <h2>
              <VenueName id={booking.venue} />
            </h2>
            <small>Reference {booking._id}</small>
            <div className="booking-status">
              <strong>{stateLabel(booking.status)}</strong>
              <span>{stateLabel(booking.paymentStatus)}</span>
            </div>
            <p>
              {eventTypes[booking.eventType] || stateLabel(booking.eventType)} ·{" "}
              {booking.guests} guests
            </p>
            <p>
              {indiaTime(booking.startAt)} – {indiaTime(booking.endAt)} IST
            </p>
            {booking.notes && <p>{booking.notes}</p>}
            {booking.price?.packageName && (
              <p>Package · {booking.price.packageName}</p>
            )}
            {booking.price?.lines?.length > 0 && (
              <QuoteBreakdown price={booking.price} totalLabel="Total" />
            )}
            <ul className="money-rows">
              {!booking.price?.lines?.length && (
                <li>
                  <span>Total</span>
                  <strong>{paise(booking.price?.totalPaise)}</strong>
                </li>
              )}
              {booking.requiredAdvancePaise > 0 && (
                <li>
                  <span>Required advance</span>
                  <strong>{paise(booking.requiredAdvancePaise)}</strong>
                </li>
              )}
              <li>
                <span>Remaining payable</span>
                <strong>{paise(booking.remainingPayablePaise)}</strong>
              </li>
            </ul>
            {booking.rescheduleRequest && (
              <p>
                Reschedule {stateLabel(booking.rescheduleRequest.status)} ·{" "}
                {indiaTime(booking.rescheduleRequest.startAt)}
              </p>
            )}
            {booking.cancellation && (
              <p>Cancellation · {booking.cancellation.reason}</p>
            )}
            <PaymentRows booking={booking} />
          </section>
          {booking.status === "quote_received" && booking.quote && (
            <section className="vf-panel">
              <h2>Venue quote</h2>
              <p>
                {paise(booking.quote.snapshot.totalPaise)} · Expires{" "}
                {indiaTime(booking.quote.expiresAt)} IST
              </p>
              <p>{booking.quote.reason}</p>
              <button
                className="vf-button"
                type="button"
                disabled={
                  busy || new Date(booking.quote.expiresAt) <= new Date()
                }
                onClick={() => apply("accept-quote")}
              >
                Accept quote
              </button>
            </section>
          )}
          <div className="account-links booking-buttons">
            {booking.status === "draft" && (
              <button
                type="button"
                className="vf-button"
                disabled={busy}
                onClick={() => apply("submit")}
              >
                Submit booking
              </button>
            )}
            {["awaiting_payment", "payment_pending"].includes(
              booking.status,
            ) && (
              <button
                type="button"
                className="vf-button"
                disabled={busy}
                onClick={pay}
              >
                Pay advance {paise(booking.requiredAdvancePaise)}
              </button>
            )}
            {booking.payments?.some((row) => row.status === "captured") && (
              <button
                type="button"
                className="vf-button outline"
                disabled={busy}
                onClick={receipt}
              >
                Download receipt
              </button>
            )}
            <button
              type="button"
              className="vf-button outline"
              disabled={busy}
              onClick={resource.reload}
            >
              Refresh status
            </button>
            {!stopped.includes(booking.status) &&
              booking.status !== "cancellation_requested" && (
                <button
                  type="button"
                  className="vf-button outline"
                  onClick={() => setAction("cancellation")}
                >
                  Request cancellation
                </button>
              )}
            {canReschedule.includes(booking.status) &&
              booking.rescheduleRequest?.status !== "requested" && (
                <button
                  type="button"
                  className="vf-button outline"
                  onClick={() => setAction("reschedule")}
                >
                  Request reschedule
                </button>
              )}
            {booking.status !== "disputed" && (
              <button
                type="button"
                className="vf-button outline"
                onClick={() => setAction("dispute")}
              >
                Raise dispute
              </button>
            )}
            {["confirmed", "completed"].includes(booking.status) &&
              booking.remainingPayablePaise > 0 && (
                <button
                  type="button"
                  className="vf-button outline"
                  onClick={() => setAction("direct-payments")}
                >
                  Report direct payment
                </button>
              )}
            {refundStates.includes(booking.status) &&
              booking.directPayments?.some(
                (row) => row.status === "verified",
              ) && (
                <button
                  type="button"
                  className="vf-button outline"
                  onClick={() => setAction("direct-refunds")}
                >
                  Report direct refund
                </button>
              )}
          </div>
          {action && (
            <ActionForm
              key={action}
              action={action}
              booking={booking}
              onSubmit={apply}
              onClose={() => setAction("")}
              busy={busy}
            />
          )}
          {feedback.error && (
            <p role="alert" className="vf-error">
              {feedback.error}
            </p>
          )}
          {feedback.fields && (
            <ul className="vf-error">
              {Object.entries(feedback.fields).map(([key, val]) => (
                <li key={key}>
                  {key}: {val}
                </li>
              ))}
            </ul>
          )}
          {feedback.message && (
            <p role="status" className="vf-success">
              {feedback.message}
            </p>
          )}
          {booking.status === "completed" && (
            <ReviewEditor booking={booking} run={run} busy={busy} />
          )}
        </>
      )}
    </Panel>
  );
}

export function CustomerActivity({ notifications = false }) {
  const customer = useCustomer();
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const path = notifications ? "/account/notifications" : "/account/enquiries";
  const resource = useCustomerData(
    customer
      ? `${notifications ? "/notifications" : "/enquiries/mine"}?page=${page}&limit=20`
      : null,
  );
  const records =
    resource.data?.[notifications ? "notifications" : "enquiries"] || [];
  return (
    <Panel
      title={notifications ? "Notifications" : "My enquiries"}
      customer={customer}
      path={path}
    >
      {resource.loading && <p role="status">Loading…</p>}
      {(resource.error || error) && (
        <p role="alert">{resource.error?.message || error}</p>
      )}
      {!resource.loading && !records.length && (
        <p>No {notifications ? "notifications" : "enquiries"} yet.</p>
      )}
      <div className="account-records">
        {records.map((row) => (
          <article className="vf-panel" key={row._id}>
            {notifications ? (
              <>
                <p>{row.message}</p>
                {row.booking && (
                  <Link href={`/bookings/${row.booking}`}>View booking</Link>
                )}
                {!row.readAt && (
                  <button
                    type="button"
                    className="vf-text-button"
                    onClick={async () => {
                      try {
                        await customerApi(`/notifications/${row._id}/read`, {
                          method: "PATCH",
                          body: {},
                        });
                        resource.reload();
                      } catch (error) {
                        setError(error.message);
                      }
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </>
            ) : (
              <>
                <h2>{row.reference || "Venue enquiry"}</h2>
                <p>
                  {stateLabel(row.eventType)} · {stateLabel(row.status)}
                </p>
                <Link href={`/account/enquiries/${row._id}`}>View enquiry</Link>
              </>
            )}
          </article>
        ))}
      </div>
      <Pager
        page={page}
        total={resource.data?.totalRecords}
        setPage={setPage}
      />
    </Panel>
  );
}
