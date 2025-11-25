import  { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import EditableField from "./UI/EditableField";
import { showToast } from "../utils/Toast";

const QrCard = ({ card, isUser = false, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCard, setEditableCard] = useState({ ...card });

  const buttons = [
    { 
      condition: onEdit, 
      onClick: () => setIsEditing(!isEditing), 
      icon: Pencil,  
      label: isEditing ? "Cancel" : "Edit" 
    },
    { 
      condition: onDelete, 
      onClick: () => onDelete(card.id), 
      icon: Trash2, 
      label: "Delete" 
    }
  ];

  const infoItems = [
    { label: "SSID", key: "ssid" },
    { label: "Pass", key: "password" },
    { label: "Encp", key: "encryption" }
  ];

  const handleSaveField = (key, value) => {
    const updatedCard = { ...editableCard, [key]: value };
    setEditableCard(updatedCard);
    onEdit?.(updatedCard); 
    showToast({ message: `${key.toUpperCase()} updated!`, success: true });
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 border border-[var(--color-border)] rounded-xl gap-4 w-full items-center text-[var(--color-text)]">
      <div>
        {editableCard.qr_url ? (
          <img src={editableCard.qr_url} alt={editableCard.title} className="object-contain rounded-lg" />
        ) : (
          <p>No QR</p>
        )}
      </div>

      <div className="flex-1">
        {isEditing ? (
          <EditableField
            label="Title"
            value={editableCard.title}
            onSave={(val) => handleSaveField("title", val)}
          />
        ) : (
          <h3 className="font-bold text-lg mb-3">{editableCard.title}</h3>
        )}

        <div className="space-y-2">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs font-medium rounded bg-[var(--color-accentbg)] px-2 py-1">
                {item.label}:
              </span>
              <span className="text-sm ml-4">
                {isEditing ? (
                  <EditableField
                    value={editableCard[item.key]}
                    onSave={(val) => handleSaveField(item.key, val)}
                    placeholder={`Enter ${item.label}`}
                  />
                ) : (
                  editableCard[item.key] || "None"
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isUser && (
        <div className="flex gap-4 lg:ml-auto">
          {buttons.map((button, index) => 
            button.condition && (
              <button 
                key={index}
                onClick={button.onClick} 
                className="btn-ghost text-xs p-0 flex items-center gap-1"
              >
                <button.icon size={16} /> {button.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default QrCard;
