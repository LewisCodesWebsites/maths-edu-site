import React from 'react';

const dummyProgress = [
  { topic: "Addition", score: 80 },
  { topic: "Subtraction", score: 95 },
  { topic: "Multiplication", score: 70 },
  { topic: "Fractions", score: 60 },
];

const ChildDashboardPage = () => {
  return (
    <div className="container py-10">
      <h1 className="text-3xl mb-6">Your Progress</h1>
      <div className="grid gap-4">
        {dummyProgress.map((item, idx) => (
          <div key={idx} className="card">
            <h2 className="text-xl">{item.topic}</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
            <p className="mt-1 text-sm">{item.score}% Correct</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildDashboardPage;
