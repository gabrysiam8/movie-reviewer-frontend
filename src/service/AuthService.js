import API from "../utils/API";

export const USERNAME_ATTRIBUTE_NAME= 'authenticatedUser';

class AuthService {

    login(username, password) {
        return API.post("auth/login", { username, password });
    }

    registerSuccessfulLogin(username, token) {
        localStorage.setItem(USERNAME_ATTRIBUTE_NAME, username);
        localStorage.setItem("token", this.createJWTToken(token));
    }

    createJWTToken(token) {
        return 'Bearer ' + token;
    }

    logout() {
        localStorage.clear();
    }

    register(email, username, password, passwordConfirmation) {
        return API.post("auth/register", { email, username, password, passwordConfirmation });
    }

    isAuthenticated() {
        let user = localStorage.getItem(USERNAME_ATTRIBUTE_NAME);
        return user !== null;
    }
}

export default new AuthService();