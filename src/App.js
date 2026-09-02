import { useEffect, useMemo, useState } from "react";
import "@/App.css";
import axios from "axios";
import {
  ArrowUpRight,
  CircleHelp,
  Flame,
  Search,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function Home() {
  const [people, setPeople] = useState([]);
  const [view, setView] = useState("overall");
  const [period, setPeriod] = useState("all-time");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [pending, setPending] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [form, setForm] = useState({
    participant_id: "p8",
    amount: "",
    source: "",
    note: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/leaderboard`, {
          params: {
            view,
            period,
            search: search || undefined,
          },
        });

        if (active) {
          setPeople(response.data.participants);
          setUpdated(response.data.updated);
        }
      } catch (error) {
        console.error("Could not load leaderboard:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [view, period, search]);

  const refreshPending = async () => {
    setPendingLoading(true);

    try {
      const response = await axios.get(`${API}/earnings?status=pending`);
      setPending(response.data);
    } catch (error) {
      console.error("Could not load pending earnings:", error);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    if (adminOpen) refreshPending();
  }, [adminOpen]);

  const me = useMemo(
    () => people.find((person) => person.name.includes("You")),
    [people]
  );

  const topThree = people.slice(0, 3);
  const tableRows = people.slice(3);

  const openPerson = (person) => setSelected(person);

  const updateEarning = async (entry, status) => {
    try {
      await axios.patch(`${API}/earnings/${entry.id}`, { status });
      await refreshPending();

      if (status === "approved") {
        window.location.reload();
      }
    } catch (error) {
      console.error(`Could not ${status} earning:`, error);
    }
  };

  const submitEarning = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API}/earnings`, {
        ...form,
        amount: Number(form.amount),
      });

      await refreshPending();
      setMessage("Submitted for EYFI review ✓");
      setForm({
        ...form,
        amount: "",
        source: "",
        note: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Could not submit this earning"
      );
    }
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand" data-testid="brand-logo">
          <span className="brand-eyfi">EYFI</span>
        </div>

        <nav>
          <a href="#leaderboard" data-testid="nav-leaderboard">
            Leaderboard
          </a>
          <a href="#how-it-works" data-testid="nav-how-it-works">
            How it works
          </a>
          <a href="#prizes" data-testid="nav-prizes">
            Prizes
          </a>
          <a href="#ambassadors" data-testid="nav-ambassadors">
            Become an Ambassador
          </a>
        </nav>

        <button className="join-button" data-testid="join-button">
          JOIN
        </button>

        <button
          className="submit-link"
          onClick={() => {
            setMessage("");
            setSubmitOpen(true);
          }}
          data-testid="open-submit-earning-button"
        >
          + Log an earning
        </button>

        <button
          className="help-button"
          onClick={() => setAdminOpen(!adminOpen)}
          data-testid="admin-review-toggle"
        >
          <CircleHelp size={17} />
          {adminOpen ? "Close review" : "EYFI review"}
        </button>
      </header>

      <main className="page-wrap" id="leaderboard">
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="live-dot" />
              WAVE 01 · LIVE RANKINGS
            </div>

            <h1>
              EARN <em>YOUR</em>
              <br />
              <span className="script-word">first</span>
              <br />
              INCOME<span className="lime-dot">.</span>
            </h1>

            <p className="hero-copy">
              India’s student earning movement — see who is turning skills,
              ideas and hustle into real income.
            </p>

            <div className="hero-prize">
              <Trophy size={24} />
              <strong>₹2 Lakhs</strong> in prizes
            </div>
          </div>

          <div className="hero-aside">
            <Sparkles size={20} />
            <span>
              30 days.
              <br />
              <strong>Your way.</strong>
            </span>
          </div>
        </section>

        {me && (
          <section className="your-card" data-testid="current-user-card">
            <div className="your-icon">
              <Trophy size={22} />
            </div>

            <div className="your-main">
              <span className="card-kicker">YOUR CURRENT RANK</span>
              <strong>
                #{me.rank} <span>of 1,284 earners</span>
              </strong>
            </div>

            <div className="your-stat">
              <span>Earned so far</span>
              <b>{money(me.earned)}</b>
            </div>

            <div className="your-stat">
              <span>Active streak</span>
              <b>
                <Flame size={16} /> {me.streak} days
              </b>
            </div>

            <button
              className="outline-button"
              onClick={() => openPerson(me)}
              data-testid="view-your-profile-button"
            >
              View profile <ArrowUpRight size={16} />
            </button>
          </section>
        )}

        <section className="controls">
          <div className="control-title">
            <h2>The earners</h2>
            <span data-testid="leaderboard-count">
              {people.length
                ? `Showing ${people.length} participants`
                : "No participants found"}
            </span>
          </div>

          <div className="control-actions">
            <label className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search a name, college..."
                data-testid="participant-search-input"
              />
            </label>

            <div className="segmented" data-testid="ranking-view-tabs">
              <button
                className={view === "overall" ? "active" : ""}
                onClick={() => setView("overall")}
                data-testid="overall-tab"
              >
                Overall
              </button>

              <button
                className={view === "college" ? "active" : ""}
                onClick={() => setView("college")}
                data-testid="college-tab"
              >
                By college
              </button>
            </div>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              data-testid="time-filter-select"
            >
              <option value="all-time">All time</option>
              <option value="weekly">This week</option>
              <option value="monthly">This month</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div className="loading" data-testid="leaderboard-loading">
            Refreshing the earners...
          </div>
        ) : (
          <>
            <section className="podium" data-testid="top-three-podium">
              {topThree.map((person) => (
                <button
                  className={`podium-card place-${person.rank}`}
                  key={person.id}
                  onClick={() => openPerson(person)}
                  data-testid={`participant-card-${person.id}`}
                >
                  <span className="rank-badge">
                    {person.rank === 1 ? <Trophy size={15} /> : `0${person.rank}`}
                  </span>

                  <div
                    className="avatar"
                    style={{ background: person.color }}
                  >
                    {person.initials}
                  </div>

                  <strong>{person.name.replace("You · ", "")}</strong>
                  <span className="college">{person.college}</span>
                  <b className="earnings">{money(person.earned)}</b>

                  <span className="category">
                    {person.category} <ArrowUpRight size={13} />
                  </span>
                </button>
              ))}
            </section>

            <section className="table-card" data-testid="leaderboard-table">
              <div className="table-head">
                <span>RANK / PARTICIPANT</span>
                <span>COLLEGE</span>
                <span>INCOME EARNED</span>
                <span>STREAK</span>
                <span />
              </div>

              {tableRows.map((person) => (
                <button
                  className={`table-row ${
                    person.name.includes("You") ? "is-you" : ""
                  }`}
                  key={person.id}
                  onClick={() => openPerson(person)}
                  data-testid={`participant-row-${person.id}`}
                >
                  <span className="rank-number">
                    {String(person.rank).padStart(2, "0")}
                  </span>

                  <span className="person-cell">
                    <span
                      className="mini-avatar"
                      style={{ background: person.color }}
                    >
                      {person.initials}
                    </span>

                    <span>
                      <strong>{person.name.replace("You · ", "")}</strong>
                      <small>{person.city}</small>
                    </span>
                  </span>

                  <span className="college-cell">{person.college}</span>
                  <strong className="income-cell">
                    {money(person.earned)}
                  </strong>

                  <span className="streak-cell">
                    <Flame size={15} /> {person.streak}d
                  </span>

                  <ArrowUpRight className="row-arrow" size={17} />
                </button>
              ))}
            </section>
          </>
        )}

        <div className="updated" data-testid="last-updated">
          Last updated {updated} <span>·</span> Income verified by EYFI
        </div>

        {adminOpen && (
          <section className="review-panel" data-testid="admin-review-panel">
            <div className="review-heading">
              <div>
                <span className="card-kicker">EYFI REVIEW DESK</span>
                <h2>Verify new earnings</h2>
              </div>

              <span
                className="pending-count"
                data-testid="pending-earnings-count"
              >
                {pendingLoading ? "Refreshing..." : `${pending.length} pending`}
              </span>
            </div>

            {pendingLoading ? (
              <p className="empty-review" data-testid="review-loading-state">
                Checking the latest submissions...
              </p>
            ) : pending.length === 0 ? (
              <p className="empty-review" data-testid="empty-review-state">
                No pending earnings right now. New participant submissions will
                appear here.
              </p>
            ) : (
              pending.map((entry) => (
                <div
                  className="review-row"
                  key={entry.id}
                  data-testid={`pending-earning-${entry.id}`}
                >
                  <div>
                    <strong>{entry.participant_name}</strong>
                    <small>
                      {entry.source} · {entry.note || "No note added"}
                    </small>
                  </div>

                  <b>{money(entry.amount)}</b>

                  <button
                    className="approve-button"
                    onClick={() => updateEarning(entry, "approved")}
                    data-testid={`approve-earning-${entry.id}`}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-button"
                    onClick={() => updateEarning(entry, "rejected")}
                    data-testid={`reject-earning-${entry.id}`}
                  >
                    Reject
                  </button>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      {submitOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setSubmitOpen(false)}
          data-testid="submit-earning-modal"
        >
          <form
            className="detail-modal submit-modal"
            onSubmit={submitEarning}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setSubmitOpen(false)}
              data-testid="close-submit-earning-button"
            >
              <X />
            </button>

            <span className="card-kicker">MAKE IT COUNT</span>
            <h2>Log an earning</h2>
            <p className="detail-college">
              Tell us what you made. EYFI reviews every entry before it reaches
              the rankings.
            </p>

            <label>
              Participant
              <select
                value={form.participant_id}
                onChange={(event) =>
                  setForm({
                    ...form,
                    participant_id: event.target.value,
                  })
                }
                data-testid="earning-participant-select"
              >
                {["p8", "p1", "p2", "p3", "p4", "p5", "p6", "p7"].map((id) => {
                  const person = people.find((item) => item.id === id);

                  return (
                    person && (
                      <option key={id} value={id}>
                        {person.name.replace("You · ", "")}
                      </option>
                    )
                  );
                })}
              </select>
            </label>

            <label>
              Amount earned (₹)
              <input
                required
                type="number"
                min="1"
                value={form.amount}
                onChange={(event) =>
                  setForm({
                    ...form,
                    amount: event.target.value,
                  })
                }
                placeholder="e.g. 2500"
                data-testid="earning-amount-input"
              />
            </label>

            <label>
              What did you earn from?
              <input
                required
                value={form.source}
                onChange={(event) =>
                  setForm({
                    ...form,
                    source: event.target.value,
                  })
                }
                placeholder="e.g. Resume reviews"
                data-testid="earning-source-input"
              />
            </label>

            <label>
              Quick note
              <input
                value={form.note}
                onChange={(event) =>
                  setForm({
                    ...form,
                    note: event.target.value,
                  })
                }
                placeholder="Optional context"
                data-testid="earning-note-input"
              />
            </label>

            {message && (
              <p className="form-message" data-testid="earning-submit-message">
                {message}
              </p>
            )}

            <button
              className="approve-button full-button"
              type="submit"
              data-testid="submit-earning-button"
            >
              Send for review <ArrowUpRight size={16} />
            </button>
          </form>
        </div>
      )}

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
          data-testid="participant-detail-modal"
        >
          <div
            className="detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelected(null)}
              data-testid="close-detail-button"
            >
              <X />
            </button>

            <div
              className="detail-avatar"
              style={{ background: selected.color }}
            >
              {selected.initials}
            </div>

            <span className="card-kicker">
              RANK #{selected.rank} · {selected.category.toUpperCase()}
            </span>

            <h2>{selected.name.replace("You · ", "")}</h2>
            <p className="detail-college">
              {selected.college} · {selected.city}
            </p>

            <div className="detail-earning">
              <span>Total earned</span>
              <b>{money(selected.earned)}</b>
              <small>
                <Flame size={14} /> {selected.streak}-day earning streak
              </small>
            </div>

            <p className="detail-bio">“{selected.bio}”</p>

            <div className="milestones">
              <h3>Milestones</h3>

              {selected.milestones.map((milestone) => (
                <div
                  className={`milestone ${
                    milestone.complete ? "complete" : ""
                  }`}
                  key={milestone.label}
                >
                  <span className="milestone-icon">
                    {milestone.complete ? "✓" : "○"}
                  </span>

                  <span>
                    <strong>{milestone.label}</strong>
                    <small>{milestone.value}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <Home />;
}
