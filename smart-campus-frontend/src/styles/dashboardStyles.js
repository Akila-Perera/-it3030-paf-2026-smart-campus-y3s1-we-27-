export const DASHBOARD_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  
  .sc-db-wrap { 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    color: #f1f5f9; 
    background: #030712; 
    min-height: 100vh; 
    display: flex;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: visible;
    overflow-y: auto;
  }

  /* Sidebar Fixed to Left */
  .glass-sidebar { 
    width: 280px; 
    min-width: 280px; 
    background: rgba(8, 13, 28, 0.95);
    backdrop-filter: blur(20px); 
    border-right: 1px solid rgba(255,255,255,0.05); 
    padding: 30px 20px; 
    display: flex; 
    flex-direction: column; 
    height: 100vh; 
    position: fixed; 
    left: 0;
    top: 0;
    z-index: 50;
  }

  /* Main Content Area Scrolls */
  .sc-main-content { 
    flex: 1; 
    min-width: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin-left: 280px; 
    padding: 40px; 
    min-height: 100vh;
    height: auto;
    overflow-y: auto; 
    overflow-x: auto;
    position: relative;
    z-index: 1;
  }

  /* Lecturer: feed + form; stacks on narrow viewports */
  .sc-dashboard-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, min(400px, 100%));
    gap: clamp(20px, 3vw, 32px);
    align-items: start;
  }
  .sc-dashboard-grid > * {
    min-width: 0;
  }

  .sc-dash-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px 20px;
  }
  .sc-dash-header-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 16px;
    min-width: 0;
  }
  .sc-dash-search {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1 1 200px;
    max-width: min(320px, 100%);
  }
  .sc-dash-search input {
    min-width: 0;
    flex: 1;
    width: 100% !important;
    max-width: 100%;
  }

  @media (max-width: 1100px) {
    .sc-dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 900px) {
    .sc-main-content {
      padding: 28px 18px;
    }
  }

  @media (max-width: 768px) {
    .glass-sidebar {
      width: 240px;
      min-width: 240px;
    }
    .sc-main-content {
      margin-left: 240px;
      padding: 22px 14px;
    }
  }

  @media (max-width: 640px) {
    .sc-db-wrap {
      flex-direction: column;
    }
    .glass-sidebar {
      position: relative;
      width: 100%;
      min-width: unset;
      height: auto;
      min-height: 0;
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sc-main-content {
      margin-left: 0;
      min-height: 0;
      overflow-x: hidden;
    }
  }

  .glass-card { 
    background: rgba(15, 23, 42, 0.6); 
    backdrop-filter: blur(14px); 
    border: 1px solid rgba(148, 163, 184, 0.1); 
    border-radius: 20px; 
    padding: 24px; 
  }

  .sc-nav-item { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    padding: 14px 18px; 
    border-radius: 12px; 
    color: #64748b; 
    cursor: pointer; 
    transition: all 0.2s ease;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .sc-nav-item:hover { background: rgba(255,255,255,0.03); color: #cbd5e1; }
  .sc-nav-item.active { background: rgba(99,102,241,0.1); color: #a5b4fc; }

  /* Logout Fixed at Bottom */
  .sidebar-bottom {
    margin-top: auto; 
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .logout-btn {
    color: #f87171 !important;
  }
  .logout-btn:hover {
    background: rgba(248,113,113,0.1) !important;
  }

  .blob { position: absolute; width: 500px; height: 500px; border-radius: 50%; filter: blur(120px); opacity: 0.1; z-index: -1; pointer-events: none; }
  .blob-1 { top: -100px; right: -50px; background: #6366f1; }
  .blob-2 { bottom: -100px; left: 100px; background: #a855f7; }
`;
