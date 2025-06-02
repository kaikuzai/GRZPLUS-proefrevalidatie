export const SmileyVeryBad = ({ selected }: { selected: boolean }) => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className={`smiley ${selected ? "selected" : ""}`}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill={selected ? "#e74c3c" : "#f8f9fa"}
      stroke="#e74c3c"
      strokeWidth="2"
    />
    <circle cx="18" cy="20" r="2" fill="#333" />
    <circle cx="32" cy="20" r="2" fill="#333" />
    <path d="M15 32 Q25 22 35 32" stroke="#333" strokeWidth="2" fill="none" />
  </svg>
);

export const SmileyBad = ({ selected }: { selected: boolean }) => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className={`smiley ${selected ? "selected" : ""}`}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill={selected ? "#f39c12" : "#f8f9fa"}
      stroke="#f39c12"
      strokeWidth="2"
    />
    <circle cx="18" cy="20" r="2" fill="#333" />
    <circle cx="32" cy="20" r="2" fill="#333" />
    <path d="M15 30 Q25 26 35 30" stroke="#333" strokeWidth="2" fill="none" />
  </svg>
);

export const SmileyNeutral = ({ selected }: { selected: boolean }) => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className={`smiley ${selected ? "selected" : ""}`}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill={selected ? "#95a5a6" : "#f8f9fa"}
      stroke="#95a5a6"
      strokeWidth="2"
    />
    <circle cx="18" cy="20" r="2" fill="#333" />
    <circle cx="32" cy="20" r="2" fill="#333" />
    <line x1="15" y1="30" x2="35" y2="30" stroke="#333" strokeWidth="2" />
  </svg>
);

export const SmileyGood = ({ selected }: { selected: boolean }) => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className={`smiley ${selected ? "selected" : ""}`}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill={selected ? "#2ecc71" : "#f8f9fa"}
      stroke="#2ecc71"
      strokeWidth="2"
    />
    <circle cx="18" cy="20" r="2" fill="#333" />
    <circle cx="32" cy="20" r="2" fill="#333" />
    <path d="M15 28 Q25 38 35 28" stroke="#333" strokeWidth="2" fill="none" />
  </svg>
);

export const SmileyVeryGood = ({ selected }: { selected: boolean }) => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className={`smiley ${selected ? "selected" : ""}`}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill={selected ? "#27ae60" : "#f8f9fa"}
      stroke="#27ae60"
      strokeWidth="2"
    />
    <circle cx="18" cy="20" r="2" fill="#333" />
    <circle cx="32" cy="20" r="2" fill="#333" />
    <path d="M15 26 Q25 40 35 26" stroke="#333" strokeWidth="2" fill="none" />
  </svg>
);
