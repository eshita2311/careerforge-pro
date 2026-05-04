import { useEffect } from "react";

function Success() {
  useEffect(() => {
    localStorage.setItem("isPro", "true");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎉 Payment Successful!</h1>
      <p>You are now a Pro user 🚀</p>
      <a href="/">Go Back</a>
    </div>
  );
}

export default Success;