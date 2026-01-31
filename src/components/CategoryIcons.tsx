import React from 'react';
import Svg, { Path, Circle, Line, Rect, Ellipse, G } from 'react-native-svg';
import { AffirmationCategory } from '@/data/affirmations';

interface IconProps {
  color: string;
  size?: number;
}

// Self-Love - Woman hugging herself with heart on chest
function SelfLoveIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Hair */}
      <Path
        d="M25 18 C20 20 18 28 18 35 C18 42 20 55 22 62 C24 68 28 70 32 70"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M55 18 C60 20 62 28 62 35 C62 42 60 55 58 62 C56 68 52 70 48 70"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Head */}
      <Path
        d="M25 18 C25 8 35 5 40 5 C45 5 55 8 55 18 C55 25 50 32 40 32 C30 32 25 25 25 18"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Face - closed eyes and smile */}
      <Path d="M33 18 Q35 16 37 18" fill="none" stroke={color} strokeWidth={1.2} />
      <Path d="M43 18 Q45 16 47 18" fill="none" stroke={color} strokeWidth={1.2} />
      <Path d="M37 24 Q40 26 43 24" fill="none" stroke={color} strokeWidth={1} />
      {/* Arms crossed hugging */}
      <Path
        d="M22 45 C15 42 12 50 15 55 L22 60 C25 62 28 58 28 55 L30 48"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M58 45 C65 42 68 50 65 55 L58 60 C55 62 52 58 52 55 L50 48"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Body */}
      <Path
        d="M30 35 C28 40 26 50 28 60 L52 60 C54 50 52 40 50 35"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Heart on chest */}
      <Path
        d="M40 42 C37 39 32 39 32 44 C32 48 40 54 40 54 C40 54 48 48 48 44 C48 39 43 39 40 42"
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
      {/* Heart rays */}
      <Line x1="32" y1="40" x2="28" y2="38" stroke={color} strokeWidth={1} />
      <Line x1="48" y1="40" x2="52" y2="38" stroke={color} strokeWidth={1} />
      <Line x1="40" y1="36" x2="40" y2="32" stroke={color} strokeWidth={1} />
    </Svg>
  );
}

// Good Vibes - Sun rising with flower and waves
function GoodVibesIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Sun circle */}
      <Path
        d="M25 30 C25 20 55 20 55 30"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Sun rays */}
      <Line x1="40" y1="18" x2="40" y2="8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="28" y1="22" x2="22" y2="14" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="52" y1="22" x2="58" y2="14" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="20" y1="28" x2="12" y2="26" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="60" y1="28" x2="68" y2="26" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Additional rays */}
      <Line x1="34" y1="20" x2="32" y2="12" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="46" y1="20" x2="48" y2="12" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Horizon line */}
      <Line x1="10" y1="35" x2="70" y2="35" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Waves on sides */}
      <Path d="M8 40 Q12 38 16 40 Q20 42 24 40" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M56 40 Q60 38 64 40 Q68 42 72 40" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 46 Q14 44 18 46 Q22 48 26 46" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M54 46 Q58 44 62 46 Q66 48 70 46" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Flower */}
      <Circle cx="40" cy="58" r="4" fill="none" stroke={color} strokeWidth={1.5} />
      <Ellipse cx="40" cy="50" rx="4" ry="6" fill="none" stroke={color} strokeWidth={1.5} />
      <Ellipse cx="34" cy="55" rx="4" ry="6" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(-45 34 55)" />
      <Ellipse cx="46" cy="55" rx="4" ry="6" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(45 46 55)" />
      <Ellipse cx="34" cy="62" rx="4" ry="6" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(-135 34 62)" />
      <Ellipse cx="46" cy="62" rx="4" ry="6" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(135 46 62)" />
      <Ellipse cx="40" cy="66" rx="4" ry="6" fill="none" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

