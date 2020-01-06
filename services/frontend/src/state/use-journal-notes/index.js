import useJournalNotesEntries from './entries';
import useJournalNotesForm from './form';

const useJournalNotes = () => {
  const notes = useJournalNotesEntries();
  const form = useJournalNotesForm();

  const submit = async () => {
    await form.submit();
    // await notes.reload();
  };

  const remove = async (noteId) => {
    await notes.remove(noteId);
    // await notes.reload();
  };

  const reload = async (e) => {
    await notes.reload()
    if (e.detail && e.detail.complete) {
      e.detail.complete()
    }
  };

  return {
    notes,
    form,
    submit,
    remove,
    reload,
  };
}

export default useJournalNotes;
