import styled from "styled-components";
import React, { useState } from "react";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupStyle = {
  background: "rgb(205, 205, 205)",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "250px",
  textAlign: "center",
};

const ButtonRow = styled.div`
  display: flex;
  /* width: 40px; */
  margin-left: 40px;
  margin-right: 40px;

  justify-content: space-between;
  margin-top: 12px;
`;

const Btn = styled.button`
  all: unset; /* remove all browser default button styles */
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  /* padding: 6px 12px; */
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #eee;
  }
`;

const Title = styled.h3`
  all: unset;
  display: block;
  font-family: inherit;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export function ChooseName({ handleSubmit, handleClose, setName, name }) {
  const [draft, setDraft] = useState(name ?? "");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit?.(draft);
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <Title>Enter session name</Title>
        <form onSubmit={onSubmit} noValidate>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your name"
            required
            autoFocus
          />
          <ButtonRow>
            <Btn type="submit">Submit</Btn>
            <Btn type="button" onClick={handleClose}>
              Cancel
            </Btn>
          </ButtonRow>
        </form>
      </div>
    </div>
  );
}

// const overlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0,0,0,0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const popupStyle = {
//   background: "white",
//   padding: "20px",
//   borderRadius: "10px",
//   minWidth: "250px",
//   textAlign: "center",
//   boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
// };

export function ApproveCancelPopup({
  onApprove,
  onCancel,
  message = "Are you sure?",
}) {
  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h3 style={{ marginBottom: "16px" }}>{message}</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 14px",
              border: "1px solid #bbb",
              borderRadius: "8px",
              background: "#fff",
              color: "#555",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onApprove}
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
