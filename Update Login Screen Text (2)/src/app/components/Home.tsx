import { Menu, MapPin, Plus, Trash2, Check, Cloud } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { SubmittedFormData } from '../App';
import { patientAPI } from '../../services/api';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  time: string;
}

interface HomeProps {
  onNavigate: (screen: string) => void;
  userName: string;
  submittedForms: SubmittedFormData[];
}

export function Home({ onNavigate, userName, submittedForms }: HomeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [backendPatients, setBackendPatients] = useState<any[]>([]);

  // Load patients from backend
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patients = await patientAPI.getAll();
        setBackendPatients(patients);
      } catch (error) {
        console.error('Failed to load patients:', error);
      }
    };
    loadPatients();
  }, []);

  // Combine frontend and backend data
  const allPatients = [...submittedForms, ...backendPatients];

  // Calculate stats from all patients
  const totalPatients = allPatients.length;
  const highRiskCount = allPatients.filter(f => f.riskLevel === 'high').length;
  const todayCount = allPatients.filter(f => {
    const formDate = new Date(f.submittedAt || f.createdAt);
    const today = new Date();
    return formDate.toDateString() === today.toDateString();
  }).length;

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText,
        completed: false,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      setIsAddingTask(false);
    }
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Android Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Phone Screen */}
        <div className="relative bg-[#0d3b2f] rounded-[2.5rem] overflow-hidden w-[375px] h-[812px]">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-white rounded-sm">
                <div className="w-2 h-2 bg-white m-0.5"></div>
              </div>
            </div>
          </div>

          {/* Home Screen Content */}
          <div className="h-full overflow-y-auto px-6 pt-14 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button className="text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 bg-[#1a5742] px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-[#4ade80] rounded-full"></div>
                <span className="text-[#4ade80] text-xs font-medium">OFFLINE MODE</span>
              </div>
              <button className="text-[#4ade80]">
                <Cloud className="w-6 h-6" />
              </button>
            </div>

            {/* Greeting */}
            <div className="mb-6">
              <h1 className="text-white mb-3">
                Hello, <span className="text-[#4ade80]">{userName || 'User'}</span>
              </h1>
              
              {/* Location Text Input */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">City Name</label>
                <div className="relative inline-block w-full max-w-xs">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder=""
                    className="bg-transparent border border-gray-600 rounded-full pl-10 pr-4 py-2 text-gray-300 text-sm focus:outline-none focus:border-gray-500 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Patients Seen */}
              <div className="bg-[#1a5742] rounded-2xl p-4">
                <div className="text-gray-400 text-sm mb-2">Patients Seen</div>
                <div className="flex items-end gap-2">
                  <span className="text-white text-3xl font-bold">{totalPatients}</span>
                  <span className="text-[#4ade80] text-sm mb-1">+{todayCount} Today</span>
                </div>
              </div>

              {/* Risk Alerts */}
              <div className="bg-[#1a5742] rounded-2xl p-4">
                <div className="text-gray-400 text-sm mb-2">Risk Alerts</div>
                <div className="flex items-end gap-2">
                  <span className="text-white text-3xl font-bold">{highRiskCount}</span>
                  <span className="text-red-400 text-sm mb-1">Action Req.</span>
                </div>
              </div>
            </div>

            {/* Today's Tasks */}
            <div>
              <h2 className="text-white mb-4">Today's Tasks</h2>
              
              {tasks.length === 0 && !isAddingTask ? (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="w-full bg-[#1a5742] hover:bg-[#245a46] text-white py-4 rounded-xl transition-colors"
                >
                  Add Task
                </button>
              ) : isAddingTask ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter task..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    className="w-full bg-[#1a5742] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#4ade80]"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTask}
                    className="w-full bg-[#4ade80] hover:bg-[#3bc56a] text-[#0d3b2f] font-semibold py-3 rounded-xl transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 bg-[#1a5742] rounded-xl p-4 ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="w-5 h-5 rounded border-gray-600 text-[#4ade80] focus:ring-[#4ade80]"
                      />
                      <div className="flex-1">
                        <div className={`text-white ${task.completed ? 'line-through' : ''}`}>
                          {task.text}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {task.completed ? `Completed: ${task.time}` : `Added: ${task.time}`}
                        </div>
                      </div>
                      <button onClick={() => deleteTask(task.id)}>
                        <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="w-full bg-[#1a5742] hover:bg-[#245a46] text-white py-3 rounded-xl transition-colors text-sm"
                  >
                    + Add Another Task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentScreen="home"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}