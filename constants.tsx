
import React from 'react';
import { FamilyMember } from './types';

export const FAMILY: FamilyMember[] = [
  { name: 'Javi', role: 'Pare / Padre', icon: 'fa-user-tie', color: 'bg-blue-500' },
  { name: 'Salut', role: 'Mare / Madre', icon: 'fa-user-nurse', color: 'bg-pink-500' },
  { name: 'Arlet', role: 'Filla / Hija', icon: 'fa-child', color: 'bg-yellow-400' },
  { name: 'Enzo', role: 'Fill / Hijo', icon: 'fa-baby', color: 'bg-green-400' },
  { name: 'Bebè', role: 'En camí / En camino', icon: 'fa-question', color: 'bg-purple-400' },
];

export const DIFFICULTIES = [
  { id: 'easy', label: { ca: 'Fàcil', es: 'Fácil' }, size: 2, description: { ca: '2x2 - Per als més petits', es: '2x2 - Para los más peques' } },
  { id: 'normal', label: { ca: 'Normal', es: 'Normal' }, size: 3, description: { ca: '3x3 - El clàssic', es: '3x3 - El clásico' } },
  { id: 'hard', label: { ca: 'Difícil', es: 'Difícil' }, size: 4, description: { ca: '4x4 - Tot un repte!', es: '4x4 - ¡Todo un reto!' } },
];

export const TRANSLATIONS = {
  ca: {
    title: "Bon Nadal i Reis!",
    family: "Família Iturralde Matencio",
    chooseLang: "Tria el teu idioma:",
    chooseDiff: "Tria una dificultat per començar:",
    back: "Tornar",
    level: "Nivell",
    loading: "Preparant els nostres millors desitjos...",
    playAgain: "Torna a jugar",
    share: "Comparteix",
    welcome2026: "Amb tot el nostre amor, donant la benvinguda al 2026 i al nou membre de la família!",
    footer: "Bon Nadal i Feliç Any Nou 2026!",
    hintShow: "Veure pista",
    hintHide: "Amaga la pista",
    puzzleFooter: "Ordena els elements per descobrir la felicitació!"
  },
  es: {
    title: "¡Feliz Navidad y Reyes!",
    family: "Familia Iturralde Matencio",
    chooseLang: "Elige tu idioma:",
    chooseDiff: "Elige una dificultad para empezar:",
    back: "Volver",
    level: "Nivel",
    loading: "Preparando nuestros mejores deseos...",
    playAgain: "Volver a jugar",
    share: "Compartir",
    welcome2026: "¡Con todo nuestro amor, dando la bienvenida al 2026 y al nuevo miembro de la familia!",
    footer: "¡Feliz Navidad y Próspero Año Nuevo 2026!",
    hintShow: "Ver pista",
    hintHide: "Ocultar pista",
    puzzleFooter: "¡Ordena los elementos para descubrir la felicitación!"
  }
};
