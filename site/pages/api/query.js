export default async function query(req, res) {
    try {
        if (req.query.q.length == 0) throw 'Empty request';
        let api_response = await fetch(`http://127.0.0.1:12581/query?q=${req.query.q}`);
        let reader = api_response.body.getReader();

        let obj_s = ''
        while (true) {
            const r = await reader.read();
            if (r.done) break;
            let d = Buffer.from(r.value).toString('utf-8');
            obj_s += d;
        }

        res.status(200).json(JSON.parse(obj_s));
    } catch (e) {
        res.status(404).json([]);
    }

}