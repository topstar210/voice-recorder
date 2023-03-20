import { RecordsProvider } from '@/contexts/RecordsContext';

import { RecordBox } from '@/components/RecordBox';
import { RecordsList } from '@/components/RecordsList';

function Record() {
  return (
    <div className="container mx-auto lg:grid lg:grid-cols-11 lg:gap-x-32 lg:px-0 px-4 lg:mt-20">
      <RecordsProvider>
        <section className="lg:col-span-5 lg:mb-0 mb-8">
          <RecordBox />
        </section>

        <section className="lg:col-span-6">
          <RecordsList />
        </section>
      </RecordsProvider>
    </div>
  );
}

export default Record;
