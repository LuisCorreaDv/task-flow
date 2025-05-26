'use client';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import TaskFilter from './components/TaskFilter';
import { useState } from 'react';
import { TaskStatus } from '@/types/TaskTypes';

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterStatus = (status: TaskStatus | 'all') => {
    setStatusFilter(status);
  };

  const handleFilterFavorites = (showFavoritesOnly: boolean) => {
    setFavoritesOnly(showFavoritesOnly);
  };
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex-1 overflow-y-hidden overflow-x-auto'>
        <TaskFilter 
          onSearch={handleSearch} 
          onFilterStatus={handleFilterStatus} 
          onFilterFavorites={handleFilterFavorites}
        />
        <TaskBoard 
          searchTerm={searchTerm} 
          statusFilter={statusFilter} 
          favoritesOnly={favoritesOnly}
        />
      </div>
    </div>
  );
}
