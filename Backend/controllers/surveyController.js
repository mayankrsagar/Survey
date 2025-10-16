import Survey from "../models/surveySchema.js";

export const getAllSurveys = async (req, res, next) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (e) {
    next(e);
  }
};

export const getMySurveys = async (req, res, next) => {
  try {
    const surveys = await Survey.find({ userId: req.params.userId });
    res.json(surveys);
  } catch (e) {
    next(e);
  }
};

export const createSurvey = async (req, res, next) => {
  try {
    const { title, questions, userId, userName } = req.body;
    const survey = await Survey.create({ title, questions, userId, userName });
    res.status(201).json({ surveyId: survey._id });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const respondSurvey = async (req, res, next) => {
  try {
    const { respondent, answers } = req.body;
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ msg: "Survey not found" });

    const responseWithQuestions = answers.map((a, i) => ({
      question: survey.questions[i].question,
      answer: a,
    }));
    survey.responses.push({ respondent, answers: responseWithQuestions });
    await survey.save();
    res.json(survey);
  } catch (e) {
    next(e);
  }
};

export const getResults = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ msg: "Survey not found" });
    res.json(survey.responses);
  } catch (e) {
    next(e);
  }
};

export const getSingleSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ msg: "Survey not found" });
    res.json(survey);
  } catch (e) {
    next(e);
  }
};

export const deleteSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);
    if (!survey) return res.status(404).json({ msg: "Survey not found" });
    res.json({ message: "Survey deleted" });
  } catch (e) {
    next(e);
  }
};

export const deleteResponse = async (req, res, next) => {
  try {
    const result = await Survey.updateOne(
      { "responses._id": req.params.id },
      { $pull: { responses: { _id: req.params.id } } }
    );
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Response not found" });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
