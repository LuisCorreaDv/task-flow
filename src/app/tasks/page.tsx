'use client';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';

export default function TasksPage() {

  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex-1'>
        <TaskBoard />
      </div>
    </div>
  );
}
