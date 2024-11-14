import React from 'react';

// Image imports or paths (assuming images are stored in the public folder or imported directly)
const images = [
  '/image 1.png', // Image for mood 1
  '/image 2.png', // Image for mood 2
  '/image 3.png', // Image for mood 3
  '/image 4.png', // Image for mood 4
  '/image 5.png', // Image for mood 5
];

//wwekly Data
const weekData = [
  { date: '2024-11-06', mood: 1 },
  { date: '2024-11-07', mood: 3 },
  { date: '2024-11-08', mood: 2 },
  { date: '2024-11-09', mood: 4 },
  { date: '2024-11-10', mood: 1 },
  { date: '2024-11-11', mood: 5 },
  { date: '2024-11-12', mood: 1 },
];

// 

const WeeklyData: React.FC = () => {
  // Get today's mood (last item in the array, assuming the data is sorted)
  const todayMood = weekData[weekData.length - 1];

  return (
    <div className="container mx-auto mt-8 p-4 bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg shadow-xl">

      {/* Main Title */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-700">Mood Dashboard 🌈</h1>

      {/* Check if weekData is empty */}
      {weekData.length === 0 ? (
        <section className="bg-gradient-to-b from-purple-500 to-pink-400 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Welcome, New User! 🎉</h2>
          <p className="text-center text-lg text-gray-800 mb-6">
            It looks like you haven't shared your mood yet. Let's start by sharing how you're feeling today! 💬
          </p>
          <div className="flex justify-center">
            <button className="bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 transition-all">
              Share Your Mood 🌟
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Today's Mood Section */}
          <section className="bg-gradient-to-b from-blue-500 to-blue-400 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Today's Mood 😊</h2>
            <div className="flex justify-center mb-4">
              <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                <img
                  src={images[todayMood.mood - 1]}
                  alt={`Mood ${todayMood.mood} for today`}
                  className="w-full h-48 object-contain rounded-md shadow-lg"
                />
                <p className="text-center text-lg text-gray-800 mt-2">{todayMood.date}</p>
              </div>
            </div>
          </section>

          {/* Share Today's Mood Section */}
          <section className="bg-gradient-to-b from-yellow-400 to-yellow-300 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Share Today's Mood 📢</h2>
            <p className="text-center text-lg text-gray-800 mb-6">
              Share your mood for today and receive only positive, supportive reactions from the community. 🌟
            </p>
            <div className="flex justify-center">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all">
                Share Your Mood 🌻
              </button>
            </div>
          </section>

          {/* Mood for the Week Section */}
          <section className="bg-gradient-to-b from-green-400 to-green-300 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Mood for the Week 📅</h2>

            {/* Bottom section with 6 smaller mood images */}
            <div className="flex justify-between gap-4">
              {weekData.slice(0, 6).map((data, index) => (
                <div key={index} className="flex flex-col items-center w-1/6 bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                  <img
                    src={images[data.mood - 1]}
                    alt={`Mood ${data.mood}`}
                    className="w-full h-24 object-contain mb-2 rounded-md"
                  />
                  <p className="text-sm text-gray-800 text-center">{data.date}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default WeeklyData;
