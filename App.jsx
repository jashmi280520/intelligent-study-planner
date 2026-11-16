import { useEffect, useMemo, useState } from "react";
import "./App.css";

/* =========================================================
   STUDYWISE AI
   Intelligent Study Planner & Progress Tracker
   ========================================================= */

const today = new Date();

const getDateString = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (dateString, days) => {
  const d = new Date(`${dateString}T00:00:00`);
  d.setDate(d.getDate() + days);
  return getDateString(d);
};

const formatDate = (dateString) => {
  if (!dateString) return "Not set";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

const daysUntil = (dateString) => {
  if (!dateString) return null;

  const target = new Date(`${dateString}T00:00:00`);
  const current = new Date(`${getDateString()}T00:00:00`);

  return Math.ceil(
    (target.getTime() - current.getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

const priorityValue = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const priorityColor = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

const difficultyValue = {
  Hard: 3,
  Medium: 2,
  Easy: 1,
};

const initialSubjects = [
  {
    id: 1,
    name: "DBMS",
    progress: 62,
    examDate: "2026-10-18",
    topics: [
      {
        id: 101,
        name: "Normalization",
        difficulty: "Hard",
        deadline: "2026-10-12",
        completed: false,
      },
      {
        id: 102,
        name: "SQL",
        difficulty: "Medium",
        deadline: "2026-10-14",
        completed: true,
      },
    ],
  },
  {
    id: 2,
    name: "Artificial Intelligence",
    progress: 81,
    examDate: "",
    topics: [
      {
        id: 201,
        name: "Classification",
        difficulty: "Medium",
        deadline: "2026-10-15",
        completed: false,
      },
    ],
  },
  {
    id: 3,
    name: "Java",
    progress: 74,
    examDate: "",
    topics: [
      {
        id: 301,
        name: "OOP Revision",
        difficulty: "Medium",
        deadline: "2026-10-16",
        completed: true,
      },
    ],
  },
  {
    id: 4,
    name: "Operating Systems",
    progress: 69,
    examDate: "",
    topics: [
      {
        id: 401,
        name: "Process Management",
        difficulty: "Hard",
        deadline: "2026-10-17",
        completed: false,
      },
    ],
  },
];

const initialTasks = [
  {
    id: 1,
    name: "DBMS – Normalization",
    subject: "DBMS",
    duration: "1 hour",
    priority: "High",
    difficulty: "Hard",
    time: "09:00 AM",
    date: getDateString(),
    completed: false,
    missed: false,
  },
  {
    id: 2,
    name: "AI – Classification",
    subject: "Artificial Intelligence",
    duration: "45 minutes",
    priority: "Medium",
    difficulty: "Medium",
    time: "11:00 AM",
    date: getDateString(),
    completed: false,
    missed: false,
  },
  {
    id: 3,
    name: "Java – Revision",
    subject: "Java",
    duration: "30 minutes",
    priority: "Low",
    difficulty: "Easy",
    time: "03:00 PM",
    date: getDateString(),
    completed: true,
    missed: false,
  },
  {
    id: 4,
    name: "Operating Systems",
    subject: "Operating Systems",
    duration: "1 hour",
    priority: "Medium",
    difficulty: "Hard",
    time: "06:00 PM",
    date: getDateString(),
    completed: false,
    missed: false,
  },
];

const initialExams = [
  {
    id: 1,
    subject: "Database Management",
    date: "2026-10-18",
  },
];

const initialAssignments = [
  {
    id: 1,
    title: "DBMS Assignment",
    subject: "DBMS",
    deadline: "2026-10-13",
    priority: "High",
    completed: false,
  },
];

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  /* =========================================================
     LOGIN
     ========================================================= */

  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const [activePage, setActivePage] = useState("Dashboard");

  /* =========================================================
     MAIN DATA
     ========================================================= */

  const [subjects, setSubjects] = useState(() =>
    loadData("studywise_subjects_v3", initialSubjects)
  );

  const [tasks, setTasks] = useState(() =>
    loadData("studywise_tasks_v3", initialTasks)
  );

  const [exams, setExams] = useState(() =>
    loadData("studywise_exams_v3", initialExams)
  );

  const [assignments, setAssignments] = useState(() =>
    loadData(
      "studywise_assignments_v3",
      initialAssignments
    )
  );

  /* =========================================================
     SETTINGS
     ========================================================= */

  const [studyHours, setStudyHours] = useState(() =>
    loadData("studywise_hours_v3", 4)
  );

  const [studyTime, setStudyTime] = useState(() =>
    loadData("studywise_time_v3", "Morning")
  );

  /* =========================================================
     MODALS
     ========================================================= */

  const [showSubjectModal, setShowSubjectModal] =
    useState(false);

  const [showTopicModal, setShowTopicModal] =
    useState(false);

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [showExamModal, setShowExamModal] =
    useState(false);

  const [showAssignmentModal, setShowAssignmentModal] =
    useState(false);

  const [showPlanModal, setShowPlanModal] =
    useState(false);

  const [showAiModal, setShowAiModal] =
    useState(false);

  /* =========================================================
     FORMS
     ========================================================= */

  const [newSubjectName, setNewSubjectName] =
    useState("");

  const [newSubjectProgress, setNewSubjectProgress] =
    useState("0");

  const [newSubjectExamDate, setNewSubjectExamDate] =
    useState("");

  const [selectedTopicSubject, setSelectedTopicSubject] =
    useState("");

  const [newTopicName, setNewTopicName] =
    useState("");

  const [newTopicDifficulty, setNewTopicDifficulty] =
    useState("Medium");

  const [newTopicDeadline, setNewTopicDeadline] =
    useState("");

  const [newTaskName, setNewTaskName] =
    useState("");

  const [newTaskSubject, setNewTaskSubject] =
    useState("");

  const [newTaskDuration, setNewTaskDuration] =
    useState("30 minutes");

  const [newTaskPriority, setNewTaskPriority] =
    useState("Medium");

  const [newTaskDifficulty, setNewTaskDifficulty] =
    useState("Medium");

  const [newTaskTime, setNewTaskTime] =
    useState("07:00 PM");

  const [newTaskDate, setNewTaskDate] =
    useState(getDateString());

  const [newExamSubject, setNewExamSubject] =
    useState("");

  const [newExamDate, setNewExamDate] =
    useState("");

  const [newAssignmentTitle, setNewAssignmentTitle] =
    useState("");

  const [newAssignmentSubject, setNewAssignmentSubject] =
    useState("");

  const [newAssignmentDeadline, setNewAssignmentDeadline] =
    useState("");

  const [newAssignmentPriority, setNewAssignmentPriority] =
    useState("Medium");

  /* =========================================================
     AI
     ========================================================= */

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  /* =========================================================
     LOCAL STORAGE
     ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "studywise_subjects_v3",
      JSON.stringify(subjects)
    );
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(
      "studywise_tasks_v3",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "studywise_exams_v3",
      JSON.stringify(exams)
    );
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(
      "studywise_assignments_v3",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(
      "studywise_hours_v3",
      JSON.stringify(studyHours)
    );

    localStorage.setItem(
      "studywise_time_v3",
      JSON.stringify(studyTime)
    );
  }, [studyHours, studyTime]);

  /* =========================================================
     CALCULATIONS
     ========================================================= */

  const overallProgress =
    subjects.length === 0
      ? 0
      : Math.round(
          subjects.reduce(
            (sum, subject) =>
              sum + Number(subject.progress || 0),
            0
          ) / subjects.length
        );

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedTopics = subjects.reduce(
    (sum, subject) =>
      sum +
      subject.topics.filter(
        (topic) => topic.completed
      ).length,
    0
  );

  const totalTopics = subjects.reduce(
    (sum, subject) =>
      sum + subject.topics.length,
    0
  );

  const pendingTopics = subjects.reduce(
    (all, subject) => [
      ...all,
      ...subject.topics
        .filter((topic) => !topic.completed)
        .map((topic) => ({
          ...topic,
          subject: subject.name,
        })),
    ],
    []
  );

  const completedAssignments =
    assignments.filter(
      (assignment) => assignment.completed
    ).length;

  /* =========================================================
     UPCOMING EXAM
     ========================================================= */

  const upcomingExam = useMemo(() => {
    const current = getDateString();

    const future = exams
      .filter((exam) => exam.date >= current)
      .sort((a, b) =>
        a.date.localeCompare(b.date)
      );

    return future[0] || exams[0] || null;
  }, [exams]);

  const examDays = upcomingExam
    ? daysUntil(upcomingExam.date)
    : null;

  /* =========================================================
     UPCOMING ASSIGNMENTS
     ========================================================= */

  const upcomingAssignments = useMemo(() => {
    return [...assignments]
      .filter((a) => !a.completed)
      .sort((a, b) =>
        a.deadline.localeCompare(b.deadline)
      );
  }, [assignments]);

  /* =========================================================
     WEAK SUBJECT
     ========================================================= */

  const weakestSubject = useMemo(() => {
    if (!subjects.length) return null;

    return [...subjects].sort(
      (a, b) => a.progress - b.progress
    )[0];
  }, [subjects]);

  /* =========================================================
     PREDICTED PROGRESS
     ========================================================= */

  const predictedProgress = Math.min(
    100,
    Math.round(
      overallProgress +
        completedTasks * 2 +
        completedTopics * 1.5
    )
  );

  /* =========================================================
     LOGIN
     ========================================================= */

  const handleLogin = () => {
    if (!email.trim() || !password) {
      alert("Please enter your email and password.");
      return;
    }

    const savedUser = loadData("studywise_user_v3", null);

    if (!savedUser) {
      alert("No account found. Please register first.");
      setAuthMode("register");
      return;
    }

    if (savedUser.email !== email.trim().toLowerCase() || savedUser.password !== password) {
      alert("Invalid email or password.");
      return;
    }

    setLoggedIn(true);
    setShowLogin(false);
    setConfirmPassword("");
  };

  const handleRegister = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password || !confirmPassword) {
      alert("Please fill all registration fields.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const savedUser = loadData("studywise_user_v3", null);

    if (savedUser && savedUser.email === cleanEmail) {
      alert("An account with this email already exists. Please login.");
      setAuthMode("login");
      return;
    }

    localStorage.setItem(
      "studywise_user_v3",
      JSON.stringify({ email: cleanEmail, password })
    );

    alert("Registration successful! You can now login. 🎉");
    setAuthMode("login");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setActivePage("Dashboard");
  };

  /* =========================================================
     ADD SUBJECT
     ========================================================= */

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      alert("Enter a subject name.");
      return;
    }

    const progress = Number(newSubjectProgress);

    if (progress < 0 || progress > 100) {
      alert("Progress must be between 0 and 100.");
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: newSubjectName.trim(),
      progress,
      examDate: newSubjectExamDate,
      topics: [],
    };

    setSubjects([...subjects, newSubject]);

    setNewSubjectName("");
    setNewSubjectProgress("0");
    setNewSubjectExamDate("");
    setShowSubjectModal(false);

    alert("Subject added successfully! 🎉");
  };

  /* =========================================================
     ADD TOPIC
     ========================================================= */

  const handleAddTopic = () => {
    if (!selectedTopicSubject) {
      alert("Select a subject.");
      return;
    }

    if (!newTopicName.trim()) {
      alert("Enter topic name.");
      return;
    }

    setSubjects(
      subjects.map((subject) => {
        if (subject.name !== selectedTopicSubject) {
          return subject;
        }

        return {
          ...subject,
          topics: [
            ...subject.topics,
            {
              id: Date.now(),
              name: newTopicName.trim(),
              difficulty: newTopicDifficulty,
              deadline: newTopicDeadline,
              completed: false,
            },
          ],
        };
      })
    );

    setNewTopicName("");
    setNewTopicDifficulty("Medium");
    setNewTopicDeadline("");
    setSelectedTopicSubject("");
    setShowTopicModal(false);

    alert("Topic added successfully! 📚");
  };

  /* =========================================================
     COMPLETE TOPIC
     ========================================================= */

  const toggleTopic = (
    subjectId,
    topicId
  ) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id !== subjectId) {
          return subject;
        }

        const updatedTopics =
          subject.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  completed:
                    !topic.completed,
                }
              : topic
          );

        const completedCount =
          updatedTopics.filter(
            (topic) => topic.completed
          ).length;

        const calculatedProgress =
          updatedTopics.length > 0
            ? Math.round(
                (completedCount /
                  updatedTopics.length) *
                  100
              )
            : subject.progress;

        return {
          ...subject,
          topics: updatedTopics,
          progress: Math.max(
            subject.progress,
            calculatedProgress
          ),
        };
      })
    );
  };

  /* =========================================================
     ADD TASK
     ========================================================= */

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      alert("Enter task name.");
      return;
    }

    if (!newTaskSubject) {
      alert("Select a subject.");
      return;
    }

    const task = {
      id: Date.now(),
      name: newTaskName.trim(),
      subject: newTaskSubject,
      duration: newTaskDuration,
      priority: newTaskPriority,
      difficulty: newTaskDifficulty,
      time: newTaskTime,
      date: newTaskDate,
      completed: false,
      missed: false,
    };

    setTasks([...tasks, task]);

    setNewTaskName("");
    setNewTaskSubject("");
    setNewTaskDuration("30 minutes");
    setNewTaskPriority("Medium");
    setNewTaskDifficulty("Medium");
    setNewTaskTime("07:00 PM");
    setNewTaskDate(getDateString());

    setShowTaskModal(false);

    alert("Task added successfully! 📝");
  };

  /* =========================================================
     COMPLETE TASK
     ========================================================= */

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              missed: false,
            }
          : task
      )
    );
  };

  /* =========================================================
     MARK MISSED
     ========================================================= */

  const markTaskMissed = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              missed: true,
              completed: false,
            }
          : task
      )
    );

    alert(
      "Task marked as missed. You can now use Auto Reschedule."
    );
  };

  /* =========================================================
     AUTO RESCHEDULE
     ========================================================= */

  const autoReschedule = () => {
    const incompleteTasks = tasks.filter(
      (task) =>
        !task.completed &&
        (task.missed || task.date < getDateString())
    );

    if (incompleteTasks.length === 0) {
      alert(
        "No missed tasks found. Your schedule is already on track! 🎉"
      );
      return;
    }

    const timeSlots = [
      "08:00 AM",
      "09:30 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM",
      "06:00 PM",
      "08:00 PM",
    ];

    let slotIndex = 0;

    const updated = tasks.map((task) => {
      if (
        !task.completed &&
        (task.missed ||
          task.date < getDateString())
      ) {
        const newTask = {
          ...task,
          date: addDays(getDateString(), 1),
          time:
            timeSlots[
              slotIndex % timeSlots.length
            ],
          missed: false,
        };

        slotIndex++;

        return newTask;
      }

      return task;
    });

    setTasks(updated);

    alert(
      `${incompleteTasks.length} missed task(s) automatically rescheduled for tomorrow. 🔄`
    );
  };

  /* =========================================================
     SMART PLAN GENERATOR
     ========================================================= */

  const generateSmartPlan = () => {
    if (!subjects.length) {
      alert("Add subjects first.");
      return;
    }

    const timeSlots = [
      "08:00 AM",
      "09:30 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM",
      "06:00 PM",
      "08:00 PM",
    ];

    const rankedSubjects = [...subjects].sort(
      (a, b) => {
        const scoreA =
          (100 - a.progress) +
          (a.examDate
            ? Math.max(
                0,
                30 -
                  Math.max(
                    0,
                    daysUntil(a.examDate) || 0
                  )
              )
            : 0);

        const scoreB =
          (100 - b.progress) +
          (b.examDate
            ? Math.max(
                0,
                30 -
                  Math.max(
                    0,
                    daysUntil(b.examDate) || 0
                  )
              )
            : 0);

        return scoreB - scoreA;
      }
    );

    const generated = rankedSubjects
      .slice(0, timeSlots.length)
      .map((subject, index) => {
        const pendingSubjectTopics =
          subject.topics.filter(
            (topic) => !topic.completed
          );

        const hardestTopic =
          [...pendingSubjectTopics].sort(
            (a, b) =>
              difficultyValue[b.difficulty] -
              difficultyValue[a.difficulty]
          )[0];

        const taskName = hardestTopic
          ? `${subject.name} – ${hardestTopic.name}`
          : `${subject.name} – Focus Revision`;

        return {
          id: Date.now() + index,
          name: taskName,
          subject: subject.name,
          duration:
            subject.progress < 50
              ? "1 hour"
              : "45 minutes",
          priority:
            subject.progress < 50
              ? "High"
              : subject.progress < 75
              ? "Medium"
              : "Low",
          difficulty:
            hardestTopic?.difficulty ||
            "Medium",
          time:
            timeSlots[index],
          date: getDateString(),
          completed: false,
          missed: false,
        };
      });

    const oldCompleted = tasks.filter(
      (task) => task.completed
    );

    setTasks([
      ...oldCompleted,
      ...generated,
    ]);

    setShowPlanModal(false);

    setActivePage("Study Planner");

    alert(
      "AI Smart Plan generated using progress, difficulty and deadlines! 🤖📅"
    );
  };

  /* =========================================================
     ADD EXAM
     ========================================================= */

  const handleAddExam = () => {
    if (!newExamSubject || !newExamDate) {
      alert("Enter exam subject and date.");
      return;
    }

    const newExam = {
      id: Date.now(),
      subject: newExamSubject,
      date: newExamDate,
    };

    setExams([...exams, newExam]);

    setNewExamSubject("");
    setNewExamDate("");
    setShowExamModal(false);

    alert("Exam added successfully! 📅");
  };

  /* =========================================================
     ADD ASSIGNMENT
     ========================================================= */

  const handleAddAssignment = () => {
    if (
      !newAssignmentTitle.trim() ||
      !newAssignmentSubject ||
      !newAssignmentDeadline
    ) {
      alert(
        "Enter assignment title, subject and deadline."
      );
      return;
    }

    const assignment = {
      id: Date.now(),
      title: newAssignmentTitle.trim(),
      subject: newAssignmentSubject,
      deadline: newAssignmentDeadline,
      priority: newAssignmentPriority,
      completed: false,
    };

    setAssignments([
      ...assignments,
      assignment,
    ]);

    setNewAssignmentTitle("");
    setNewAssignmentSubject("");
    setNewAssignmentDeadline("");
    setNewAssignmentPriority("Medium");
    setShowAssignmentModal(false);

    alert("Assignment added successfully! 📚");
  };

  /* =========================================================
     COMPLETE ASSIGNMENT
     ========================================================= */

  const toggleAssignment = (id) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              completed:
                !assignment.completed,
            }
          : assignment
      )
    );
  };

  /* =========================================================
     AI COACH
     ========================================================= */

  const askAiCoach = () => {
    if (!weakestSubject) {
      setAiAnswer(
        "Add a subject first so I can personalize your recommendation."
      );
      return;
    }

    const weak = weakestSubject;
    const pending = weak.topics.filter(
      (topic) => !topic.completed
    );

    const hardest = [...pending].sort(
      (a, b) =>
        difficultyValue[b.difficulty] -
        difficultyValue[a.difficulty]
    )[0];

    const examInfo = weak.examDate
      ? ` Your exam is on ${formatDate(
          weak.examDate
        )}.`
      : "";

    if (
      aiQuestion.toLowerCase().includes("plan")
    ) {
      setAiAnswer(
        `I recommend focusing on ${weak.name} first because your progress is ${weak.progress}%. ${
          hardest
            ? `Start with the ${hardest.difficulty.toLowerCase()} topic "${hardest.name}".`
            : "Start with revision and practice questions."
        }${examInfo}`
      );
    } else if (
      aiQuestion.toLowerCase().includes("exam")
    ) {
      setAiAnswer(
        `Prioritize ${weak.name}. Spend ${
          studyHours >= 4 ? "at least 1 hour" : "45 minutes"
        } on it and revise the most difficult topics first.${examInfo}`
      );
    } else if (
      aiQuestion.toLowerCase().includes("time")
    ) {
      setAiAnswer(
        `You have ${studyHours} study hours per day. Try 45-minute focused sessions with 10-minute breaks. Give extra time to ${weak.name}.`
      );
    } else {
      setAiAnswer(
        `Your current weakest subject is ${weak.name} at ${weak.progress}%. ${
          hardest
            ? `I suggest studying "${hardest.name}" first because it is marked ${hardest.difficulty}.`
            : "Add more topics to get more detailed recommendations."
        }`
      );
    }
  };

  /* =========================================================
     RESET DATA
     ========================================================= */

  const resetData = () => {
    const confirmed = window.confirm(
      "Reset all StudyWise demo data?"
    );

    if (!confirmed) return;

    setSubjects(initialSubjects);
    setTasks(initialTasks);
    setExams(initialExams);
    setAssignments(initialAssignments);
    setStudyHours(4);
    setStudyTime("Morning");

    alert("Demo data restored.");
  };

  /* =========================================================
     STYLES
     ========================================================= */

  const inputStyle = {
    width: "100%",
    padding: "13px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    textAlign: "left",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "14px",
  };

  const actionButton = {
    border: "none",
    borderRadius: "10px",
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: "600",
  };

  /* =========================================================
     CALENDAR
     ========================================================= */

  const calendarDays = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date();
      date.setDate(
        date.getDate() + index
      );

      return {
        date: getDateString(date),
        label: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),
        number: date.getDate(),
      };
    }
  );

  /* =========================================================
     LOGIN PAGE
     ========================================================= */

  if (!loggedIn) {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">

            <div className="logo-icon">
              S
            </div>

            <span>
              StudyWise <b>AI</b>
            </span>

          </div>

          <div className="nav-links">

            <a href="#features">
              Features
            </a>

            <a href="#how">
              How It Works
            </a>

            <button
              className="login-btn"
              onClick={() => {
                setAuthMode("login");
                setShowLogin(true);
              }}
            >
              Login
            </button>

            <button
              className="signup-btn"
              onClick={() => {
                setAuthMode("register");
                setShowLogin(true);
              }}
            >
              Get Started
            </button>

          </div>

        </nav>


        <main className="hero">

          <div className="hero-content">

            <div className="badge">
              ✨ AI-Powered Study Planning
            </div>

            <h1>
              Plan Smart.
              <br />
              <span>Study Better.</span>
              <br />
              Achieve More.
            </h1>

            <p>
              Your intelligent study companion that
              creates personalized study plans, tracks
              your progress, manages deadlines and
              helps you stay ahead of every exam.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={() =>
                  setShowLogin(true)
                }
              >
                Start Planning →
              </button>

              <a
                href="#how"
                className="secondary-btn"
              >
                See How It Works
              </a>

            </div>

            <div className="trust">

              <span>
                ✓ Personalized Plans
              </span>

              <span>
                ✓ Smart Scheduling
              </span>

              <span>
                ✓ Progress Tracking
              </span>

            </div>

          </div>


          <div className="hero-card">

            <div className="card-header">

              <div>
                <small>
                  Good Morning 👋
                </small>

                <h3>
                  Your Study Overview
                </h3>
              </div>

              <div className="avatar">
                S
              </div>

            </div>


            <div className="progress-card">

              <div>
                <small>
                  Overall Progress
                </small>

                <h2>
                  78%
                </h2>
              </div>

              <div className="progress-circle">
                78%
              </div>

            </div>


            <div className="task-title">
              Today's Smart Plan
            </div>


            <div className="task">

              <div className="task-icon red">
                D
              </div>

              <div>
                <strong>
                  DBMS – Normalization
                </strong>

                <small>
                  1 hour · High Priority
                </small>
              </div>

              <span>
                →
              </span>

            </div>


            <div className="task">

              <div className="task-icon orange">
                A
              </div>

              <div>
                <strong>
                  AI – Classification
                </strong>

                <small>
                  45 min · Medium Priority
                </small>
              </div>

              <span>
                →
              </span>

            </div>


            <div className="task">

              <div className="task-icon green">
                J
              </div>

              <div>
                <strong>
                  Java – Revision
                </strong>

                <small>
                  30 min · Low Priority
                </small>
              </div>

              <span>
                ✓
              </span>

            </div>


            <div className="ai-tip">

              <span>
                🤖
              </span>

              <div>

                <strong>
                  AI Suggestion
                </strong>

                <p>
                  Focus on weaker subjects and
                  upcoming deadlines.
                </p>

              </div>

            </div>

          </div>

        </main>


        <section
          className="features"
          id="features"
        >

          <div className="section-title">

            <span>
              POWERFUL FEATURES
            </span>

            <h2>
              Everything you need to study smarter
            </h2>

            <p>
              StudyWise AI turns your academic
              workload into a clear plan.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature">
              <div className="feature-icon">
                🤖
              </div>

              <h3>
                AI Study Plans
              </h3>

              <p>
                Personalized schedules based on
                progress, difficulty and deadlines.
              </p>
            </div>


            <div className="feature">
              <div className="feature-icon">
                📅
              </div>

              <h3>
                Smart Scheduling
              </h3>

              <p>
                Automatically prioritize important
                topics and upcoming exams.
              </p>
            </div>


            <div className="feature">
              <div className="feature-icon">
                📊
              </div>

              <h3>
                Progress Tracking
              </h3>

              <p>
                Track subject and topic progress
                in one dashboard.
              </p>
            </div>


            <div className="feature">
              <div className="feature-icon">
                🔄
              </div>

              <h3>
                Auto Rescheduling
              </h3>

              <p>
                Missed tasks can automatically move
                to the next available study slot.
              </p>
            </div>

          </div>

        </section>


        <section
          className="how-section"
          id="how"
        >

          <div className="section-title">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              Your smarter study journey
            </h2>

          </div>


          <div className="steps">

            <div className="step">
              <div className="step-number">
                01
              </div>

              <h3>
                Add Subjects
              </h3>

              <p>
                Add subjects and topics.
              </p>
            </div>


            <div className="step">
              <div className="step-number">
                02
              </div>

              <h3>
                Add Deadlines
              </h3>

              <p>
                Enter exams and assignments.
              </p>
            </div>


            <div className="step">
              <div className="step-number">
                03
              </div>

              <h3>
                Generate Plan
              </h3>

              <p>
                AI creates your study schedule.
              </p>
            </div>


            <div className="step">
              <div className="step-number">
                04
              </div>

              <h3>
                Track Progress
              </h3>

              <p>
                Complete tasks and improve.
              </p>
            </div>

          </div>

        </section>


        {showLogin && (

          <div className="login-overlay">

            <div className="login-box">

              <button
                className="close-btn"
                onClick={() =>
                  setShowLogin(false)
                }
              >
                ×
              </button>

              <div className="login-logo">
                S
              </div>

              <h2>
                {authMode === "login"
                  ? "Welcome to StudyWise AI"
                  : "Create your StudyWise account"}
              </h2>

              <p>
                {authMode === "login"
                  ? "Login and start planning your studies smarter."
                  : "Register to save your study planner account."}
              </p>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              {authMode === "register" && (
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              )}

              <button
                className="login-submit"
                onClick={authMode === "login" ? handleLogin : handleRegister}
              >
                {authMode === "login" ? "Login →" : "Create Account →"}
              </button>

              <small>
                {authMode === "login"
                  ? "Don't have an account? Use Get Started to register."
                  : "Already have an account? Switch to Login below."}
              </small>

              <button
                type="button"
                className="secondary-btn"
                style={{ marginTop: "12px", width: "100%" }}
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                {authMode === "login"
                  ? "Create a new account"
                  : "Back to Login"}
              </button>

            </div>

          </div>

        )}

      </div>
    );
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="dashboard-logo">

          <div className="logo-icon">
            S
          </div>

          <span>
            StudyWise <b>AI</b>
          </span>

        </div>


        <div className="sidebar-menu">

          {[
            ["Dashboard", "🏠"],
            ["My Subjects", "📚"],
            ["Study Planner", "📅"],
            ["Tasks", "✅"],
            ["Assignments", "📝"],
            ["Calendar", "🗓️"],
            ["Progress", "📊"],
          ].map(([page, icon]) => (

            <button
              key={page}
              className={`side-item ${
                activePage === page
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(page)
              }
            >
              {icon}
              <span>{page}</span>
            </button>

          ))}

        </div>


        <div className="sidebar-bottom">

          <button
            className={`side-item ${
              activePage === "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Settings")
            }
          >
            ⚙️
            <span>Settings</span>
          </button>


          <button
            className="side-item logout"
            onClick={handleLogout}
          >
            🚪
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="dashboard-greeting">
              Good Morning 👋
            </p>

            <h1>
              Welcome back, Student!
            </h1>

            <p className="dashboard-subtitle">
              Here's your personalized study
              overview.
            </p>

          </div>


          <div className="profile-circle">
            S
          </div>

        </header>


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {activePage === "Dashboard" && (

          <>

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon green-bg">
                  📊
                </div>

                <div>
                  <p>
                    Overall Progress
                  </p>

                  <h2>
                    {overallProgress}%
                  </h2>

                  <span className="positive">
                    ↑ Current
                  </span>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon blue-bg">
                  ⏱️
                </div>

                <div>
                  <p>
                    Study Hours
                  </p>

                  <h2>
                    {studyHours}h
                  </h2>

                  <span>
                    Daily target
                  </span>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange-bg">
                  📝
                </div>

                <div>
                  <p>
                    Tasks Completed
                  </p>

                  <h2>
                    {completedTasks}
                  </h2>

                  <span>
                    {remainingTasks} remaining
                  </span>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon purple-bg">
                  🔮
                </div>

                <div>
                  <p>
                    Predicted Progress
                  </p>

                  <h2>
                    {predictedProgress}%
                  </h2>

                  <span className="positive">
                    AI prediction
                  </span>
                </div>

              </div>

            </section>


            <section className="dashboard-grid">

              {/* TODAY'S PLAN */}

              <div className="dashboard-card today-plan">

                <div className="card-title-row">

                  <div>
                    <h2>
                      Today's Smart Plan
                    </h2>

                    <p>
                      AI-prioritized schedule
                    </p>
                  </div>

                  <button
                    className="view-btn"
                    onClick={() =>
                      setActivePage(
                        "Study Planner"
                      )
                    }
                  >
                    View All
                  </button>

                </div>


                {tasks
                  .filter(
                    (task) =>
                      task.date ===
                        getDateString() ||
                      task.completed
                  )
                  .slice(0, 6)
                  .map((task) => (

                    <div
                      className="dashboard-task"
                      key={task.id}
                    >

                      <div className="task-time">
                        {task.time}
                      </div>


                      <div
                        className="dashboard-task-icon"
                        style={{
                          background:
                            priorityColor[
                              task.priority
                            ],
                        }}
                      >
                        {task.subject
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>


                      <div className="task-information">

                        <h3
                          style={{
                            textDecoration:
                              task.completed
                                ? "line-through"
                                : "none",
                            opacity:
                              task.completed
                                ? 0.6
                                : 1,
                          }}
                        >
                          {task.name}
                        </h3>

                        <p>
                          {task.subject} ·{" "}
                          {task.duration} ·{" "}
                          {task.priority}
                        </p>

                      </div>


                      <button
                        className="task-check"
                        onClick={() =>
                          toggleTask(task.id)
                        }
                      >
                        {task.completed
                          ? "✓"
                          : "○"}
                      </button>

                    </div>

                  ))}

              </div>


              {/* AI */}

              <div className="dashboard-card ai-card">

                <div className="ai-header">

                  <div className="ai-icon">
                    🤖
                  </div>

                  <div>
                    <h2>
                      AI Study Coach
                    </h2>

                    <p>
                      Personalized recommendation
                    </p>
                  </div>

                </div>


                <div className="ai-message">

                  <h3>
                    Focus on{" "}
                    {weakestSubject
                      ? weakestSubject.name
                      : "your subjects"}{" "}
                    🎯
                  </h3>

                  <p>
                    {weakestSubject
                      ? `${weakestSubject.name} has ${weakestSubject.progress}% progress. AI recommends giving it more study time.`
                      : "Add subjects to receive recommendations."}
                  </p>

                </div>


                <button
                  className="ai-action"
                  onClick={() =>
                    setShowAiModal(true)
                  }
                >
                  Ask AI Coach →
                </button>

              </div>


              {/* SUBJECT PROGRESS */}

              <div className="dashboard-card subject-card">

                <div className="card-title-row">

                  <div>
                    <h2>
                      Subject Progress
                    </h2>

                    <p>
                      Current performance
                    </p>
                  </div>

                  <button
                    className="view-btn"
                    onClick={() =>
                      setActivePage(
                        "My Subjects"
                      )
                    }
                  >
                    Details
                  </button>

                </div>


                {subjects.map((subject) => (

                  <div
                    className="subject-row"
                    key={subject.id}
                  >

                    <div className="subject-info">

                      <span className="subject-dot dbms">
                      </span>

                      <strong>
                        {subject.name}
                      </strong>

                    </div>


                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${subject.progress}%`,
                        }}
                      ></div>

                    </div>


                    <span>
                      {subject.progress}%
                    </span>

                  </div>

                ))}

              </div>


              {/* EXAM */}

              <div className="dashboard-card exam-card">

                <div className="exam-icon">
                  📅
                </div>

                <p className="exam-label">
                  NEXT EXAM
                </p>

                <h2>
                  {upcomingExam
                    ? upcomingExam.subject
                    : "No exam added"}
                </h2>


                {upcomingExam && (

                  <>
                    <div className="exam-date">

                      <strong>
                        {new Date(
                          `${upcomingExam.date}T00:00:00`
                        ).getDate()}
                      </strong>

                      <div>

                        <span>
                          {new Date(
                            `${upcomingExam.date}T00:00:00`
                          )
                            .toLocaleString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )
                            .toUpperCase()}
                        </span>

                        <small>
                          {new Date(
                            `${upcomingExam.date}T00:00:00`
                          ).getFullYear()}
                        </small>

                      </div>

                    </div>

                    <p className="exam-days">
                      {examDays >= 0
                        ? `${examDays} days remaining`
                        : "Exam date passed"}
                    </p>

                  </>

                )}


                <button
                  className="exam-btn"
                  onClick={() =>
                    setShowExamModal(true)
                  }
                >
                  Manage Exams →
                </button>

              </div>

            </section>


            {/* DEADLINES */}

            <div
              className="dashboard-card"
              style={{
                marginTop: "25px",
              }}
            >

              <div className="card-title-row">

                <div>
                  <h2>
                    ⏰ Upcoming Deadlines
                  </h2>

                  <p>
                    Exams and assignments
                  </p>
                </div>

                <button
                  className="view-btn"
                  onClick={() =>
                    setActivePage(
                      "Assignments"
                    )
                  }
                >
                  View
                </button>

              </div>


              {upcomingAssignments
                .slice(0, 3)
                .map((assignment) => (

                  <div
                    key={assignment.id}
                    className="dashboard-task"
                  >

                    <div className="task-time">
                      {daysUntil(
                        assignment.deadline
                      )}d
                    </div>

                    <div
                      className="dashboard-task-icon"
                      style={{
                        background:
                          priorityColor[
                            assignment.priority
                          ],
                      }}
                    >
                      !
                    </div>

                    <div className="task-information">

                      <h3>
                        {assignment.title}
                      </h3>

                      <p>
                        {assignment.subject} ·{" "}
                        Due{" "}
                        {formatDate(
                          assignment.deadline
                        )}
                      </p>

                    </div>

                  </div>

                ))}

            </div>


            {/* QUICK ACTIONS */}

            <section className="quick-section">

              <h2>
                Quick Actions
              </h2>

              <div className="quick-grid">

                <button
                  className="quick-card"
                  onClick={() =>
                    setShowSubjectModal(true)
                  }
                >
                  <span>
                    ➕
                  </span>

                  <div>
                    <strong>
                      Add Subject
                    </strong>

                    <small>
                      Add subject
                    </small>
                  </div>
                </button>


                <button
                  className="quick-card"
                  onClick={() =>
                    setShowTopicModal(true)
                  }
                >
                  <span>
                    📚
                  </span>

                  <div>
                    <strong>
                      Add Topic
                    </strong>

                    <small>
                      Add syllabus topic
                    </small>
                  </div>
                </button>


                <button
                  className="quick-card"
                  onClick={() =>
                    setShowTaskModal(true)
                  }
                >
                  <span>
                    📝
                  </span>

                  <div>
                    <strong>
                      Add Task
                    </strong>

                    <small>
                      Create study task
                    </small>
                  </div>
                </button>


                <button
                  className="quick-card"
                  onClick={() =>
                    setShowPlanModal(true)
                  }
                >
                  <span>
                    🤖
                  </span>

                  <div>
                    <strong>
                      Generate Plan
                    </strong>

                    <small>
                      AI timetable
                    </small>
                  </div>
                </button>

              </div>

            </section>

          </>

        )}


        {/* =====================================================
            MY SUBJECTS
        ===================================================== */}

        {activePage === "My Subjects" && (

          <section>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "25px",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <div>
                <h2>
                  📚 My Subjects & Topics
                </h2>

                <p>
                  Manage subjects, syllabus and
                  pending topics.
                </p>
              </div>


              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >

                <button
                  style={actionButton}
                  onClick={() =>
                    setShowTopicModal(true)
                  }
                >
                  + Topic
                </button>

                <button
                  className="login-submit"
                  style={{
                    width: "auto",
                    padding: "11px 18px",
                  }}
                  onClick={() =>
                    setShowSubjectModal(true)
                  }
                >
                  + Subject
                </button>

              </div>

            </div>


            {subjects.map((subject) => (

              <div
                className="dashboard-card"
                key={subject.id}
                style={{
                  marginBottom: "20px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >

                  <div>
                    <h2>
                      {subject.name}
                    </h2>

                    <p>
                      Progress:{" "}
                      <strong>
                        {subject.progress}%
                      </strong>
                    </p>
                  </div>

                  {subject.examDate && (
                    <span>
                      📅 Exam:{" "}
                      {formatDate(
                        subject.examDate
                      )}
                    </span>
                  )}

                </div>


                <div
                  className="progress-bar"
                  style={{
                    marginTop: "12px",
                  }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${subject.progress}%`,
                    }}
                  ></div>
                </div>


                <h3
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Topics
                </h3>


                {subject.topics.length === 0 ? (

                  <p>
                    No topics added yet.
                  </p>

                ) : (

                  subject.topics.map(
                    (topic) => (

                      <div
                        key={topic.id}
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                          padding:
                            "12px 0",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >

                        <button
                          onClick={() =>
                            toggleTopic(
                              subject.id,
                              topic.id
                            )
                          }
                          style={{
                            border: "none",
                            background:
                              "transparent",
                            cursor: "pointer",
                            fontSize:
                              "20px",
                          }}
                        >
                          {topic.completed
                            ? "✅"
                            : "⭕"}
                        </button>


                        <div
                          style={{
                            flex: 1,
                          }}
                        >

                          <strong
                            style={{
                              textDecoration:
                                topic.completed
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            {topic.name}
                          </strong>

                          <p
                            style={{
                              margin:
                                "4px 0 0",
                            }}
                          >
                            {topic.difficulty} ·{" "}
                            Deadline:{" "}
                            {formatDate(
                              topic.deadline
                            )}
                          </p>

                        </div>


                        <span
                          style={{
                            color:
                              priorityColor[
                                topic.difficulty ===
                                "Hard"
                                  ? "High"
                                  : topic.difficulty ===
                                    "Medium"
                                  ? "Medium"
                                  : "Low"
                              ],
                            fontWeight: "600",
                          }}
                        >
                          {topic.difficulty}
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            ))}

          </section>

        )}


        {/* =====================================================
            STUDY PLANNER
        ===================================================== */}

        {activePage === "Study Planner" && (

          <section>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "25px",
              }}
            >

              <div>
                <h2>
                  📅 AI Study Planner
                </h2>

                <p>
                  Schedule based on progress,
                  difficulty and deadlines.
                </p>
              </div>


              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  style={actionButton}
                  onClick={autoReschedule}
                >
                  🔄 Auto Reschedule
                </button>

                <button
                  className="login-submit"
                  style={{
                    width: "auto",
                    padding: "11px 18px",
                  }}
                  onClick={() =>
                    setShowPlanModal(true)
                  }
                >
                  🤖 Generate AI Plan
                </button>

              </div>

            </div>


            <div className="dashboard-card">

              <h2>
                Today's Timetable
              </h2>


              {tasks.map((task) => (

                <div
                  key={task.id}
                  className="dashboard-task"
                  style={{
                    marginBottom: "10px",
                  }}
                >

                  <div className="task-time">
                    {task.time}
                  </div>


                  <div
                    className="dashboard-task-icon"
                    style={{
                      background:
                        priorityColor[
                          task.priority
                        ],
                    }}
                  >
                    {task.subject
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>


                  <div
                    className="task-information"
                    style={{
                      flex: 1,
                    }}
                  >

                    <h3
                      style={{
                        textDecoration:
                          task.completed
                            ? "line-through"
                            : "none",
                      }}
                    >
                      {task.name}
                    </h3>

                    <p>
                      {task.subject} ·{" "}
                      {task.duration} ·{" "}
                      {task.priority} priority ·{" "}
                      {task.difficulty}
                    </p>

                    <small>
                      {formatDate(task.date)}
                    </small>

                  </div>


                  <button
                    className="task-check"
                    onClick={() =>
                      toggleTask(task.id)
                    }
                  >
                    {task.completed
                      ? "✓"
                      : "○"}
                  </button>


                  {!task.completed && (
                    <button
                      style={{
                        ...actionButton,
                        background:
                          "#fff1f2",
                        color: "#dc2626",
                      }}
                      onClick={() =>
                        markTaskMissed(
                          task.id
                        )
                      }
                    >
                      Missed
                    </button>
                  )}

                </div>

              ))}

            </div>


            <div
              className="dashboard-card"
              style={{
                marginTop: "20px",
              }}
            >

              <h2>
                🧠 Why this plan?
              </h2>

              <p>
                StudyWise AI prioritizes:
              </p>

              <ul>
                <li>
                  Lower subject progress
                </li>

                <li>
                  Difficult topics
                </li>

                <li>
                  Upcoming exams
                </li>

                <li>
                  Assignment deadlines
                </li>

                <li>
                  Available study hours
                </li>
              </ul>

            </div>

          </section>

        )}


        {/* =====================================================
            TASKS
        ===================================================== */}

        {activePage === "Tasks" && (

          <section>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >

              <div>
                <h2>
                  ✅ Study Tasks
                </h2>

                <p>
                  Complete or reschedule your
                  study tasks.
                </p>
              </div>

              <button
                className="login-submit"
                style={{
                  width: "auto",
                  padding: "11px 18px",
                }}
                onClick={() =>
                  setShowTaskModal(true)
                }
              >
                + Add Task
              </button>

            </div>


            <div className="dashboard-card">

              {tasks.map((task) => (

                <div
                  key={task.id}
                  className="dashboard-task"
                  style={{
                    marginBottom: "10px",
                  }}
                >

                  <div className="task-time">
                    {task.time}
                  </div>


                  <div className="task-information">

                    <h3
                      style={{
                        textDecoration:
                          task.completed
                            ? "line-through"
                            : "none",
                        opacity:
                          task.completed
                            ? 0.6
                            : 1,
                      }}
                    >
                      {task.name}
                    </h3>

                    <p>
                      {task.subject} ·{" "}
                      {task.duration} ·{" "}
                      {task.priority}
                    </p>

                    <small>
                      {formatDate(task.date)}
                    </small>

                  </div>


                  <button
                    className="task-check"
                    onClick={() =>
                      toggleTask(task.id)
                    }
                  >
                    {task.completed
                      ? "✓"
                      : "○"}
                  </button>


                  {!task.completed && (
                    <button
                      style={{
                        ...actionButton,
                        background:
                          "#fff1f2",
                        color: "#dc2626",
                      }}
                      onClick={() =>
                        markTaskMissed(
                          task.id
                        )
                      }
                    >
                      Missed
                    </button>
                  )}

                </div>

              ))}

            </div>

          </section>

        )}


        {/* =====================================================
            ASSIGNMENTS
        ===================================================== */}

        {activePage === "Assignments" && (

          <section>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >

              <div>
                <h2>
                  📝 Assignments & Deadlines
                </h2>

                <p>
                  Never miss an academic deadline.
                </p>
              </div>

              <button
                className="login-submit"
                style={{
                  width: "auto",
                  padding: "11px 18px",
                }}
                onClick={() =>
                  setShowAssignmentModal(
                    true
                  )
                }
              >
                + Add Assignment
              </button>

            </div>


            <div className="dashboard-card">

              {assignments.length === 0 ? (

                <p>
                  No assignments added.
                </p>

              ) : (

                assignments.map(
                  (assignment) => (

                    <div
                      key={assignment.id}
                      className="dashboard-task"
                      style={{
                        marginBottom: "12px",
                      }}
                    >

                      <button
                        className="task-check"
                        onClick={() =>
                          toggleAssignment(
                            assignment.id
                          )
                        }
                      >
                        {assignment.completed
                          ? "✓"
                          : "○"}
                      </button>


                      <div className="task-information">

                        <h3
                          style={{
                            textDecoration:
                              assignment.completed
                                ? "line-through"
                                : "none",
                          }}
                        >
                          {assignment.title}
                        </h3>

                        <p>
                          {assignment.subject} ·{" "}
                          {assignment.priority} priority
                        </p>

                        <small>
                          Deadline:{" "}
                          {formatDate(
                            assignment.deadline
                          )}
                        </small>

                      </div>


                      <span
                        style={{
                          color:
                            priorityColor[
                              assignment.priority
                            ],
                          fontWeight: "600",
                        }}
                      >
                        {daysUntil(
                          assignment.deadline
                        ) >= 0
                          ? `${daysUntil(
                              assignment.deadline
                            )} days`
                          : "Overdue"}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </section>

        )}


        {/* =====================================================
            CALENDAR
        ===================================================== */}

        {activePage === "Calendar" && (

          <section>

            <h2>
              🗓️ Study Calendar
            </h2>

            <p>
              Your upcoming study timetable.
            </p>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, minmax(100px, 1fr))",
                gap: "10px",
                marginTop: "25px",
                overflowX: "auto",
              }}
            >

              {calendarDays.map((day) => {

                const dayTasks =
                  tasks.filter(
                    (task) =>
                      task.date ===
                      day.date
                  );

                const dayAssignments =
                  assignments.filter(
                    (assignment) =>
                      assignment.deadline ===
                      day.date
                  );

                const dayExams =
                  exams.filter(
                    (exam) =>
                      exam.date ===
                      day.date
                  );

                return (

                  <div
                    key={day.date}
                    className="dashboard-card"
                    style={{
                      minHeight: "230px",
                      minWidth: "100px",
                    }}
                  >

                    <div
                      style={{
                        textAlign:
                          "center",
                        marginBottom:
                          "12px",
                      }}
                    >

                      <strong>
                        {day.label}
                      </strong>

                      <h2>
                        {day.number}
                      </h2>

                    </div>


                    {dayTasks.map(
                      (task) => (

                        <div
                          key={task.id}
                          style={{
                            padding:
                              "8px",
                            marginBottom:
                              "6px",
                            borderRadius:
                              "8px",
                            background:
                              "#eef8f1",
                            fontSize:
                              "12px",
                          }}
                        >
                          ⏰ {task.time}
                          <br />
                          {task.name}
                        </div>

                      )
                    )}


                    {dayAssignments.map(
                      (assignment) => (

                        <div
                          key={
                            assignment.id
                          }
                          style={{
                            padding:
                              "8px",
                            marginBottom:
                              "6px",
                            borderRadius:
                              "8px",
                            background:
                              "#fff7ed",
                            fontSize:
                              "12px",
                          }}
                        >
                          📝{" "}
                          {assignment.title}
                        </div>

                      )
                    )}


                    {dayExams.map(
                      (exam) => (

                        <div
                          key={exam.id}
                          style={{
                            padding:
                              "8px",
                            borderRadius:
                              "8px",
                            background:
                              "#fef2f2",
                            fontSize:
                              "12px",
                          }}
                        >
                          📚{" "}
                          {exam.subject}
                        </div>

                      )
                    )}

                  </div>

                );
              })}

            </div>

          </section>

        )}


        {/* =====================================================
            PROGRESS
        ===================================================== */}

        {activePage === "Progress" && (

          <section>

            <h2>
              📊 Progress Analytics
            </h2>

            <p>
              Understand your performance and
              predicted progress.
            </p>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "25px",
              }}
            >

              <div className="stat-card">
                <div>
                  <p>
                    Overall Progress
                  </p>

                  <h2>
                    {overallProgress}%
                  </h2>
                </div>
              </div>


              <div className="stat-card">
                <div>
                  <p>
                    Topics Completed
                  </p>

                  <h2>
                    {completedTopics}/
                    {totalTopics}
                  </h2>
                </div>
              </div>


              <div className="stat-card">
                <div>
                  <p>
                    Tasks Completed
                  </p>

                  <h2>
                    {completedTasks}/
                    {tasks.length}
                  </h2>
                </div>
              </div>


              <div className="stat-card">
                <div>
                  <p>
                    AI Predicted
                  </p>

                  <h2>
                    {predictedProgress}%
                  </h2>
                </div>
              </div>

            </div>


            {/* CHART */}

            <div
              className="dashboard-card"
              style={{
                marginTop: "25px",
              }}
            >

              <h2>
                📈 Subject Progress Chart
              </h2>

              <p>
                Visual comparison of your subjects.
              </p>


              {subjects.map((subject) => (

                <div
                  key={subject.id}
                  style={{
                    marginTop: "18px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: "6px",
                    }}
                  >

                    <strong>
                      {subject.name}
                    </strong>

                    <span>
                      {subject.progress}%
                    </span>

                  </div>


                  <div
                    style={{
                      width: "100%",
                      height: "22px",
                      background:
                        "#e5e7eb",
                      borderRadius:
                        "20px",
                      overflow:
                        "hidden",
                    }}
                  >

                    <div
                      style={{
                        width: `${subject.progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg,#22c55e,#16a34a)",
                        borderRadius:
                          "20px",
                        transition:
                          "width .5s",
                      }}
                    ></div>

                  </div>

                </div>

              ))}

            </div>


            {/* SUMMARY */}

            <div
              className="dashboard-card"
              style={{
                marginTop: "20px",
              }}
            >

              <h2>
                📋 Weekly Study Summary
              </h2>

              <p>
                This week you completed{" "}
                <strong>
                  {completedTasks}
                </strong>{" "}
                study tasks and{" "}
                <strong>
                  {completedTopics}
                </strong>{" "}
                topics.
              </p>

              <p>
                You have{" "}
                <strong>
                  {remainingTasks}
                </strong>{" "}
                study tasks and{" "}
                <strong>
                  {pendingTopics.length}
                </strong>{" "}
                pending topics remaining.
              </p>

              <p>
                Your current overall progress is{" "}
                <strong>
                  {overallProgress}%
                </strong>
                , with an AI-predicted progress of{" "}
                <strong>
                  {predictedProgress}%
                </strong>
                .
              </p>

            </div>

          </section>

        )}


        {/* =====================================================
            SETTINGS
        ===================================================== */}

        {activePage === "Settings" && (

          <section>

            <h2>
              ⚙️ Settings
            </h2>

            <p>
              Customize your study preferences.
            </p>


            <div
              className="dashboard-card"
              style={{
                maxWidth: "650px",
                marginTop: "25px",
              }}
            >

              <label style={labelStyle}>
                Available Study Hours Per Day
              </label>

              <input
                type="number"
                min="1"
                max="12"
                value={studyHours}
                onChange={(e) =>
                  setStudyHours(
                    Number(e.target.value)
                  )
                }
                style={inputStyle}
              />


              <label style={labelStyle}>
                Preferred Study Time
              </label>

              <select
                value={studyTime}
                onChange={(e) =>
                  setStudyTime(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option>
                  Morning
                </option>

                <option>
                  Afternoon
                </option>

                <option>
                  Evening
                </option>

                <option>
                  Night
                </option>
              </select>


              <button
                className="login-submit"
                onClick={() =>
                  alert(
                    "Study preferences saved! ⚙️"
                  )
                }
              >
                Save Settings
              </button>


              <button
                style={{
                  ...actionButton,
                  width: "100%",
                  marginTop: "10px",
                  background:
                    "#fff1f2",
                  color: "#dc2626",
                }}
                onClick={resetData}
              >
                Reset Demo Data
              </button>

            </div>

          </section>

        )}

      </main>


      {/* =======================================================
          ADD SUBJECT MODAL
      ======================================================= */}

      {showSubjectModal && (

        <div className="login-overlay">

          <div className="login-box">

            <button
              className="close-btn"
              onClick={() =>
                setShowSubjectModal(false)
              }
            >
              ×
            </button>

            <div className="login-logo">
              📚
            </div>

            <h2>
              Add Subject
            </h2>

            <p>
              Add subject and current progress.
            </p>


            <input
              type="text"
              placeholder="Subject name"
              value={newSubjectName}
              onChange={(e) =>
                setNewSubjectName(
                  e.target.value
                )
              }
            />


            <input
              type="number"
              min="0"
              max="100"
              placeholder="Progress %"
              value={newSubjectProgress}
              onChange={(e) =>
                setNewSubjectProgress(
                  e.target.value
                )
              }
            />


            <label style={labelStyle}>
              Exam Date
            </label>

            <input
              type="date"
              value={newSubjectExamDate}
              onChange={(e) =>
                setNewSubjectExamDate(
                  e.target.value
                )
              }
            />


            <button
              className="login-submit"
              onClick={handleAddSubject}
            >
              Add Subject →
            </button>

          </div>

        </div>

      )}


      {/* =======================================================
          ADD TOPIC MODAL
      ======================================================= */}

      {showTopicModal && (

        <div className="login-overlay">

          <div className="login-box">

            <button
              className="close-btn"
              onClick={() =>
                setShowTopicModal(false)
              }
            >
              ×
            </button>

            <div className="login-logo">
              📖
            </div>

            <h2>
              Add Topic
            </h2>

            <p>
              Add a topic to your syllabus.
            </p>


            <select
              value={selectedTopicSubject}
              onChange={(e) =>
                setSelectedTopicSubject(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option value="">
                Select subject
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.name}
                >
                  {subject.name}
                </option>
              ))}

            </select>


            <input
              type="text"
              placeholder="Topic name"
              value={newTopicName}
              onChange={(e) =>
                setNewTopicName(
                  e.target.value
                )
              }
            />


            <select
              value={newTopicDifficulty}
              onChange={(e) =>
                setNewTopicDifficulty(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option>
                Easy
              </option>

              <option>
                Medium
              </option>

              <option>
                Hard
              </option>

            </select>


            <label style={labelStyle}>
              Topic Deadline
            </label>

            <input
              type="date"
              value={newTopicDeadline}
              onChange={(e) =>
                setNewTopicDeadline(
                  e.target.value
                )
              }
            />


            <button
              className="login-submit"
              onClick={handleAddTopic}
            >
              Add Topic →
            </button>

          </div>

        </div>

      )}


      {/* =======================================================
          ADD TASK MODAL
      ======================================================= */}

      {showTaskModal && (

        <div className="login-overlay">

          <div className="login-box">

            <button
              className="close-btn"
              onClick={() =>
                setShowTaskModal(false)
              }
            >
              ×
            </button>

            <div className="login-logo">
              📝
            </div>

            <h2>
              Add Study Task
            </h2>

            <p>
              Create a personalized study task.
            </p>


            <input
              type="text"
              placeholder="Task name"
              value={newTaskName}
              onChange={(e) =>
                setNewTaskName(
                  e.target.value
                )
              }
            />


            <select
              value={newTaskSubject}
              onChange={(e) =>
                setNewTaskSubject(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option value="">
                Select subject
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.name}
                >
                  {subject.name}
                </option>
              ))}

            </select>


            <select
              value={newTaskDuration}
              onChange={(e) =>
                setNewTaskDuration(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option>
                30 minutes
              </option>

              <option>
                45 minutes
              </option>

              <option>
                1 hour
              </option>

              <option>
                1.5 hours
              </option>

              <option>
                2 hours
              </option>

            </select>


            <select
              value={newTaskPriority}
              onChange={(e) =>
                setNewTaskPriority(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option>
                High
              </option>

              <option>
                Medium
              </option>

              <option>
                Low
              </option>

            </select>


            <select
              value={newTaskDifficulty}
              onChange={(e) =>
                setNewTaskDifficulty(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option>
                Easy
              </option>

              <option>
                Medium
              </option>

              <option>
                Hard
              </option>

            </select>


            <input
              type="text"
              placeholder="Time e.g. 07:00 PM"
              value={newTaskTime}
              onChange={(e) =>
                setNewTaskTime(
                  e.target.value
                )
              }
            />


            <label style={labelStyle}>
              Task Date
            </label>

            <input
              type="date"
              value={newTaskDate}
              onChange={(e) =>
                setNewTaskDate(
                  e.target.value
                )
              }
            />


            <button
              className="login-submit"
              onClick={handleAddTask}
            >
              Add Task →
            </button>

          </div>

        </div>

      )}


      {/* =======================================================
          EXAM MODAL
      ======================================================= */}

      {showExamModal && (

        <div className="login-overlay">

          <div className="login-box">

            <button
              className="close-btn"
              onClick={() =>
                setShowExamModal(false)
              }
            >
              ×
            </button>

            <div className="login-logo">
              📅
            </div>

            <h2>
              Manage Exams
            </h2>

            <p>
              Add your upcoming examinations.
            </p>


            <input
              type="text"
              placeholder="Exam / Subject name"
              value={newExamSubject}
              onChange={(e) =>
                setNewExamSubject(
                  e.target.value
                )
              }
            />


            <label style={labelStyle}>
              Exam Date
            </label>

            <input
              type="date"
              value={newExamDate}
              onChange={(e) =>
                setNewExamDate(
                  e.target.value
                )
              }
            />


            <button
              className="login-submit"
              onClick={handleAddExam}
            >
              Add Exam →
            </button>


            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
              }}
            >

              <strong>
                Upcoming Exams
              </strong>

              {exams.map((exam) => (

                <div
                  key={exam.id}
                  style={{
                    padding:
                      "10px 0",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  📚 {exam.subject}
                  <br />
                  📅{" "}
                  {formatDate(
                    exam.date
                  )}
                </div>

              ))}

            </div>

          </div>

        </div>

      )}


      {/* =======================================================
          ASSIGNMENT MODAL
      ======================================================= */}

      {showAssignmentModal && (

        <div className="login-overlay">

          <div className="login-box">

            <button
              className="close-btn"
              onClick={() =>
                setShowAssignmentModal(
                  false
                )
              }
            >
              ×
            </button>

            <div className="login-logo">
              📝
            </div>

            <h2>
              Add Assignment
            </h2>

            <p>
              Track your assignment deadline.
            </p>


            <input
              type="text"
              placeholder="Assignment title"
              value={newAssignmentTitle}
              onChange={(e) =>
                setNewAssignmentTitle(
                  e.target.value
                )
              }
            />


            <select
              value={newAssignmentSubject}
              onChange={(e) =>
                setNewAssignmentSubject(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option value="">
                Select subject
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.name}
                >
                  {subject.name}
                </option>
              ))}

            </select>


            <label style={labelStyle}>
              Deadline
            </label>

            <input
              type="date"
              value={newAssignmentDeadline}
              onChange={(e) =>
                setNewAssignmentDeadline(
                  e.target.value
                )
              }
            />


            <select
              value={newAssignmentPriority}
              onChange={(e) =>
                setNewAssignmentPriority(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option>
                High
              </option>

              <option>
                Medium
              </option>

              <option>
                Low
              </option>

            </select>


            <button
              className="login-submit"
              onClick={
                handleAddAssignment
              }
            >
              Add Assignment →
            </button>

          </div>

        </div>

      )}


      {/* =======================================================
          SMART PLAN MODAL
      ======================================================= */}

      {showPlanModal && (

        <div className="login-overlay">

          <div className="login-box">

            <button
              className="close-btn"
              onClick={() =>
                setShowPlanModal(false)
              }
            >
              ×
            </button>

            <div className="login-logo">
              🤖
            </div>

            <h2>
              Generate AI Study Plan
            </h2>

            <p>
              StudyWise AI will analyze your
              progress, difficulty, exams and
              deadlines.
            </p>


            <div
              style={{
                textAlign: "left",
                margin:
                  "20px 0",
              }}
            >

              <p>
                📊 Overall progress:{" "}
                <strong>
                  {overallProgress}%
                </strong>
              </p>

              <p>
                ⏱️ Available study time:{" "}
                <strong>
                  {studyHours} hours/day
                </strong>
              </p>

              <p>
                📚 Weakest subject:{" "}
                <strong>
                  {weakestSubject
                    ? weakestSubject.name
                    : "None"}
                </strong>
              </p>

              <p>
                ⏰ Pending topics:{" "}
                <strong>
                  {pendingTopics.length}
                </strong>
              </p>

              <p>
                📝 Pending assignments:{" "}
                <strong>
                  {assignments.filter(
                    (a) =>
                      !a.completed
                  ).length}
                </strong>
              </p>

            </div>


            <button
              className="login-submit"
              onClick={
                generateSmartPlan
              }
            >
              Generate Smart Plan →
            </button>

          </div>

        </div>

      )}


      {/* =======================================================
          AI MODAL
      ======================================================= */}

      {showAiModal && (

        <div className="login-overlay">

          <div className="login-box">

            <button
              className="close-btn"
              onClick={() => {
                setShowAiModal(false);
                setAiQuestion("");
                setAiAnswer("");
              }}
            >
              ×
            </button>

            <div className="login-logo">
              🤖
            </div>

            <h2>
              AI Study Coach
            </h2>

            <p>
              Ask about your study strategy.
            </p>


            <input
              type="text"
              placeholder="How should I plan my exam?"
              value={aiQuestion}
              onChange={(e) =>
                setAiQuestion(
                  e.target.value
                )
              }
            />


            <button
              className="login-submit"
              onClick={askAiCoach}
            >
              Ask AI →
            </button>


            {aiAnswer && (

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius:
                    "12px",
                  background:
                    "#f1f8f4",
                  textAlign:
                    "left",
                }}
              >

                <strong>
                  🤖 StudyWise AI
                </strong>

                <p>
                  {aiAnswer}
                </p>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;