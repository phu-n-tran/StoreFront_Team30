import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginPage from "./Login";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import SearchResultPage from "./SearchResultPage";
import CartPage from "./CartPage";
import ItemByCategory from "./ItemByCategory";
import ItemByItemID from "./ItemByItemID";
import Categories from "./Categories";
import PaymentPage from "./PaymentPage";
import HistoryPage from "./HistoryPage";
import { PrivateRoute } from "./PrivateRoute";

function Routing({ appProps }) {
  const signedOutRoutes = [
    { path: "/login", C: LoginPage },
    { path: "/register", C: RegisterPage },
    { path: "/home", C: HomePage },
    { path: "/payment", C: PaymentPage },
    { path: "/history", C: HistoryPage },
  ];

  return (
    <div>
      <Switch>
        <PrivateRoute exact path="/"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={HomePage} />
        <PrivateRoute exact path="/search"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={SearchResultPage} />
        <PrivateRoute exact path="/cart"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={CartPage} />
        <PrivateRoute exact path="/category/:id"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={ItemByCategory} />
        <PrivateRoute exact path="/item/:id"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={ItemByItemID} />
        <PrivateRoute exact path="/categories"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={Categories} />
        <PrivateRoute exact path="/payment"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={PaymentPage} />
        <PrivateRoute exact path="/history"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={HistoryPage} />
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
