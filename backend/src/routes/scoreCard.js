import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();

const saveScoreCard = async (name, subject, score, res) => {
  const nameExisting = await ScoreCard.findOne({ name });
  const subjectExisting = await ScoreCard.findOne({ subject });
  try {
    const newScoreCard = new ScoreCard({ name, subject, score });
    if (nameExisting && subjectExisting) {
      ScoreCard.collection.deleteMany({ name: name, subject: subject });
      res.send({
        message: `Updating (${name}, ${subject}, ${score})`,
        card: newScoreCard,
      });
    } else {
      res.send({
        message: `Adding (${name}, ${subject}, ${score})`,
        card: newScoreCard,
      });
    }
    return newScoreCard.save();
  } catch (error) {
    console.log(error);
  }
};

const deleteDB = async (res) => {
  try {
    await ScoreCard.collection.deleteMany({});
    res.send({ message: "Database cleared" });
  } catch (error) {
    console.log(error);
  }
};

const findDB = async (type, filter, res) => {
  if (type === "name") {
    const names = await ScoreCard.find({ name: filter });
    if (names.length === 0) {
      res.send({ message: `${type} (${filter}) not found!` });
      return;
    }
    const namesMsg = names.map((item) => {
      return `Found card with name: (${item.name}, ${item.subject}, ${item.score})`;
    });

    res.send({ messages: namesMsg });
  } else if (type === "subject") {
    const subjects = await ScoreCard.find({ subject: filter });
    if (subjects.length === 0) {
      res.send({ message: `${type} (${filter}) not found!` });
      return;
    }
    const subjectsMsg = subjects.map((item) => {
      return `Found card with subject: (${item.name}, ${item.subject}, ${item.score})`;
    });
    res.send({ messages: subjectsMsg });

    //console.log(subjects);
  }
};

const buildTable = async (filter, content, res) => {
  let infos = [];
  if (filter === "name") {
    infos = await ScoreCard.find({ name: content });
  } else if (filter === "subject") {
    infos = await ScoreCard.find({ subject: content });
  }
  //console.log(infos.length);
  if (infos.length === 0) return;
  else res.send({ tmpInfo: infos });
};

router.delete("/cards", (req, res) => {
  deleteDB(res);
});
router.post("/card", (req, res) => {
  saveScoreCard(req.body.name, req.body.subject, req.body.score, res);
});
router.get("/cards", (req, res) => {
  findDB(req.query.type, req.query.queryString, res);
});

router.get("/cards/info", (req, res) => {
  buildTable(req.query.filter, req.query.content, res);
});

export default router;
