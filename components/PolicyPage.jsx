import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./PolicyPage.module.css";

function PolicyBlock({ block, index, cover = false }) {
  const text = block.text || "";

  if (block.type === "eyebrow") {
    return <p key={index} className={styles.eyebrow}>{text}</p>;
  }

  if (block.type === "title" || (cover && index === 1 && /cancellation, rescheduling/i.test(text))) {
    return <h1 key={index} className={styles.documentTitle}>{text}</h1>;
  }

  if (block.type === "heading1") {
    return <h2 key={index} className={styles.heading1}>{text}</h2>;
  }

  if (block.type === "heading2") {
    return <h3 key={index} className={styles.heading2}>{text}</h3>;
  }

  if (block.type === "heading3") {
    return <h4 key={index} className={styles.heading3}>{text}</h4>;
  }

  if (block.type === "list") {
    return <div key={index} className={styles.listItem}><span className={styles.bullet} aria-hidden="true">•</span><span>{text}</span></div>;
  }

  if (block.type === "callout" || /^IMPORTANT\b|^PLEASE READ BEFORE BOOKING:/i.test(text.trim())) {
    return (
      <div key={index} className={styles.callout} role="note">
        <span className={styles.calloutLabel}>Important</span>
        <p>{text.replace(/^IMPORTANT:\s*/i, "").replace(/^PLEASE READ BEFORE BOOKING:\s*/i, "")}</p>
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div key={index} className={`table-responsive ${styles.tableWrap}`}>
        <table className={`table table-bordered align-middle mb-0 ${styles.policyTable}`}>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const isMetaTable = cover && row.length === 2;
                  const Cell = isMetaTable && cellIndex === 0 ? "th" : "td";
                  return <Cell key={cellIndex}>{cell}</Cell>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (cover && index === 2) {
    return <p key={index} className={styles.subtitle}>{text}</p>;
  }

  return <p key={index} className={styles.paragraph}>{text}</p>;
}

export default function PolicyPage({ title, blocks }) {
  const firstHeadingIndex = blocks.findIndex((block, index) =>
    index > 0 && (block.type === "heading1" || block.type === "heading2")
  );
  const coverBlocks = firstHeadingIndex === -1 ? blocks : blocks.slice(0, firstHeadingIndex);
  const bodyBlocks = firstHeadingIndex === -1 ? [] : blocks.slice(firstHeadingIndex);

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className="container">
          <nav aria-label="breadcrumb" className={styles.breadcrumbWrap}>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/#policies">Policies</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{title}</li>
            </ol>
          </nav>

          <article className={styles.document}>
            <section className={styles.cover}>
              {coverBlocks.map((block, index) => (
                <PolicyBlock key={`${block.type}-${index}`} block={block} index={index} cover />
              ))}
            </section>

            <div className={styles.policyBody}>
              {bodyBlocks.map((block, index) => (
                <PolicyBlock key={`${block.type}-${index}`} block={block} index={index + firstHeadingIndex} />
              ))}
            </div>

            <div className={styles.relatedPolicies}>
              <h2>Related Policies</h2>
              <div className={styles.relatedLinks}>
                <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/cookie-policy">Cookie Policy</Link>
                <Link href="/refund-policy">Refund Policy</Link>
                <Link href="/cancellation-refund-policy">Cancellation &amp; Refund Policy</Link>
              </div>
            </div>

            <p className={styles.documentFootnote}>
              This page presents the customer-facing policy text. Please contact Venuefy through the official contact details stated in the policy for policy-related queries.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
