import { useState, useRef, useMemo, useEffect } from 'react';
import { useLazyQuery } from '../lib/apollo';
import { gql } from 'apollo-boost';

const FETCH_ENTRIES = gql`
  query fetchEntries (
    $top: date!
    $bottom: date!
  ) {
    journal_logs(
      order_by: {
        created_at_day: desc
      }
      where: {
        created_at_day: {
          _lte: $top
          _gte: $bottom
        }
        journal_question: {
          show_in_journal: {
            _eq: true
          }
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
  const [ logs, setLogs ] = useState([]);
  const showRecordsRef = useRef(0);

  const [ fetchEntries, {
    loading,
    error,
  }] = useLazyQuery(FETCH_ENTRIES);

  // calculates the list of visible entries from today into the past
  const entries = useMemo(() => {
    // console.log('@entries');
    return makeList(showRecordsRef.current, (idx) => {
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
  }, [ initialDate, logs ]);

  const loadMore = () => {
    const lastDate = logs.length
      ? decreaseDate(logs[logs.length - 1].created_at_day, 1)
      : initialDate;

    const top = formatDate(lastDate);
    const bottom = formatDate(decreaseDate(initialDate, showRecordsRef.current + options.pageSize));

    // console.log('@loadMore', top, bottom, showRecordsRef.current)
    return fetchEntries({ variables: { top, bottom }})
      .then((data) => {
        showRecordsRef.current += options.pageSize;
        setLogs([ ...logs, ...data.journal_logs ]);
      });
  };

  const reload = () => {
    const top = formatDate(initialDate);
    const bottom = formatDate(decreaseDate(initialDate, showRecordsRef.current + options.pageSize));

    // console.log('@reload', top, bottom, showRecordsRef.current)
    return fetchEntries({ variables: { top, bottom }})
      .then((data) => {
        showRecordsRef.current = options.pageSize;
        setLogs([ ...data.journal_logs ]);
      });
  }

  // first load
  useEffect(() => {
    loadMore();
  }, []); // eslint-disable-line

  return {
    today: formatDate(initialDate),
    entries,
    loading,
    error,
    loadMore,
    reload,
  };
};

export default useJournalHistory;