// Abundance - Cornucopia with coins and $ symbol
function AbundanceIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Cornucopia horn */}
      <Path
        d="M15 25 C10 30 8 40 12 50 C16 58 25 62 35 60 C40 58 45 55 48 50 L50 45 C48 40 42 38 38 40 C32 42 28 48 30 55"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Horn spiral end */}
      <Path
        d="M15 25 C18 20 22 18 25 20 C28 22 26 28 22 30"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Coins stacking out */}
      <Ellipse cx="45" cy="52" rx="8" ry="3" fill="none" stroke={color} strokeWidth={1.5} />
      <Ellipse cx="45" cy="48" rx="8" ry="3" fill="none" stroke={color} strokeWidth={1.5} />
      <Ellipse cx="45" cy="44" rx="8" ry="3" fill="none" stroke={color} strokeWidth={1.5} />
      {/* Loose coins */}
      <Ellipse cx="55" cy="60" rx="6" ry="2.5" fill="none" stroke={color} strokeWidth={1.5} />
      <Ellipse cx="60" cy="65" rx="5" ry="2" fill="none" stroke={color} strokeWidth={1.2} />
      <Ellipse cx="50" cy="68" rx="4" ry="1.5" fill="none" stroke={color} strokeWidth={1} />
      {/* Dollar sign */}
      <Path
        d="M68 15 C65 12 60 14 60 18 C60 22 68 22 68 26 C68 30 63 32 60 29"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Line x1="64" y1="10" x2="64" y2="35" stroke={color} strokeWidth={1.5} />
      {/* Sparkle */}
      <Path d="M72 40 L74 44 L78 44 L75 47 L76 51 L72 48 L68 51 L69 47 L66 44 L70 44 Z" fill="none" stroke={color} strokeWidth={1} />
    </Svg>
  );
}

// Law of Attraction - Hands holding magnet with stars and lightning
function LawOfAttractionIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Left hand */}
      <Path
        d="M10 45 C8 50 8 60 12 65 C14 68 18 70 22 68 L25 60 C26 55 24 50 20 48 L15 45 C12 43 10 43 10 45"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {/* Right hand */}
      <Path
        d="M70 45 C72 50 72 60 68 65 C66 68 62 70 58 68 L55 60 C54 55 56 50 60 48 L65 45 C68 43 70 43 70 45"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {/* Magnet U shape */}
      <Path
        d="M28 35 L28 50 C28 58 34 62 40 62 C46 62 52 58 52 50 L52 35"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Magnet ends */}
      <Rect x="24" y="28" width="10" height="10" rx="1" fill="none" stroke={color} strokeWidth={2} />
      <Rect x="46" y="28" width="10" height="10" rx="1" fill="none" stroke={color} strokeWidth={2} />
      {/* Stars */}
      <Path d="M40 8 L41 12 L45 12 L42 15 L43 19 L40 16 L37 19 L38 15 L35 12 L39 12 Z" fill="none" stroke={color} strokeWidth={1.2} />
      <Path d="M25 15 L26 18 L29 18 L27 20 L28 23 L25 21 L22 23 L23 20 L21 18 L24 18 Z" fill="none" stroke={color} strokeWidth={1} />
      <Path d="M55 15 L56 18 L59 18 L57 20 L58 23 L55 21 L52 23 L53 20 L51 18 L54 18 Z" fill="none" stroke={color} strokeWidth={1} />
      <Path d="M62 8 L63 10 L65 10 L63.5 11.5 L64 14 L62 12.5 L60 14 L60.5 11.5 L59 10 L61 10 Z" fill="none" stroke={color} strokeWidth={0.8} />
      {/* Lightning bolts */}
      <Path d="M32 18 L34 22 L32 22 L35 27" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M45 20 L47 24 L45 24 L48 29" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M38 22 L40 26 L38 26 L41 31" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

// Gratitude - Praying hands with flower branch
function GratitudeIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Praying hands */}
      <Path
        d="M30 70 L30 45 C30 40 32 35 35 32 L38 28 C39 26 40 24 40 22"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M50 70 L50 45 C50 40 48 35 45 32 L42 28 C41 26 40 24 40 22"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Fingers */}
      <Path d="M32 45 L32 35" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M35 42 L35 30" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M38 40 L38 26" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M48 45 L48 35" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M45 42 L45 30" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M42 40 L42 26" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Flower branch */}
      <Path
        d="M50 40 C55 35 60 30 65 25 C68 22 70 18 70 15"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Top flower */}
      <Circle cx="70" cy="12" r="5" fill="none" stroke={color} strokeWidth={1.5} />
      <Circle cx="70" cy="12" r="2" fill="none" stroke={color} strokeWidth={1} />
      {/* Flower petals */}
      <Path d="M65 10 C63 8 63 5 65 5 C67 5 68 8 66 10" fill="none" stroke={color} strokeWidth={1.2} />
      <Path d="M75 10 C77 8 77 5 75 5 C73 5 72 8 74 10" fill="none" stroke={color} strokeWidth={1.2} />
      {/* Leaves */}
      <Path d="M55 32 C52 30 50 26 52 24 C54 22 58 24 58 28 C58 30 56 32 55 32" fill="none" stroke={color} strokeWidth={1.2} />
      <Path d="M60 26 C58 24 58 20 60 18 C62 16 66 18 65 22 C64 24 62 26 60 26" fill="none" stroke={color} strokeWidth={1.2} />
      {/* Small flower bud */}
      <Path d="M62 30 C60 28 60 25 62 24 C64 23 66 26 64 28" fill="none" stroke={color} strokeWidth={1} />
    </Svg>
  );
}

