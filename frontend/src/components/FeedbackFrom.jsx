import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function FeedbackForm() {
  const { currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a brief comment.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/api/reviews/submit', {
        userId: currentUser?.uid || "anonymous",
        rating: rating,
        comment: comment
      });

      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setComment('');
      setError('');
    }, 300);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-3.5 bg-[#6A0DAD] text-white rounded-full shadow-[0_8px_20px_rgba(106,13,173,0.3)] font-bold text-sm hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">rate_review</span>
        Give Feedback
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl dark:shadow-none border border-transparent dark:border-zinc-800 font-['Inter',sans-serif] overflow-hidden transition-colors duration-300"
            >
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400 rounded-full transition-colors z-10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="p-8">
                {isSubmitted ? (
                  <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h3 className="text-xl font-black text-black dark:text-white mb-2">Thank You!</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mb-8">
                      Your feedback helps us make CareerCoach better for everyone.
                    </p>
                    <button
                      onClick={handleClose}
                      className="w-full py-3.5 rounded-xl font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Rate your experience</h3>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mt-1">How was your mock interview session?</p>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl text-center">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-90"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(rating)}
                          >
                            <span
                              className={`material-symbols-outlined text-4xl transition-colors ${
                                star <= (hover || rating) ? "text-[#FFC53D]" : "text-gray-200 dark:text-zinc-700"
                              }`}
                              style={{ fontVariationSettings: star <= (hover || rating) ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              star
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tell us what you loved, or what we can improve..."
                          className="w-full h-32 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all resize-none custom-scrollbar"
                          maxLength={500}
                        />
                        <div className="absolute bottom-3 right-4 text-[10px] font-bold text-gray-400 dark:text-zinc-500">
                          {comment.length}/500
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl font-bold text-white bg-[#6A0DAD] hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-md active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2 text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Submit Feedback"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}