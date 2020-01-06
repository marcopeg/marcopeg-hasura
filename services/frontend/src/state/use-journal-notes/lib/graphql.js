import { gql } from 'apollo-boost';

export const LOAD_JOURNAL_NOTES = gql`
  query loadJournalNotes {
    journal_notes (
      order_by: { created_at: desc }
    ) {
      id
      text
      data
      created_at
    }
  }
`;

export const LOAD_JOURNAL_NOTE = gql`
  query loadJournalNote (
    $noteId: Int!
  ) {
    journal_notes(where: {id: {_eq: $noteId}}) {
      updated_by
      updated_at
      text
      id
      created_at
      created_by
      data
    }
  }
`;

export const REMOVE_JOURNAL_NOTES = gql`
  mutation removeJournalNotes (
    $ids: [Int!]
  ) {
    delete_journal_notes (
      where: { id: { _in: $ids }}
    ) {
      returning {
        id
      }
    }
  }
`;

export const INSERT_JOURNAL_NOTE = gql`
  mutation insertJournalNote (
    $text: String!
  ) {
    insert_journal_notes (
      objects: {
        text: $text
      }
    ) {
      returning {
        id
        data
        created_at
        created_by
        text
        updated_at
        updated_by
      }
    }
  }
`;

export const UPDATE_JOURNAL_NOTE = gql`
  mutation updateJournalNote (
    $noteId: Int!
    $text: String!
  ) {
    update_journal_notes(
      where: { id: {_eq: $noteId }},
      _set: { text: $text }
    ) {
      returning {
        id
        text
        data
        created_at
        created_by
        updated_at
        updated_by
      }
    }
  }
`;

