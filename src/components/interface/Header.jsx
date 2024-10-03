import '../../index.css';

const Header = () => {
  return (
    <header>
      <nav class="nav-menu">
        <div>
          <a href="/">Home</a>
          <a href="/roleco">Roleco</a>
          <a href="/help">Help</a>
        </div>
        <div>
          <a href="/new-project">Play Scrumble!</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
