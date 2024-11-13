import DisplayGrid from '../components/interface/DisplayGrid';
const About = () => {
  return (
    <div class="main-content">
      <div class="snap-container unlocked">        
        <section class="snap-section">
          <div class="name-grid-container">
            <DisplayGrid
              digital={true}
            />
          </div>
        </section>
        <section class="snap-section">
          <div class="name-grid-container">
            <DisplayGrid
              interaction={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 