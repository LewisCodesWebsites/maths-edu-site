import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API_BASE from '../api';

const ChildDashboardPage = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<any>({});
  const [progress, setProgress] = useState<any[]>([]);
  const [year, setYear] = useState('reception');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let childYear = 'reception';
      let childProgress: any[] = [];
      if (user?.username) {
        // Fetch child details from backend
        const res = await fetch(`${API_BASE}/api/children/${user.username}`);
        const data = await res.json();
        if (data.success && data.child) {
          childYear = data.child.year || 'reception';
          childProgress = data.child.progress || [];
        }
      }
      setYear(childYear);
      setProgress(childProgress);
      // Fetch topics for the child's year
      const tRes = await fetch(`${API_BASE}/api/topics/${childYear}`);
      const tData = await tRes.json();
      setTopics(tData.topics || {});
      setLoading(false);
    }
    fetchData();
  }, [user]);

  // Helper to get progress for a topic
  const getTopicScore = (topicTitle: string) => {
    const entry = progress.find((p) => p.topic === topicTitle);
    return entry ? entry.score : 0;
  };

  if (loading) return <div className="container py-10">Loading...</div>;

  return (
    <div className="container py-10">
      <h1 className="text-3xl mb-6">Your Topics</h1>
      {Object.keys(topics).length === 0 && <p>No topics found for your year.</p>}
      {Object.entries(topics).map(([section, levels]: any) => (
        <div key={section} className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{section}</h2>
          {Object.entries(levels).map(([level, topicList]: any) => (
            <div key={level} className="mb-4">
              <h3 className="text-lg font-semibold capitalize mb-2">{level}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {topicList.map((topic: any) => (
                  <div key={topic._id} className="card p-4">
                    <h4 className="text-xl font-bold">{topic.title}</h4>
                    <p className="mb-2 text-gray-700">{topic.article}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2 mb-1">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${getTopicScore(topic.title)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-indigo-700 font-medium">
                      {getTopicScore(topic.title)}% Correct
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChildDashboardPage;
