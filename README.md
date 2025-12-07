# 🤖 AI-Powered Restaurant Management System (RYS)

An intelligent, browser-based solution for modernizing table and order management in small to medium-sized restaurants and cafes. Built with pure HTML, CSS, and JavaScript, enhanced with simulated AI capabilities for predictive insights and reporting.

---

## ✨ Key Features

This system provides a comprehensive set of tools for seamless restaurant operations:

- **Intelligent Table Management**  
  - Real-time tracking of table status (Occupied/Free).  
  - Dynamic adding, removing (of empty tables only), and renaming of tables through the Settings panel.

- **AI-Enhanced Order Processing (Simulated)**  
  - Quick-entry product selection modal with category filtering.  
  - Efficiently build up an Adisyon (Check/Bill) for a selected table.

- **Comprehensive Financial Tracking**  
  - Calculation of total adisyon amount.  
  - Secure closure of checks and robust logging of payment records into `gecmisSatislar` (Past Sales).

- **AI-Driven Reporting & Analytics**  
  - **Performance Metrics:** Daily Gross Revenue, Order Count, Average Check Amount, Table Occupancy Rate.  
  - **Predictive Trends (Simulated):** Weekly and monthly sales projections.  
  - **Best Seller Analysis:** Top 5 selling products by unit count.  
  - **Data Export:** Download generated reports in TXT format.

- **User Experience**  
  - Light and Dark theme options, saved to `localStorage`.

- **Data Persistence**  
  - Uses `localStorage` to ensure tables, adisions, and historical sales data persist after browser closure.

---

## ⚙️ AI Component Rationale

The "AI-Powered" tag reflects the system's ability to process real-time transactional data to deliver immediate, actionable insights and predictive forecasts.

- **Instant Trend Reporting:**  
  Uses real-time sales data to create simulated weekly/monthly projections, aiding quick resource planning.

- **Best Seller Deep Dive:**  
  Automatically analyzes transactions to identify top-performing products, allowing menu optimization and inventory control.

---

## 🛠️ Installation and Setup

Since this project is built entirely using vanilla frontend technologies (HTML, CSS, JavaScript), no backend server is required.

