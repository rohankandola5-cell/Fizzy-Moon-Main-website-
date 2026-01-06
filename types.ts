/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface FeatureItem {
  id: string;
  name: string;
  category: string;
  image: string;
  tag: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  EAT_DRINK = 'eat-drink',
  VIBE = 'vibe',
  BOOKINGS = 'bookings',
}