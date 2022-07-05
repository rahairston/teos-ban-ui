import './App.css';
import { connect } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import Auth from './auth/Auth';


function App(state: any, props: any) {
  let [searchParams] = useSearchParams();
  
  return (
    <div className="App">
        <header className="App-header">
        <Auth />
        </header>
    </div>
  );
};

export default connect(null, null)(App);
