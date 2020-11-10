const login = async ({username, password}) => {
    // check credentials
    const user = { username, id: 1997, role: "Student" };
    return { ...user };
};

const restrictedData = async () => {
    return {
        name: "private",
        surname: "you can't see if not student"
    };
};

module.exports = { login, restrictedData };
