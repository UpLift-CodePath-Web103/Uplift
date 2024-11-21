'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

// Image imports with mood descriptions
const moodOptions = [
  { src: '/image1.png', alt: 'Very Happy', rating: 1 },
  { src: '/image2.png', alt: 'Happy', rating: 2 },
  { src: '/image3.png', alt: 'Neutral', rating: 3 },
  { src: '/image4.png', alt: 'Sad', rating: 4 },
  { src: '/image5.png', alt: 'Very Sad', rating: 5 },
];

const WeeklyData = () => {
  const [weekData, setWeekData] = useState<
    Array<{ date: string; mood: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [todaysMoodId, setTodaysMoodId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserId(profile.id);
          fetchMoods(profile.id);
        }
      }
    };
    getUserId();
  }, []);

  const fetchMoods = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0];

    const { data: moods, error } = await supabase
      .from('moods')
      .select('id, date, mood_rating')
      .eq('user_id', uid)
      .order('date', { ascending: false })
      .limit(7);

    if (error) {
      console.error('Error fetching moods:', error);
      return;
    }

    // Check if there's a mood for today and store its ID
    const todaysMood = moods.find((m) => m.date === today);
    setTodaysMoodId(todaysMood?.id || null);

    setWeekData(moods.map((m) => ({ date: m.date, mood: m.mood_rating })));
    setIsLoading(false);
  };

  const handleMoodSelection = async (rating: number) => {
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];
    let error;

    if (todaysMoodId) {
      // Update existing mood
      ({ error } = await supabase
        .from('moods')
        .update({ mood_rating: rating })
        .eq('id', todaysMoodId));
    } else {
      // Insert new mood
      ({ error } = await supabase.from('moods').insert([
        {
          user_id: userId,
          mood_rating: rating,
          date: today,
        },
      ]));
    }

    if (error) {
      console.error('Error saving mood:', error);
      return;
    }

    fetchMoods(userId);
  };

  // Get today's mood
  const todayMood = weekData[0];
  const today = new Date().toISOString().split('T')[0];
  const hasTodaysMood = todayMood?.date === today;

  return (
    <div className='container mx-auto p-4 bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg shadow-xl'>
      {/* Main Title */}
      <h1 className='text-4xl font-extrabold text-center mb-10 text-blue-700'>
        Mood Dashboard 🌈
      </h1>

      {isLoading ? (
        <div className='text-center'>Loading...</div>
      ) : weekData.length === 0 ? (
        <section className='bg-gradient-to-b from-purple-500 to-pink-400 p-6 rounded-lg shadow-md mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 text-center mb-4'>
            Welcome, New User! 🎉
          </h2>
          <p className='text-center text-lg text-gray-800 mb-6'>
            It looks like you haven't shared your mood yet. Let's start by
            sharing how you're feeling today! 💬
          </p>
          <div className='flex justify-center'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className='bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 transition-all'>
                  Share Your Mood 🌟
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className='sm:max-w-[425px]'>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    How are you feeling today?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <div className='grid grid-cols-5 gap-4 p-4'>
                  {[...moodOptions].reverse().map((mood) => (
                    <button
                      key={mood.rating}
                      onClick={() => handleMoodSelection(mood.rating)}
                      className='flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                      <img
                        src={mood.src}
                        alt={mood.alt}
                        className='w-16 h-16 object-contain mb-2'
                      />
                      <span className='text-sm text-center'>{mood.alt}</span>
                    </button>
                  ))}
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      ) : (
        <>
          {/* Today's Mood Section */}
          <section className='bg-gradient-to-b from-blue-500 to-blue-400 p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 text-center mb-4'>
              Today's Mood 😊
            </h2>
            <div className='flex justify-center mb-4'>
              <div className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3'>
                <img
                  src={moodOptions[todayMood.mood - 1].src}
                  alt={moodOptions[todayMood.mood - 1].alt}
                  className='w-full h-48 object-contain rounded-md shadow-lg'
                />
                <p className='text-center text-lg text-gray-800 mt-2'>
                  {todayMood.date}
                </p>
              </div>
            </div>
          </section>

          {/* Modified Share Today's Mood Section */}
          <section className='bg-gradient-to-b from-yellow-400 to-yellow-300 p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 text-center mb-4 flex justify-center items-center'>
              {hasTodaysMood
                ? "Update Today's Mood 📝"
                : "Share Today's Mood 📢"}
            </h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all mx-auto block'>
                  {hasTodaysMood ? 'Update Mood 🔄' : 'Share Your Mood 🌻'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className='sm:max-w-[425px]'>
                <div className='flex justify-between items-start'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {hasTodaysMood
                        ? 'Update your mood for today?'
                        : 'How are you feeling today?'}
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                </div>
                <div className='grid grid-cols-5 gap-4 p-4'>
                  {[...moodOptions].reverse().map((mood) => (
                    <button
                      key={mood.rating}
                      onClick={async () => {
                        await handleMoodSelection(mood.rating);
                        const closeButton = document.querySelector(
                          '[role="dialog"] button[type="button"]'
                        );
                        if (closeButton instanceof HTMLElement)
                          closeButton.click();
                      }}
                      className={`flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors
                        ${
                          todayMood?.mood === mood.rating
                            ? 'ring-2 ring-blue-500'
                            : ''
                        }`}
                    >
                      <img
                        src={mood.src}
                        alt={mood.alt}
                        className='w-16 h-16 object-contain mb-2'
                      />
                      <span className='text-sm text-center'>{mood.alt}</span>
                    </button>
                  ))}
                </div>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>
          </section>

          {/* Mood for the Week Section */}
          <section className='bg-gradient-to-b from-green-400 to-green-300 p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 text-center mb-4'>
              Mood for the Week 📅
            </h2>

            {/* Bottom section with 6 smaller mood images */}
            <div className='flex justify-between gap-4'>
              {weekData.slice(0, 6).map((data, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center w-1/6 bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-transform transform hover:scale-105'
                >
                  <img
                    src={moodOptions[data.mood - 1].src}
                    alt={moodOptions[data.mood - 1].alt}
                    className='w-full h-24 object-contain mb-2 rounded-md'
                  />
                  <p className='text-sm text-gray-800 text-center'>
                    {data.date}
                  </p>
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
