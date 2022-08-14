function Redirect() {
  window.history.pushState(null, "", "/");
  return (<div />);
};

export default Redirect;
