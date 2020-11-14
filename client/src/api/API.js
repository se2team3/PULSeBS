const baseURL = "";

/*async function getLectures(start_date, end_date) {
    let url = "/lectures";
    if (start_date!==undefined || end_date!==undefined){
        url += "?";
        if(start_date!==undefined)
            url += `from=${start_date}&`;
        if(end_date!==undefined)
            url += `to=${end_date}`;
    }
    const response = await fetch(baseURL + url);
    const lecturesJson = await response.json();
    if(response.ok){
        return lecturesJson.map(
            (o) => new Operation(o.code, o.name, o.description, o.counters));
    } else {
        let err = {status: response.status, errObj:operationsJson};
        throw err;  // An object with the error coming from the server
    }
}*/