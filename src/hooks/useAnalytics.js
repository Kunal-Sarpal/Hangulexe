import { useEffect, useRef } from 'react';

// Generates a simple random session ID for guests
const getSessionId = () => {
  let sid = sessionStorage.getItem('analytics_sid');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('analytics_sid', sid);
  }
  return sid;
};

export const useAnalytics = (pageName) => {
  const viewLogged = useRef(false);

  const trackEvent = (eventType, elementId = null, metadata = {}) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('fashionco_token') || ''}`
      },
      body: JSON.stringify({
        event_type: eventType,
        page: pageName,
        element_id: elementId,
        session_id: getSessionId(),
        metadata
      })
    }).catch(() => {}); // silent fail
  };

  useEffect(() => {
    if (!viewLogged.current) {
      trackEvent('page_view');
      viewLogged.current = true;
    }
  }, [pageName]);

  return { trackEvent };
};
