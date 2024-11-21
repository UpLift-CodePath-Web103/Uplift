import ReactWordcloud from 'react-d3-cloud';

interface WordCloudProps {
  data: {
    text: string;
    value: number;
  }[];
}

// Fake data for testing
const fakeData = [
  { text: 'Family', value: 1 },
  { text: 'Health', value: 1 },
  { text: 'Friends', value: 2 },
  { text: 'Growth', value: 3 },
  { text: 'Learning', value: 4 },
  { text: 'Purpose', value: 5 },
  { text: 'Nature', value: 6 },
  { text: 'Creativity', value: 20 },
  { text: 'Home', value: 3 },
  { text: 'Life itself', value: 1 },
];

export default function D3WordCloud({ data: realData }: WordCloudProps) {
  // Use fake data instead of real data for now
  const data = fakeData;

  if (!data || data.length === 0) {
    return <div>No gratitude entries yet</div>;
  }

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className='relative w-[400px] h-[300px] border rounded-lg bg-white mx-auto'>
      <ReactWordcloud
        data={data}
        fontSize={(word) => {
          const normalizedValue = word.value / maxValue;
          return 32 + normalizedValue * 64;
        }}
        rotate={0}
      />
    </div>
  );
}
