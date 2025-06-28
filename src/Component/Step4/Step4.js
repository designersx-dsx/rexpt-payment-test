import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "../Step4/Step4.module.css";

const roles = [
  {
    title: "General Receptionist",
    description: "Ready to handle all Inbound calls",
    icon: "svg/general-receptionist.svg",
  },
  {
    title: "Inbound LEAD Qualifier",
    description: "Handle inbound sales queries",
    icon: "svg/sales receptionist.svg",
  },
];

const Step4 = forwardRef(
  (
    {
      onNext,
      onBack,
      onValidationError,
      loading,
      setLoading,
      detectRoleTypeChange,
    
   
    },
    ref
  ) => {
    const [agentNote, setAgentNote] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    // Load stored values
    useEffect(() => {
      const storedAgentRole = sessionStorage.getItem("agentRole");
      const storedNote = sessionStorage.getItem("agentNote");

      if (storedAgentRole) {
        setSelectedRole(storedAgentRole);
      }
      if (storedNote) {
        setAgentNote(storedNote);
      }
    }, []);

    // Persist on change
    useEffect(() => {
      sessionStorage.setItem("agentRole", selectedRole);
    }, [selectedRole]);

    useEffect(() => {
      sessionStorage.setItem("agentNote", agentNote);
    }, [agentNote]);

    // Pass validation and note back to parent
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!selectedRole?.trim()) {
          onValidationError?.({
            type: "failed",
            message: "Please select a Receptionist Type!",
          });
          return false;
        }
    
        return {
          isValid: true,
          agentNote: agentNote.trim(),
        };
        
      },
    }));
    // Block refresh and context menu
    // useEffect(() => {
    //   const blockKeyboardRefresh = (e) => {
    //     if (
    //       e.key === "F5" ||
    //       (e.ctrlKey && e.key === "r") ||
    //       (e.metaKey && e.key === "r")
    //     ) {
    //       e.preventDefault();
    //       e.stopPropagation();
    //     }
    //   };

    //   const blockMouseRefresh = (e) => {
    //     if (e.button === 1 || e.button === 2) {
    //       e.preventDefault();
    //     }
    //   };

    //   const handleBeforeUnload = (e) => {
    //     e.preventDefault();
    //     e.returnValue = "";
    //   };

    //   window.addEventListener("keydown", blockKeyboardRefresh);
    //   window.addEventListener("mousedown", blockMouseRefresh);
    //   window.addEventListener("beforeunload", handleBeforeUnload);
    //   window.addEventListener("contextmenu", (e) => e.preventDefault());

    //   return () => {
    //     window.removeEventListener("keydown", blockKeyboardRefresh);
    //     window.removeEventListener("mousedown", blockMouseRefresh);
    //     window.removeEventListener("beforeunload", handleBeforeUnload);
    //     window.removeEventListener("contextmenu", (e) => e.preventDefault());
    //   };
    // }, []);
    return (
      <div className={`${styles.container} ${loading ? styles.blocked : ""}`}>
        {roles.map((role, index) => (
          <label
            key={index}
            className={`${styles.card} ${selectedRole === role.title ? styles.selected : ""
              }`}
          >
            <div className={styles.iconBox}>
              <img src={role.icon} alt={role.title} className={styles.icon} />
            </div>
            <div className={styles.info}>
              <p className={styles.title}>{role.title}</p>
              <p className={styles.description}>{role.description}</p>
            </div>
            <input
              type="radio"
              name="receptionist"
              value={role.title}
              checked={selectedRole === role.title}
              onChange={() => {
                setSelectedRole(role.title);
                detectRoleTypeChange(role?.title);
              }}
              className={styles.radio}
            />
            <span className={styles.customRadio}></span>
          </label>
        ))}

        <div className={styles.noteCard}>
          <label htmlFor="agent-note" className={styles.noteTitle}>
            Additional Note for Your Agent
          </label>
          <textarea
            id="agent-note"
            placeholder="Note"
            value={agentNote}
            onChange={(e) => setAgentNote(e.target.value)}
            className={styles.noteTextarea}
            rows={2}
          />
        </div>
      </div>
    );
  }
);

export default Step4;
