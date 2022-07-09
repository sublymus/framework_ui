const Server = {}

Server.send = async (params)=>{
    let {url, logic, resource} = params;
    if (!url) throw Error('<send Function> need url "String" to run ');
    if (!(logic instanceof Function)) throw Error('<send Function> need require accessLogic "Function(formData, resource) : bodyObject" to run ');

    const formData = new window.FormData();
    const body = logic(formData,resource);
    if(body)formData.append("body", JSON.stringify(body));
    
    var requestOptions = {
        method: 'POST',
        body: formData
    };
    return await fetch(url, requestOptions).then((response) => {
        if (response.ok)return response.json();
        return response.json().then(response => { throw new Error(response.error) })
    });
}

export default Server ;