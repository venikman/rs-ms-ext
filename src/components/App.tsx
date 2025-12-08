import { useState, useEffect } from 'react';
import type { ProjectInfo, WorkItem, TabType } from '../utils/types';
import {
  isAzureDevOpsHost,
  getStateColorClasses,
  getTypeIcon,
  countByState,
  formatTabLabel,
  mockWorkItems,
  mockProject,
} from '../utils/helpers';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

interface AppProps {
  /** For testing: override Azure DevOps detection */
  forceDemo?: boolean;
  /** For testing: inject initial error */
  initialError?: string;
}

export function App({ forceDemo, initialError }: AppProps = {}) {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(!initialError);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isDemo, setIsDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (initialError) return;

    async function loadProject() {
      const useDemo = forceDemo ?? !isAzureDevOpsHost();

      if (useDemo) {
        setIsDemo(true);
        setProject(mockProject);
        setWorkItems(mockWorkItems);
        setLoading(false);
        return;
      }

      // Real Azure DevOps mode - integration code tested in actual environment
      /* istanbul ignore next */
      try {
        const SDK = await import('azure-devops-extension-sdk');
        await SDK.init();
        await SDK.ready();

        const projectService = await SDK.getService<{
          getProject(): Promise<{ name: string; id: string } | undefined>;
        }>('ms.vss-tfs-web.tfs-page-data-service');
        const projectInfo = await projectService.getProject();

        if (projectInfo) {
          setProject({
            name: projectInfo.name,
            id: projectInfo.id,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [forceDemo, initialError]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">
              Azure DevOps Extension
            </h1>
            {isDemo && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">
                DEMO MODE
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Built with React 19 + Rsbuild
          </div>
        </div>
      </header>

      {/* Demo Notice */}
      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <p className="text-sm text-amber-800">
            Running in standalone demo mode. Deploy to Azure DevOps to see real data.
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {(['overview', 'work-items', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {formatTabLabel(tab)}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Project Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project Information
              </h2>
              {project && (
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Name</dt>
                    <dd className="text-sm font-medium text-gray-900">{project.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">ID</dt>
                    <dd className="text-sm font-mono text-gray-600">{project.id}</dd>
                  </div>
                </dl>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Work Item Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {countByState(workItems, 'New')}
                  </div>
                  <div className="text-xs text-blue-600">New</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {countByState(workItems, 'Active')}
                  </div>
                  <div className="text-xs text-yellow-600">Active</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {countByState(workItems, 'Resolved')}
                  </div>
                  <div className="text-xs text-green-600">Resolved</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {workItems.length}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  + Create Work Item
                </button>
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📊 View Reports
                </button>
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  ⚙️ Configure Extension
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'work-items' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Work Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {workItems.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getTypeIcon(item.type)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          #{item.id}
                        </span>
                        <span className="text-sm text-gray-700">{item.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{item.type}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStateColorClasses(item.state)}`}
                  >
                    {item.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-500 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Show notifications for work item updates
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-500 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Enable dark mode (coming soon)
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Refresh interval
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Manual only</option>
                </select>
              </div>
              <div className="pt-4">
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
