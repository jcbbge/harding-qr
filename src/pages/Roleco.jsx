import { createSignal } from 'solid-js';
import { useParams } from "@solidjs/router";
import NameGrid from '../components/interface/NameGrid';

const Roleco = (props) => {
    const [role, setRole] = createSignal(props.role);
    const [company, setCompany] = createSignal(props.company);

  const params = useParams();

  return (
    <div>
      <nav>
        <a href="/">homepage</a>
        <a href="/scrumble">scrumble</a>
      </nav>  
      <h1>Roleco Page</h1>
      <NameGrid company={company()} role={role()} onLetterUnlock={handleLetterUnlock} />
      <p>This is the Roleco page</p>
      <h5>Role: {role()}</h5>
      <h5>Company: {company()}</h5>
    </div>
  );
};

export default Roleco;
