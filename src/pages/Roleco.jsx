import { createSignal, onMount, onCleanup } from 'solid-js';
import { useParams } from '@solidjs/router';
import NameGrid from '../components/interface/NameGrid';
import LoaderModal from '../components/interface/LoaderModal';

const Roleco = props => {
  const [role, setRole] = createSignal(props.role.toUpperCase());
  const [company, setCompany] = createSignal(props.company.toUpperCase());
  const [timeLeft, setTimeLeft] = createSignal(60); // 60 seconds = 1 minute
  const [showModal, setShowModal] = createSignal(true);

  let timerInterval;

  onMount(() => {
    // Start the timer
    timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  });

  onCleanup(() => {
    clearInterval(timerInterval);
  });

  const params = useParams();

  const handleLetterUnlock = () => {
    console.log('letter unlocked - inside Roleco.jsx');
  };

  // Format time as MM:SS
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft() / 60);
    const seconds = timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const jsxElements = [
    <h1>{role()} at {company()}</h1>,
    <h2>Product Requirements</h2>,
    <h2>Key Features</h2>
  ];

  return (
    <>
      {showModal() && (
        <LoaderModal
          role={role()}
          company={company()}
          onClose={handleModalClose}
        />
      )}
      <div class="top-column">
        <NameGrid
          company={company()}
          role={role()}
          onLetterUnlock={handleLetterUnlock}
          jsxElements={jsxElements}
        />
      </div>
      <div class="bottom-column">
        <div class="prd-container">
          <h1 class="prd-title">
            Product Requirement Document: Draft Joshua Gantt for FanDuel's Product Manager Position
          </h1>

          <section class="prd-section">
            <h2>1. Game Plan Overview</h2>
            <div class="prd-subsection">
              <h3>1.1 The Play</h3>
              <p>
                FanDuel needs a star Product Manager for their rapidly growing Sportsbook. They're
                looking for someone who can handle the fast-paced environment of sports-tech
                entertainment and deliver winning products.
              </p>
            </div>
            <div class="prd-subsection">
              <h3>1.2 The Winning Move</h3>
              <p>
                Draft Joshua Gantt as the new Product Manager to drive innovation, enhance user
                experiences, and score big on product initiatives.
              </p>
            </div>
          </section>

          <section class="prd-section">
            <h2>2. Player Stats</h2>
            <div class="prd-subsection">
              <h3>2.1 Key Abilities</h3>
              <ul>
                <li>
                  Strategic Playmaking: Joshua brings 8 years of product lifecycle management
                  experience to the game.
                </li>
                <li>
                  Data Analytics: A champion at turning data into actionable insights, reducing AWS
                  bills by 12%.
                </li>
                <li>
                  Team Collaboration: MVP in cross-functional leadership, especially in
                  post-acquisition plays.
                </li>
                <li>
                  Agile Execution: Cuts through red tape to reduce process time by 11% for
                  enterprise clients.
                </li>
                <li>
                  Innovation Drive: Creates game-changing solutions like bespoke Javascript/PHP
                  frameworks.
                </li>
              </ul>
            </div>
            <div class="prd-subsection">
              <h3>2.2 Acceptance Criteria</h3>
              <ul>
                <li>
                  Increase user engagement metrics by 20% in first 6 months (measured in cheers per
                  feature)
                </li>
                <li>
                  Launch 2+ innovative features per quarter (aiming for SportsCenter Top 10
                  material)
                </li>
                <li>
                  Reduce time-to-market for new features by 30% (faster than a New York minute)
                </li>
              </ul>
            </div>
          </section>

          <section class="prd-section">
            <h2>3. Technical Scouting Report</h2>
            <ul>
              <li>
                8 years combined experience in product management and software development (like a
                dual-threat quarterback)
              </li>
              <li>
                Proficiency in product management tools and data analysis (his playbook is digital)
              </li>
              <li>
                Strong analytical skills with a track record of optimizing systems (he can read the
                defense AND the data)
              </li>
            </ul>
          </section>

          <section class="prd-section">
            <h2>4. The Intangibles</h2>
            <ul>
              <li>Collaborative team player (plays well with others, even New England fans)</li>
              <li>
                Innovative thinker (the Wayne Gretzky of product - skates to where the puck is
                going)
              </li>
              <li>
                Adaptable to changing market conditions (more flexible than a yoga instructor)
              </li>
            </ul>
          </section>

          <section class="prd-section">
            <h2>5. Game Day Strategy</h2>
            <ul>
              <li>
                Week 1-2: Onboarding and team huddle (expect a flurry of LinkedIn connections)
              </li>
              <li>
                Month 1: Analyze market and product landscape (scouting report will be more detailed
                than Bill Belichick's)
              </li>
              <li>
                Month 2: Develop and present new product strategy (prepare for mind-blowing plays)
              </li>
              <li>
                Month 3: Implement process improvements (watch efficiency skyrocket faster than a
                Hail Mary pass)
              </li>
            </ul>
          </section>

          <section class="prd-section">
            <h2>6. Performance Metrics</h2>
            <ul>
              <li>Product adoption rates (aiming for fantasy football levels of engagement)</li>
              <li>Revenue growth (making it rain more than a Seattle Seahawks home game)</li>
              <li>
                Customer satisfaction scores (higher than the odds of a perfect March Madness
                bracket)
              </li>
            </ul>
          </section>

          <section class="prd-section">
            <h2>7. Risk Management</h2>
            <ul>
              <li>
                Potential for information overload in the sports-tech space (nothing Joshua can't
                handle with his data-crunching skills)
              </li>
              <li>
                Fast-paced environment (Joshua thrives under pressure like Tom Brady in the 4th
                quarter)
              </li>
            </ul>
          </section>

          <section class="prd-section">
            <h2>8. Scouting Notes</h2>
            <p>
              Joshua Gantt is a product management all-star with a proven track record of shipping
              high-quality products and improving customer experiences. His experience with
              multi-tenant B2B web applications and innovative solutions for documents, forms, and
              data processing makes him the perfect draft pick for FanDuel's dynamic environment.
            </p>
            <p class="fun-fact">
              <strong>Fun Fact:</strong> Joshua once optimized a system so efficiently, it started
              predicting user needs before they even logged in. He's basically the sports-tech
              equivalent of the movie "Minority Report", minus the ethical dilemmas.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Roleco;
