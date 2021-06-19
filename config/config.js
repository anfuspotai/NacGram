const MongoClient = require('mongodb').MongoClient
const state = {
  db: null
}
module.exports.connect = function (done) {
  const url = 'mongodb+srv://tweetgram:xDU3qYbHWJwuPkCP@cluster0.xnuzf.mongodb.net/test?authSource=admin&replicaSet=atlas-thr35a-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
  const dbName = 'mini_project'

  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) return done(err)
    state.db = client.db(dbName)
    done()
  })
  
}

module.exports.get = function(){
  return state.db
}
