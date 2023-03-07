import React, { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsPage from "./components/GroupsPage/GroupIndex";
import GroupDetailPage from "./components/GroupDetailPage/GroupDetailIndex";
import CreateGroupForm from "./components/GroupForm/CreateGroupForm";
import UpdateGroupForm from "./components/GroupForm/UpdateGroupForm";
import EventsPage from "./components/EventsPage/EventIndex";
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
            <Route exact path='/'>
              <LandingPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
            <Route exact path="/groups">
              <GroupsPage />
            </Route>
            <Route path="/groups/new">
              <CreateGroupForm />
            </Route>
            <Route exact path="/groups/:groupId">
              <GroupDetailPage />
            </Route>
            <Route path="/groups/:groupId/edit">
              <UpdateGroupForm />
            </Route>
            <Route exact path="/events">
              <EventsPage />
            </Route>
          </Switch>
        ))}
  </Fragment>
  );
}

export default App;
