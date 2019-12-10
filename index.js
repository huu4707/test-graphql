var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
 
var schema = buildSchema(`
    type Query {
        user(id: Int!): Person
        users(gender: String): [Person]
    },
    type Person {
        id: Int
        name: String
        age: Int
        gender: String  
    },
    type Mutation {
        createUser(name: String, age: Int!, gender: String): Person
        updateUser(id: Int!, name: String, age: Int!, gender: String): Person
    }
`);

var users = [ 
    {
      id: 1,
      name: 'Brian',
      age: '21',
      gender: 'M'
    },
    {
      id:2,
      name: 'Kim',
      age: '22',
      gender: 'M'
    },
    {
      id:3,
      name: 'Joseph',
      age: '23',
      gender: 'M'
    },
    {
      id:3,
      name: 'Faith',
      age: '23',
      gender: 'F'
    },
    {
      id:5,
      name: 'Joy',
      age: '25',
      gender: 'F'
    }
  ];
  var getUser = function(args) { 
    var userID = args.id;
    return users.filter(user => {
      return user.id == userID;
    })[0];
  }
   
  
  
  var retrieveUsers = function(args) {
    if(args.gender) {
      var gender = args.gender;
      return users.filter(user => user.gender === gender);
    } else {
      return users;
    }
  }  

  var createUser = function(args) { 
    let { name, age, gender } = args;
    let id = Math.max.apply(Math, users.map(function(o) { return o.id; })) + 1;
    users.push({ id , name, age, gender })
    return users.find(x=> x.id == id);
  }

  var updateUser = function(args) { 
    let { id,  name, age, gender } = args;
    let find = users.find(x => x.id == id);
    find.name = name;
    find.age = age;
    find.gender = gender;
    return users.find(x=> x.id == id);
  }
var root = { 
    user: getUser,
    users: retrieveUsers,
    createUser: createUser,
    updateUser: updateUser,
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
//   mutation: RootMutation,
  graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));


//lấy user có id = 1 dùng query:  {user(id: 1){name,age,gender}}
// api là http://localhost:4000/graphql?query={user(id: 1){name,age,gender}}