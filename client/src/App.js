import React from 'react';
import './App.css';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import LecturePage from './components/LecturePage';
import SetupPage from './components/SetupPage';
import API from './api';
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { AuthContext } from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import CalendarPage from './components/CalendarPage';
import StatisticsPage from './components/StatisticsPage';
import ErrorPage from './components/ErrorPage';


class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = { lecture: { title: "" }, filter: 'all', };
  }

  componentDidMount() {
    API.isAuthenticated()
      .then((user) => {
        this.setState({ authUser: user });
      }
      ).catch((err) => {
        this.setState({ authErr: err.errorObj, authUser: null });
        this.props.history.push("/login");
      });
  }

  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        API.isAuthenticated().then(
          (user) => {
            this.setState({ authUser: user });
          }
        ).catch((err2) => {
          this.setState({ authErr: err2.errorObj, authUser: null });
          this.props.history.push("/login");
        });
      }
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.    
    this.handleErrors(error);
  }

  /*componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service  
    console.log(error);
    console.log(errorInfo);
    this.handleErrors(error);
  }*/

  // Add a logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null });
      this.props.history.push("/login");
    });
  }

  // Add a login method
  login = (username, password) => {
    return new Promise((resolve, reject) => {
      API.userLogin(username, password)
        .then((user) => {
          this.setState({ authUser: user, authErr: null });
          if (user.role === 'manager')
            this.props.history.push("/statistics")
          else if (user.role === 'officer')
            this.props.history.push("/setup")
          else this.props.history.push("/calendar");
          console.log(this.props.history);
          resolve()
        }).catch(
          (errorObj) => {
            const err = errorObj.message;
            this.setState({ authErr: err });
            resolve()
          }
        );
    })
  }

  showSidebar = () => {
    this.setState((state) => ({ openMobileMenu: !state.openMobileMenu }));
  }

  goToLecturePage = (event) => {
    this.setState({ lecture: event })
    let id = event.extendedProps.lectureId;
    this.props.history.push(`/lectures/${id}`);
  }

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    return (
      <AuthContext.Provider value={value}>

        <Header showSidebar={this.showSidebar} />

        <Switch>
          {value.authUser===null&&<Route path="/login">
            <LoginPage />
          </Route>}

          {(value.authUser && (value.authUser.role === "student" || value.authUser.role === "teacher")) &&<Route path="/calendar">
            <CalendarPage goToLecturePage={this.goToLecturePage} authUser={value.authUser} />
          </Route>}

          {(value.authUser && (value.authUser.role === "teacher" || value.authUser.role === "manager")) &&<Route path="/statistics">
            <StatisticsPage authUser={value.authUser} />
          </Route>}

          {(value.authUser && value.authUser.role === "teacher") &&<Route path="/lectures/:lecture_id" render={(props) =>
            <LecturePage lecture_id={props.match.params.lecture_id} />
          } />}

          {(value.authUser && value.authUser.role === "officer") && <Route path="/setup">
            <SetupPage />
          </Route>}

          <Route exact path="/">
            {value.authUser === null&&<Redirect to="/login" />}
            {(value.authUser && value.authUser.role === "officer")&&<Redirect to="/setup" />}
            {(value.authUser && value.authUser.role === "student")&&<Redirect to="/calendar" />}
            {(value.authUser && value.authUser.role === "teacher")&&<Redirect to="/calendar" />}
            {(value.authUser && value.authUser.role === "manager")&&<Redirect to="/statistics" />}
          </Route>


          {value.authUser === null ?
            <Route>
              <Redirect to="/login" />
            </Route> :
            <Route>
              <ErrorPage/>
            </Route>
          }

        </Switch>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
