import AboutUs from "../../assets/images/about-us/about-us.jpg";
import "./about.css";

const About = () => {

  return (
    <main className="about">
      <article>
        <section className="about-title">
          <h2>Expenseless: Budget Expense Tracker</h2>
          <p>With us budgeting expenses has never been easier!</p>
        </section>
      </article>
      <article className="about-us">
        <section>
          <p className="tagline">Explore</p>
          <h3>
            About <span className="highlight-title">Expenseless</span>
          </h3>
          <p>
            Expenseless is a market-leading personal finance manager which was
            built to help you save money, plan for the future, and see all your
            finances in one place. With Expenseless you can stay on top of your
            daily expenses automatically with bank synchronization, manage debt,
            monitor expenses and incomes, dive into weekly reports on your
            spending, and track bills. Expenseless allows you to see your
            finances your way - anywhere, any time. No more need for your
            notebooks and spreadsheets, and budget for clear, tangible goals
            that are easy to track in real-time. Tracking your spending will get
            a whole lot easier with us! Gain full control of your finances with
            beautifully designed reports on your accounts.
          </p>
        </section>
        <img src={AboutUs} alt="finance" />
      </article>
      <hr />
      
    </main>
  );
};

export default About;