// Glow Up - Chrysalis and butterfly transformation
function GlowUpIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Branch */}
      <Path d="M8 8 L20 20" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      {/* Chrysalis */}
      <Path
        d="M18 22 C15 25 14 35 16 45 C18 52 22 55 25 52 C28 48 28 35 25 25 C23 20 20 20 18 22"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Chrysalis lines */}
      <Path d="M17 30 C20 32 24 30 25 28" fill="none" stroke={color} strokeWidth={1} opacity={0.7} />
      <Path d="M16 38 C19 40 24 38 26 35" fill="none" stroke={color} strokeWidth={1} opacity={0.7} />
      {/* Butterfly */}
      <G transform="translate(50, 40)">
        {/* Body */}
        <Ellipse cx="0" cy="0" rx="2" ry="12" fill="none" stroke={color} strokeWidth={1.5} />
        {/* Left upper wing */}
        <Path
          d="M-2 -8 C-18 -20 -22 -5 -18 5 C-15 12 -5 10 -2 2"
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Left lower wing */}
        <Path
          d="M-2 2 C-12 8 -15 18 -10 20 C-5 22 -2 15 -2 8"
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Right upper wing */}
        <Path
          d="M2 -8 C18 -20 22 -5 18 5 C15 12 5 10 2 2"
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Right lower wing */}
        <Path
          d="M2 2 C12 8 15 18 10 20 C5 22 2 15 2 8"
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Wing patterns */}
        <Circle cx="-12" cy="-5" r="2" fill="none" stroke={color} strokeWidth={0.8} />
        <Circle cx="12" cy="-5" r="2" fill="none" stroke={color} strokeWidth={0.8} />
        <Circle cx="-8" cy="10" r="1.5" fill="none" stroke={color} strokeWidth={0.8} />
        <Circle cx="8" cy="10" r="1.5" fill="none" stroke={color} strokeWidth={0.8} />
        {/* Antennae */}
        <Path d="M-1 -12 C-3 -16 -5 -18 -6 -18" fill="none" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Path d="M1 -12 C3 -16 5 -18 6 -18" fill="none" stroke={color} strokeWidth={1} strokeLinecap="round" />
      </G>
      {/* Rays around butterfly */}
      <Line x1="68" y1="25" x2="72" y2="20" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="72" y1="35" x2="78" y2="33" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="70" y1="45" x2="76" y2="48" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="65" y1="55" x2="70" y2="60" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="35" y1="60" x2="32" y2="65" stroke={color} strokeWidth={1} strokeLinecap="round" />
    </Svg>
  );
}

// Spirituality - Crescent moon with eye and star
function SpiritualityIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Crescent moon - double line */}
      <Path
        d="M20 15 C5 25 5 55 20 65 C30 72 45 70 55 60 C40 60 30 50 30 40 C30 30 40 20 55 20 C45 10 30 8 20 15"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Path
        d="M23 20 C12 28 12 52 23 60 C30 65 40 64 48 58 C38 56 32 48 32 40 C32 32 38 24 48 22 C40 16 30 15 23 20"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Eye */}
      <Path
        d="M35 40 C40 32 55 32 60 40 C55 48 40 48 35 40"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Iris */}
      <Circle cx="47" cy="40" r="5" fill="none" stroke={color} strokeWidth={1.8} />
      {/* Pupil */}
      <Circle cx="47" cy="40" r="2" fill={color} />
      {/* Eye rays/lashes */}
      <Line x1="47" y1="30" x2="47" y2="26" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="40" y1="32" x2="38" y2="28" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="54" y1="32" x2="56" y2="28" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="47" y1="50" x2="47" y2="54" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="40" y1="48" x2="38" y2="52" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="54" y1="48" x2="56" y2="52" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Star */}
      <Path d="M65 12 L66.5 17 L72 17 L68 20.5 L69.5 26 L65 22.5 L60.5 26 L62 20.5 L58 17 L63.5 17 Z" fill="none" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

