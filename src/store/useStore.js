import { create } from 'zustand';

export const useStore = create((set, get) => ({
  activeTab: 'archive', // 'archive' | 'submit' | 'editorial' | 'reviewer'
  selectedCategory: 'All',
  searchQuery: '',

  manuscripts: [
    {
      id: 'MS-2026-8801',
      title: 'Thermodynamic Bounds on Distributed Multi-Agent Consensus Algorithms',
      authors: ['Dr. Arthur Pendelton', 'Prof. Elena Rostova, Ph.D.', 'Dr. Tariq Al-Mansoor'],
      correspondingEmail: 'arthur.p@oxford-archive.org',
      institution: 'Oxford Institute for Advanced Computational Sciences',
      category: 'Computer Science & Distributed Systems',
      abstract: 'We prove a fundamental lower bound on entropy generation in asynchronous distributed consensus networks with stochastic message delays, providing optimal packet scheduler formulations.',
      keywords: ['Distributed Consensus', 'Thermodynamics', 'Stochastic Processes', 'Information Theory'],
      doi: '10.1093/acta.2026.8801',
      volume: 'Vol. 48, Iss. 3',
      publicationDate: '2026-09-18',
      submissionDate: '2026-07-10',
      status: 'Published',
      plagiarismScore: 3, // 3% similarity
      editorAssigned: 'Prof. Julian Vance, D.Phil',
      citationsCount: 19,
      reviews: [
        { reviewerId: 'REV-01', reviewerName: 'Anonymous Reviewer #1', score: 9, recommendation: 'Accept as is', feedbackText: 'Exceptional mathematical rigor in Theorem 3.4 proofs. Groundbreaking entropy formulation.', date: '2026-08-04' },
        { reviewerId: 'REV-02', reviewerName: 'Anonymous Reviewer #2', score: 8, recommendation: 'Accept with minor edits', feedbackText: 'Clarify assumptions on non-stationary Byzantine fault probability distributions.', date: '2026-08-12' }
      ]
    },
    {
      id: 'MS-2026-8802',
      title: 'CRISPR-Cas14 Transcriptional Activation in High-Salinity Cultivars',
      authors: ['Lady Eleanor Montagu', 'Dr. Hiroshi Tanaka'],
      correspondingEmail: 'e.montagu@cambridge-botany.ac.uk',
      institution: 'Cambridge Department of Plant Genetics',
      category: 'Molecular Biology & Genetics',
      abstract: 'Targeted epigenetic upregulation of OsHKT1;5 sodium transporters in Oryza sativa yields a 42% biomass improvement under 200mM NaCl drought stress.',
      keywords: ['CRISPR-Cas14', 'Epigenetics', 'Salinity Tolerance', 'Agronomic Biotechnology'],
      doi: '10.1093/acta.2026.8802',
      volume: 'Vol. 48, Iss. 3',
      publicationDate: '2026-09-22',
      submissionDate: '2026-08-01',
      status: 'Published',
      plagiarismScore: 2,
      editorAssigned: 'Prof. Julian Vance, D.Phil',
      citationsCount: 31,
      reviews: [
        { reviewerId: 'REV-03', reviewerName: 'Anonymous Reviewer #1', score: 9, recommendation: 'Accept as is', feedbackText: 'Robust Western blot replications and field trial telemetry across three soil types.', date: '2026-08-25' }
      ]
    },
    {
      id: 'MS-2026-8803',
      title: 'Topological Invariants in Superconducting Dirac Semimetals',
      authors: ['Dr. Marcus Holloway', 'Prof. Clara Zimmerman'],
      correspondingEmail: 'm.holloway@stanford-physics.edu',
      institution: 'Stanford Quantum Matter Institute',
      category: 'Condensed Matter Physics',
      abstract: 'Observation of Majorana zero modes in proximitized bismuth selenide nanowires under high-field millikelvin scanning tunneling spectroscopy.',
      keywords: ['Topological Semimetals', 'Majorana Modes', 'Superconductivity', 'Nanowires'],
      doi: '10.1093/acta.2026.8803',
      volume: 'Under Editorial Evaluation',
      publicationDate: null,
      submissionDate: '2026-09-15',
      status: 'Under Peer Review',
      plagiarismScore: 5,
      editorAssigned: 'Prof. Julian Vance, D.Phil',
      citationsCount: 0,
      reviews: [
        { reviewerId: 'REV-04', reviewerName: 'Anonymous Reviewer #1', score: 7, recommendation: 'Major Revision', feedbackText: 'Address potential thermal broadening artifacts in the dI/dV spectroscopy peaks at 50mK.', date: '2026-09-25' }
      ]
    }
  ],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  submitManuscript: (msData) => set((state) => {
    const newMs = {
      id: `MS-2026-${Math.floor(8804 + Math.random() * 900)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Under Peer Review',
      plagiarismScore: Math.floor(2 + Math.random() * 6), // 2-7% normal
      editorAssigned: 'Prof. Julian Vance, D.Phil (Chief Editor)',
      volume: 'Pending Volume Assignment',
      publicationDate: null,
      citationsCount: 0,
      reviews: [],
      ...msData
    };
    return {
      manuscripts: [newMs, ...state.manuscripts],
      activeTab: 'editorial'
    };
  }),

  submitPeerReview: (manuscriptId, reviewData) => set((state) => ({
    manuscripts: state.manuscripts.map(m => {
      if (m.id === manuscriptId) {
        return {
          ...m,
          reviews: [
            ...m.reviews,
            {
              reviewerId: `REV-${Math.floor(10 + Math.random() * 90)}`,
              date: new Date().toISOString().split('T')[0],
              ...reviewData
            }
          ]
        };
      }
      return m;
    })
  })),

  updateEditorialDecision: (manuscriptId, newStatus) => set((state) => ({
    manuscripts: state.manuscripts.map(m => {
      if (m.id === manuscriptId) {
        const isPublished = newStatus === 'Published';
        return {
          ...m,
          status: newStatus,
          doi: m.doi || `10.1093/acta.2026.${Math.floor(8800 + Math.random() * 1000)}`,
          volume: isPublished ? 'Vol. 48, Iss. 4 (Fall 2026)' : m.volume,
          publicationDate: isPublished ? new Date().toISOString().split('T')[0] : m.publicationDate
        };
      }
      return m;
    })
  }))
}));
