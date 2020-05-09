  
import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

class MainMenu extends Component {

    render() {

        return (
            <div className="MainMenu">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand className="logo" href="/"><span className="logoPart">Movie</span> Reviewer</Navbar.Brand>
                {this.props.isAuthenticated
                    ?
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    : null
                }
                <Nav className="ml-auto">
                    {this.props.isAuthenticated
                        ?
                        null
                        :
                        [
                            <Nav.Link key="login" href="/login">Login</Nav.Link>,
                            <Nav.Link key="register" href="/register">Register</Nav.Link>
                        ]
                    }
                    <NavDropdown title={<FontAwesomeIcon icon={faUser} color="white"/>} alignRight id="dropdown-menu-align-right">
                        {this.props.isAuthenticated
                            ?
                            [
                                <NavDropdown.Item key="profile" href="/user/me">Profile</NavDropdown.Item>,
                                <NavDropdown.Item key="changePassword" href="/user/me/password">Change password</NavDropdown.Item>,
                                <NavDropdown.Divider key="divider"/>,
                                <NavDropdown.Item key="logout" onClick={this.props.onLogout}>Logout</NavDropdown.Item>
                            ]:[
                                <NavDropdown.Item key="login" href="/login">Login</NavDropdown.Item>,
                                <NavDropdown.Item key="register" href="/register">Register</NavDropdown.Item>
                            ]
                        }
                    </NavDropdown>
                </Nav>
            </Navbar>
            </div>
        );
    }
}

export default MainMenu;