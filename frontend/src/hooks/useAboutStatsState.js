import { useState } from 'react';
import { generateId } from "../utils/portfolioUtils";

export const useAboutStatsState = (parseMultiMode) => {
  const [stats, setStats] = useState([]);
  const [promiseItems, setPromiseItems] = useState([]);
  const [connectItems, setConnectItems] = useState([]);

  // Stats Actions
  const addStat = () => setStats(prev => [...prev, { id: generateId(), n: { light: "0", dark: "0" }, l: { light: "Label", dark: "Label" } }]);
  const updateStat = (id, field, value, mode) => setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: { ...parseMultiMode(s[field]), [mode]: value } } : s));
  const deleteStat = (id) => confirm("Delete this stat?") && setStats(prev => prev.filter(s => s.id !== id));
  const moveStat = (id, direction) => setStats(prev => {
    const idx = prev.findIndex(s => s.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === prev.length - 1)) return prev;
    const next = [...prev];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    return next;
  });

  // Promise Actions
  const addPromiseItem = () => setPromiseItems(prev => [...prev, { id: generateId(), n: (prev.length + 1).toString().padStart(2, "0"), t: { light: "", dark: "" }, d: { light: "", dark: "" } }]);
  const updatePromiseItem = (id, field, value, mode) => setPromiseItems(prev => prev.map(i => i.id === id ? { ...i, [field]: { ...parseMultiMode(i[field]), [mode]: value } } : i));
  const deletePromiseItem = (id) => confirm("Delete this promise item?") && setPromiseItems(prev => prev.filter(i => i.id !== id));
  const movePromiseItem = (id, direction) => setPromiseItems(prev => {
    const idx = prev.findIndex(i => i.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === prev.length - 1)) return prev;
    const next = [...prev];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    return next.map((item, i) => ({ ...item, n: (i + 1).toString().padStart(2, "0") }));
  });

  // Connect Actions
  const addConnectItem = () => setConnectItems(prev => [...prev, { id: generateId(), name: "New Link", url: "#", icon: "Globe", color: "#EAB308" }]);
  const updateConnectItem = (id, field, value) => setConnectItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  const deleteConnectItem = (id) => confirm("Delete this connect link?") && setConnectItems(prev => prev.filter(i => i.id !== id));

  return {
    stats, setStats, addStat, updateStat, deleteStat, moveStat,
    promiseItems, setPromiseItems, addPromiseItem, updatePromiseItem, deletePromiseItem, movePromiseItem,
    connectItems, setConnectItems, addConnectItem, updateConnectItem, deleteConnectItem
  };
};
