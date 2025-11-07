import { CVData, ThemeType } from "@/lib/types";
import { themes } from "@/lib/themes";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Edit2,
  Check,
} from "lucide-react";

interface PreviewProps {
  data: CVData;
  onUpdate?: (updatedData: CVData) => void;
}

export function Preview({ data, onUpdate = () => {} }: PreviewProps) {
  const theme = themes[data.activeTheme];
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Function to handle clicking on an editable field
  const handleEditClick = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  // Function to save changes
  const handleSave = (field: string, section?: string, index?: number) => {
    const updatedData = { ...data };
    
    // Update the appropriate field based on the path
    if (section && index !== undefined) {
      // For array items like experiences, education, etc.
      const [mainField, subField] = field.split('.');
      updatedData[section][index][subField] = editValue;
    } else if (section) {
      // For nested objects like summary
      updatedData[section][field] = editValue;
    } else {
      // For basic info fields
      const [mainField, subField] = field.split('.');
      if (subField) {
        updatedData[mainField][subField] = editValue;
      }
    }
    
    onUpdate(updatedData);
    setEditingField(null);
  };

  // Editable text component
  const EditableText = ({ 
    value, 
    fieldName, 
    section, 
    index,
    className = "",
    isHeading = false
  }) => {
    const isEditing = editingField === (section && index !== undefined 
      ? `${section}.${index}.${fieldName}` 
      : section 
        ? `${section}.${fieldName}` 
        : fieldName);
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            autoFocus
          />
          <button 
            onClick={() => handleSave(fieldName, section, index)}
            className="text-green-500 hover:text-green-700"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div 
        className={`group relative cursor-pointer ${className}`}
        onClick={() => handleEditClick(
          section && index !== undefined 
            ? `${section}.${index}.${fieldName}` 
            : section 
              ? `${section}.${fieldName}` 
              : fieldName, 
          value
        )}
      >
        {isHeading ? (
          <h1 className={className}>{value}</h1>
        ) : (
          <span>{value}</span>
        )}
        <Edit2 className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 absolute -right-4 top-1/2 transform -translate-y-1/2" />
      </div>
    );
  };

  // Use section configuration if available, otherwise use defaults
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

  // Get background and card styles if they exist
  const backgroundClass = theme.backgroundClass || "bg-white";
  const cardStyle = theme.cardStyle || "";
  const borderStyle = theme.borderStyle || "";

  // Handle photo display
  const hasPhoto = !!data.basicInfo.photo;
  const imagePlacement = theme.imagePlacement || "left";
  const imageStyle = theme.imageStyle || "w-24 h-24 rounded-full";

  const renderPhotoHeader = () => {
    if (!hasPhoto) return null;

    if (imagePlacement === "left") {
      return (
        <div className="flex items-start gap-6 mb-6">
          <img
            src={data.basicInfo.photo}
            alt={data.basicInfo.name}
            className={imageStyle + " object-cover"}
          />
          <div className="flex-1">
            <h1 className={`${theme.headerStyle} ${theme.color}`}>
              {data.basicInfo.name}
            </h1>
            <h2 className="text-lg font-medium text-gray-700 mt-1">
              {data.basicInfo.role}
            </h2>
            {renderContactInfo()}
          </div>
        </div>
      );
    } else if (imagePlacement === "right") {
      return (
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-1">
            <h1 className={`${theme.headerStyle} ${theme.color}`}>
              {data.basicInfo.name}
            </h1>
            <h2 className="text-lg font-medium text-gray-700 mt-1">
              {data.basicInfo.role}
            </h2>
            {renderContactInfo()}
          </div>
          <img
            src={data.basicInfo.photo}
            alt={data.basicInfo.name}
            className={imageStyle + " object-cover"}
          />
        </div>
      );
    } else if (imagePlacement === "top" || imagePlacement === "center") {
      return (
        <div className="text-center mb-6">
          <img
            src={data.basicInfo.photo}
            alt={data.basicInfo.name}
            className={
              imageStyle +
              " object-cover " +
              (imagePlacement === "center" ? "mx-auto" : "")
            }
          />
          <h1 className={`${theme.headerStyle} ${theme.color} mt-4`}>
            {data.basicInfo.name}
          </h1>
          <h2 className="text-lg font-medium text-gray-700 mt-1">
            {data.basicInfo.role}
          </h2>
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600 justify-center">
            {renderContactItems()}
          </div>
        </div>
      );
    }
  };

  const renderContactItems = () => {
    return (
      <>
        {data.basicInfo.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{data.basicInfo.location}</span>
          </div>
        )}

        {data.basicInfo.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>{data.basicInfo.email}</span>
          </div>
        )}

        {data.basicInfo.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{data.basicInfo.phone}</span>
          </div>
        )}

        {data.basicInfo.website && (
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>{data.basicInfo.website}</span>
          </div>
        )}

        {data.basicInfo.github && (
          <div className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            <span>{data.basicInfo.github}</span>
          </div>
        )}

        {data.basicInfo.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="h-4 w-4" />
            <span>{data.basicInfo.linkedin}</span>
          </div>
        )}
      </>
    );
  };

  const renderContactInfo = () => {
    return (
      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
        {data.basicInfo.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <EditableText
              value={data.basicInfo.location}
              fieldName="location"
              section="basicInfo"
            />
          </div>
        )}

        {data.basicInfo.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <EditableText
              value={data.basicInfo.email}
              fieldName="email"
              section="basicInfo"
            />
          </div>
        )}

        {data.basicInfo.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <EditableText
              value={data.basicInfo.phone}
              fieldName="phone"
              section="basicInfo"
            />
          </div>
        )}

        {data.basicInfo.website && (
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <EditableText
              value={data.basicInfo.website}
              fieldName="website"
              section="basicInfo"
            />
          </div>
        )}

        {data.basicInfo.github && (
          <div className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            <EditableText
              value={data.basicInfo.github}
              fieldName="github"
              section="basicInfo"
            />
          </div>
        )}

        {data.basicInfo.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="h-4 w-4" />
            <EditableText
              value={data.basicInfo.linkedin}
              fieldName="linkedin"
              section="basicInfo"
            />
          </div>
        )}
      </div>
    );
  };

  const renderStandardHeader = () => {
    return (
      <header className="mb-6">
        <EditableText
          value={data.basicInfo.name}
          fieldName="basicInfo.name"
          className={`${theme.headerStyle} ${theme.color}`}
          isHeading={true}
        />
        <EditableText
          value={data.basicInfo.role}
          fieldName="basicInfo.role"
          className="text-lg font-medium text-gray-700 mt-1"
        />
        {renderContactInfo()}
      </header>
    );
  };

  // Map over the ordered sections and render each visible section
  const renderSections = () => {
    return order.map((sectionKey) => {
      if (!visibility[sectionKey]) {
        return null;
      }

      if (
        sectionKey &&
        !["summary", "experiences", "education", "skills", "projects"].includes(
          sectionKey
        )
      ) {
        return renderGeneralSection(sectionKey);
      }

      switch (sectionKey) {
        case "summary":
          return renderSummarySection();
        case "experiences":
          return renderExperiencesSection();
        case "education":
          return renderEducationSection();
        case "skills":
          return renderSkillsSection();
        case "projects":
          return renderProjectsSection();
        default:
          return null;
      }
    });
  };

  const renderSummarySection = () => {
    if (!data.summary.content || !visibility.summary) return null;

    return (
      <section key="summary" className="mb-6 animate-fade-in">
        <h3 className={theme.sectionTitleStyle}>{titles.summary}</h3>
        <div className={theme.sectionContentStyle}>
          <p>
            <EditableText
              value={data.summary.content}
              fieldName="content"
              section="summary"
            />
          </p>
        </div>
      </section>
    );
  };

  const renderExperiencesSection = () => {
    if (data.experiences.length === 0 || !visibility.experiences) return null;

    return (
      <section key="experiences" className="mb-6 animate-fade-in">
        <h3 className={theme.sectionTitleStyle}>{titles.experiences}</h3>
        <div className={theme.sectionContentStyle}>
          <div className="space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={exp.id} className="cv-experience">
                <div className="flex justify-between items-start">
                  <div>
                    <EditableText
                      value={exp.role}
                      fieldName="role"
                      section="experiences"
                      index={index}
                      className="font-semibold"
                    />
                    <EditableText
                      value={exp.company}
                      fieldName="company"
                      section="experiences"
                      index={index}
                      className="text-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>
                      <EditableText
                        value={formatDate(exp.startDate)}
                        fieldName="startDate"
                        section="experiences"
                        index={index}
                      /> - {" "}
                      {exp.current ? "Present" : (
                        <EditableText
                          value={formatDate(exp.endDate)}
                          fieldName="endDate"
                          section="experiences"
                          index={index}
                        />
                      )}
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
        <h3 className={theme.sectionTitleStyle}>{titles.education}</h3>
        <div className={theme.sectionContentStyle}>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={edu.id} className="cv-education">
                <div className="flex justify-between items-start">
                  <div>
                    <EditableText
                      value={edu.degree}
                      fieldName="degree"
                      section="education"
                      index={index}
                      className="font-semibold"
                    />
                    <EditableText
                      value={edu.institute}
                      fieldName="institute"
                      section="education"
                      index={index}
                      className="text-gray-700"
                    />
                    {edu.location && (
                      <div className="text-sm text-gray-600">
                        <EditableText
                          value={edu.location}
                          fieldName="location"
                          section="education"
                          index={index}
                        />
                      </div>
                    )}
                  </div>
                  {edu.startDate && (edu.current || edu.endDate) && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>
                        <EditableText
                          value={formatDate(edu.startDate)}
                          fieldName="startDate"
                          section="education"
                          index={index}
                        /> - {" "}
                        {edu.current ? "Present" : (
                          <EditableText
                            value={formatDate(edu.endDate)}
                            fieldName="endDate"
                            section="education"
                            index={index}
                          />
                        )}
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
        <h3 className={theme.sectionTitleStyle}>{titles.skills}</h3>
        <div className={theme.sectionContentStyle}>
          <div className="space-y-3">
            {data.skills.map((skill) => (
              <div key={skill.id} className="cv-skill">
                <h4 className="font-medium">{skill.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{skill.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderGeneralSection = (key: string) => {
    if (data[key].length === 0 || !visibility[key]) return null;

    return (
      <section key={key} className="mb-6 animate-fade-in">
        <h3 className={theme.sectionTitleStyle}>{titles[key]}</h3>
        <div className={theme.sectionContentStyle}>
          <div className="space-y-3">
            {data[key].map((item) => (
              <div key={item.id} className="cv-skill">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{item.details}</p>
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
        <h3 className={theme.sectionTitleStyle}>{titles.projects}</h3>
        <div className={theme.sectionContentStyle}>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="cv-project">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{project.name}</h4>
                    {project.company && (
                      <div className="text-gray-700">{project.company}</div>
                    )}
                  </div>
                </div>
                {project.details.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {project.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{detail}</span>
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

  return (
    <div
      id="cv-preview"
      style={{ width: 794, minWidth: 794 }}
      className={`paper ${theme.fontClass} ${theme.spacing} mx-auto overflow-auto transition-all duration-300 ease-in-out ${backgroundClass} ${cardStyle} ${borderStyle}`}
    >
      {hasPhoto ? renderPhotoHeader() : renderStandardHeader()}
      {renderSections()}
    </div>
  );
}
