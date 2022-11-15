import decode, { JwtPayload } from 'jwt-decode';

class Authentication
{
    GetProfile()
    {
        const token = this.GetToken();
        if (token) return decode<JwtPayload>(token);
        else return null;
    }

    LoggedIn() 
    {
        // Checks if there is a saved token and it's still valid
        const token = this.GetToken();
        return !!token && !this.IsTokenExpired(token);
    }

    IsTokenExpired(token: string) 
    {
        try 
        {
            const decoded = decode<JwtPayload>(token);
            if (decoded.exp)
            {
                if (decoded.exp < Date.now() / 1000) return true;
                else return false;
            }
            else return false;
        } 
        catch (err) { return false; }
    }

    GetToken() 
    {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    Login(idToken: string) 
    {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }

    Logout() 
    {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        // this will reload the page and reset the state of the application
        window.location.assign('/');
    }
}

export default new Authentication();