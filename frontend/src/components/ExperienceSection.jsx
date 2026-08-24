import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Edit2, Lock, LockOpen, Briefcase, GraduationCap } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import CrudControls from './CrudControls';
import { getIconByName } from '../utils/portfolioUtils';
import IconPicker from './IconPicker';
import ColorPickerField from './ColorPickerField';

const IconComponent = ({ name, size = 18, className = "", style = {} }) => {
  if (name && (name.startsWith('http') || name.startsWith('/'))) {
    return <img src={name} alt="icon" style={{ width: size, height: size, ...style }} className={`object-contain ${className}`} />;
  }
  const Icon = getIconByName(name);
  return Icon ? <Icon size={size} className={className} style={style} /> : <Edit2 size={size} className={className} style={style} />;
};

const ExperienceSection = ({ isEditMode, data, onChange, mode = 'light' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const defaultData = {
    headerTitle: { light: "Professional Experience", dark: "Professional Experience" },
    headerIcon: "Briefcase",
    headerIconColor: { light: "#EAB308", dark: "#EAB308" },
    professionalSummaryTitle: { light: "Professional Summary", dark: "Professional Summary" },
    summary: { light: "", dark: "" },
    summaryBgColor: { light: "transparent", dark: "transparent" },
    workHistoryTitle: { light: "Work History", dark: "Work History" },
    workHistoryLineColor: { light: "#EAB308", dark: "#EAB308" },
    work: [],
    experienceBgColor: { light: "transparent", dark: "transparent" },
    headerBgColor: { light: "transparent", dark: "transparent" },
    educationTitle: { light: "Education", dark: "Education" },
    educationList: [],
    isLocked: false
  };

  const [expData, setExpData] = useState(data || defaultData)
  const isInternalUpdate = useRef(false);

  const parseMultiMode = (val, defaultVal = "") => {
    if (val === undefined || val === null) return { light: defaultVal, dark: defaultVal };
    if (typeof val === 'string') return { light: val, dark: val };
    if (typeof val === 'object') {
      return {
        light: val.light !== undefined ? val.light : defaultVal,
        dark: val.dark !== undefined ? val.dark : defaultVal
      };
    }
    return { light: defaultVal, dark: defaultVal };
  };

  useEffect(() => {
    if (data && !isInternalUpdate.current) {
      const normalizedData = {
        ...defaultData,
        ...data,
        headerTitle: parseMultiMode(data.headerTitle, "Professional Experience"),
        headerIconColor: parseMultiMode(data.headerIconColor, "#EAB308"),
        professionalSummaryTitle: parseMultiMode(data.professionalSummaryTitle, "Professional Summary"),
        summary: parseMultiMode(data.summary, ""),
        summaryBgColor: parseMultiMode(data.summaryBgColor, "transparent"),
        workHistoryTitle: parseMultiMode(data.workHistoryTitle, "Work History"),
        workHistoryLineColor: parseMultiMode(data.workHistoryLineColor, "#EAB308"),
        experienceBgColor: parseMultiMode(data.experienceBgColor, "transparent"),
        headerBgColor: parseMultiMode(data.headerBgColor, "transparent"),
        educationTitle: parseMultiMode(data.educationTitle, "Education"),
        isLocked: data.isLocked !== undefined ? data.isLocked : false,
        work: (data.work || []).map(job => ({
          ...job,
          title: parseMultiMode(job.title),
          company: parseMultiMode(job.company),
          period: parseMultiMode(job.period),
          type: parseMultiMode(job.type),
          bgColor: parseMultiMode(job.bgColor, "transparent"),
          responsibilities: (job.responsibilities || []).map(r => ({
            ...r,
            text: parseMultiMode(r.text)
          }))
        })),
        educationList: (data.educationList || []).map(edu => ({
          ...edu,
          degree: parseMultiMode(edu.degree),
          school: parseMultiMode(edu.school),
          period: parseMultiMode(edu.period),
          bgColor: parseMultiMode(edu.bgColor, "transparent")
        }))
      };
      setExpData(normalizedData);
    }
    isInternalUpdate.current = false;
  }, [data]);

  useEffect(() => {
    if (onChange && expData) {
      isInternalUpdate.current = true;
      onChange(expData);
    }
  }, [expData]);

  useEffect(() => {
    if (expData.isLocked) {
      setIsExpanded(true);
    }
  }, [expData.isLocked]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const updateField = (field, value) => {
    setExpData(prev => ({
      ...prev,
      [field]: {
        ...parseMultiMode(prev[field]),
        [mode]: value
      }
    }));
  };

  const setExperienceBgColor = (color) => updateField('experienceBgColor', color);

  const setMasterBoxBgColor = (color) => {
    setExpData(prev => ({
      ...prev,
      headerBgColor: { ...parseMultiMode(prev.headerBgColor), [mode]: color },
      summaryBgColor: { ...parseMultiMode(prev.summaryBgColor), [mode]: color },
      work: prev.work.map(job => ({
        ...job,
        bgColor: { ...parseMultiMode(job.bgColor), [mode]: color }
      })),
      educationList: prev.educationList.map(edu => ({
        ...edu,
        bgColor: { ...parseMultiMode(edu.bgColor), [mode]: color }
      }))
    }));
  };

  const toggleLock = () => {
    setExpData(prev => ({ ...prev, isLocked: !prev.isLocked }));
  };

  const handleIconSelect = (newIcon) => {
    setExpData(prev => ({ ...prev, headerIcon: newIcon }));
  };

  const addWork = () => {
    const boxBg = parseMultiMode(expData.summaryBgColor);
    const newWork = {
      id: generateId(),
      title: { light: "", dark: "" },
      company: { light: "", dark: "" },
      period: { light: "", dark: "" },
      type: { light: "", dark: "" },
      responsibilities: [],
      bgColor: { light: boxBg.light, dark: boxBg.dark }
    }
    setExpData(prev => ({
      ...prev,
      work: [...prev.work, newWork]
    }))
  }

  const deleteWork = (workId) => {
    if (confirm("Delete this work experience?")) {
      setExpData(prev => ({
        ...prev,
        work: prev.work.filter(w => w.id !== workId)
      }))
    }
  }

  const moveWork = (workId, direction) => {
    const index = expData.work.findIndex(w => w.id === workId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === expData.work.length - 1)
    ) return

    const newWork = [...expData.work]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newWork[index], newWork[newIndex]] = [newWork[newIndex], newWork[index]]

    setExpData(prev => ({ ...prev, work: newWork }))
  }

  const updateWork = (workId, field, value) => {
    setExpData(prev => ({
      ...prev,
      work: prev.work.map(item =>
        item.id === workId ? {
          ...item,
          [field]: { ...parseMultiMode(item[field]), [mode]: value }
        } : item
      )
    }))
  }

  const addResponsibility = (workId) => {
    const newResp = {
      id: generateId(),
      text: { light: "", dark: "" }
    }
    setExpData(prev => ({
      ...prev,
      work: prev.work.map(item =>
        item.id === workId
          ? { ...item, responsibilities: [...item.responsibilities, newResp] }
          : item
      )
    }))
  }

  const deleteResponsibility = (workId, respId) => {
    if (confirm("Delete this responsibility?")) {
      setExpData(prev => ({
        ...prev,
        work: prev.work.map(item =>
          item.id === workId
            ? { ...item, responsibilities: item.responsibilities.filter(r => r.id !== respId) }
            : item
        )
      }))
    }
  }

  const moveResponsibility = (workId, respId, direction) => {
    const work = expData.work.find(w => w.id === workId)
    const index = work.responsibilities.findIndex(r => r.id === respId)

    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === work.responsibilities.length - 1)
    ) return

    const newResponsibilities = [...work.responsibilities]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newResponsibilities[index], newResponsibilities[newIndex]] = [newResponsibilities[newIndex], newResponsibilities[index]]

    setExpData(prev => ({
      ...prev,
      work: prev.work.map(item =>
        item.id === workId ? { ...item, responsibilities: newResponsibilities } : item
      )
    }))
  }

  const updateResponsibility = (workId, respId, value) => {
    setExpData(prev => ({
      ...prev,
      work: prev.work.map(item =>
        item.id === workId ? {
          ...item,
          responsibilities: item.responsibilities.map(r =>
            r.id === respId ? { ...r, text: { ...parseMultiMode(r.text), [mode]: value } } : r
          )
        } : item
      )
    }))
  }

  const addEducation = () => {
    const boxBg = parseMultiMode(expData.summaryBgColor);
    const newEdu = {
      id: generateId(),
      degree: { light: "", dark: "" },
      school: { light: "", dark: "" },
      period: { light: "", dark: "" },
      bgColor: { light: boxBg.light, dark: boxBg.dark }
    }
    setExpData(prev => ({
      ...prev,
      educationList: [...(prev.educationList || []), newEdu]
    }))
  }

  const updateEducationItem = (eduId, field, value) => {
    setExpData(prev => ({
      ...prev,
      educationList: prev.educationList.map(item =>
        item.id === eduId ? {
          ...item,
          [field]: { ...parseMultiMode(item[field]), [mode]: value }
        } : item
      )
    }))
  }

  const deleteEducationItem = (eduId) => {
    if (confirm("Delete this education entry?")) {
      setExpData(prev => ({
        ...prev,
        educationList: (prev.educationList || []).filter(item => item.id !== eduId)
      }))
    }
  }

  const moveEducationItem = (eduId, direction) => {
    const index = expData.educationList.findIndex(item => item.id === eduId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === expData.educationList.length - 1)
    ) return

    const newList = [...expData.educationList]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newList[index], newList[newIndex]] = [newList[newIndex], newList[index]]

    setExpData(prev => ({ ...prev, educationList: newList }))
  }

  const headerIconName = expData.headerIcon || "Briefcase";
  const expBg = parseMultiMode(expData.experienceBgColor);
  const headBg = parseMultiMode(expData.headerBgColor);

  return (
    <section
      className="py-24 sm:py-32 md:py-40 px-6 sm:px-12 md:px-20 lg:px-32 transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: expBg[mode] !== 'transparent' ? expBg[mode] : '' }}
    >
      <AnimatePresence>
        {isIconPickerOpen && (
          <IconPicker
            isOpen={isIconPickerOpen}
            onClose={() => setIsIconPickerOpen(false)}
            onSelect={handleIconSelect}
            currentIcon={headerIconName}
          />
        )}
      </AnimatePresence>

      {isEditMode && (
          <div className="absolute top-4 right-12 md:right-32 flex flex-wrap items-center gap-3 z-50">
            <ColorPickerField
              label="Section"
              value={expBg[mode] === 'transparent' ? (mode === 'dark' ? '#000000' : '#F5F5F5') : expBg[mode]}
              onChange={setExperienceBgColor}
              onReset={() => setExperienceBgColor('transparent')}
            />
            <ColorPickerField
              label="Boxes"
              value={parseMultiMode(expData.summaryBgColor)[mode] !== 'transparent' ? parseMultiMode(expData.summaryBgColor)[mode] : (mode === 'dark' ? '#1a1a1a' : '#ffffff')}
              onChange={setMasterBoxBgColor}
              onReset={() => setMasterBoxBgColor('transparent')}
            />
          </div>
      )}

      <div className="max-w-screen-2xl mx-auto relative">
        <div className="relative group/header mb-16">
          <div
            role="button"
            tabIndex={0}
            onClick={() => !expData.isLocked && setIsExpanded(!isExpanded)}
            onKeyDown={(e) => e.key === 'Enter' && !expData.isLocked && setIsExpanded(!isExpanded)}
            className={`w-full flex items-center justify-between gap-8 p-10 rounded-[2rem] border-2 border-theme/10 hover:border-theme/30 transition-all outline-none shadow-2xl ${expData.isLocked ? 'cursor-default' : 'cursor-pointer'}`}
            style={{ backgroundColor: headBg[mode] !== 'transparent' ? headBg[mode] : 'var(--bg-primary)' }}
          >
            <div className="flex items-center gap-8">
              <div className="p-6 rounded-3xl relative group/icon bg-theme-icon/5 border-2 border-theme-icon/10">
                <div className="relative group/iconEdit">
                  <IconComponent
                    name={headerIconName}
                    size={40}
                    className="text-theme-icon"
                  />
                  {isEditMode && (
                    <div className="absolute -inset-2 flex flex-col items-center justify-center opacity-0 group-hover/iconEdit:opacity-100 transition-opacity z-50">
                      <div className="flex items-center gap-1 bg-theme-primary/90 backdrop-blur-sm p-1 rounded-lg border border-theme shadow-xl">
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsIconPickerOpen(true); }}
                          className="p-1.5 bg-[#EAB308] text-black rounded transition-colors"
                          title="Change Icon"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-left">
                <RichTextEditor
                  value={parseMultiMode(expData.headerTitle)[mode]}
                  onSave={(val) => updateField('headerTitle', val)}
                  isEditMode={isEditMode}
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-theme-primary tracking-tighter"
                  placeholder="Professional Experience"
                />
                <p className="text-sm sm:text-base text-theme-secondary opacity-60 font-medium mt-2">
                  {expData.isLocked ? 'Career highlights and milestones' : `Tap to view my career journey`}
                </p>
              </div>
            </div>
            {!expData.isLocked && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="p-4 rounded-2xl bg-theme-secondary group-hover:bg-theme-icon/10 group-hover:text-theme-icon transition-all"
              >
                <ChevronDown size={32} />
              </motion.div>
            )}
          </div>

          {isEditMode && (
            <div className="absolute top-4 right-16 flex items-center gap-2 z-50">
              <button
                onClick={(e) => { e.stopPropagation(); toggleLock(); }}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 opacity-0 group-hover/header:opacity-100 ${expData.isLocked ? 'bg-orange-500/20 border-orange-500/50 text-orange-500' : 'bg-blue-500/20 border-blue-500/50 text-blue-500'}`}
              >
                {expData.isLocked ? <Lock size={14} /> : <LockOpen size={14} />}
                <span className="text-[10px] font-black uppercase">{expData.isLocked ? 'Locked' : 'Manual'}</span>
              </button>
              <CrudControls
                onAdd={addWork}
                className="shadow-2xl"
              />
            </div>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="overflow-visible"
            >
              <div className="grid lg:grid-cols-12 gap-12 sm:gap-16">

                {/* Left Column: Summary and Education */}
                <div className="lg:col-span-4 space-y-12">
                  <div
                    className="bg-theme-primary rounded-[2rem] p-8 sm:p-10 border border-theme/10 relative group/summary shadow-xl"
                    style={{ backgroundColor: parseMultiMode(expData.summaryBgColor)[mode] !== 'transparent' ? parseMultiMode(expData.summaryBgColor)[mode] : '' }}
                  >
                    {isEditMode && (
                      <div className="absolute top-4 right-4 z-50">
                        <CrudControls
                          onDelete={() => confirm("Clear summary?") && updateField('summary', "")}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-1 bg-theme-line rounded-full" />
                      <RichTextEditor
                        value={parseMultiMode(expData.professionalSummaryTitle)[mode]}
                        onSave={(val) => updateField('professionalSummaryTitle', val)}
                        isEditMode={isEditMode}
                        className="text-xs font-black uppercase tracking-[0.3em] text-theme-primary/50"
                        placeholder="Summary Title"
                      />
                    </div>
                    <RichTextEditor
                      value={parseMultiMode(expData.summary)[mode]}
                      onSave={(val) => updateField('summary', val)}
                      isEditMode={isEditMode}
                      className="text-lg sm:text-xl text-theme-primary font-medium leading-relaxed"
                      placeholder="Share your story..."
                    />
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                      <GraduationCap className="text-theme-line" size={24} />
                      <RichTextEditor
                        value={parseMultiMode(expData.educationTitle)[mode]}
                        onSave={(val) => updateField('educationTitle', val)}
                        isEditMode={isEditMode}
                        className="text-2xl font-black text-theme-primary tracking-tight"
                        placeholder="Education"
                      />
                    </div>

                    {isEditMode && (
                      <button
                        onClick={addEducation}
                        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-theme/20 rounded-2xl text-theme-primary/40 hover:border-theme-line hover:text-theme-line transition-all font-bold text-sm"
                      >
                        <Plus size={18} /> Add Education
                      </button>
                    )}

                    <div className="space-y-6">
                      {(expData.educationList || []).map((edu, index) => {
                        const eduBg = parseMultiMode(edu.bgColor);
                        return (
                          <motion.div
                            key={edu.id}
                            className="bg-theme-primary rounded-2xl p-6 border border-theme/10 relative group/edu shadow-md"
                            style={{ backgroundColor: eduBg[mode] !== 'transparent' ? eduBg[mode] : '' }}
                          >
                            {isEditMode && (
                              <div className="absolute top-2 right-2 z-50 opacity-0 group-hover/edu:opacity-100 transition-opacity">
                                <CrudControls
                                  onDelete={() => deleteEducationItem(edu.id)}
                                  onMoveUp={() => moveEducationItem(edu.id, 'up')}
                                  onMoveDown={() => moveEducationItem(edu.id, 'down')}
                                />
                              </div>
                            )}
                            <RichTextEditor
                              value={parseMultiMode(edu.degree)[mode]}
                              onSave={(val) => updateEducationItem(edu.id, 'degree', val)}
                              isEditMode={isEditMode}
                              className="text-base font-bold text-theme-primary"
                              placeholder="Degree"
                            />
                            <RichTextEditor
                              value={parseMultiMode(edu.school)[mode]}
                              onSave={(val) => updateEducationItem(edu.id, 'school', val)}
                              isEditMode={isEditMode}
                              className="text-sm text-theme-secondary opacity-60 font-medium mt-1"
                              placeholder="Institution"
                            />
                            <RichTextEditor
                              value={parseMultiMode(edu.period)[mode]}
                              onSave={(val) => updateEducationItem(edu.id, 'period', val)}
                              isEditMode={isEditMode}
                              className="text-[10px] font-black uppercase tracking-widest text-theme-line mt-3"
                              placeholder="Period"
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Work History */}
                <div className="lg:col-span-8 space-y-12">
                  <div className="flex items-center gap-4 px-2">
                    <Briefcase className="text-theme-line" size={24} />
                    <RichTextEditor
                      value={parseMultiMode(expData.workHistoryTitle)[mode]}
                      onSave={(val) => updateField('workHistoryTitle', val)}
                      isEditMode={isEditMode}
                      className="text-2xl font-black text-theme-primary tracking-tight"
                      placeholder="Work History"
                    />
                  </div>

                  <div className="space-y-16">
                    {expData.work.map((job, index) => {
                      const jobBg = parseMultiMode(job.bgColor);
                      return (
                        <motion.div
                          key={job.id}
                          className="relative pl-12 sm:pl-16 border-l-2 border-theme/10 group/job pb-4"
                        >
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-theme-primary border-4 border-theme-line shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10" />

                          {isEditMode && (
                            <div className="absolute -top-8 right-0 z-50 opacity-0 group-hover/job:opacity-100 transition-opacity">
                              <CrudControls
                                onAdd={() => addResponsibility(job.id)}
                                onDelete={() => deleteWork(job.id)}
                                onMoveUp={() => moveWork(job.id, 'up')}
                                onMoveDown={() => moveWork(job.id, 'down')}
                              />
                            </div>
                          )}

                          <div
                            className="bg-theme-primary rounded-[2rem] p-8 sm:p-10 border border-theme/10 hover:border-theme/30 hover:shadow-2xl transition-all relative"
                            style={{ backgroundColor: jobBg[mode] !== 'transparent' ? jobBg[mode] : '' }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                              <div className="space-y-2">
                                <RichTextEditor
                                  value={parseMultiMode(job.title)[mode]}
                                  onSave={(val) => updateWork(job.id, 'title', val)}
                                  isEditMode={isEditMode}
                                  className="text-2xl sm:text-3xl font-black text-theme-primary tracking-tight"
                                  placeholder="Role Title"
                                />
                                <RichTextEditor
                                  value={parseMultiMode(job.company)[mode]}
                                  onSave={(val) => updateWork(job.id, 'company', val)}
                                  isEditMode={isEditMode}
                                  className="text-lg font-bold text-theme-line"
                                  placeholder="Company"
                                />
                              </div>
                              <div className="text-left sm:text-right space-y-3">
                                <RichTextEditor
                                  value={parseMultiMode(job.period)[mode]}
                                  onSave={(val) => updateWork(job.id, 'period', val)}
                                  isEditMode={isEditMode}
                                  className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-primary/40"
                                  placeholder="Dates"
                                />
                                <RichTextEditor
                                  value={parseMultiMode(job.type)[mode]}
                                  onSave={(val) => updateWork(job.id, 'type', val)}
                                  isEditMode={isEditMode}
                                  className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-theme-icon/10 text-theme-icon"
                                  placeholder="Type"
                                />
                              </div>
                            </div>

                            <ul className="space-y-6">
                              {job.responsibilities.map((resp) => (
                                <li key={resp.id} className="flex gap-6 group/resp">
                                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-theme-line/40 shrink-0" />
                                  <div className="flex-1 relative">
                                    <RichTextEditor
                                      value={parseMultiMode(resp.text)[mode]}
                                      onSave={(val) => updateResponsibility(job.id, resp.id, val)}
                                      isEditMode={isEditMode}
                                      className="text-base sm:text-lg text-theme-secondary font-medium leading-relaxed"
                                      placeholder="Key responsibility..."
                                    />
                                    {isEditMode && (
                                      <div className="absolute -right-12 top-0 opacity-0 group-hover/resp:opacity-100 transition-opacity">
                                        <CrudControls
                                          onDelete={() => deleteResponsibility(job.id, resp.id)}
                                          onMoveUp={() => moveResponsibility(job.id, resp.id, 'up')}
                                          onMoveDown={() => moveResponsibility(job.id, resp.id, 'down')}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ExperienceSection;
