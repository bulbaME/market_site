export default async function searchTop() {
    let api_response = await fetch(`/api/search_top`);
    let reader = api_response.body.getReader();

    let obj_s = ''
    while (true) {
        const r = await reader.read();
        if (r.done) break;
        let d = Buffer.from(r.value).toString('utf-8');
        obj_s += d;
    }

    obj_s = decodeURI(obj_s);

    return JSON.parse(obj_s);
}