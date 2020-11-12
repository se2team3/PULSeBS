module.exports = async (sec) => {
    await (async () => new Promise(resolve => setTimeout(resolve, sec * 1000)))();
};
