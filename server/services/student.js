const restrictedData = async () => {
    return {
        name: "private",
        surname: "you can't see if not student"
    };
};

module.exports = { restrictedData };
