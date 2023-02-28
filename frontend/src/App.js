import React, { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <Fragment>
      <Navigation isLoaded={isLoaded} />
        {(isLoaded && (
          <Switch>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
          </Switch>
        ))}
  </Fragment>
  );
}

export default App;
