module.exports = function(app, client, db) {
    app.get("/", function(req, res) {
        res.render();
    });

    app.get("/search/:qry?", function(req, res) {
        if (!req.params.qry) {
            res.send("You can not enter an empty query!");
            return;
        }
        const searchTime = new Date();
        const params = req.params.qry.split("?page=");
        const keywords = params[0];
        if (keywords == "") {
            res.send("You can not enter an empty query!");
            return;
        }
        const pageOffset = parseInt(params[1]) || 1;
        client.searchPhotos(keywords, null, pageOffset, null, function(err, photos, link) {
            if (err) {
                console.log(err);
                res.send(err);
            } else if (photos.length > 0) {
                let output = [];
                photos.forEach(function(p) {
                    let newImg = {
                        "url": p.urls.raw,
                        "thumbnail": p.urls.thumb,
                        "info": "Image by " + p.user.name,
                        "portfolio": p.user.portfolio_url || p.links.photos || "Not available"
                    };
                    output.push(newImg);
                })
                res.json(output);
            } else {
                res.send("No results found for query " + keywords)
            }
            db.collection("searchHistory").insert({"when": searchTime, "keywords": keywords});
        });
    });

    app.get("/latest", function(req, res) {
        db.collection("searchHistory").find({}, {"_id": 0}).sort({"when": -1}).limit(10)
                .toArray(function(error, results){
                    if (error) {
                        (console.log(error));
                        res.send(error);
                    } else {
                        res.json(results);
                    }
                });
    });
}