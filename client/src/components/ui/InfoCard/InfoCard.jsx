// client/src/components/InfoCard.jsx
//-------- Start: Version V3.0.0---------//

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./InfoCard.css"; // We will create this next

const InfoCard = ({
  image,
  title,
  primaryStats,
  progress,
  details,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="info-card">
      {image && <img src={image} alt={title} className="info-card-image" />}
      <div className="info-card-content">
        <h3 className="info-card-title">{title}</h3>

        {primaryStats && (
          <div className="primary-stats">
            {primaryStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        )}

        {progress !== undefined && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* This is the special "Action Area" for other components */}
        <div className="action-area">{children}</div>

        {details && details.length > 0 && (
          <div className="details-expander">
            <button onClick={() => setIsExpanded(!isExpanded)}>
              <span>Show {isExpanded ? "Less" : "More"}</span>
              <ChevronDown size={16} className={isExpanded ? "expanded" : ""} />
            </button>
            {isExpanded && (
              <div className="details-content">
                {details.map((detail, index) => (
                  <div key={index} className="detail-line">
                    <span>{detail.label}:</span>
                    <strong>{detail.value}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
//-------- End: Version V3.0.0---------//
