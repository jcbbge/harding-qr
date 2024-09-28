import '../../index.css';

const Header = () => {
  return (
    <header class="w-full bg-accent-fun">
      <nav class="container flex items-center justify-between">
        <div class="flex items-center">
          <a href="/" class="p-1  spacing-widest nav-link">Home~</a>
          <a href="/" class="p-1  spacing-widest nav-link">About*</a>
          <a href="/scrumble" class="p-1 spacing-widest nav-link">PlayScrumble!</a>
        </div>
        <a href="/" class="p-1 pl-2 spacing-widest nav-link">Help?</a>
      </nav>
    </header>
  );
};

export default Header;
