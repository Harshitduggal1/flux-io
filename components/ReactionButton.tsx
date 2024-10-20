'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

type Reaction = 'like' | 'love' | 'clap' | 'fire' | 'rocket';

interface ReactionButtonProps {
  postId: string;
  initialReactions: Record<Reaction, number>;
  initialUserReaction: Reaction | null;
}

type State = {
  reactions: Record<Reaction, number>;
  userReaction: Reaction | null;
  isLoading: boolean;
};

type Action =
  | { type: 'SET_REACTIONS'; payload: Record<Reaction, number> }
  | { type: 'SET_USER_REACTION'; payload: Reaction | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'OPTIMISTIC_UPDATE'; payload: Reaction };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_REACTIONS':
      return { ...state, reactions: action.payload };
    case 'SET_USER_REACTION':
      return { ...state, userReaction: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'OPTIMISTIC_UPDATE':
      const newReactions = { ...state.reactions };
      if (state.userReaction) {
        newReactions[state.userReaction] = Math.max(0, (newReactions[state.userReaction] || 0) - 1);
      }
      if (state.userReaction !== action.payload) {
        newReactions[action.payload] = (newReactions[action.payload] || 0) + 1;
      }
      return {
        ...state,
        reactions: newReactions,
        userReaction: state.userReaction === action.payload ? null : action.payload,
      };
    default:
      return state;
  }
}

export default function ReactionButton({ postId, initialReactions, initialUserReaction }: ReactionButtonProps) {
  const [state, dispatch] = useReducer(reducer, {
    reactions: initialReactions,
    userReaction: initialUserReaction,
    isLoading: false,
  });

  const { isAuthenticated, isLoading: isAuthLoading } = useKindeAuth();
  const { toast } = useToast();

  const fetchReactions = useCallback(async () => {
    if (!postId) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`/api/reactions?postId=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch reactions');
      const data = await response.json();
      console.log('Fetched reaction data:', data);
      dispatch({ type: 'SET_REACTIONS', payload: data.reactions });
      dispatch({ type: 'SET_USER_REACTION', payload: data.userReaction });
    } catch (error) {
      console.error('Error fetching reactions:', error);
      toast({
        title: "Error",
        description: "Failed to load reactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [postId, toast]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (reaction: Reaction) => {
    if (isAuthenticated !== true) {
      toast({
        title: "Authentication Required",
        description: "Please log in to react to this post.",
      });
      return;
    }

    // Optimistic update
    dispatch({ type: 'OPTIMISTIC_UPDATE', payload: reaction });

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, reaction }),
      });

      if (!response.ok) throw new Error('Failed to update reaction');

      const data = await response.json();
      console.log('Updated reaction data:', data);
      dispatch({ type: 'SET_REACTIONS', payload: data.reactions });
      dispatch({ type: 'SET_USER_REACTION', payload: data.userReaction });
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      });
      // Revert optimistic update on error
      fetchReactions();
    }
  };

  const reactionEmojis: Record<Reaction, string> = {
    like: '👍',
    love: '😍',
    clap: '👏🏻',
    fire: '🔥',
    rocket: '🚀'
  };

  return (
    <div className="flex flex-col items-center space-y-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-2xl p-6 rounded-xl">
      <h3 className="mb-4 font-bold text-2xl text-white">React to this post!</h3>
      <div className="flex space-x-2">
        {Object.entries(reactionEmojis).map(([key, emoji]) => (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full ${
                    state.userReaction === key
                      ? 'bg-white shadow-inner'
                      : 'bg-opacity-50 hover:bg-opacity-75 bg-gray-200'
                  }`}
                  onClick={() => handleReaction(key as Reaction)}
                  disabled={state.isLoading || isAuthLoading || !isAuthenticated}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="ml-1 font-semibold text-sm">{state.reactions[key as Reaction] || 0}</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      {state.isLoading && <p className="mt-2 text-sm text-white">Updating reactions...</p>}
      {isAuthenticated !== true && !isAuthLoading && (
        <p className="mt-2 text-sm text-white">Please log in to react to this post.</p>
      )}
    </div>
  );
}
