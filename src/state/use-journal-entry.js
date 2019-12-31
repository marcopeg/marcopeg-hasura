import { useState, useEffect, useRef, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const LOAD_DAILY_ENTRIES = gql`
  query loadDailyEntries (
    $logDate: date!
  ) {
    journal_questions {
      id
      type
      text
      data
      journal_logs(where: {created_at_day: {_eq: $logDate}}) {
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

const formatAnswer = (record) => ({
  answer: record ? record.text : '',
  data: record ? record.data : null,
  createdAt: record ? record.created_at : null,
  updatedAt: record ? record.updated_at : null,
});

const formatQuestion = (record) => {
  const answer = formatAnswer(record.journal_logs.length ? record.journal_logs[0] : null);
  return {
    id: record.id,
    type: record.type,
    question: record.text,
    answer: answer.answer,
    questionData: record.data || {},
    answerData: answer.data || {},
    createdAt: answer.createdAt,
    updatedAt: answer.updatedAt,
  }
}

const decorateAnswer = (question, answers, setAnswers) => {
  const answer = answers && answers[question.id]
    ? {
      answer: answers[question.id].text,
      answerData: answers[question.id].data,
    }
    : {};

  return {
    ...question,
    ...answer,
    updateAnswer: (text, data) => setAnswers({
      ...answers,
      [question.id]: { text, data },
    }),
  };
}

const useJournalEntry = (logDate, options = {
  debounce: 500,
}) => {
  const debounceUpdate = useRef(null);
  const [ answers, setAnswers ] = useState({});
  const [ hasChanges, setHasChanges ] = useState(false);

  const [ fetchEntries, {
    loading: isFetching,
    error: fetchError,
    data: fetchData,
  }] = useLazyQuery(LOAD_DAILY_ENTRIES);

  const [ updateEntries, {
    loading: isUpdating,
    error: updateError,
  }] = useMutation(UPDATE_DAILY_ENTRIES);

  // re-fetch on logDate change
  useEffect(() => {
    setAnswers({});
    fetchEntries({ variables: { logDate }});
  }, [ logDate, setAnswers, fetchEntries ]);

  // compute questions data model for rendering
  // merges current values with current changes
  const questions = useMemo(() => {
    if (!fetchData || !fetchData.journal_questions) {
      return [];
    }

    return fetchData.journal_questions
      .map(formatQuestion)
      .map($ => decorateAnswer($, answers, setAnswers));
  }, [fetchData, answers]);

  // keep note of open changes that await persistance
  useEffect(() => {
    if (Object.keys(answers).length) {
      setHasChanges(true);
    }
  }, [ answers, setHasChanges ]);

  // auto save on user activity
  // (debounced)
  useEffect(() => {
    if (!Object.keys(answers).length) {
      return;
    }

    clearTimeout(debounceUpdate.current)
    debounceUpdate.current = setTimeout(() => {
      const records = Object.keys(answers).map((id) => ({
        question_id: id,
        created_at_day: logDate,
        ...answers[id],
      }));

      // on persis, reset the open changes note
      updateEntries({ variables: { records } })
        .then(() => setHasChanges(false))
        .catch(err => console.log('Couldnt update the daily logs', err.message))
    }, options.debounce) ;

    return () => clearTimeout(debounceUpdate.current);
  }, [ answers, logDate, options.debounce, updateEntries ]);

  return {
    isFetching,
    isUpdating,
    fetchError,
    updateError,
    questions,
    hasChanges,
  };
};

export default useJournalEntry;
