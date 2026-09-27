import React, { useState } from 'react';
import { useStore } from './store/useStore';
import {
  BookOpen,
  FileCheck,
  Award,
  Send,
  PlusCircle,
  Quote,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Copy,
  ExternalLink,
  Sparkles,
  Library
} from 'lucide-react';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    manuscripts,
    submitManuscript,
    submitPeerReview,
    updateEditorialDecision
  } = useStore();

  // Citation Modal
  const [citationModalMs, setCitationModalMs] = useState(null);
  const [citationFormat, setCitationFormat] = useState('APA');
  const [copiedToast, setCopiedToast] = useState(false);

  // Author Submission Modal State
  const [subTitle, setSubTitle] = useState('');
  const [subAuthors, setSubAuthors] = useState('Dr. Marcus Vance, Prof. Eleanor Montagu');
  const [subEmail, setSubEmail] = useState('');
  const [subInstitution, setSubInstitution] = useState('MIT Laboratory for Computer Science');
  const [subCategory, setSubCategory] = useState('Computer Science & Distributed Systems');
  const [subAbstract, setSubAbstract] = useState('');
  const [subKeywords, setSubKeywords] = useState('Distributed Consensus, Fault Tolerance');

  // Peer Review Form State
  const [reviewMsId, setReviewMsId] = useState(manuscripts[2]?.id || manuscripts[0]?.id);
  const [reviewScore, setReviewScore] = useState(8);
  const [reviewRec, setReviewRec] = useState('Accept with minor edits');
  const [reviewFeedback, setReviewFeedback] = useState('');

  const categories = [
    'All',
    'Computer Science & Distributed Systems',
    'Molecular Biology & Genetics',
    'Condensed Matter Physics'
  ];

  const filteredManuscripts = manuscripts.filter(m => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (m.doi && m.doi.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const publishedPapers = filteredManuscripts.filter(m => m.status === 'Published');
  const activeReviewQueue = manuscripts.filter(m => m.status !== 'Published');

  const handleAuthorSubmit = (e) => {
    e.preventDefault();
    if (!subTitle.trim() || !subAbstract.trim()) return;

    submitManuscript({
      title: subTitle,
      authors: subAuthors.split(',').map(a => a.trim()),
      correspondingEmail: subEmail || 'corresponding.author@university.edu',
      institution: subInstitution,
      category: subCategory,
      abstract: subAbstract,
      keywords: subKeywords.split(',').map(k => k.trim())
    });

    setSubTitle('');
    setSubAbstract('');
    setSubKeywords('');
  };

  const handlePeerReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewFeedback.trim()) return;

    submitPeerReview(reviewMsId, {
      reviewerName: 'Anonymous External Ref (Double-Blind)',
      score: Number(reviewScore),
      recommendation: reviewRec,
      feedbackText: reviewFeedback.trim()
    });

    setReviewFeedback('');
  };

  const generateCitation = (ms, format) => {
    const primaryAuthor = ms.authors[0] || 'Author';
    const year = ms.publicationDate ? ms.publicationDate.split('-')[0] : '2026';

    if (format === 'APA') {
      return `${primaryAuthor} et al. (${year}). ${ms.title}. Acta Scientia, ${ms.volume}, https://doi.org/${ms.doi}`;
    } else if (format === 'BibTeX') {
      return `@article{acta_${ms.id.replace(/-/g, '_')},\n  author = {${ms.authors.join(' and ')}},\n  title = {${ms.title}},\n  journal = {Acta Scientia},\n  year = {${year}},\n  doi = {${ms.doi}}\n}`;
    } else {
      return `${primaryAuthor}, et al. "${ms.title}." Acta Scientia ${ms.volume} (${year}).`;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-stone-900 flex flex-col font-sans">
      {/* Deep Maroon Academic Header */}
      <header className="border-b border-rose-950/15 bg-[#fef2f2] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('archive')}>
              <div className="w-11 h-11 rounded-xl bg-[#4c0519] text-rose-100 flex items-center justify-center shadow-md border border-rose-900">
                <Library className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#881337] font-mono">ISSN 2841-904X • Impact Factor 14.8</span>
                <h1 className="text-2xl font-serif font-black tracking-tight text-[#4c0519]">Acta Scientia</h1>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveTab('archive')}
                className={`px-4 py-2 rounded-lg font-serif font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
                  activeTab === 'archive'
                    ? 'bg-[#4c0519] text-rose-100 shadow-sm'
                    : 'text-stone-700 hover:bg-rose-900/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Published Archive</span>
              </button>

              <button
                onClick={() => setActiveTab('submit')}
                className={`px-4 py-2 rounded-lg font-serif font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
                  activeTab === 'submit'
                    ? 'bg-[#4c0519] text-rose-100 shadow-sm'
                    : 'text-stone-700 hover:bg-rose-900/10'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Author Submission Portal</span>
              </button>

              <button
                onClick={() => setActiveTab('editorial')}
                className={`px-4 py-2 rounded-lg font-serif font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
                  activeTab === 'editorial'
                    ? 'bg-[#4c0519] text-rose-100 shadow-sm'
                    : 'text-stone-700 hover:bg-rose-900/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Editorial Board Desk</span>
              </button>

              <button
                onClick={() => setActiveTab('reviewer')}
                className={`px-4 py-2 rounded-lg font-serif font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
                  activeTab === 'reviewer'
                    ? 'bg-[#4c0519] text-rose-100 shadow-sm'
                    : 'text-stone-700 hover:bg-rose-900/10'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Peer Reviewer Form</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: PUBLISHED ARCHIVE */}
        {activeTab === 'archive' && (
          <div className="space-y-6">
            {/* Search & Category Filter */}
            <div className="bg-[#fef2f2]/60 p-5 rounded-2xl border border-rose-900/15 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-rose-900/60" />
                  <input
                    type="text"
                    placeholder="Search by manuscript title, author, DOI, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-rose-900/20 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  />
                </div>

                <div className="text-xs font-serif text-stone-600">
                  Curated Open-Access Repository • Volume 48
                </div>
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-2 pt-2 border-t border-rose-900/10 overflow-x-auto">
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider font-mono">Discipline:</span>
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === c
                        ? 'bg-[#4c0519] text-rose-100 shadow-xs'
                        : 'bg-rose-100/70 text-rose-950 hover:bg-rose-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Published Papers Cards */}
            <div className="space-y-6">
              {publishedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-[#fffdfa] rounded-2xl border border-rose-950/15 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="font-bold text-[#4c0519] bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                        {paper.volume}
                      </span>
                      <span className="text-stone-500">DOI: {paper.doi}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Peer Reviewed & Published ({paper.publicationDate})</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#380312] leading-snug">
                      {paper.title}
                    </h3>

                    <p className="text-xs text-stone-700 italic mt-1 font-serif">
                      {paper.authors.join(' • ')} — <span className="text-stone-500 not-italic font-sans">{paper.institution}</span>
                    </p>
                  </div>

                  <div className="bg-[#fef2f2]/40 p-4 rounded-xl border border-rose-900/10">
                    <h4 className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#881337] mb-1">Abstract</h4>
                    <p className="text-xs text-stone-800 leading-relaxed font-serif">
                      {paper.abstract}
                    </p>
                  </div>

                  {/* Keywords & Action Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-rose-900/10 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {paper.keywords.map(kw => (
                        <span key={kw} className="bg-stone-100 text-stone-700 text-[11px] font-mono px-2 py-0.5 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCitationModalMs(paper)}
                        className="px-3.5 py-1.5 bg-[#4c0519] hover:bg-[#680924] text-rose-100 font-serif font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
                      >
                        <Quote className="w-3.5 h-3.5 text-rose-300" />
                        <span>Cite Article</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AUTHOR SUBMISSION PORTAL */}
        {activeTab === 'submit' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#fef2f2]/70 p-6 rounded-3xl border border-rose-900/15 text-center space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[#4c0519]">Manuscript Submission Portal</h2>
              <p className="text-xs text-stone-600">Authors may submit original uncompressed research papers for double-blind peer review.</p>
            </div>

            <form onSubmit={handleAuthorSubmit} className="bg-white p-8 rounded-3xl border border-rose-900/15 shadow-sm space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-800 font-serif text-sm mb-1">Manuscript Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asymptotic Bounds on Asynchronous Quantum Telemetry Networks"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 font-serif text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Author List (comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Pendelton, Prof. Elena Rostova"
                    value={subAuthors}
                    onChange={(e) => setSubAuthors(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Affiliation / University</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oxford Dept of Computational Physics"
                    value={subInstitution}
                    onChange={(e) => setSubInstitution(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Journal Academic Track</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-serif"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Corresponding Author Email</label>
                  <input
                    type="email"
                    required
                    placeholder="author@institution.edu"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 font-serif mb-1">Scientific Abstract (250-400 words)</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Summarize the core hypothesis, mathematical derivation, experimental setup, and quantitative findings..."
                  value={subAbstract}
                  onChange={(e) => setSubAbstract(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 font-serif leading-relaxed text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Keywords & Index Terms (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Quantum Entropy, Asymptotic Bounds, Non-equilibrium Thermodynamics"
                  value={subKeywords}
                  onChange={(e) => setSubKeywords(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#4c0519] hover:bg-[#680924] text-rose-100 font-serif font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 text-rose-300" />
                  <span>Transmit Manuscript for Editorial Review</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: EDITORIAL BOARD DESK */}
        {activeTab === 'editorial' && (
          <div className="space-y-6">
            <div className="bg-[#fef2f2]/60 p-6 rounded-3xl border border-rose-900/15">
              <h2 className="text-xl font-serif font-bold text-[#4c0519]">Chief Editorial & Decision Console</h2>
              <p className="text-xs text-stone-600">Review plagiarism similarity indexes, examine blind reviewer recommendations, and assign publication volumes.</p>
            </div>

            <div className="space-y-6">
              {manuscripts.map(ms => (
                <div key={ms.id} className="bg-white rounded-3xl border border-rose-900/15 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#4c0519] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {ms.id}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#380312]">{ms.title}</h4>
                      </div>
                      <p className="text-xs text-stone-600 italic mt-0.5">{ms.authors.join(', ')} • {ms.institution}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                        ms.plagiarismScore <= 5
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}>
                        Similarity Index: {ms.plagiarismScore}% (Turnitin Verified)
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Feedback Summary */}
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase font-mono font-bold text-stone-500">Double-Blind Referee Reports ({ms.reviews.length})</span>
                    {ms.reviews.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No referee reports submitted yet.</p>
                    ) : (
                      ms.reviews.map((r, i) => (
                        <div key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                          <div className="flex justify-between font-bold text-stone-800 mb-1 font-serif">
                            <span>{r.reviewerName} (Score: {r.score}/10)</span>
                            <span className="text-rose-900 font-sans font-bold text-[11px]">{r.recommendation}</span>
                          </div>
                          <p className="text-stone-700 italic">"{r.feedbackText}"</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Decision Controls */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-700 font-serif">Editorial Status:</span>
                      <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                        ms.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-900'
                          : ms.status === 'Accepted'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {ms.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateEditorialDecision(ms.id, 'Major Revision')}
                        className="px-3 py-1.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg font-semibold"
                      >
                        Request Major Revision
                      </button>
                      <button
                        onClick={() => updateEditorialDecision(ms.id, 'Accepted')}
                        className="px-3 py-1.5 border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg font-semibold"
                      >
                        Accept Manuscript
                      </button>
                      <button
                        onClick={() => updateEditorialDecision(ms.id, 'Published')}
                        className="px-4 py-1.5 bg-[#4c0519] hover:bg-[#680924] text-rose-100 rounded-lg font-serif font-bold shadow-xs"
                      >
                        Authorize Publication to Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PEER REVIEWER FORM */}
        {activeTab === 'reviewer' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#fef2f2]/70 p-6 rounded-3xl border border-rose-900/15 text-center space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[#4c0519]">Double-Blind Peer Reviewer Rubric</h2>
              <p className="text-xs text-stone-600">Provide anonymous, rigorous feedback on novelty, methodology, and theoretical soundness.</p>
            </div>

            <form onSubmit={handlePeerReviewSubmit} className="bg-white p-8 rounded-3xl border border-rose-900/15 shadow-sm space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 font-serif mb-1">Select Assigned Manuscript</label>
                <select
                  value={reviewMsId}
                  onChange={(e) => setReviewMsId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-serif"
                >
                  {manuscripts.map(m => (
                    <option key={m.id} value={m.id}>{m.id} — {m.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Methodology Score (1 to 10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Recommendation</label>
                  <select
                    value={reviewRec}
                    onChange={(e) => setReviewRec(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  >
                    <option value="Accept as is">Accept as is</option>
                    <option value="Accept with minor edits">Accept with minor edits</option>
                    <option value="Major Revision">Major Revision Required</option>
                    <option value="Reject">Reject</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 font-serif mb-1">Referee Detailed Commentary & Critique</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Address theoretical assumptions, experimental controls, baseline comparisons, and missing citations..."
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 font-serif leading-relaxed text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#4c0519] hover:bg-[#680924] text-rose-100 font-serif font-bold text-xs rounded-xl shadow-sm"
                >
                  Submit Anonymous Peer Review
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Citation Modal */}
      {citationModalMs && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#fffdfa] max-w-lg w-full rounded-3xl shadow-2xl p-6 relative border border-rose-900/20 space-y-4">
            <button
              onClick={() => setCitationModalMs(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="font-serif font-bold text-xl text-[#4c0519]">Cite Scientific Article</h3>
            <p className="text-xs text-stone-600 font-serif">{citationModalMs.title}</p>

            <div className="flex space-x-2 border-b border-stone-200 pb-2">
              {['APA', 'BibTeX', 'Chicago'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    citationFormat === fmt
                      ? 'bg-[#4c0519] text-rose-100'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="bg-[#fef2f2] p-4 rounded-xl border border-rose-900/10 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
              {generateCitation(citationModalMs, citationFormat)}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-mono text-emerald-700">
                {copiedToast ? '✓ Copied citation to clipboard!' : ''}
              </span>

              <button
                onClick={() => copyToClipboard(generateCitation(citationModalMs, citationFormat))}
                className="px-4 py-2 bg-[#4c0519] hover:bg-[#680924] text-rose-100 font-serif font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Citation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Footer */}
      <footer className="border-t border-rose-900/15 bg-[#fef2f2] py-6 text-center text-xs text-stone-600 font-serif">
        <p className="font-bold text-[#4c0519]">Acta Scientia Academic Publishing Protocol</p>
        <p className="text-[11px] text-stone-500 font-sans mt-0.5">Double-Blind Peer Review • Automated DOI Stamping • Turnitin Plagiarism Screening</p>
      </footer>
    </div>
  );
}
