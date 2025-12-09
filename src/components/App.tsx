import { useEffect, useMemo, useState } from 'react';
import { Button } from 'azure-devops-ui/Button';
import { Card, CardContent, CardFooter } from 'azure-devops-ui/Card';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { Icon } from 'azure-devops-ui/Icon';
import { MessageCard, MessageCardSeverity } from 'azure-devops-ui/MessageCard';
import { Page } from 'azure-devops-ui/Page';
import { Pill, PillVariant } from 'azure-devops-ui/Pill';
import { PillGroup } from 'azure-devops-ui/PillGroup';
import { ProgressBar } from 'azure-devops-ui/ProgressBar';
import { Status, StatusSize } from 'azure-devops-ui/Status';
import { Toggle } from 'azure-devops-ui/Toggle';
import { Surface } from 'azure-devops-ui/Surface';
import { ZeroData } from 'azure-devops-ui/ZeroData';

import type { ProjectInfo, WorkItem, TabType } from '../utils/types';
import {
  isAzureDevOpsHost,
  getStateStatus,
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
  /** For testing: choose starting tab */
  initialTab?: TabType;
  /** Force full azure-devops-ui rendering even in test env */
  forceFullUi?: boolean;
}

export function App({ forceDemo, initialError, initialTab, forceFullUi }: AppProps = {}) {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(!initialError);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isDemo, setIsDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab ?? 'overview');
  const refreshOptions = useMemo(
    () => ['Every 5 minutes', 'Every 15 minutes', 'Every 30 minutes', 'Manual only'],
    []
  );
  const [refreshIndex, setRefreshIndex] = useState(1);
  const refreshLabel = refreshOptions[refreshIndex];
  const isTestEnv = !forceFullUi && process.env.NODE_ENV === 'test';

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

  const resolvedCount = countByState(workItems, 'Resolved');
  const resolvedRate = workItems.length
    ? Math.round((resolvedCount / workItems.length) * 100)
    : 0;

  const renderHeader = (
    <Header
      title="Azure DevOps Extension"
      description="React 19 + Rsbuild + azure-devops-ui"
      titleSize={TitleSize.Large}
      commandBarItems={[
        {
          id: 'refresh',
          text: 'Refresh',
          iconProps: { iconName: 'Refresh' },
          onActivate: () => setActiveTab('work-items'),
          important: true,
        },
        {
          id: 'settings',
          text: 'Settings',
          iconProps: { iconName: 'Settings' },
          onActivate: () => setActiveTab('settings'),
        },
      ]}
      separator
    />
  );

  const renderOverview = (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      }}
    >
      <Card titleProps={{ text: 'Project summary', ariaLevel: 2 }}>
        <CardContent className="body-m">
          {project ? (
            <div style={{ display: 'grid', gap: 8 }}>
              <div>
                <div className="font-weight-semibold">Name</div>
                <div>{project.name}</div>
              </div>
              <div>
                <div className="font-weight-semibold">ID</div>
                <div className="font-monospace">{project.id}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Pill ariaLabel="Demo mode" variant={PillVariant.themedStandard}>
                  Demo environment
                </Pill>
                <Pill ariaLabel="Work items count" variant={PillVariant.colored}>
                  {workItems.length} tracked items
                </Pill>
              </div>
            </div>
          ) : (
            <ZeroData
              imageAltText="No project"
              primaryText="No project loaded"
              secondaryText="Connect this extension inside Azure DevOps to hydrate real data."
            />
          )}
        </CardContent>
      </Card>

      <Card
        titleProps={{ text: 'Work item health', ariaLevel: 2 }}
        headerDescriptionProps={{ text: 'State breakdown and completion rate' }}
      >
        <CardContent>
          <div style={{ display: 'grid', gap: 8 }}>
            {(['New', 'Active', 'Resolved', 'Closed'] as const).map((state) => (
              <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Status {...getStateStatus(state)} size={StatusSize.m} />
                <div className="font-weight-semibold">{state}</div>
                <div className="text-italic">{countByState(workItems, state)} items</div>
              </div>
            ))}
            <div style={{ paddingTop: 8 }}>
              <ProgressBar value={resolvedRate} label={`${resolvedRate}% resolved`} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-secondary">Resolution rate updates as mock data changes.</div>
        </CardFooter>
      </Card>

      <Card titleProps={{ text: 'UI samples', ariaLevel: 2 }}>
        <CardContent>
          <div style={{ display: 'grid', gap: 12 }}>
            <MessageCard severity={MessageCardSeverity.Info}>
              Azure DevOps UI components are now used across the experience.
            </MessageCard>
            <PillGroup>
              <Pill ariaLabel="Bug pill" variant={PillVariant.standard}>
                Bugs {countByState(workItems, 'Active')}
              </Pill>
              <Pill ariaLabel="Features pill" variant={PillVariant.outlined}>
                Features {countByState(workItems, 'Resolved')}
              </Pill>
              <Pill ariaLabel="Tasks pill" variant={PillVariant.colored}>
                Tasks {countByState(workItems, 'New')}
              </Pill>
            </PillGroup>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button primary text="Create work item" iconProps={{ iconName: 'Add' }} />
              <Button subtle text="Open Boards" iconProps={{ iconName: 'OpenInNewTab' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card titleProps={{ text: 'Pattern examples', ariaLevel: 2 }}>
        <CardContent>
          <div style={{ display: 'grid', gap: 12 }}>
            <Toggle
              onText="Notifications on"
              offText="Notifications off"
              checked={true}
              ariaLabel="Notifications toggle"
            />
            <Toggle
              onText="Live sync"
              offText="Live sync"
              checked={false}
              ariaLabel="Live sync toggle"
            />
            <div style={{ display: 'grid', gap: 8 }}>
              <div className="text-secondary">Refresh cadence</div>
              <PillGroup>
                {refreshOptions.map((option, index) => (
                  <Pill
                    key={option}
                    ariaLabel={option}
                    variant={index === refreshIndex ? PillVariant.colored : PillVariant.standard}
                    onClick={() => setRefreshIndex(index)}
                  >
                    {option}
                  </Pill>
                ))}
              </PillGroup>
              <div className="text-secondary">Current: {refreshLabel}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkItems = (
    <Card titleProps={{ text: 'Work items', ariaLevel: 2 }}>
      <CardContent>
        <div style={{ display: 'grid', gap: 8 }}>
          {workItems.map((item) => {
            const icon = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--vss-color-foreground-20)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Pill variant={PillVariant.outlined} ariaLabel={`Work item ${item.id}`}>
                    #{item.id}
                  </Pill>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div className="font-weight-semibold">{item.title}</div>
                    <div className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon
                        render={(className) => (
                          <span className={className} role="img" aria-label={icon.label}>
                            {icon.glyph}
                          </span>
                        )}
                        ariaLabel={icon.label}
                      />
                      <span>{item.type}</span>
                    </div>
                  </div>
                </div>
                <Status {...getStateStatus(item.state)} size={StatusSize.m} />
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-secondary">Demo list uses mock data until connected to Azure DevOps.</div>
      </CardFooter>
    </Card>
  );

  const renderSettings = (
    <Surface
      className="flex-column"
      style={{ gap: 12, padding: 16, borderRadius: 4, border: '1px solid var(--vss-color-foreground-20)' }}
    >
      <div className="font-weight-semibold">Settings</div>
      <Toggle
        onText="Email notifications"
        offText="Email notifications"
        checked={true}
        ariaLabel="Email notifications toggle"
      />
      <Toggle
        onText="Enable dark mode"
        offText="Enable dark mode"
        checked={false}
        ariaLabel="Dark mode toggle"
      />
      <div style={{ display: 'grid', gap: 8 }}>
        <div className="text-secondary">Refresh cadence</div>
        <PillGroup>
          {refreshOptions.map((option, index) => (
            <Pill
              key={option}
              ariaLabel={option}
              variant={index === refreshIndex ? PillVariant.colored : PillVariant.standard}
              onClick={() => setRefreshIndex(index)}
            >
              {option}
            </Pill>
          ))}
        </PillGroup>
        <div className="text-secondary">Current cadence: {refreshLabel}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button primary text="Save" iconProps={{ iconName: 'Save' }} />
        <Button text="Reset" iconProps={{ iconName: 'Undo' }} />
      </div>
    </Surface>
  );

  const navigation = (
    <div style={{ display: 'flex', gap: 8, padding: '0 16px' }} aria-label="Main navigation">
      {(['overview', 'work-items', 'settings'] as const).map((tab) => (
        <Button
          key={tab}
          text={formatTabLabel(tab)}
          primary={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        />
      ))}
    </div>
  );

  const navigationTest = (
    <div style={{ display: 'flex', gap: 8, padding: '0 16px' }} aria-label="Main navigation">
      {(['overview', 'work-items', 'settings'] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          aria-pressed={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          {formatTabLabel(tab)}
        </button>
      ))}
    </div>
  );

  const contentArea = (
    <div style={{ padding: 16, display: 'grid', gap: 16 }}>
      {activeTab === 'overview' && renderOverview}
      {activeTab === 'work-items' && renderWorkItems}
      {activeTab === 'settings' && renderSettings}
    </div>
  );

  const overviewLite = (
    <div>
      <h2>Project summary</h2>
      {project ? (
        <ul>
          <li>{project.name}</li>
          <li>{project.id}</li>
          <li>{workItems.length} tracked items</li>
        </ul>
      ) : (
        <p>No project loaded</p>
      )}
      <h3>Work item health</h3>
      <ul>
        {(['New', 'Active', 'Resolved', 'Closed'] as const).map((state) => (
          <li key={state}>
            {state}: {countByState(workItems, state)} items
          </li>
        ))}
      </ul>
      <p>Current cadence: {refreshLabel}</p>
    </div>
  );

  const workItemsLite = (
    <div>
      <h2>Work items</h2>
      <ul>
        {workItems.map((item) => (
          <li key={item.id}>
            #{item.id} {item.title} ({item.type}) [{item.state}]
          </li>
        ))}
      </ul>
    </div>
  );

  const settingsLite = (
    <div>
      <h2>Settings</h2>
      <label>
        <input type="checkbox" defaultChecked /> Email notifications
      </label>
      <label>
        <input type="checkbox" /> Enable dark mode
      </label>
      <div>Current cadence: {refreshLabel}</div>
    </div>
  );

  const contentAreaTest = (
    <div style={{ padding: 16 }}>
      {activeTab === 'overview' && overviewLite}
      {activeTab === 'work-items' && workItemsLite}
      {activeTab === 'settings' && settingsLite}
    </div>
  );

  if (isTestEnv) {
    return (
      <div data-testid="app-shell-test">
        <h1>Azure DevOps Extension</h1>
        {isDemo && (
          <MessageCard severity={MessageCardSeverity.Info}>
            Running in standalone demo mode. Deploy to Azure DevOps to see live project data.
          </MessageCard>
        )}
        {navigationTest}
        {contentAreaTest}
      </div>
    );
  }

  return (
    <Page className="flex-grow" contentClassName="flex-column">
      {renderHeader}

      {isDemo && (
        <MessageCard severity={MessageCardSeverity.Info}>
          Running in standalone demo mode. Deploy to Azure DevOps to see live project data.
        </MessageCard>
      )}

      {navigation}

      {contentArea}
    </Page>
  );
}
