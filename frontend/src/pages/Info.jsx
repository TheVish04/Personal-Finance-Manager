// frontend/src/pages/Info.jsx
import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedComponent from '../components/AnimatedComponent';


function Info() {
  return (
    <div style={{ padding: '2rem', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
      <AnimatedComponent>
        <section style={{ marginBottom: '4rem' }}>
          <ScrollReveal>
            <div>
              <h2>Welcome to Personal Finance Manager</h2>
              <p>
                Our Personal Finance Manager is designed to help you effortlessly track, manage, and analyze your expenses.
                With a robust set of features, you can quickly get a clear picture of your spending habits and make informed decisions.
              </p>
            </div>
          </ScrollReveal>
        </section>
      </AnimatedComponent>
      
      {/* Section 2: Features */}
      <section style={{ marginBottom: '4rem' }}>
        <ScrollReveal>
          <div>
            <h2>Features</h2>
            <p>Key features include:</p>
            <ul>
              <li>Secure user authentication and registration.</li>
              <li>Easy expense tracking with add, edit, and delete options.</li>
              <li>Real-time updates via Socket.io.</li>
              <li>Interactive reporting and analytics.</li>
              <li>Document uploads for receipts.</li>
            </ul>
          </div>
        </ScrollReveal>
      </section>
      
      {/* Section 3: How It Works */}
      <section style={{ marginBottom: '4rem' }}>
        <ScrollReveal>
          <div>
            <h2>How It Works</h2>
            <p>
              Built on the MERN stack, our platform integrates a robust Express backend with a dynamic React frontend.
              Data is securely stored in MongoDB Atlas, and real-time functionality keeps your dashboard up to date.
            </p>
          </div>
        </ScrollReveal>
      </section>
      
      {/* Section 4: Get Started */}
      <section style={{ marginBottom: '4rem' }}>
        <ScrollReveal>
          <div>
            <h2>Get Started Today</h2>
            <p>
              Register or log in to start taking control of your finances. Explore our dashboard to view your monthly income,
              expenses, and detailed reports.
            </p>
          </div>
        </ScrollReveal>
      </section>
      
      {/* Section 5: Testimonials */}
      <section style={{ marginBottom: '4rem' }}>
        <ScrollReveal>
          <div>
            <h2>Testimonials</h2>
            <p>
              "This app revolutionized the way I manage my expenses. It's intuitive and extremely helpful." – Jane D.
            </p>
            <p>
              "The real-time updates and detailed reports have made a huge difference in my budgeting." – John S.
            </p>
          </div>
        </ScrollReveal>
      </section>
      
      {/* Section 6: Our Vision */}
      <section style={{ marginBottom: '4rem' }}>
        <ScrollReveal>
          <div>
            <h2>Our Vision</h2>
            <p>
              We aim to empower individuals to achieve financial stability and success through continuous improvement of our platform.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

export default Info;
