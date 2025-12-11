import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  type?: string;
  completed: boolean;
}

interface TaskDetailsScreenProps {
  task: Task;
  onBack: () => void;
  onToggleComplete: (id: string) => void;
}

export function TaskDetailsScreen({ task, onBack, onToggleComplete }: TaskDetailsScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-gray-900">Task Details</h1>
        </div>
      </div>

      {/* Task Details Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Title Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <label className="block text-gray-500 text-sm mb-2">Title</label>
          <h2 className="text-gray-900">{task.title}</h2>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <label className="block text-gray-500 text-sm mb-2">Description</label>
          {task.description ? (
            <p className="text-gray-900">{task.description}</p>
          ) : (
            <p className="text-gray-400 italic">No description provided</p>
          )}
        </div>

        {/* Type Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <label className="block text-gray-500 text-sm mb-2">Type</label>
          {task.type ? (
            <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              {task.type}
            </span>
          ) : (
            <p className="text-gray-400 italic">No type assigned</p>
          )}
        </div>

        {/* Completion Status Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <label className="block text-gray-500 text-sm mb-3">Completion Status</label>
          <div className="flex items-center gap-3">
            {task.completed ? (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-green-600">Completed</div>
                  <div className="text-gray-500 text-sm">This task has been finished</div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-orange-600">Pending</div>
                  <div className="text-gray-500 text-sm">This task is not yet complete</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Complete/Uncomplete Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`w-full py-4 rounded-xl active:scale-98 transition-all ${
            task.completed
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
        </button>
      </div>
    </div>
  );
}
