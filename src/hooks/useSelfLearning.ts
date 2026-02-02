/**
 * Self-Learning Hook
 * 
 * Tracks user behavior and triggers automatic simplification.
 * Part of Block 54: Self-Learning Core.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LearningInput,
  LearningOutput,
  calculateLearningOutput,
  LEARNING_THRESHOLDS,
} from '@/config/selfLearningCoreConfig';

export interface SelfLearningState {
  input: LearningInput;
  output: LearningOutput;
  isLearning: boolean;
  sessionStart: number;
}

export function useSelfLearning(pageId: string) {
  const sessionStart = useRef(Date.now());
  const [state, setState] = useState<SelfLearningState>({
    input: {
      clicks: 0,
      timeToInsight: 0,
      scrollDepth: 0,
      backtracking: 0,
      aiCitations: 0,
      externalLinks: 0,
    },
    output: {
      shorterSummaries: false,
      fewerBlocks: false,
      betterHeadings: false,
      earlierWhatThisShows: false,
      earlierWhatThisDoesNotShow: false,
    },
    isLearning: true,
    sessionStart: sessionStart.current,
  });

  // Track clicks
  const trackClick = useCallback(() => {
    setState(prev => {
      const newInput = { ...prev.input, clicks: prev.input.clicks + 1 };
      return {
        ...prev,
        input: newInput,
        output: calculateLearningOutput(newInput),
      };
    });
  }, []);

  // Track scroll depth
  const trackScroll = useCallback((depth: number) => {
    setState(prev => {
      const newInput = { ...prev.input, scrollDepth: Math.max(prev.input.scrollDepth, depth) };
      return {
        ...prev,
        input: newInput,
        output: calculateLearningOutput(newInput),
      };
    });
  }, []);

  // Track backtracking (navigation back)
  const trackBacktrack = useCallback(() => {
    setState(prev => {
      const newInput = { ...prev.input, backtracking: prev.input.backtracking + 1 };
      return {
        ...prev,
        input: newInput,
        output: calculateLearningOutput(newInput),
      };
    });
  }, []);

  // Mark insight reached
  const markInsightReached = useCallback(() => {
    const timeToInsight = (Date.now() - sessionStart.current) / 1000;
    setState(prev => {
      const newInput = { ...prev.input, timeToInsight };
      return {
        ...prev,
        input: newInput,
        output: calculateLearningOutput(newInput),
      };
    });
  }, []);

  // Track external link click
  const trackExternalLink = useCallback(() => {
    setState(prev => {
      const newInput = { ...prev.input, externalLinks: prev.input.externalLinks + 1 };
      return {
        ...prev,
        input: newInput,
        output: calculateLearningOutput(newInput),
      };
    });
  }, []);

  // Set up scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      trackScroll(depth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll]);

  // Set up click tracking
  useEffect(() => {
    const handleClick = () => trackClick();
    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [trackClick]);

  // Check if page needs simplification
  const needsSimplification = 
    state.input.timeToInsight > LEARNING_THRESHOLDS.timeToInsightMax ||
    state.input.backtracking > LEARNING_THRESHOLDS.backtrackingMax;

  return {
    ...state,
    needsSimplification,
    trackClick,
    trackScroll,
    trackBacktrack,
    markInsightReached,
    trackExternalLink,
  };
}

export default useSelfLearning;
