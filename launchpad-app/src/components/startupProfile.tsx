import { useState, useEffect, useCallback } from "react";

type ProfileUser = {
  id?: string;
  name?: string;
  email?: string;
};

type Props = {
  user: ProfileUser;
};

type Notification = {
  message: string;
  type: "success" | "error";
};

type ProfileData = {
  companyName: string;
  tagline: string;
  memberCount: string;
  industry: string;
  stage: string;
};

const STORAGE_KEY = "launchpad_startup_profile";

const INDUSTRIES = [
  "Technology & Software",
  "Artificial Intelligence (AI)",
  "FinTech (Finance Technology)",
  "EdTech (Education Technology)",
  "HealthTech",
  "E-Commerce & Marketplace",
  "Marketing & Media",
  "Design & Creative",
  "Business Services",
  "Travel & Hospitality",
  "AgriTech & Food",
  "IoT & Hardware",
  "GreenTech & Sustainability",
  "Social Impact",
];

const STAGES = [
  "Idea",
  "MVP",
  "Prototype",
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Growth",
  "Established",
];

const loadProfile = (): ProfileData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveProfile = (data: ProfileData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const StartupProfile = ({ user }: Props) => {
  const [profile, setProfile] = useState<ProfileData | null>(loadProfile);

  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((message: string, type: "success" | "error") => {
    setNotification({ message, type });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(clearNotification, 4000);
    return () => clearTimeout(timer);
  }, [notification, clearNotification]);

  const [form, setForm] = useState<ProfileData>(
    profile ?? {
      companyName: "",
      tagline: "",
      memberCount: "",
      industry: "",
      stage: "",
    },
  );

  const openModal = () => {
    setForm(
      profile ?? {
        companyName: "",
        memberCount: "",
        tagline: "",
        industry: "",
        stage: "",
      },
    );

    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("launchpad_auth_token");

      if (!token) {
        showNotification("Authentication token not found", "error");
        return;
      }

      const payload = {
        companyName: form.companyName,
        tagLine: form.tagline,
        currentStage: form.stage,
        industry: form.industry,
        teamSize: Number(form.memberCount) || 0,
      };

      const response = await fetch("http://localhost:5000/api/profile/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile creation failed");
      }

      showNotification("Profile saved successfully", "success");

      // save local cache after backend success

      saveProfile(form);

      setProfile(form);

      setModalOpen(false);
    } catch (error: any) {
      console.error(error);

      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const set =
    (field: keyof ProfileData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container dashboard-hero-grid">
          <div>
            <p className="dashboard-kicker">Startup Profile</p>

            <h1>{profile?.companyName || user.name?.trim() || "Founder"}</h1>

            <p className="dashboard-user-email">{user.email}</p>

            {profile?.tagline && (
              <p className="dashboard-copy">{profile.tagline}</p>
            )}

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <button className="hero-primary-action" onClick={openModal}>
                ⚙ Configure Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-content container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <p className="dashboard-card-label">Company</p>

            <h3>{profile?.companyName || "—"}</h3>

            <p>{profile?.tagline || "Tell the world about your startup."}</p>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-card-label">Current Stage</p>

            <h3>{profile?.stage || "—"}</h3>

            <p>Where you are in the startup journey.</p>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-card-label">Industry</p>

            <h3>{profile?.industry || "—"}</h3>

            <p>
              {profile?.industry ? "Primary sector" : "Select your industry."}
            </p>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-card-label">Team Size</p>

            <h3>{profile?.memberCount || "—"}</h3>

            <p>
              {profile?.memberCount
                ? "Team members"
                : "How many are building with you."}
            </p>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-card-label">Founder</p>

            <h3>{user.name?.trim() || "—"}</h3>

            <p>{user.email || ""}</p>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-card-label">Network</p>

            <h3>Connect & Grow</h3>

            <p>Discover investors and collaborators.</p>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="task-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="task-modal profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="task-modal-close"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            <div className="task-modal-header">
              <h2>Startup Profile</h2>
            </div>

            <div className="task-modal-body">
              <div className="task-modal-field">
                <span className="task-modal-label">Company Name</span>

                <input
                  className="task-input"
                  placeholder="Your startup name"
                  value={form.companyName}
                  onChange={set("companyName")}
                />
              </div>

              <div className="task-modal-field">
                <span className="task-modal-label">Tag Line</span>

                <input
                  className="task-input"
                  placeholder="A short description"
                  value={form.tagline}
                  onChange={set("tagline")}
                />
              </div>

              <div className="task-modal-field">
                <span className="task-modal-label">Member Count</span>

                <input
                  className="task-input"
                  placeholder="e.g. 5"
                  value={form.memberCount}
                  onChange={set("memberCount")}
                />
              </div>

              <div className="task-modal-field">
                <span className="task-modal-label">Industry Category</span>

                <select
                  className="task-input"
                  value={form.industry}
                  onChange={set("industry")}
                >
                  <option value="">Select industry</option>

                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-modal-field">
                <span className="task-modal-label">Current Stage</span>

                <select
                  className="task-input"
                  value={form.stage}
                  onChange={set("stage")}
                >
                  <option value="">Select stage</option>

                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className="task-modal-footer"
              style={{
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                className="action-btn"
                onClick={() => setModalOpen(false)}
                style={{
                  color: "#64748b",
                  borderColor: "rgba(0,0,0,0.1)",
                }}
              >
                Cancel
              </button>

              <button
                className="add-btn"
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: "0.6rem 1.4rem",
                }}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`notification notification-${notification.type}`} onClick={clearNotification}>
          <span>{notification.message}</span>
          <button className="notification-close">✕</button>
        </div>
      )}
    </div>
  );
};

export default StartupProfile;
