import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import EmployeeTable from "./EmployeeTable";
import { PrivateRoute } from "./PrivateRoute";

function Routing({ appProps }) {
  const signedOutRoutes = [
    { path: "/login", C: LoginPage },
    { path: "/register", C: RegisterPage },
    { path: "/home", C: HomePage },
  ];

  return (
    <div>
      <Switch>
        <PrivateRoute exact path="/"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={EmployeeTable} />
        {signedOutRoutes.map((x, index) => {
          return (
            <Route key={index} exact path={x.path}
              render={(props) => !appProps.authenticated ? <x.C
                {...appProps} {...props} /> :
                <Route render={() => <Redirect
                  to={{
                    pathname: "/",
                    state: { from: props.location }
                  }} />}
                />}
            />
          );
        })}
        <Route render={(props) => <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }} />}
        />} />
      </Switch>
    </div>
  );
}

export default Routing;
