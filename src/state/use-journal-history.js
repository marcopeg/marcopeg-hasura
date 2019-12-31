/* eslint-disable */
import { useState, useMemo, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const FETCH_ENTRIES = gql`
  query fetchEntries (
    $top: date!
    $bottom: date!
  ) {
    journal_logs(
      order_by: {created_at_day: desc}
      where: {
        created_at_day: {
          _lte: $top
          _gte: $bottom
        }
      }
    ) {
      text
      created_at_day
      journal_question {
        id
        text
        type
        order
        data
      }
      data
    }
  }
`;

const formatDate = (date) => {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}

const decreaseDate = (initialDate, days) => {
  const date = new Date(initialDate);
  date.setDate(date.getDate() - days);
  return date;
};

const increaseDate = (initialDate, days) => {
  const date = new Date(initialDate);
  date.setDate(date.getDate() + days);
  return date;
};

// Prepares an array[size] and apply an initialization function
// on each item, the handler receives the item's index.
const makeList = (size, initFn = null) => {
  const list = [...Array(size).keys()];
  return initFn ? list.map((_, i) => initFn(i)) : list;
};

const formatEntry = (entry) => {
  // console.log(entry)
  return {
    type: entry.journal_question.type,
    order: entry.journal_question.order,
    question: entry.journal_question.text,
    questionId: entry.journal_question.id,
    questionData: entry.journal_question.data,
    answer: entry.text,
    answerData: entry.data,
  }
}

const useJournalHistory = (options = {
  pageSize: 7,
}) => {
  const initialDate = useMemo(() => new Date(), []);
  const [ lastDate, setLastDate ] = useState(initialDate)
  const [ showRecords, setShowRecords ] = useState(options.pageSize);
  const [ logs, setLogs ] = useState([]);

  const [ fetchEntries, {
    loading: isFetching,
    error: fetchError,
    data: fetchData,
  }] = useLazyQuery(FETCH_ENTRIES);

  // load more records
  useEffect(() => {
    const top = formatDate(lastDate);
    const bottom = formatDate(decreaseDate(initialDate, showRecords - 1));
    console.log('@fetchMore', top, bottom);
    fetchEntries({ variables: { top, bottom }});
  }, [ showRecords ]);

  // detect new records were loaded
  // `fetchEntries()` does not provide a Promise back!
  useEffect(() => {
    if (isFetching || fetchError || !fetchData) {
      return;
    }

    setLogs([
      ...logs,
      ...fetchData.journal_logs,
    ]);
  }, [ isFetching, fetchError, fetchData ]);

  // update the last record's date for next pagination
  // happens in response to a new data being loaded
  useEffect(() => {
    if (!logs.length) {
      return
    }

    const lastRecord = logs[logs.length - 1];
    setLastDate(new Date(lastRecord.created_at_day));
  }, [logs]);

  // calculates the list of visible entries from today into the past
  const entries = useMemo(() => {
    console.log('@entries');
    return makeList(showRecords, (idx) => {
      const date = decreaseDate(initialDate, idx);
      const logDate = formatDate(date);
      const entries = logs
        .filter(log => log.created_at_day === logDate)
        .map(formatEntry)

      // sort by question order
      entries.sort((a, b) => a.order - b.order);

      return {
        logDate,
        entries,
      }
    });
  }, [showRecords, logs]);

  return {
    entries,
    loadMore: () => setShowRecords(entries.length + options.pageSize),
  };
};

export default useJournalHistory;
