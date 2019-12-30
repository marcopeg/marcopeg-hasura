import { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const LOAD_DAILY_ENTRIES = gql`
  query loadDailyEntries (
    $date: date!
  ) {
    journal_questions {
      id
      type
      text
      data
      journal_logs(where: {created_at_day: {_eq: $date}}) {
        text
        data
        created_at
        updated_at
      }
    }
  }
`

const UPDATE_DAILY_ENTRIES = gql`
  mutation updateDailyEntries($records: [journal_logs_insert_input!]!) {
    insert_journal_logs(
      objects: $records,
      on_conflict: {
        constraint: journal_logs_pkey,
        update_columns: [data, text]
      }
    ) {
      affected_rows
    }
  }
`

const getQuestions = (data) => {
  try {
    return data.journal_questions || [];
  } catch (err) {
    return [];
  }
};

const getAnswerText = (record, answer) => {
  if (answer.text !== undefined) {
    return answer.text;
  }
  if (record.text !== undefined) {
    return record.text;
  }
  return '';
}

const formatAnswer = (record = {}, answer = {}) => {
  return {
    text: getAnswerText(record, answer),
    data: answer.data || record.data || {},
    createdAt: record.created_at || null,
    updatedAt: record.updated_at || null,
  };
};

const formatQuestion = (answers, setAnswers) => (question) => ({
  id: question.id,
  type: question.type,
  question: {
    text: question.text,
    data: question.data,
  },
  answer: formatAnswer(question.journal_logs[0], answers[question.id]),
  updateValue: (text, data) => setAnswers({
    ...answers,
    [question.id]: { text, data },
  }),
});

const useJournalEntry = (date) => {
  // const [ logDate, ]
  const [ answers, setAnswers ] = useState({});
  const [ fetchEntries, { loading, data, error }] = useLazyQuery(LOAD_DAILY_ENTRIES);
  const [updateDailyEntries] = useMutation(UPDATE_DAILY_ENTRIES);

  // Fetch fresh records when the `date` changes
  useEffect(() => {
    fetchEntries({ fetchPolicy: 'no-cache', variables: { date } });
    setAnswers({});
  }, [ date, fetchEntries ])

  // Auto save changes
  const saveTimer = useRef();
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!Object.keys(answers).length) {
        console.log('no answers, return')
        return
      }

      const records = Object.keys(answers).map((id) => ({
        question_id: id,
        created_at_day: date,
        ...answers[id],
      }));

      try {
        console.log('update!', records)
        await updateDailyEntries({ variables: { records } })
      } catch (err) {
        console.log('Couldnt update the daily logs', err.message)
      }
    }, 250)

    return () => clearTimeout(saveTimer.current);
  }, [ date, answers, updateDailyEntries ]);

  return {
    loading,
    questions: getQuestions(data).map(formatQuestion(answers, setAnswers)),
    error,
  }
}

export default useJournalEntry;
