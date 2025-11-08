import { CVData } from "@/lib/types";
import { themes } from "@/lib/themes";
import { formatDate } from "@/lib/utils";
import { InlineEditableText } from "./InlineEditableText";
import { useResume } from "@/contexts/ResumeContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Calendar,
  GripVertical,
} from "lucide-react";
import { useMemo } from "react";

interface PreviewEnhancedProps {
  data?: CVData;
  readOnly?: boolean;
}



interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  readOnly?: boolean;
}

function SortableSection({ id, children, readOnly = false }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {!readOnly && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      )}
      {children}
    </div>
  );
}

export function PreviewEnhanced({ data: propData, readOnly = false }: PreviewEnhancedProps) {
  const contextData = useResume();
  const data = propData || contextData?.cvData;
  const updateField = readOnly ? undefined : contextData?.updateField;
  const updateCVData = readOnly ? undefined : contextData?.updateCVData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!data) return null;

  const theme = themes[data.activeTheme];
  const customStyles = data.customStyles;

  // Apply custom styles as CSS variables
  const cssVars = useMemo(() => {
    if (!customStyles) return {};
    return {
      '--font-family': customStyles.typography.fontFamily,
      '--font-size-base': `${customStyles.typography.fontSize.base}px`,
      '--font-size-heading': `${customStyles.typography.fontSize.heading}px`,
      '--font-size-subheading': `${customStyles.typography.fontSize.subheading}px`,
      '--font-weight-normal': customStyles.typography.fontWeight.normal,
      '--font-weight-medium': customStyles.typography.fontWeight.medium,
      '--font-weight-bold': customStyles.typography.fontWeight.bold,
      '--color-primary': customStyles.colors.primary,
      '--color-secondary': customStyles.colors.secondary,
      '--color-accent': customStyles.colors.accent,
      '--color-background': customStyles.colors.background,
      '--color-text': customStyles.colors.text,
      '--color-text-secondary': customStyles.colors.textSecondary,
      '--section-spacing': `${customStyles.layout.sectionSpacing}px`,
      '--padding': `${customStyles.layout.padding}px`,
      '--border-radius': `${customStyles.layout.borderRadius}px`,
    } as React.CSSProperties;
  }, [customStyles]);

  const visibility = data.sectionConfig?.visibility || {
    basicInfo: true,
    summary: true,
    experiences: true,
    education: true,
    skills: true,
    projects: true,
  };

  const titles = data.sectionConfig?.titles || {
    summary: "Summary",
    experiences: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
  };

  const order = data.sectionConfig?.order || [
    "summary",
    "experiences",
    "education",
    "skills",
    "projects",
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnly) return; // Disable drag in read-only mode
    
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      const newOrder = arrayMove(order, oldIndex, newIndex);

      if (updateCVData) {
        updateCVData({
          ...data,
          sectionConfig: {
            ...data.sectionConfig,
            order: newOrder,
          },
        });
      }
    }
  };

  const renderContactInfo = () => {
    return (
      <div className="flex flex-wrap gap-3 mt-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {data.basicInfo.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <InlineEditableText
              value={data.basicInfo.location}
              onChange={(value) => updateField?.('basicInfo.location', value)}
            />
          </div>
        )}

        {data.basicInfo.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <InlineEditableText
              value={data.basicInfo.email}
              onChange={(value) => updateField?.('basicInfo.email', value)}
            />
          </div>
        )}

        {data.basicInfo.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <InlineEditableText
              value={data.basicInfo.phone}
              onChange={(value) => updateField?.('basicInfo.phone', value)}
            />
          </div>
        )}

        {data.basicInfo.website && (
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <InlineEditableText
              value={data.basicInfo.website}
              onChange={(value) => updateField?.('basicInfo.website', value)}
            />
          </div>
        )}

        {data.basicInfo.github && (
          <div className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            <InlineEditableText
              value={data.basicInfo.github}
              onChange={(value) => updateField?.('basicInfo.github', value)}
            />
          </div>
        )}

        {data.basicInfo.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="h-4 w-4" />
            <InlineEditableText
              value={data.basicInfo.linkedin}
              onChange={(value) => updateField?.('basicInfo.linkedin', value)}
            />
          </div>
        )}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <header className="mb-6">
        <InlineEditableText
          value={data.basicInfo.name}
          onChange={(value) => updateField?.('basicInfo.name', value)}
          as="h1"
          className={`${theme.headerStyle} ${theme.color}`}
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-heading)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}
        />
        <InlineEditableText
          value={data.basicInfo.role}
          onChange={(value) => updateField?.('basicInfo.role', value)}
          as="h2"
          className="text-lg font-medium mt-1"
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-subheading)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)',
          }}
        />
        {renderContactInfo()}
      </header>
    );
  };

  const renderSummarySection = () => {
    if (!data.summary.content || !visibility.summary) return null;

    return (
      <section key="summary" className="mb-6 animate-fade-in">
        <InlineEditableText
          value={titles.summary}
          onChange={(value) => {
            if (updateCVData) {
              updateCVData({
                ...data,
                sectionConfig: {
                  ...data.sectionConfig,
                  titles: { ...titles, summary: value },
                },
              });
            }
          }}
          as="h3"
          className={theme.sectionTitleStyle}
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-subheading)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}
        />
        <div className={theme.sectionContentStyle} style={{ marginTop: 'var(--section-spacing)' }}>
          <InlineEditableText
            value={data.summary.content}
            onChange={(value) => updateField?.('summary.content', value)}
            as="p"
            multiline
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      </section>
    );
  };

  const renderExperiencesSection = () => {
    if (data.experiences.length === 0 || !visibility.experiences) return null;

    return (
      <section key="experiences" className="mb-6 animate-fade-in">
        <InlineEditableText
          value={titles.experiences}
          onChange={(value) => {
            if (updateCVData) {
              updateCVData({
                ...data,
                sectionConfig: {
                  ...data.sectionConfig,
                  titles: { ...titles, experiences: value },
                },
              });
            }
          }}
          as="h3"
          className={theme.sectionTitleStyle}
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-subheading)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}
        />
        <div className={theme.sectionContentStyle} style={{ marginTop: 'var(--section-spacing)' }}>
          <div className="space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={exp.id} className="cv-experience">
                <div className="flex justify-between items-start">
                  <div>
                    <InlineEditableText
                      value={exp.role}
                      onChange={(value) => {
                        const newExperiences = [...data.experiences];
                        newExperiences[index] = { ...exp, role: value };
                        updateCVData?.({ ...data, experiences: newExperiences });
                      }}
                      className="font-semibold"
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text)',
                      }}
                    />
                    <InlineEditableText
                      value={exp.company}
                      onChange={(value) => {
                        const newExperiences = [...data.experiences];
                        newExperiences[index] = { ...exp, company: value };
                        updateCVData?.({ ...data, experiences: newExperiences });
                      }}
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--color-text-secondary)',
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>
                {exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span
                          dangerouslySetInnerHTML={{ __html: achievement }}
                          style={{
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderEducationSection = () => {
    if (data.education.length === 0 || !visibility.education) return null;

    return (
      <section key="education" className="mb-6 animate-fade-in">
        <InlineEditableText
          value={titles.education}
          onChange={(value) => {
            if (updateCVData) {
              updateCVData({
                ...data,
                sectionConfig: {
                  ...data.sectionConfig,
                  titles: { ...titles, education: value },
                },
              });
            }
          }}
          as="h3"
          className={theme.sectionTitleStyle}
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-subheading)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}
        />
        <div className={theme.sectionContentStyle} style={{ marginTop: 'var(--section-spacing)' }}>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={edu.id} className="cv-education">
                <div className="flex justify-between items-start">
                  <div>
                    <InlineEditableText
                      value={edu.degree}
                      onChange={(value) => {
                        const newEducation = [...data.education];
                        newEducation[index] = { ...edu, degree: value };
                        updateCVData?.({ ...data, education: newEducation });
                      }}
                      className="font-semibold"
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text)',
                      }}
                    />
                    <InlineEditableText
                      value={edu.institute}
                      onChange={(value) => {
                        const newEducation = [...data.education];
                        newEducation[index] = { ...edu, institute: value };
                        updateCVData?.({ ...data, education: newEducation });
                      }}
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--color-text-secondary)',
                      }}
                    />
                    {edu.location && (
                      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <InlineEditableText
                          value={edu.location}
                          onChange={(value) => {
                            const newEducation = [...data.education];
                            newEducation[index] = { ...edu, location: value };
                            updateCVData?.({ ...data, education: newEducation });
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {edu.startDate && (edu.current || edu.endDate) && (
                    <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderSkillsSection = () => {
    if (data.skills.length === 0 || !visibility.skills) return null;

    return (
      <section key="skills" className="mb-6 animate-fade-in">
        <InlineEditableText
          value={titles.skills}
          onChange={(value) => {
            if (updateCVData) {
              updateCVData({
                ...data,
                sectionConfig: {
                  ...data.sectionConfig,
                  titles: { ...titles, skills: value },
                },
              });
            }
          }}
          as="h3"
          className={theme.sectionTitleStyle}
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-subheading)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}
        />
        <div className={theme.sectionContentStyle} style={{ marginTop: 'var(--section-spacing)' }}>
          <div className="space-y-3">
            {data.skills.map((skill, index) => (
              <div key={skill.id} className="cv-skill">
                <InlineEditableText
                  value={skill.title}
                  onChange={(value) => {
                    const newSkills = [...data.skills];
                    newSkills[index] = { ...skill, title: value };
                    updateCVData?.({ ...data, skills: newSkills });
                  }}
                  as="h4"
                  className="font-medium"
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text)',
                  }}
                />
                <InlineEditableText
                  value={skill.details}
                  onChange={(value) => {
                    const newSkills = [...data.skills];
                    newSkills[index] = { ...skill, details: value };
                    updateCVData?.({ ...data, skills: newSkills });
                  }}
                  as="p"
                  className="text-sm mt-1"
                  multiline
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-text-secondary)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderProjectsSection = () => {
    if (data.projects.length === 0 || !visibility.projects) return null;

    return (
      <section key="projects" className="mb-6 animate-fade-in">
        <InlineEditableText
          value={titles.projects}
          onChange={(value) => {
            if (updateCVData) {
              updateCVData({
                ...data,
                sectionConfig: {
                  ...data.sectionConfig,
                  titles: { ...titles, projects: value },
                },
              });
            }
          }}
          as="h3"
          className={theme.sectionTitleStyle}
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-subheading)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}
        />
        <div className={theme.sectionContentStyle} style={{ marginTop: 'var(--section-spacing)' }}>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={project.id} className="cv-project">
                <div className="flex justify-between items-start">
                  <div>
                    <InlineEditableText
                      value={project.name}
                      onChange={(value) => {
                        const newProjects = [...data.projects];
                        newProjects[index] = { ...project, name: value };
                        updateCVData?.({ ...data, projects: newProjects });
                      }}
                      as="h4"
                      className="font-semibold"
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text)',
                      }}
                    />
                    {project.company && (
                      <InlineEditableText
                        value={project.company}
                        onChange={(value) => {
                          const newProjects = [...data.projects];
                          newProjects[index] = { ...project, company: value };
                          updateCVData?.({ ...data, projects: newProjects });
                        }}
                        style={{
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--font-size-base)',
                          color: 'var(--color-text-secondary)',
                        }}
                      />
                    )}
                  </div>
                </div>
                {project.details.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {project.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span
                          style={{
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)',
                          }}
                        >
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const sectionComponents = {
    summary: renderSummarySection,
    experiences: renderExperiencesSection,
    education: renderEducationSection,
    skills: renderSkillsSection,
    projects: renderProjectsSection,
  };

  const backgroundClass = theme.backgroundClass || "bg-white";
  const cardStyle = theme.cardStyle || "";
  const borderStyle = theme.borderStyle || "";

  return (
    <div
      id="cv-preview"
      style={{
        width: 794,
        minWidth: 794,
        ...cssVars,
        backgroundColor: 'var(--color-background)',
        padding: 'var(--padding)',
        borderRadius: 'var(--border-radius)',
      }}
      className={`paper ${theme.fontClass} ${theme.spacing} mx-auto overflow-auto transition-all duration-300 ease-in-out ${backgroundClass} ${cardStyle} ${borderStyle}`}
    >
      {renderHeader()}
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((sectionKey) => {
            const renderSection = sectionComponents[sectionKey];
            if (!renderSection) return null;
            
            return (
              <SortableSection key={sectionKey} id={sectionKey} readOnly={readOnly}>
                {renderSection()}
              </SortableSection>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
