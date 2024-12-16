import React from 'react';
import { auth } from '../Firebase/Firebase'; // Ensure Firebase is imported if not already

function AboutUs() {
  // Ensure that only authenticated users can see this page
  const user = auth.currentUser;

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>You need to be logged in to view this page</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ margin: '100px 0', color: '#D81B60' }}>
        <h1>About Us</h1>
        <p style={{ fontSize: '18px', color: '#333' }}>
          Welcome to our ERP platform. This site was developed by <strong>LMKS Developers</strong> in
          collaboration with <strong>Intuit India</strong>. The platform is currently being deployed for
          trial and testing purposes only and is not available for sale or commercial use.
        </p>
        <p style={{ fontSize: '16px', color: '#555' }}>
          Our goal is to provide an intuitive and user-friendly system to streamline school management processes.
          The platform offers features such as fee management, attendance tracking, timetable management, and more.
          We hope that you find it useful for educational institutions and trust that it will improve administrative efficiency.
        </p>
        <p style={{ fontSize: '14px', color: '#777' }}>
          For any queries or feedback, please reach out to our support team.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
