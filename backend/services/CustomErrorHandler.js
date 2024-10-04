class CustomErrorHandler extends Error {
    constructor(status, code) {
        super();
        this.status = status;
        this.message = code;
    }

    static wrongCredentials(message = "Wrong Credentials / Invalid Account Details") {
        return new CustomErrorHandler(401, message);
    }

    static methodNotAllowed(message = "Method Not Allowed / Lack of Rights for Current Roles") {
        return new CustomErrorHandler(405, message);
    }
}

export default CustomErrorHandler;
