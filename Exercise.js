const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercise")
  .then(result => console.log("Connected"))
  .catch(err => console.log("error", err));

const courseSchema = mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now() },
  tags: [String],
  author: String,
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model("Exercie", courseSchema);

async function saveCourse() {
  const course = new Course({
    name: "Vanilla js",
    author: "Mosh Hamedani",
    tags: ["#Neautral", "#Js"],
    isPublished: true,
    price: 156
  });
  const result = await course.save();
  console.log(result);
}

async function findCourse() {
  return await Course.find({
    isPublished: true,
    tags: { $in: ["Backend", "FrontEnd"] }
  })
    .sort("-price")
    .select({ name: 1, author: 1, price: 1, _id: 1 });
}

async function run() {
  const result = await findCourse();
  console.log(result);
}

async function findBeforeUpdate(id) {
  const course = await Course.findById(id);
  course.set({
    tags: [...course.tags, "Another New Tag"]
  });
  const result = await course.save();
  console.log(result);
}

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        name: "Vue Core",
        price: 200
      }
    },
    { new: true }
  );
  console.log(course);
}

async function deleteCourse(id) {
  const course = await Course.findByIdAndDelete(id);
  console.log(course);
}

findBeforeUpdate("5dfbb6e878ace70d04ad4e63");