// Healing - Heart with bandaids
function HealingIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Heart outline */}
      <Path
        d="M40 70 C25 55 8 42 8 28 C8 16 18 8 28 8 C34 8 38 12 40 16 C42 12 46 8 52 8 C62 8 72 16 72 28 C72 42 55 55 40 70"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Bandaid 1 - diagonal */}
      <G transform="rotate(-45 40 38)">
        <Rect x="25" y="34" width="30" height="10" rx="5" fill="none" stroke={color} strokeWidth={1.8} />
        <Rect x="35" y="34" width="10" height="10" fill="none" stroke={color} strokeWidth={1.2} />
        {/* Dots on bandaid */}
        <Circle cx="30" cy="39" r="1" fill={color} />
        <Circle cx="33" cy="36" r="0.8" fill={color} />
        <Circle cx="33" cy="42" r="0.8" fill={color} />
        <Circle cx="50" cy="39" r="1" fill={color} />
        <Circle cx="47" cy="36" r="0.8" fill={color} />
        <Circle cx="47" cy="42" r="0.8" fill={color} />
      </G>
      {/* Bandaid 2 - opposite diagonal */}
      <G transform="rotate(45 40 38)">
        <Rect x="25" y="34" width="30" height="10" rx="5" fill="none" stroke={color} strokeWidth={1.8} />
        <Rect x="35" y="34" width="10" height="10" fill="none" stroke={color} strokeWidth={1.2} />
        {/* Dots on bandaid */}
        <Circle cx="30" cy="39" r="1" fill={color} />
        <Circle cx="33" cy="36" r="0.8" fill={color} />
        <Circle cx="33" cy="42" r="0.8" fill={color} />
        <Circle cx="50" cy="39" r="1" fill={color} />
        <Circle cx="47" cy="36" r="0.8" fill={color} />
        <Circle cx="47" cy="42" r="0.8" fill={color} />
      </G>
      {/* Rays */}
      <Line x1="65" y1="15" x2="72" y2="10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="70" y1="22" x2="76" y2="20" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="15" y1="55" x2="8" y2="58" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="12" y1="48" x2="5" y2="48" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

// Feminine Energy - Venus symbol with flower and waves
function FeminineEnergyIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Venus symbol - double circle */}
      <Circle cx="35" cy="28" r="18" fill="none" stroke={color} strokeWidth={2.5} />
      <Circle cx="35" cy="28" r="12" fill="none" stroke={color} strokeWidth={1.5} />
      {/* Cross */}
      <Line x1="35" y1="46" x2="35" y2="72" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Line x1="23" y1="60" x2="47" y2="60" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {/* Waves around */}
      <Path d="M58 18 Q62 15 66 18" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M60 25 Q64 22 68 25" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M8 32 Q12 29 16 32" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M6 40 Q10 37 14 40" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Flower */}
      <G transform="translate(62, 50)">
        <Circle cx="0" cy="0" r="3" fill="none" stroke={color} strokeWidth={1.2} />
        <Ellipse cx="0" cy="-8" rx="3" ry="5" fill="none" stroke={color} strokeWidth={1.5} />
        <Ellipse cx="6" cy="-4" rx="3" ry="5" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(60 6 -4)" />
        <Ellipse cx="6" cy="4" rx="3" ry="5" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(120 6 4)" />
        <Ellipse cx="0" cy="8" rx="3" ry="5" fill="none" stroke={color} strokeWidth={1.5} />
        <Ellipse cx="-6" cy="4" rx="3" ry="5" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(-120 -6 4)" />
        <Ellipse cx="-6" cy="-4" rx="3" ry="5" fill="none" stroke={color} strokeWidth={1.5} transform="rotate(-60 -6 -4)" />
      </G>
    </Svg>
  );
}

