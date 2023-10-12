export default async function searchAction(q) {
    let api_response = await fetch(`/api/query?q=${q}`);
    let reader = api_response.body.getReader();

    let obj_s = ''
    while (true) {
        const r = await reader.read();
        if (r.done) break;
        let d = Buffer.from(r.value).toString('utf-8');
        obj_s += d;
    }

    return JSON.parse(obj_s);
}