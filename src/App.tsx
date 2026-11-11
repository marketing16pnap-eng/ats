import React, { useState, useEffect, useCallback } from 'react';
import { 
  Candidate, 
  CandidateStatus,
  RecruitmentStepNumber,
  JobRequisition, 
  RequisitionStatus,
  Department, 
  InterviewRound, 
  InterviewStageConfig, 
  InterviewStatus,
  NavigationTab, 
  AppUser, 
  AppLanguage,
  AuthSession
} from './types';
import { 
  initialCandidates, 
  initialRequisitions, 
  initialDepartments, 
  initialInterviews, 
  initialInterviewStages 
} from './mockData';
import { INITIAL_USERS } from './mockUsers';
import { DbService, DbSyncStatus } from './services/dbService';
import { sanitizeCandidates, sanitizeListWithIds, generateUniqueCandidateId } from './utils/sanitizeData';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { CandidatesScreen } from './screens/CandidatesScreen';
import { RequisitionsScreen } from './screens/RequisitionsScreen';
import { DepartmentManagementScreen } from './screens/DepartmentManagementScreen';
import { InterviewCenterScreen } from './screens/InterviewCenterScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { ExportsScreen } from './screens/ExportsScreen';
import { UserManagementScreen } from './screens/UserManagementScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { PublicApplicationForm } from './screens/PublicApplicationForm';
import { CandidatePortalScreen } from './screens/CandidatePortalScreen';

// Components & Modals
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CandidateDossierModal } from './components/CandidateDossierModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { NewCandidateModal } from './components/NewCandidateModal';
import { EditCandidateModal } from './components/EditCandidateModal';
import { NewRequisitionModal } from './components/NewRequisitionModal';
import { NewDepartmentModal } from './components/NewDepartmentModal';
import { EditDepartmentModal } from './components/EditDepartmentModal';
import { NewInterviewStageModal } from './components/NewInterviewStageModal';
import { EditInterviewStageModal } from './components/EditInterviewStageModal';
import { ScheduleInterviewModal } from './components/ScheduleInterviewModal';
import { ScorecardModal } from './components/ScorecardModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { WordPressEmbedModal } from './components/WordPressEmbedModal';
import { PhoneInterviewFormModal } from './components/PhoneInterviewFormModal';
import { InPersonInterviewFormModal } from './components/InPersonInterviewFormModal';
import { PhoneInterviewFormData, InPersonInterviewFormData } from './types';

const SESSION_KEY = 'panap_ats_session';
const STANDARD_INACTIVITY_MS = 20 * 60 * 1000; // 20 minutes standard inactivity timeout
const EXTENDED_INACTIVITY_MS = 8 * 60 * 60 * 1000; // 8 hours if rememberMe checked

function getValidActiveSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (!session || !session.user || !session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('panap_ats_auth');
      return null;
    }
    const now = Date.now();
    const allowedInactivity = session.rememberMe ? EXTENDED_INACTIVITY_MS : STANDARD_INACTIVITY_MS;
    if (now > session.expiresAt || (now - session.lastActivityTimestamp > allowedInactivity)) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('panap_ats_auth');
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export const App: React.FC = () => {
  const [language, setLanguage] = useState<AppLanguage>('PERSIAN');
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = (params.get('tab') || params.get('screen') || '').toUpperCase();
      const validTabs: NavigationTab[] = [
        'DASHBOARD', 'CANDIDATES', 'REQUISITIONS', 'DEPARTMENTS',
        'INTERVIEWS', 'ANALYTICS', 'EXPORTS', 'USERS', 'SETTINGS'
      ];
      if (validTabs.includes(tabParam as NavigationTab)) {
        return tabParam as NavigationTab;
      }
    }
    return 'CANDIDATES';
  });
  
  // Strict Authentication & Session States
  const initialSession = getValidActiveSession();
  const [currentUser, setCurrentUser] = useState<AppUser>(() => initialSession ? initialSession.user : INITIAL_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'login') return false;
      if (params.get('auth') === 'true' || params.get('tab') || params.get('screen') || params.get('modal')) return true;
    }
    return !!initialSession;
  });
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState<string | null>(null);

  // Check URL parameters for direct public career form mode (e.g. for WordPress iframe embed)
  const [isPublicMode, setIsPublicMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'apply' || params.get('embed') === 'true' || params.get('mode') === 'apply';
    }
    return false;
  });

  // Company Logo & Branding States
  const [companyLogo, setCompanyLogo] = useState<string>(() => {
    return localStorage.getItem('panap_ats_logo') || '';
  });

  const [companyName, setCompanyName] = useState<string>(() => {
    return localStorage.getItem('panap_ats_org_name') || 'سامانه پناپ ATS';
  });

  const [companySubtitle, setCompanySubtitle] = useState<string>(() => {
    return localStorage.getItem('panap_ats_org_sub') || 'سامانه یکپارچه مدیریت جذب و استخدام';
  });

  // Mobile navigation drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [dbStatus, setDbStatus] = useState<DbSyncStatus>('CONNECTING');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Data States
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem('panap_ats_candidates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeCandidates(parsed);
        }
      }
    } catch {
      // Fallback
    }
    return sanitizeCandidates(initialCandidates);
  });

  const [requisitions, setRequisitions] = useState<JobRequisition[]>(() => {
    try {
      const saved = localStorage.getItem('panap_ats_requisitions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeListWithIds(parsed, 'REQ');
        }
      }
    } catch {
      // Fallback
    }
    return sanitizeListWithIds(initialRequisitions, 'REQ');
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('panap_ats_departments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeListWithIds(parsed, 'DEP');
        }
      }
    } catch {
      // Fallback
    }
    return sanitizeListWithIds(initialDepartments, 'DEP');
  });

  const [interviews, setInterviews] = useState<InterviewRound[]>(() => {
    try {
      const saved = localStorage.getItem('panap_ats_interviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeListWithIds(parsed, 'INT');
        }
      }
    } catch {
      // Fallback
    }
    return sanitizeListWithIds(initialInterviews, 'INT');
  });

  const [interviewStages, setInterviewStages] = useState<InterviewStageConfig[]>(() => {
    try {
      const saved = localStorage.getItem('panap_ats_stages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeListWithIds(parsed, 'STG');
        }
      }
    } catch {
      // Fallback
    }
    return sanitizeListWithIds(initialInterviewStages, 'STG');
  });

  // Modal States
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const m = p.get('modal');
      if (m === 'dossier' || m === 'phone_form' || m === 'inperson_form') {
        return sanitizeCandidates(initialCandidates)[0] || null;
      }
    }
    return null;
  });
  const [isDossierOpen, setIsDossierOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'dossier';
    }
    return false;
  });
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'excel_import';
    }
    return false;
  });
  const [isNewCandidateOpen, setIsNewCandidateOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'new_candidate';
    }
    return false;
  });
  const [candidateToEdit, setCandidateToEdit] = useState<Candidate | null>(null);
  const [isNewRequisitionOpen, setIsNewRequisitionOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'new_requisition';
    }
    return false;
  });
  const [isNewDepartmentOpen, setIsNewDepartmentOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'new_department';
    }
    return false;
  });
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  const [isNewStageOpen, setIsNewStageOpen] = useState(false);
  const [stageToEdit, setStageToEdit] = useState<InterviewStageConfig | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'schedule';
    }
    return false;
  });
  const [scorecardCandidate, setScorecardCandidate] = useState<Candidate | null>(null);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'role_switcher';
    }
    return false;
  });
  const [isWordPressModalOpen, setIsWordPressModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'wordpress';
    }
    return false;
  });

  // Form 1 & Form 2 Modals State
  const [phoneFormCandidate, setPhoneFormCandidate] = useState<Candidate | null>(() => {
    if (typeof window !== 'undefined') {
      if (new URLSearchParams(window.location.search).get('modal') === 'phone_form') {
        return sanitizeCandidates(initialCandidates)[0] || null;
      }
    }
    return null;
  });
  const [isPhoneFormOpen, setIsPhoneFormOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'phone_form';
    }
    return false;
  });
  const [phoneFormMode, setPhoneFormMode] = useState<'FILL' | 'CUSTOMIZE_TEMPLATE'>('FILL');

  const [inPersonFormCandidate, setInPersonFormCandidate] = useState<Candidate | null>(() => {
    if (typeof window !== 'undefined') {
      if (new URLSearchParams(window.location.search).get('modal') === 'inperson_form') {
        return sanitizeCandidates(initialCandidates)[0] || null;
      }
    }
    return null;
  });
  const [isInPersonFormOpen, setIsInPersonFormOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('modal') === 'inperson_form';
    }
    return false;
  });
  const [inPersonFormMode, setInPersonFormMode] = useState<'FILL' | 'CUSTOMIZE_TEMPLATE'>('FILL');

  // Candidate Self-Service Tracking Portal State
  const [activePortalCandidate, setActivePortalCandidate] = useState<Candidate | null>(null);

  // Check URL parameters for direct candidate portal mode
  useEffect(() => {
    if (typeof window !== 'undefined' && candidates.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const trackCode = params.get('track') || params.get('portal');
      if (trackCode && trackCode !== 'true') {
        const found = candidates.find(
          (c) =>
            (c.trackingCode || '').toLowerCase() === trackCode.toLowerCase() ||
            (c.id || '').toLowerCase() === trackCode.toLowerCase() ||
            (c.phone || '').includes(trackCode)
        );
        if (found) {
          setActivePortalCandidate(found);
        }
      }
    }
  }, [candidates]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('panap_ats_auth', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('panap_ats_logo', companyLogo);
  }, [companyLogo]);

  useEffect(() => {
    localStorage.setItem('panap_ats_org_name', companyName);
  }, [companyName]);

  useEffect(() => {
    localStorage.setItem('panap_ats_org_sub', companySubtitle);
  }, [companySubtitle]);

  useEffect(() => {
    localStorage.setItem('panap_ats_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('panap_ats_requisitions', JSON.stringify(requisitions));
  }, [requisitions]);

  useEffect(() => {
    localStorage.setItem('panap_ats_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('panap_ats_interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('panap_ats_stages', JSON.stringify(interviewStages));
  }, [interviewStages]);

  // Initial Sync from MySQL
  const loadFromMysql = async () => {
    setIsRefreshing(true);
    const res = await DbService.fetchAllData();
    setDbStatus(res.dbStatus);

    if (res.success && res.data) {
      if (res.data.candidates && res.data.candidates.length > 0) {
        setCandidates(sanitizeCandidates(res.data.candidates));
      }
      if (res.data.requisitions && res.data.requisitions.length > 0) {
        setRequisitions(sanitizeListWithIds(res.data.requisitions, 'REQ'));
      }
      if (res.data.departments && res.data.departments.length > 0) {
        setDepartments(sanitizeListWithIds(res.data.departments, 'DEP'));
      }
      if (res.data.interviews && res.data.interviews.length > 0) {
        setInterviews(sanitizeListWithIds(res.data.interviews, 'INT'));
      }
      if (res.data.interviewStages && res.data.interviewStages.length > 0) {
        setInterviewStages(sanitizeListWithIds(res.data.interviewStages, 'STG'));
      }
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadFromMysql();
  }, []);

  // Handlers
  const handleBulkImportCandidates = (newCandidates: Candidate[]) => {
    const sanitizedNew = sanitizeCandidates(newCandidates);
    setCandidates((prev) => sanitizeCandidates([...sanitizedNew, ...prev]));
    DbService.saveCandidatesBulk(sanitizedNew);
  };

  const handleAddCandidate = (newCand: Candidate) => {
    const safeCand = {
      ...newCand,
      id: newCand.id || generateUniqueCandidateId(newCand.trackingCode),
    };
    setCandidates((prev) => sanitizeCandidates([safeCand, ...prev]));
    DbService.saveCandidate(safeCand);
  };

  const handleUpdateCandidate = (updated: Candidate) => {
    setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedCandidate?.id === updated.id) {
      setSelectedCandidate(updated);
    }
    DbService.saveCandidate(updated);
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    DbService.deleteCandidate(id);
  };

  const handleBulkDeleteCandidates = (ids: string[]) => {
    const setIds = new Set(ids);
    setCandidates((prev) => prev.filter((c) => !setIds.has(c.id)));
    ids.forEach((id) => DbService.deleteCandidate(id));
  };

  const handleBulkUpdateStep = (ids: string[], newStep: RecruitmentStepNumber) => {
    const setIds = new Set(ids);
    const statusMap: Record<RecruitmentStepNumber, CandidateStatus> = {
      1: 'STAGE_1_APPLIED',
      2: 'STAGE_2_SITE_FORM',
      3: 'STAGE_3_VIDEO',
      4: 'STAGE_4_PHONE_INTERVIEW',
      5: 'STAGE_5_IN_PERSON',
      6: 'STAGE_6_BACKGROUND_CHECK',
      7: 'STAGE_7_FINAL_DECISION',
    };
    setCandidates((prev) =>
      prev.map((c) => {
        if (setIds.has(c.id)) {
          const updated = {
            ...c,
            currentStep: newStep,
            status: statusMap[newStep] || c.status,
          };
          DbService.saveCandidate(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const handleToggleBookmark = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c))
    );
  };

  const handleAddRequisition = (req: JobRequisition) => {
    setRequisitions((prev) => [req, ...prev]);
    DbService.saveRequisition(req);
  };

  const handleToggleRequisitionStatus = (id: string) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus: RequisitionStatus = r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          const updated: JobRequisition = { ...r, status: nextStatus };
          DbService.saveRequisition(updated);
          return updated;
        }
        return r;
      })
    );
  };

  const handleAddDepartment = (dept: Department) => {
    setDepartments((prev) => [...prev, dept]);
    DbService.saveDepartment(dept);
  };

  const handleUpdateDepartment = (updatedDept: Department) => {
    setDepartments((prev) => prev.map((d) => (d.id === updatedDept.id ? updatedDept : d)));
    DbService.saveDepartment(updatedDept);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== departmentId));
  };

  const handleAddStage = (stage: InterviewStageConfig) => {
    setInterviewStages((prev) => [...prev, stage]);
    DbService.saveStage(stage);
  };

  const handleUpdateStage = (updatedStage: InterviewStageConfig) => {
    setInterviewStages((prev) => prev.map((s) => (s.id === updatedStage.id ? updatedStage : s)));
    DbService.saveStage(updatedStage);
  };

  const handleDeleteStage = (stageId: string) => {
    setInterviewStages((prev) => prev.filter((s) => s.id !== stageId));
  };

  const handleScheduleInterview = (interview: InterviewRound) => {
    setInterviews((prev) => [interview, ...prev]);
    DbService.saveInterview(interview);
  };

  const handleInterviewStatusChange = (interviewId: string, newStatus: InterviewStatus) => {
    setInterviews((prev) =>
      prev.map((item) => {
        if (item.id === interviewId) {
          const updated = { ...item, status: newStatus };
          DbService.saveInterview(updated);
          return updated;
        }
        return item;
      })
    );
  };

  const handleSaveScorecard = (candidateId: string, score: number, feedback: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const notes = c.notes ? [...c.notes, feedback] : [feedback];
          const updated = { ...c, rating: score, notes };
          DbService.saveCandidate(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const handleOpenPhoneForm = (candidate: Candidate | null, mode: 'FILL' | 'CUSTOMIZE_TEMPLATE' = 'FILL') => {
    setPhoneFormCandidate(candidate);
    setPhoneFormMode(mode);
    setIsPhoneFormOpen(true);
  };

  const handleOpenInPersonForm = (candidate: Candidate | null, mode: 'FILL' | 'CUSTOMIZE_TEMPLATE' = 'FILL') => {
    setInPersonFormCandidate(candidate);
    setInPersonFormMode(mode);
    setIsInPersonFormOpen(true);
  };

  const handleSavePhoneForm = (candidateId: string, data: PhoneInterviewFormData) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updated: Candidate = {
            ...c,
            phoneInterviewForm: data,
            // Sync with Step 4 data if present
            step4: {
              ...(c.step4 || {
                phoneInterviewDate: data.interviewDate,
                interviewerName: data.interviewerName,
                workHistorySummary: '',
                motivation: '',
                companyKnowledge: '',
                keyRoleSkills: '',
                currentEmploymentStatus: 'EMPLOYED',
                expectedSalary: '',
                step4Status: 'PENDING',
              }),
              phoneInterviewDate: data.interviewDate || c.step4?.phoneInterviewDate,
              interviewerName: data.interviewerName || c.step4?.interviewerName,
              phoneTotalScore: Math.max(1, Math.min(5, Math.round(data.totalScore / 2))),
              step4Status: data.recommendation === 'INVITE_IN_PERSON' ? 'APPROVED' : data.recommendation === 'REJECT' ? 'REJECTED' : (c.step4?.step4Status || 'PENDING'),
            },
          };
          DbService.saveCandidate(updated);
          if (selectedCandidate && selectedCandidate.id === candidateId) {
            setSelectedCandidate(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  const handleSaveInPersonForm = (candidateId: string, data: InPersonInterviewFormData) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updated: Candidate = {
            ...c,
            inPersonInterviewForm: data,
            // Sync with Step 5 data if present
            step5: {
              ...(c.step5 || {
                interviewDate: data.interviewDate,
                location: 'دفتر مرکزی پناپ - مجتمع سرمد',
                scores: {
                  educationAndExperience: 4,
                  technicalCompetence: 4,
                  jobMotivationAndStability: 4,
                  teamworkSpirit: 4,
                  culturalAlignment: 4,
                  professionalAppearance: 4,
                  problemSolvingSkill: 4,
                },
                totalScore: 28,
                scorePercentage: 80,
                step5Status: 'PENDING',
              }),
              interviewDate: data.interviewDate || c.step5?.interviewDate,
              totalScore: Math.round(data.interviewerRating * 7),
              interviewerFeedback: data.interviewerNotes || c.step5?.interviewerFeedback || '',
              step5Status: data.interviewerVerdict === 'HIRE' || data.interviewerVerdict === 'STAGE_6_BACKGROUND' ? 'APPROVED' : data.interviewerVerdict === 'REJECT' ? 'REJECTED' : (c.step5?.step5Status || 'PENDING'),
            },
          };
          DbService.saveCandidate(updated);
          if (selectedCandidate && selectedCandidate.id === candidateId) {
            setSelectedCandidate(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  const handleLogout = useCallback((reason?: string) => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('panap_ats_auth');
    setIsLoggedIn(false);
    if (reason && typeof reason === 'string') {
      setSessionExpiredNotice(reason);
    } else {
      setSessionExpiredNotice(null);
    }
  }, []);

  const handleLogin = (user: AppUser, rememberMe: boolean = false) => {
    const now = Date.now();
    const allowedInactivity = rememberMe ? EXTENDED_INACTIVITY_MS : STANDARD_INACTIVITY_MS;
    const newSession: AuthSession = {
      user,
      token: `TOK-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      loginTimestamp: now,
      lastActivityTimestamp: now,
      expiresAt: now + allowedInactivity,
      rememberMe,
    };
    try {
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        localStorage.setItem('panap_ats_auth', 'true');
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        localStorage.removeItem('panap_ats_auth');
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(user);
    setIsLoggedIn(true);
    setSessionExpiredNotice(null);
  };

  // Activity tracking: update lastActivityTimestamp on user interaction
  useEffect(() => {
    if (!isLoggedIn) return;

    const updateActivity = () => {
      try {
        const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        if (!raw) return;
        const session: AuthSession = JSON.parse(raw);
        if (!session) return;
        const now = Date.now();
        // Throttle updates: update only if at least 15s elapsed
        if (now - session.lastActivityTimestamp < 15000) return;
        const allowedInactivity = session.rememberMe ? EXTENDED_INACTIVITY_MS : STANDARD_INACTIVITY_MS;
        const updated: AuthSession = {
          ...session,
          lastActivityTimestamp: now,
          expiresAt: now + allowedInactivity,
        };
        if (session.rememberMe) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        } else {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((ev) => window.addEventListener(ev, updateActivity, { passive: true }));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, updateActivity));
    };
  }, [isLoggedIn]);

  // Periodic expiration checker interval (checks every 10 seconds)
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const active = getValidActiveSession();
      if (!active) {
        handleLogout('نشست کاربری شما به دلیل عدم فعالیت در مدت زمان استاندارد منقضی شد. لطفاً مجدداً وارد شوید.');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isLoggedIn, handleLogout]);

  // Search State
  const [globalSearch, setGlobalSearch] = useState('');

  // 1. PUBLIC CAREER FORM VIEW (FOR WORDPRESS EMBED OR DIRECT APPLICANTS)
  if (isPublicMode) {
    return (
      <PublicApplicationForm
        requisitions={requisitions}
        departments={departments}
        companyLogo={companyLogo}
        onSubmitCandidate={handleAddCandidate}
        onBackToAdmin={() => setIsPublicMode(false)}
      />
    );
  }

  // 1.5. CANDIDATE SELF-SERVICE TRACKING PORTAL
  if (activePortalCandidate) {
    return (
      <CandidatePortalScreen
        candidate={activePortalCandidate}
        companyLogo={companyLogo}
        companyName={companyName}
        companySubtitle={companySubtitle}
        language={language}
        onLogout={() => setActivePortalCandidate(null)}
        onUpdateCandidate={(updated) => {
          handleUpdateCandidate(updated);
          setActivePortalCandidate(updated);
        }}
      />
    );
  }

  // 2. LOGIN SCREEN (IF LOGGED OUT)
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        users={INITIAL_USERS}
        candidates={candidates}
        onCandidateLogin={(cand) => {
          setActivePortalCandidate(cand);
        }}
        onOpenPublicForm={() => setIsPublicMode(true)}
        companyLogo={companyLogo}
        companyName={companyName}
        companySubtitle={companySubtitle}
        language={language}
        expiredReason={sessionExpiredNotice}
        onToggleLanguage={() => setLanguage(language === 'PERSIAN' ? 'ENGLISH' : 'PERSIAN')}
      />
    );
  }

  // 3. MAIN ATS ADMIN PANEL
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 antialiased overflow-hidden select-none font-sans" dir={language === 'PERSIAN' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        language={language}
        totalApplicants={candidates.length}
        activeRequisitions={requisitions.filter(r => r.status === 'ACTIVE').length}
        departmentsCount={departments.length}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onLogout={handleLogout}
        companyLogo={companyLogo}
        companyName={companyName}
        companySubtitle={companySubtitle}
        onOpenPublicForm={() => setIsPublicMode(true)}
        onOpenCandidatePortal={() => {
          if (candidates.length > 0) {
            setActivePortalCandidate(candidates[0]);
          }
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          currentUser={currentUser}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'PERSIAN' ? 'ENGLISH' : 'PERSIAN')}
          dbStatus={dbStatus}
          onRefreshData={loadFromMysql}
          isRefreshing={isRefreshing}
          onOpenNewCandidate={() => setIsNewCandidateOpen(true)}
          onOpenRoleSwitcher={() => {
            if (currentUser.role === 'SUPER_ADMIN') {
              setIsRoleSwitcherOpen(true);
            }
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
          companyLogo={companyLogo}
          onLogout={handleLogout}
          onSelectCandidate={(candId) => {
            const found = candidates.find((c) => c.id === candId);
            if (found) {
              setSelectedCandidate(found);
              setIsDossierOpen(true);
            }
          }}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6">
          {currentTab === 'DASHBOARD' && (
            <DashboardScreen
              candidates={candidates}
              requisitions={requisitions}
              interviews={interviews}
              departments={departments}
              currentUser={currentUser}
              language={language}
              onNavigateTab={setCurrentTab}
              onOpenExcelImport={() => setIsExcelImportOpen(true)}
              onSelectCandidate={(c) => {
                setSelectedCandidate(c);
                setIsDossierOpen(true);
              }}
            />
          )}

          {currentTab === 'CANDIDATES' && (
            <CandidatesScreen
              candidates={candidates}
              language={language}
              departments={departments}
              currentUser={currentUser}
              onOpenNewCandidate={() => setIsNewCandidateOpen(true)}
              onOpenExcelImport={() => setIsExcelImportOpen(true)}
              onSelectCandidate={(c: Candidate) => {
                setSelectedCandidate(c);
                setIsDossierOpen(true);
              }}
              onToggleBookmark={handleToggleBookmark}
              onDeleteCandidate={handleDeleteCandidate}
              onBulkDelete={handleBulkDeleteCandidates}
              onBulkUpdateStep={handleBulkUpdateStep}
              onEditCandidate={(c: Candidate) => setCandidateToEdit(c)}
              onOpenScorecard={(c: Candidate) => setScorecardCandidate(c)}
              searchTerm={globalSearch}
              onSearchChange={setGlobalSearch}
            />
          )}

          {currentTab === 'REQUISITIONS' && (
            <RequisitionsScreen
              requisitions={requisitions}
              language={language}
              onToggleStatus={handleToggleRequisitionStatus}
              onOpenNewModal={() => setIsNewRequisitionOpen(true)}
            />
          )}

          {currentTab === 'DEPARTMENTS' && (
            <DepartmentManagementScreen
              departments={departments}
              candidates={candidates}
              requisitions={requisitions}
              language={language}
              onOpenNewDepartmentModal={() => setIsNewDepartmentOpen(true)}
              onEditDepartment={(dept: Department) => setDepartmentToEdit(dept)}
              onDeleteDepartment={handleDeleteDepartment}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'INTERVIEWS' && (
            <InterviewCenterScreen
              interviews={interviews}
              interviewStages={interviewStages}
              candidates={candidates}
              language={language}
              onOpenScorecard={(round: InterviewRound) => {
                const cand = candidates.find((c) => c.id === round.candidateId) || {
                  id: round.candidateId,
                  name: round.candidateName,
                  role: round.candidateRole,
                  department: 'فنی و مهندسی',
                  appliedDate: '۱۴۰۳/۰۶/۰۱',
                  experienceYears: 4,
                  currentCompany: '—',
                  location: 'تهران',
                  status: 'STAGE_5_IN_PERSON' as const,
                  currentStep: 5 as const,
                  matchScore: 85,
                  rating: round.scorecard ? round.scorecard.technicalScore : 4.5,
                  skills: [],
                  education: 'کارشناسی',
                  salaryExpectation: '—',
                  summary: '',
                  email: '',
                  phone: '',
                };
                setScorecardCandidate(cand);
              }}
              onOpenScheduleModal={() => setIsScheduleOpen(true)}
              onOpenNewStageModal={() => setIsNewStageOpen(true)}
              onEditStage={(stage: InterviewStageConfig) => setStageToEdit(stage)}
              onDeleteStage={handleDeleteStage}
              onOpenPhoneForm={handleOpenPhoneForm}
              onOpenInPersonForm={handleOpenInPersonForm}
            />
          )}

          {currentTab === 'ANALYTICS' && (
            <AnalyticsScreen
              candidates={candidates}
              requisitions={requisitions}
              departments={departments}
              language={language}
            />
          )}

          {currentTab === 'EXPORTS' && (
            <ExportsScreen
              candidates={candidates}
              requisitions={requisitions}
              departments={departments}
              language={language}
            />
          )}

          {currentTab === 'USERS' && (
            <UserManagementScreen
              language={language}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'SETTINGS' && (
            <SettingsScreen
              language={language}
              currentUser={currentUser}
              dbStatus={dbStatus}
              onRefreshData={loadFromMysql}
              companyLogo={companyLogo}
              onUpdateCompanyLogo={setCompanyLogo}
              companyName={companyName}
              onUpdateCompanyName={setCompanyName}
              companySubtitle={companySubtitle}
              onUpdateCompanySubtitle={setCompanySubtitle}
              onOpenWordPressModal={() => setIsWordPressModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Candidate Dossier */}
      <CandidateDossierModal
        candidate={selectedCandidate}
        isOpen={isDossierOpen}
        onClose={() => {
          setIsDossierOpen(false);
          setSelectedCandidate(null);
        }}
        language={language}
        onToggleBookmark={handleToggleBookmark}
        onEditCandidate={(c) => setCandidateToEdit(c)}
        onDeleteCandidate={handleDeleteCandidate}
        onUpdateCandidate={handleUpdateCandidate}
        onOpenPhoneForm={handleOpenPhoneForm}
        onOpenInPersonForm={handleOpenInPersonForm}
        currentUser={currentUser}
        allCandidates={candidates}
        onOpenCandidatePortal={(cand) => {
          setIsDossierOpen(false);
          setActivePortalCandidate(cand);
        }}
      />

      {/* 2. Excel Import Modal (Sheet Site 21 Fields) */}
      <ExcelImportModal
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
        language={language}
        departments={departments}
        onImportCandidates={handleBulkImportCandidates}
      />

      {/* 3. New Candidate Modal */}
      <NewCandidateModal
        isOpen={isNewCandidateOpen}
        onClose={() => setIsNewCandidateOpen(false)}
        language={language}
        onAddCandidate={handleAddCandidate}
        departments={departments}
      />

      {/* 4. Edit Candidate Modal */}
      <EditCandidateModal
        candidate={candidateToEdit}
        isOpen={!!candidateToEdit}
        onClose={() => setCandidateToEdit(null)}
        language={language}
        onSaveCandidate={handleUpdateCandidate}
        departments={departments}
      />

      {/* 5. New Requisition */}
      <NewRequisitionModal
        isOpen={isNewRequisitionOpen}
        onClose={() => setIsNewRequisitionOpen(false)}
        language={language}
        onAddRequisition={handleAddRequisition}
        departments={departments}
      />

      {/* 6. New Department */}
      <NewDepartmentModal
        isOpen={isNewDepartmentOpen}
        onClose={() => setIsNewDepartmentOpen(false)}
        language={language}
        onAddDepartment={handleAddDepartment}
      />

      {/* 6.1 Edit Department */}
      <EditDepartmentModal
        department={departmentToEdit}
        isOpen={!!departmentToEdit}
        onClose={() => setDepartmentToEdit(null)}
        language={language}
        onSaveDepartment={handleUpdateDepartment}
      />

      {/* 7. New Interview Stage */}
      <NewInterviewStageModal
        isOpen={isNewStageOpen}
        onClose={() => setIsNewStageOpen(false)}
        language={language}
        onAddStage={handleAddStage}
      />

      {/* 7.1 Edit Interview Stage */}
      <EditInterviewStageModal
        stage={stageToEdit}
        isOpen={!!stageToEdit}
        onClose={() => setStageToEdit(null)}
        language={language}
        onSaveStage={handleUpdateStage}
        onDeleteStage={handleDeleteStage}
      />

      {/* 8. Schedule Interview */}
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        language={language}
        candidates={candidates}
        interviewStages={interviewStages}
        onSchedule={handleScheduleInterview}
        onOpenNewStageModal={() => setIsNewStageOpen(true)}
      />

      {/* 9. Scorecard Modal */}
      <ScorecardModal
        candidate={scorecardCandidate}
        isOpen={!!scorecardCandidate}
        onClose={() => setScorecardCandidate(null)}
        language={language}
        onSaveScorecard={handleSaveScorecard}
      />

      {/* 10. Role Switcher (Only available for Super Admin) */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        users={INITIAL_USERS}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        language={language}
      />

      {/* 11. WordPress & Embed Code Modal */}
      <WordPressEmbedModal
        isOpen={isWordPressModalOpen}
        onClose={() => setIsWordPressModalOpen(false)}
        onOpenPreview={() => setIsPublicMode(true)}
      />

      {/* 12. Phone Interview Form Modal (Form 1) */}
      <PhoneInterviewFormModal
        candidate={phoneFormCandidate}
        isOpen={isPhoneFormOpen}
        onClose={() => {
          setIsPhoneFormOpen(false);
          setPhoneFormCandidate(null);
        }}
        language={language}
        onSaveForm={handleSavePhoneForm}
        mode={phoneFormMode}
      />

      {/* 13. In-Person Interview Form Modal (Form 2) */}
      <InPersonInterviewFormModal
        candidate={inPersonFormCandidate}
        isOpen={isInPersonFormOpen}
        onClose={() => {
          setIsInPersonFormOpen(false);
          setInPersonFormCandidate(null);
        }}
        language={language}
        onSaveForm={handleSaveInPersonForm}
        mode={inPersonFormMode}
      />
    </div>
  );
};
