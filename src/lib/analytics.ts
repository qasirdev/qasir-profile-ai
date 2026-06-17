/**
 * Microsoft Clarity Analytics Integration
 * Production-safe analytics implementation with proper error handling
 */

export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

export interface PageViewData {
  path: string;
  title: string;
  referrer?: string;
}

export interface ClickEventData {
  element: string;
  text?: string;
  href?: string;
  position: { x: number; y: number };
}

export interface ScrollEventData {
  direction: 'up' | 'down';
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  scrollPercentage: number;
}

class AnalyticsService {
  private isInitialized = false;
  private isClarityAvailable = false;
  private projectId: string | null = null;

  constructor() {
    this.checkClarityAvailability();
  }

  private checkClarityAvailability(): void {
    if (typeof window !== 'undefined') {
      this.isClarityAvailable = !!window.clarity;
    }
  }

  private callClarity(command: 'event', name: string, metadata?: ClarityEventMetadata): void;
  private callClarity(command: 'identify', userId: string | null): void;
  private callClarity(
    command: 'event' | 'identify',
    nameOrUserId: string | null,
    metadata?: ClarityEventMetadata,
  ): void {
    if (command === 'event') {
      window.clarity?.('event', nameOrUserId as string, metadata);
      return;
    }
    window.clarity?.('identify', nameOrUserId);
  }

  /**
   * Initialize Microsoft Clarity with safety checks
   */
  initialize(projectId: string): void {
    if (typeof window === 'undefined') {
      console.warn('Analytics: Cannot initialize on server side');
      return;
    }

    if (this.isInitialized) {
      console.warn('Analytics: Already initialized');
      return;
    }

    if (!projectId) {
      console.error('Analytics: Project ID is required');
      return;
    }

    this.projectId = projectId;
    this.isInitialized = true;
    this.isClarityAvailable = !!window.clarity;
  }

  /**
   * Track page view
   */
  trackPageView(data: PageViewData): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('event', 'page_view', {
        path: data.path,
        title: data.title,
        referrer: data.referrer,
      });
    } catch (error) {
      console.error('Analytics: Failed to track page view:', error);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('event', event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
      });
    } catch (error) {
      console.error('Analytics: Failed to track event:', error);
    }
  }

  /**
   * Track click interactions
   */
  trackClick(data: ClickEventData): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('event', 'click', {
        element: data.element,
        text: data.text,
        href: data.href,
        position: data.position,
      });
    } catch (error) {
      console.error('Analytics: Failed to track click:', error);
    }
  }

  /**
   * Track scroll depth
   */
  trackScroll(data: ScrollEventData): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('event', 'scroll', {
        direction: data.direction,
        scrollPercentage: data.scrollPercentage,
        scrollTop: data.scrollTop,
      });
    } catch (error) {
      console.error('Analytics: Failed to track scroll:', error);
    }
  }

  /**
   * Track user engagement metrics
   */
  trackEngagement(metric: string, value: number): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('event', 'engagement', {
        metric,
        value,
      });
    } catch (error) {
      console.error('Analytics: Failed to track engagement:', error);
    }
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(formName: string, action: 'start' | 'submit' | 'abandon'): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('event', 'form_interaction', {
        form: formName,
        action,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Analytics: Failed to track form interaction:', error);
    }
  }

  /**
   * Track AI chat interactions
   */
  trackChatInteraction(
    action: string,
    metadata?: Record<string, string | number | boolean | null | undefined>,
  ): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('event', 'chat_interaction', {
        action,
        ...metadata,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Analytics: Failed to track chat interaction:', error);
    }
  }

  /**
   * Get current initialization status
   */
  getStatus(): { initialized: boolean; available: boolean; projectId: string | null } {
    return {
      initialized: this.isInitialized,
      available: this.isClarityAvailable,
      projectId: this.projectId,
    };
  }

  /**
   * Set user identifier for analytics (optional)
   */
  setUserIdentifier(userId: string): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('identify', userId);
    } catch (error) {
      console.error('Analytics: Failed to set user identifier:', error);
    }
  }

  /**
   * Clear user identifier
   */
  clearUserIdentifier(): void {
    if (!this.isInitialized || !this.isClarityAvailable) return;

    try {
      this.callClarity('identify', null);
    } catch (error) {
      console.error('Analytics: Failed to clear user identifier:', error);
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// React hooks for analytics
export const useAnalytics = () => {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackScroll: analytics.trackScroll.bind(analytics),
    trackEngagement: analytics.trackEngagement.bind(analytics),
    trackFormInteraction: analytics.trackFormInteraction.bind(analytics),
    trackChatInteraction: analytics.trackChatInteraction.bind(analytics),
    setUserIdentifier: analytics.setUserIdentifier.bind(analytics),
    clearUserIdentifier: analytics.clearUserIdentifier.bind(analytics),
    getStatus: analytics.getStatus.bind(analytics),
  };
};

// Auto-initialize with environment variable
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (projectId && projectId !== 'your_clarity_project_id_here') {
      analytics.initialize(projectId);
    } else {
      console.info('Analytics: Clarity Project ID not configured');
    }
  }
};
