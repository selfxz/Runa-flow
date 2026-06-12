"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface StarRatingProps {
  trackId: string;
  onLoginRequired: () => void;
}

export default function StarRating({ trackId, onLoginRequired }: StarRatingProps) {
  const { user } = useAuth();
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  
  const fetchRatings = useCallback(async () => {
    // Fetch average and count
    const { data: allRatings, error: allErr } = await supabase
      .from('ratings')
      .select('stars')
      .eq('track_id', trackId);

    if (!allErr && allRatings) {
      setCount(allRatings.length);
      if (allRatings.length > 0) {
        const sum = allRatings.reduce((acc, r) => acc + r.stars, 0);
        setAverage(sum / allRatings.length);
      } else {
        setAverage(0);
      }
    }

    // Fetch user rating
    if (user) {
      const { data: uRating, error: uErr } = await supabase
        .from('ratings')
        .select('stars')
        .eq('track_id', trackId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!uErr && uRating) {
        setUserRating(uRating.stars);
      } else {
        setUserRating(0);
      }
    }
  }, [trackId, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRatings();
  }, [fetchRatings]);

  const handleRate = async (stars: number) => {
    if (!user) {
      onLoginRequired();
      return;
    }

    const { error } = await supabase
      .from('ratings')
      .upsert({
        user_id: user.id,
        track_id: trackId,
        stars: stars
      }, { onConflict: 'user_id,track_id' });

    if (!error) {
      setUserRating(stars);
      fetchRatings();
    } else {
      alert("Error al calificar: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hover || userRating);
          return (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`transition-all duration-200 hover:scale-125 active:scale-95 ${
                isFilled ? "text-orange-500 drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]" : "text-white/15 hover:text-white/30"
              }`}
            >
              <Star size={28} fill={isFilled ? "currentColor" : "none"} />
            </button>
          );
        })}
      </div>
      
      {/* Rating Info */}
      <div className="flex items-center gap-4 text-center">
        {count > 0 && (
          <>
            <span className="text-2xl font-black text-orange-500 italic">{average.toFixed(1)}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
              {count} {count === 1 ? "voto" : "votos"}
            </span>
          </>
        )}
        {count === 0 && (
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
            Sin valoraciones aún
          </span>
        )}
      </div>
      
      {userRating > 0 && (
        <span className="text-[9px] font-bold text-green-500/60 uppercase tracking-widest">
          ★ Tu voto: {userRating}/5
        </span>
      )}
    </div>
  );
}
