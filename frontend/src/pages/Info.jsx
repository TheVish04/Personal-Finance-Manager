// frontend/src/pages/Info.jsx
import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

function Info() {
  return (
    <div style={{ padding: '2rem', lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Section 1: Introduction */}
      <section style={{ marginBottom: '4rem' }}>
        <ScrollReveal>
          <div>
            <h2>Welcome to Personal Finance Manager</h2>
            <p>
              Our Personal Finance Manager is designed to help you effortlessly track, manage, and analyze your expenses.
              With a robust set of features, you can quickly get a clear picture of your spending habits and make informed
              decisions to improve your financial health.
            </p>
          </div>
        </ScrollReveal>
      </section>
      
      {/* Section 2: Features */}
      <section style={{ marginBottom: '4rem' }}>
        <ScrollReveal>
          <div>
            <h2>Features</h2>
            <p>Key features include:</p>
            <ul>
              <li>Secure user authentication and registration.</li>
              <li>Easy expense tracking with add, edit, and delete options.</li>
              <li>Real-time updates to keep your dashboard current.</li>
              <li>Interactive reporting and analytics to visualize your spending.</li>
              <li>Optional document uploads for receipts and supporting files.</li>
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
              Our application is built on the MERN stack, integrating a robust Express backend with a dynamic React frontend.
              Data is securely stored in a cloud-based MongoDB database, ensuring your information is safe and accessible.
              The intuitive design and real-time functionality make it easy for you to stay on top of your finances.
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
              Whether you're looking to manage your monthly budget or track your expenses for a specific project,
              our Personal Finance Manager is the perfect tool for you.
              Register or log in to start taking control of your financial future.
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
              "This app revolutionized the way I handle my expenses. It's simple, intuitive, and extremely helpful." – Jane D.
            </p>
            <p>
              "I love the real-time updates and detailed reporting. It has truly helped me manage my finances better." – John S.
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
              We are dedicated to empowering individuals to achieve financial stability and success.
              Our goal is to continuously improve and enhance our platform to serve you better.
            </p>
          </div>
        </ScrollReveal>
      </section>
      
    </div>
  );
}

export default Info;
