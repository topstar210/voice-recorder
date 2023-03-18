import { RecordsProvider } from '@/contexts/RecordsContext';

import { RecordBox } from '@/components/RecordBox';
import { RecordsList } from '@/components/RecordsList';

function Record() {
  return (
    <>
      <RecordsProvider>
        <section className="lg:col-span-5 lg:mb-0 mb-8">
          <RecordBox />
        </section>

        <section className="lg:col-span-6">
          <RecordsList />
        </section>
      </RecordsProvider>
    </>
  );
}

export default Record;