// Masculine Energy - Mars symbol with arrows
function MasculineEnergyIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Mars circle - double */}
      <Circle cx="32" cy="48" r="20" fill="none" stroke={color} strokeWidth={2.5} />
      <Circle cx="32" cy="48" r="13" fill="none" stroke={color} strokeWidth={1.5} />
      {/* Arrow */}
      <Line x1="46" y1="34" x2="68" y2="12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {/* Arrow head */}
      <Path d="M68 12 L68 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M68 12 L56 12" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {/* Top chevron accent */}
      <Path d="M28 18 L32 12 L36 18" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      {/* Side arrow accent */}
      <Path d="M60 48 L66 48 L60 54" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

// Love and Family - Cupid bow and heart arrow
function LoveAndFamilyIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Bow */}
      <Path
        d="M15 60 C10 50 10 30 20 15 C22 12 26 12 28 15"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Bow decorative curl top */}
      <Path
        d="M28 15 C32 18 30 25 25 25"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Bow decorative curl bottom */}
      <Path
        d="M15 60 C12 65 18 70 22 66 C26 62 22 55 18 58"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Bowstring */}
      <Line x1="28" y1="18" x2="18" y2="58" stroke={color} strokeWidth={1.5} />
      {/* Arrow shaft */}
      <Line x1="25" y1="55" x2="65" y2="15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      {/* Heart arrow tip */}
      <Path
        d="M65 15 C62 12 58 12 58 16 C58 19 65 24 65 24 C65 24 72 19 72 16 C72 12 68 12 65 15"
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
      {/* Arrow feathers */}
      <Path d="M25 55 L18 52 L22 58 L15 60 L22 62" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// Stress and Anxiety - Storm cloud with lightning and rain
function StressAnxietyIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Main cloud */}
      <Path
        d="M15 45 C8 45 5 38 10 32 C12 28 18 26 24 28 C26 20 34 16 42 18 C50 20 56 26 56 34 C64 34 70 40 68 48 C66 54 58 56 52 54 L28 54 C20 54 15 50 15 45"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Small cloud behind */}
      <Path
        d="M50 22 C52 18 58 16 64 18 C70 20 74 26 72 32 C70 36 66 38 62 36"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Lightning bolt */}
      <Path
        d="M38 54 L42 62 L36 62 L44 75 L40 66 L46 66 L38 54"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rain drops */}
      <Path d="M22 58 C22 62 20 66 22 66 C24 66 24 62 22 58" fill="none" stroke={color} strokeWidth={1.5} />
      <Path d="M28 62 C28 66 26 70 28 70 C30 70 30 66 28 62" fill="none" stroke={color} strokeWidth={1.5} />
      <Path d="M56 58 C56 62 54 66 56 66 C58 66 58 62 56 58" fill="none" stroke={color} strokeWidth={1.5} />
      <Path d="M62 62 C62 66 60 70 62 70 C64 70 64 66 62 62" fill="none" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

// General - Spiral
function GeneralIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Spiral */}
      <Path
        d="M40 40
           C40 38 42 36 44 36
           C48 36 50 40 50 44
           C50 50 44 54 38 54
           C30 54 26 48 26 40
           C26 30 34 24 44 24
           C56 24 64 34 64 46
           C64 60 52 70 38 70
           C22 70 12 58 12 42
           C12 24 26 12 44 12"
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Friendship - Two people with arms linked
function FriendshipIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Left person head */}
      <Circle cx="22" cy="18" r="10" fill="none" stroke={color} strokeWidth={2} />
      {/* Right person head */}
      <Circle cx="58" cy="18" r="10" fill="none" stroke={color} strokeWidth={2} />
      {/* Left person body */}
      <Path
        d="M12 35 L12 70 M32 35 L32 70"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M12 35 C12 30 17 28 22 28 C27 28 32 30 32 35"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Right person body */}
      <Path
        d="M48 35 L48 70 M68 35 L68 70"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M48 35 C48 30 53 28 58 28 C63 28 68 30 68 35"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Arms linked/intertwined */}
      <Path
        d="M32 40 C36 38 38 40 40 42 C42 44 44 46 40 48 C36 50 34 48 32 46"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M48 40 C44 38 42 40 40 42 C38 44 36 46 40 48 C44 50 46 48 48 46"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Knot detail */}
      <Path
        d="M36 44 C38 42 42 42 44 44 C46 46 44 50 40 50 C36 50 34 46 36 44"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Business - Briefcase with arrow and gear
function BusinessIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Briefcase body */}
      <Rect x="8" y="28" width="48" height="35" rx="4" fill="none" stroke={color} strokeWidth={2.5} />
      {/* Handle */}
      <Path
        d="M22 28 L22 22 C22 18 26 15 32 15 C38 15 42 18 42 22 L42 28"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Handle top bar */}
      <Rect x="26" y="15" width="12" height="5" rx="2" fill="none" stroke={color} strokeWidth={1.5} />
      {/* Clasp */}
      <Rect x="28" y="40" width="8" height="10" rx="2" fill="none" stroke={color} strokeWidth={1.5} />
      {/* Arrow going up */}
      <Line x1="62" y1="55" x2="62" y2="20" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M54 28 L62 18 L70 28" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Gear */}
      <G transform="translate(58, 58)">
        <Circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth={2} />
        <Circle cx="0" cy="0" r="3" fill="none" stroke={color} strokeWidth={1.5} />
        {/* Gear teeth */}
        <Line x1="0" y1="-8" x2="0" y2="-12" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Line x1="0" y1="8" x2="0" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Line x1="-8" y1="0" x2="-12" y2="0" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Line x1="8" y1="0" x2="12" y2="0" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Line x1="-6" y1="-6" x2="-9" y2="-9" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Line x1="6" y1="-6" x2="9" y2="-9" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Line x1="-6" y1="6" x2="-9" y2="9" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Line x1="6" y1="6" x2="9" y2="9" stroke={color} strokeWidth={2} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

// Motherhood - Pregnant woman with hearts
function MotherhoodIcon({ color, size = 80 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Hair */}
      <Path
        d="M28 12 C22 15 20 25 22 35 C24 42 26 48 28 52"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Head */}
      <Path
        d="M28 12 C32 5 42 5 45 12 C48 18 46 25 42 28"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Face features */}
      <Path d="M36 16 Q38 14 40 16" fill="none" stroke={color} strokeWidth={1} />
      <Path d="M35 22 Q38 24 41 22" fill="none" stroke={color} strokeWidth={1} />
      {/* Body - pregnant silhouette */}
      <Path
        d="M42 28 C48 32 52 40 52 52 C52 62 48 72 42 75 L30 75 C26 72 24 65 28 52"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Belly curve */}
      <Path
        d="M32 45 C38 42 48 48 48 58 C48 65 42 70 36 70"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Hands on belly */}
      <Path d="M35 60 C38 58 42 60 44 62" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* Heart on belly */}
      <Path
        d="M40 55 C38 53 35 53 35 56 C35 58 40 62 40 62 C40 62 45 58 45 56 C45 53 42 53 40 55"
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
      {/* Heart floating */}
      <Path
        d="M58 35 C56 33 53 33 53 36 C53 38 58 42 58 42 C58 42 63 38 63 36 C63 33 60 33 58 35"
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </Svg>
  );
}

// Map category to icon component
export const CATEGORY_ICONS: Record<AffirmationCategory, React.FC<IconProps> | null> = {
  'self-love': SelfLoveIcon,
  'good-vibes': GoodVibesIcon,
  'abundance': AbundanceIcon,
  'law-of-attraction': LawOfAttractionIcon,
  'gratitude': GratitudeIcon,
  'glow-up': GlowUpIcon,
  'spirituality': SpiritualityIcon,
  'healing': HealingIcon,
  'feminine-energy': FeminineEnergyIcon,
  'masculine-energy': MasculineEnergyIcon,
  'love-and-family': LoveAndFamilyIcon,
  'stress-and-anxiety': StressAnxietyIcon,
  'general': GeneralIcon,
  'friendship': FriendshipIcon,
  'business': BusinessIcon,
  'motherhood': MotherhoodIcon,
  'blessings': null,
  'heartbreak': null,
  'fatherhood': null,
  'students': null,
};

export function CategoryIcon({ category, color, size = 80 }: { category: AffirmationCategory; color: string; size?: number }) {
  const IconComponent = CATEGORY_ICONS[category];
  if (!IconComponent) return null;
  return <IconComponent color={color} size={size} />;
}
