const express = require("express");
const studentsRouter = require("./routes/students");
const coursesRouter = require("./routes/courses");
const app = express();
const PORT = process.env.PORT || 3000;
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const query = require("./resolvers");

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: query,
    graphiql: true, // เปิดใช้งานหน้าทดสอบ GraphiQL ผ่านเบราว์เซอร์
  }),
);

app.use("/api/v1/students", studentsRouter);
app.use("/api/v1/courses", coursesRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Student API พร้อมใช้งาน" });
});


app.listen(PORT, () => {
  console.log(`Server กำลังทำงานที่ http://localhost:${PORT}`);
});

